'use client';

import { useState } from 'react';
import { dictionaries, type Lang } from './i18n';
import { T } from './t';
import styles from './page.module.css';

// Reloads the page after triggering revalidation so the regenerated page (new timestamp)
// is shown. On EdgeOne the purge is eventual, so we wait briefly; if still stale, refresh
// once more.
const RELOAD_DELAY_MS = 1500;

// The runtime message (success/error) is set after the click, so we resolve the current
// language imperatively from the <html data-lang> attribute at that moment.
function currentLang(): Lang {
  if (typeof document === 'undefined') return 'zh';
  return document.documentElement.getAttribute('data-lang') === 'en' ? 'en' : 'zh';
}

export default function RevalidateButton() {
  const [status, setStatus] = useState<'idle' | 'pending' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const handleClick = async () => {
    setStatus('pending');
    setMessage(null);
    const t = dictionaries[currentLang()].button;
    try {
      const res = await fetch('/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-revalidate-secret': process.env.NEXT_PUBLIC_REVALIDATE_SECRET ?? ''
        },
        body: JSON.stringify({ paths: ['/'] })
      });

      const data = (await res.json().catch(() => ({}))) as {
        revalidated?: boolean;
        message?: string;
      };
      if (!res.ok || !data.revalidated) {
        throw new Error(data.message ?? `HTTP ${res.status}`);
      }

      setMessage(t.success);
      setTimeout(() => window.location.reload(), RELOAD_DELAY_MS);
    } catch (error) {
      setStatus('error');
      setMessage(`${t.errorPrefix}${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const key = status === 'pending' ? 'pending' : 'idle';

  return (
    <div className={styles.buttonRow}>
      <button
        type="button"
        onClick={handleClick}
        disabled={status === 'pending'}
        className={styles.button}
      >
        <T zh={dictionaries.zh.button[key]} en={dictionaries.en.button[key]} />
      </button>
      <p className={styles.hint}>{message ?? ' '}</p>
    </div>
  );
}
