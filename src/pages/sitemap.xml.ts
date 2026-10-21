import type { APIRoute } from 'astro';
import { products } from '../data/products';
import { categories } from '../data/taxonomy';
import { solutions } from '../data/solutions';

const productionOrigin = 'https://universalelectronicet.com';
const fixedPaths = ['/', '/shop/', '/shop/solar/', '/shop/sound/', '/projects/', '/services/', '/recognition/', '/about/', '/contact/'];

export const GET: APIRoute = () => {
  const paths = [
    ...fixedPaths,
    ...categories.map((category) => '/category/' + category.slug + '/'),
    ...solutions.map((solution) => '/solutions/' + solution.slug + '/'),
    ...products.map((product) => '/product/' + product.slug + '/'),
  ];
  const urls = [...new Set(paths)];
  const body = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map((path) => '  <url><loc>' + new URL(path, productionOrigin).href + '</loc></url>').join('\n') +
    '\n</urlset>\n';
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
