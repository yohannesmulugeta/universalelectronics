import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  site: 'https://yohannesmulugeta.github.io',
  base: process.env.GITHUB_PAGES === 'true' ? '/universalelectronics/' : '/',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
  ],
});
