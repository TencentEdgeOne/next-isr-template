import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * On-demand revalidation endpoint.
 *
 * Invalidates the Next.js cache for one or more paths / tags. On EdgeOne this is turned
 * into a CDN cache purge by the `@edgeone/opennextjs-pages` adapter.
 *
 *   GET  /api/revalidate?path=/        revalidate a single path (easy to test in a browser)
 *   GET  /api/revalidate?tag=posts     revalidate a single tag
 *   POST /api/revalidate               body: { "paths": ["/"], "tags": ["posts"] }
 *
 * Auth is optional: when the `REVALIDATE_SECRET` env var is set, the request must present
 * the same value via the `x-revalidate-secret` header, an `Authorization: Bearer <secret>`
 * header, or a `?secret=` query param. If `REVALIDATE_SECRET` is unset, no check is done.
 *
 * Reading searchParams / calling revalidate makes this route dynamic automatically, so no
 * `export const dynamic` is required.
 */

/** Normalize a `string | string[] | undefined` value into a clean, non-empty string[]. */
function toArray(value: unknown): string[] {
  const items = Array.isArray(value) ? value : [value];
  return items.filter(
    (item): item is string => typeof item === 'string' && item.length > 0
  );
}

/** Read the caller-provided secret from header, bearer token, or query string. */
function getProvidedSecret(request: NextRequest): string | null {
  return (
    request.headers.get('x-revalidate-secret') ??
    request.headers.get('authorization')?.replace(/^Bearer /, '') ??
    request.nextUrl.searchParams.get('secret')
  );
}

/** Optional auth: allowed when no secret is configured, otherwise it must match. */
function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.REVALIDATE_SECRET;
  return !secret || getProvidedSecret(request) === secret;
}

function unauthorized() {
  return NextResponse.json(
    { revalidated: false, message: 'Invalid revalidation secret.' },
    { status: 401 }
  );
}

/** Invalidate the given paths and tags. */
function revalidate(paths: string[], tags: string[]) {
  console.log('[revalidate] paths:', paths, 'tags:', tags);
  paths.forEach((path) => revalidatePath(path));
  tags.forEach((tag) => revalidateTag(tag));
}

/** Revalidate a single path or tag, e.g. `/api/revalidate?path=/` or `?tag=posts`. */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorized();

  const path = request.nextUrl.searchParams.get('path');
  const tag = request.nextUrl.searchParams.get('tag');

  if (!path && !tag) {
    return NextResponse.json(
      {
        revalidated: false,
        message: 'Missing "path" or "tag" query parameter.',
        usage: {
          byPath: '/api/revalidate?path=/',
          byTag: '/api/revalidate?tag=posts'
        }
      },
      { status: 400 }
    );
  }

  const paths = path ? [path] : [];
  const tags = tag ? [tag] : [];
  revalidate(paths, tags);

  return NextResponse.json({ revalidated: true, now: Date.now(), paths, tags });
}

/** Revalidate multiple paths / tags via a JSON body: `{ paths?: string | string[]; tags?: string | string[] }`. */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorized();

  try {
    const body = (await request.json().catch(() => ({}))) as {
      paths?: string | string[];
      tags?: string | string[];
    };

    const paths = toArray(body.paths);
    const tags = toArray(body.tags);

    // Default to the homepage so an empty body still does something useful.
    if (paths.length === 0 && tags.length === 0) {
      paths.push('/');
    }

    revalidate(paths, tags);

    return NextResponse.json({ revalidated: true, now: Date.now(), paths, tags });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ revalidated: false, message }, { status: 500 });
  }
}
