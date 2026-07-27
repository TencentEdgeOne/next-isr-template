import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Deployed on EdgeOne Makers, which builds the app with the @edgeone/opennextjs-pages
  // adapter (handles ISR / on-demand revalidation → CDN purge).
};

export default nextConfig;
