import type { ReactNode } from 'react';

// Renders both language variants; the inactive one is hidden via CSS based on the
// `data-lang` attribute set on <html> before paint (see the inline script in layout.tsx).
// This keeps the page fully static/ISR-friendly and avoids any language flash on reload.
export function T({ zh, en }: { zh: ReactNode; en: ReactNode }) {
  return (
    <>
      <span className="i18n-zh">{zh}</span>
      <span className="i18n-en">{en}</span>
    </>
  );
}
