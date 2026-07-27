'use client';

import { T } from './t';
import styles from './page.module.css';

// Toggles the language by flipping `data-lang` on <html> (which CSS uses to show/hide the
// two rendered variants) and persisting the choice. No React state → the button label is
// rendered in both languages and switched by the same CSS, so it never flashes.
export default function LanguageToggle() {
  const toggle = () => {
    const current =
      document.documentElement.getAttribute('data-lang') === 'en' ? 'en' : 'zh';
    const next = current === 'en' ? 'zh' : 'en';
    document.documentElement.setAttribute('data-lang', next);
    document.documentElement.lang = next === 'en' ? 'en' : 'zh-CN';
    try {
      localStorage.setItem('lang', next);
    } catch {
      // ignore (e.g. storage disabled)
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={styles.langToggle}
      aria-label="Switch language"
    >
      <T zh="EN" en="中文" />
    </button>
  );
}
