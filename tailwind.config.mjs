/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#012483',
          navyDark: '#00195e',
          blue: '#005EE9',
          blueHover: '#004ec2',
          pale: '#EAF2FF',
          offwhite: '#F7F9FC',
          dark: '#172033',
          muted: '#475569',
          border: '#DCE4EE',
          whatsapp: '#25D366',
          whatsappHover: '#1ebe57',
          telegram: '#229ED9',
          telegramHover: '#1b86b8',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        serif: ['"Roboto Slab"', 'Georgia', 'Cambria', 'serif'],
      },
      maxWidth: {
        site: '1200px',
      },
    },
  },
  plugins: [],
};
