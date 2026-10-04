export interface Product {
  id: string;
  title: string;
  slug: string;
  sourceUrl?: string;
  categories: string[];
  categorySlug: string;
  categoryName: string;
  brands: string[];
  primaryBrand: string;
  descriptionText: string;
  shortDescriptionText: string;
  features: string[];
  specifications: { label: string; value: string }[];
  media: string[];
  section: 'solar' | 'sound';
}

export interface Category {
  name: string;
  slug: string;
  description: string;
  section: 'solar' | 'sound';
  count: number;
}

export interface Brand {
  name: string;
  slug: string;
  description: string;
  logoUrl?: string;
}

export interface SiteConfig {
  companyName: string;
  tagline: string;
  address: string;
  city: string;
  country: string;
  phones: string[];
  email: string;
  telegramUsername: string;
  telegramUrl: string;
  whatsappNumber: string;
  navLinks: { label: string; href: string }[];
  solarCategories: { name: string; slug: string }[];
  soundCategories: { name: string; slug: string }[];
}
