/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#202b2c',
          navyDark: '#11191a',
          blue: '#22536a',
          blueHover: '#153b4c',
          pale: '#e9eeec',
          offwhite: '#f5f4f0',
          dark: '#202b2c',
          muted: '#536061',
          border: '#dedfd9',
          whatsapp: '#25D366',
          whatsappHover: '#1ebe57',
          telegram: '#229ED9',
          telegramHover: '#1b86b8',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        serif: ['"Manrope"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        site: '1320px',
      },
    },
  },
  plugins: [],
};
