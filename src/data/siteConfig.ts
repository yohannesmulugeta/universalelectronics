import type { SiteConfig } from '../types';

export const siteConfig: SiteConfig = {
  companyName: 'Universal Electronics',
  tagline: 'Your Source for Solar and Sound Solutions',
  address: 'Tefera Business Center, Habte Giyorgis',
  city: 'Addis Ababa',
  country: 'Ethiopia',
  phones: ['+251 911 102 251', '+0111 565800'],
  email: 'universal.elec@ethionet.et',
  telegramUsername: 'universal_electronics_et',
  telegramUrl: 'https://t.me/universal_electronics_et',
  // Provisional number chosen from the recovered Contact page by the owner.
  whatsappNumber: '251911102251',
  navLinks: [
    { label: 'Solar', href: '/shop/solar/' },
    { label: 'Sound', href: '/shop/sound/' },
    { label: 'All products', href: '/shop/' },
    { label: 'Projects', href: '/projects/' },
    { label: 'About', href: '/about/' },
  ],
  solarCategories: [
    { name: 'Inverters', slug: 'inverters' },
    { name: 'Solar Batteries', slug: 'solar-batteries' },
    { name: 'Solar Panels', slug: 'solar-panels' },
    { name: 'Solar Water Pumps', slug: 'solar-water-pumps' },
    { name: 'Lanterns', slug: 'lanterns' },
  ],
  soundCategories: [
    { name: 'Speakers', slug: 'speakers' },
    { name: 'Amplifiers', slug: 'amplifiers' },
    { name: 'Microphones', slug: 'microphones' },
    { name: 'Keyboards', slug: 'keyboards' },
    { name: 'Mixers', slug: 'mixer' },
  ],
};
