import { dictionaries } from './i18n';
import LanguageToggle from './language-toggle';
import RevalidateButton from './revalidate-button';
import { T } from './t';
import styles from './page.module.css';

// On-demand ISR: prerendered + cached, served by the SSR function (numeric `revalidate`,
// NOT force-static) so `revalidatePath('/')` can regenerate it on EdgeOne.
export const revalidate = 31536000;

const zh = dictionaries.zh;
const en = dictionaries.en;

export default function Page() {
  // Timestamp is generated on the server (kept stable until revalidation). Both language
  // variants are rendered; CSS shows the active one (see T + the inline script in layout).
  const generatedAt = new Date().toISOString();

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.topbar}>
          <span className={styles.badge}>
            <span className={styles.dot} />
            {zh.badge}
          </span>
          <LanguageToggle />
        </div>

        <h1 className={styles.title}>
          <T zh={zh.title} en={en.title} />
        </h1>
        <p className={styles.subtitle}>
          <T
            zh={
              <>
                {zh.subtitlePre}
                <code>{zh.subtitleCode}</code>
                {zh.subtitlePost}
              </>
            }
            en={
              <>
                {en.subtitlePre}
                <code>{en.subtitleCode}</code>
                {en.subtitlePost}
              </>
            }
          />
        </p>

        <div className={styles.card}>
          <div className={styles.cardLabel}>
            <T zh={zh.generatedLabel} en={en.generatedLabel} />
          </div>
          <div className={styles.timestamp}>{generatedAt}</div>
        </div>

        <RevalidateButton />

        <ol className={styles.steps}>
          {zh.steps.map((step, i) => (
            <li key={i}>
              <T zh={step} en={en.steps[i]} />
            </li>
          ))}
        </ol>

        <p className={styles.note}>
          <T zh={zh.note} en={en.note} />
        </p>

        <div className={styles.footer}>
          <span>Next.js {`{App Router}`}</span>
          <span>·</span>
          <span>{zh.footerDeploy}</span>
        </div>
      </div>
    </main>
  );
}
