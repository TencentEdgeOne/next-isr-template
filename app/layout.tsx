import '../styles/globals.css';

export const metadata = {
  title: 'On-Demand ISR · EdgeOne Makers',
  description:
    'Next.js on-demand Incremental Static Regeneration template, deployed on EdgeOne Makers. · Demo only',
  keywords: "EdgeOne Makers, Demo only",
};

// Runs before paint: applies the saved language to <html data-lang> so CSS shows the right
// language immediately — no flash on reload. Default (first visit) is 'en'.
const langInitScript = `(function(){try{var l=localStorage.getItem('lang');if(l!=='en'&&l!=='zh')l='en';var d=document.documentElement;d.setAttribute('data-lang',l);d.lang=l==='en'?'en':'zh-CN';}catch(e){document.documentElement.setAttribute('data-lang','en');}})();`;

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: langInitScript }} />
        {children}
      </body>
    </html>
  );
}
