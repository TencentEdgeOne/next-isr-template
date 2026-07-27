# On-Demand ISR · EdgeOne Makers

**English** | [简体中文](./README_zh-CN.md)

> A **On-Demand Incremental Static Regeneration (ISR)** template built with the Next.js App Router, deployed on **EdgeOne Makers**.

The page is statically cached — every visit returns the same "generated time". The page is only re-generated (and the time updated) after you call the revalidation endpoint.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [How It Works](#how-it-works)
- [API](#api)
- [Verifying ISR](#verifying-isr)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [License](#license)

## Features

- ⚡️ **On-demand ISR** — precisely refresh page cache via `revalidatePath` / `revalidateTag`
- 🔌 **Revalidation endpoint** — both `GET` (triggerable straight from the browser) and `POST`, with optional secret auth
- 🧪 **Visual demo** — the home page shows a "generated time" plus a one-click trigger button to verify ISR at a glance

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- TypeScript
- [EdgeOne Makers](https://edgeone.ai/) (deployment platform)

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm (or pnpm / yarn)

### Install & Develop

```bash
npm install
npm run dev        # http://localhost:3000
```

> ⚠️ Dev mode (`next dev`) does **not** cache — the time changes on every refresh, so you won't see the ISR effect. To verify ISR, use a production build (below).

### Production Build

```bash
npm run build
npm start
```

## How It Works

1. The home page `app/page.tsx` uses `export const revalidate = 31536000` (a large value), making it an **ISR page** (rendered by the SSR function), so it can be regenerated on demand by `revalidatePath`. Do **not** use `force-static`.
2. The revalidation endpoint `app/api/revalidate/route.ts` calls `revalidatePath` / `revalidateTag`.

## API

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/revalidate?path=/` | Revalidate by path (can be triggered directly in the browser) |
| `GET` | `/api/revalidate?tag=<tag>` | Revalidate by tag |
| `POST` | `/api/revalidate` | Body: `{ "paths": ["/"], "tags": [] }` |

Auth is **optional**: when `REVALIDATE_SECRET` is set, requests must include the `x-revalidate-secret` header (`GET` can also use `?secret=`); if unset, no check is performed. The home page button reads the secret from `NEXT_PUBLIC_REVALIDATE_SECRET`.

## Verifying ISR

```bash
npm run build && npm start

# 1) Refresh twice — the timestamp is identical (cache hit)
curl -s localhost:3000/ | grep -oE '[0-9T:.-]{20,}Z'
curl -s localhost:3000/ | grep -oE '[0-9T:.-]{20,}Z'

# 2) Trigger revalidation
curl -s "localhost:3000/api/revalidate?path=/"

# 3) Refresh again — the timestamp changed = it works
curl -s localhost:3000/ | grep -oE '[0-9T:.-]{20,}Z'
```

> When verifying on EdgeOne, use **curl** (a browser soft refresh may hit the RSC / browser cache and show a stale value). CDN purge is asynchronous, so the first request may still be stale — just refresh once more. On a distributed CDN, different edge nodes may each cache their own regenerated copy, so the timestamp can alternate between a few values — this is expected.

## Deployment

```bash
edgeone makers build
edgeone makers deploy
```

For auth, configure the environment variable `REVALIDATE_SECRET` (and `NEXT_PUBLIC_REVALIDATE_SECRET` for the home page button — the two must match) in the EdgeOne console.

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `REVALIDATE_SECRET` | No | Secret for the revalidation endpoint; when set, the endpoint enforces it |
| `NEXT_PUBLIC_REVALIDATE_SECRET` | No | Secret sent by the home page button; must match the one above |

## Project Structure

```
app/
  page.tsx                # Home page (ISR, shows the generated time)
  revalidate-button.tsx   # Button that triggers revalidation (client component)
  api/revalidate/route.ts # Revalidation endpoint (GET / POST)
  layout.tsx              # Root layout
  not-found.tsx           # 404 page
  page.module.css         # Home page styles
styles/
  globals.css             # Global theme
next.config.ts
```

## License

[MIT](./LICENSE.md)
