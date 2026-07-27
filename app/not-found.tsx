import Link from 'next/link';

import { dictionaries } from './i18n';
import { T } from './t';

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        textAlign: 'center',
        padding: 24
      }}
    >
      <div>
        <h1 style={{ fontSize: 48, margin: 0 }}>404</h1>
        <p style={{ color: 'var(--text-dim)', marginTop: 8 }}>
          <T zh={dictionaries.zh.notFound.message} en={dictionaries.en.notFound.message} />
        </p>
        <Link
          href="/"
          style={{ color: 'var(--accent-hover)', marginTop: 16, display: 'inline-block' }}
        >
          <T zh={dictionaries.zh.notFound.back} en={dictionaries.en.notFound.back} />
        </Link>
      </div>
    </main>
  );
}
