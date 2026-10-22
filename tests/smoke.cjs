const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const fileExists = (p) => fs.existsSync(path.join(root, p));
const productsSource = read('src/data/products.ts');
const taxonomySource = read('src/data/taxonomy.ts');
const products = [...productsSource.matchAll(/"slug":\s*"([^"]+)"/g)].map((m) => m[1]);
const categories = [...taxonomySource.slice(0, taxonomySource.indexOf('export const brands')).matchAll(/"slug":\s*"([^"]+)"/g)].map((m) => m[1]);
assert.equal(products.length, 59, 'Expected the 59 published product routes');
assert.equal(categories.length, 10, 'Expected the 10 curated catalog categories');
assert.equal(new Set(products).size, products.length, 'Product slugs must be unique');
for (const slug of products) {
  assert.ok(fileExists(path.join('dist', 'product', slug, 'index.html')), 'Missing rendered product: ' + slug);
}
for (const slug of categories) {
  assert.ok(fileExists(path.join('dist', 'category', slug, 'index.html')), 'Missing rendered category: ' + slug);
}
const page = read('dist/index.html');
assert.match(page, /rel="canonical"/, 'Homepage needs a canonical link');
assert.ok(page.includes('universalelectronicet.com'), 'Homepage should use the production domain');
assert.match(page, /application\/ld\+json/, 'Site should include structured data');
assert.ok(page.includes('Recognition &amp; certificates') || page.includes('Recognition & certificates'), 'Homepage should feature recognition documents');
assert.ok(page.includes('Ready to power your project'), 'Homepage quotation CTA missing');
assert.ok(page.includes('A few useful answers'), 'Homepage FAQ missing');
assert.ok(page.includes('ue-solution-accordion'), 'Interactive solution panels missing');
assert.ok(page.includes('ue-category-quick-grid'), 'Quick category navigation missing');
assert.ok(fileExists('dist/robots.txt') && fileExists('dist/sitemap.xml'), 'Sitemap and robots must be published');
const sitemap = read('dist/sitemap.xml');
const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
assert.equal(locations.length, 14 + categories.length + products.length, 'Sitemap count must match published routes');
assert.equal(new Set(locations).size, locations.length, 'Sitemap URLs must be unique');
const manifest = JSON.parse(read('src/generated/image-manifest.json'));
assert.ok(Object.keys(manifest).length > 10, 'Image optimizer must generate responsive versions');
for (const variants of Object.values(manifest)) {
  for (const asset of Object.values(variants)) {
    assert.ok(fileExists(path.join('dist', asset.replace(/^\//, ''))), 'Missing optimized image: ' + asset);
  }
}
for (const slug of ['solar-power','backup-power','water-pumping','professional-sound']) {
 assert.ok(fileExists('dist/solutions/' + slug + '/index.html'), 'Missing solution page '+slug);
}
assert.ok(fileExists('dist/guides/index.html'), 'Equipment guides page missing');
const service = read('dist/services/index.html');
assert.ok(service.includes('Solutions for power, water and sound'), 'Services page missing');
const contact = read('dist/contact/index.html');
assert.ok(contact.includes('ተፋራ የገበያ ማዕከል') === false, 'Unexpected changed Amharic spelling');
assert.ok(contact.includes('ተፈራ የገበያ ማዕከል'), 'Bilingual company address missing');
assert.ok(contact.includes('maps.google.com/maps?q=9.03467%2C38.744252'), 'Map iframe missing');
assert.ok(contact.includes('www.google.com/maps/dir/?api=1'), 'Get directions link missing');
const catalog = read('dist/shop/index.html');
assert.match(catalog, /Find the equipment you need/, 'Catalog page must be rendered');
assert.ok(fileExists('dist/contact/index.html') && fileExists('dist/projects/index.html') && fileExists('dist/services/index.html') && fileExists('dist/recognition/index.html'), 'Important pages must be present');
console.log('Smoke QA passed: ' + products.length + ' products, ' + categories.length + ' categories, ' + locations.length + ' sitemap URLs, ' + Object.keys(manifest).length + ' optimized image sources.');
