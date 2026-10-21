import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

const isGithubPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  // Keep the existing GitHub Pages URL while using the custom domain on Cloudflare Pages.
  site: isGithubPages
    ? 'https://yohannesmulugeta.github.io'
    : 'https://universalelectronicet.com',
  base: isGithubPages ? '/universalelectronics/' : '/',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
  ],
});
