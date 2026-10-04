import { useEffect, useMemo, useState } from 'react';
import { withBase } from '../lib/paths';
import type { Category, Product } from '../types';

interface Props { products: Product[]; categories: Category[]; }
type Section = 'all' | 'solar' | 'sound';

export default function CatalogFilter({ products, categories }: Props) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [brand, setBrand] = useState('all');
  const [section, setSection] = useState<Section>('all');
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialSection = params.get('section');
    setSearch(params.get('q') || '');
    setCategory(params.get('category') || 'all');
    setBrand(params.get('brand') || 'all');
    if (initialSection === 'solar' || initialSection === 'sound') setSection(initialSection);
    if (params.has('category') || params.has('brand')) setFiltersOpen(true);
  }, []);

  function updateUrl(nextSearch: string, nextCategory: string, nextBrand: string, nextSection: Section) {
    const params = new URLSearchParams();
    if (nextSearch.trim()) params.set('q', nextSearch.trim());
    if (nextCategory !== 'all') params.set('category', nextCategory);
    if (nextBrand !== 'all') params.set('brand', nextBrand);
    if (nextSection !== 'all') params.set('section', nextSection);
    const query = params.toString();
    window.history.replaceState({}, '', `${window.location.pathname}${query ? `?${query}` : ''}`);
  }

  function changeSection(next: Section) {
    const nextCategory = next !== 'all' && categories.find((item) => item.slug === category)?.section !== next ? 'all' : category;
    setSection(next);
    setCategory(nextCategory);
    setBrand('all');
    updateUrl(search, nextCategory, 'all', next);
  }

  function clearFilters() {
    setSearch(''); setCategory('all'); setBrand('all'); setSection('all'); setSort('asc');
    setFiltersOpen(false);
    window.history.replaceState({}, '', window.location.pathname);
  }

  const availableCategories = categories.filter((item) => section === 'all' || item.section === section);
  const brands = useMemo(() => Array.from(new Set(products.filter((item) => section === 'all' || item.section === section).map((item) => item.primaryBrand))).sort(), [products, section]);
  const filtered = useMemo(() => products.filter((item) => {
    const query = search.trim().toLowerCase();
    return (section === 'all' || item.section === section)
      && (category === 'all' || item.categorySlug === category)
      && (brand === 'all' || item.primaryBrand === brand)
      && (!query || [item.title, item.primaryBrand, item.categoryName, item.descriptionText].some((value) => value.toLowerCase().includes(query)));
  }).sort((a, b) => sort === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)), [products, search, category, brand, section, sort]);
  const hasFilters = Boolean(search.trim()) || category !== 'all' || brand !== 'all' || section !== 'all';

  return <div>
    <div className="border-y border-brand-border py-5 sm:py-6">
      <div className="flex flex-wrap items-center gap-3" role="group" aria-label="Product type">
        {([['all', 'All products'], ['solar', 'Solar'], ['sound', 'Sound']] as const).map(([value, label]) => <button
          key={value} type="button" aria-pressed={section === value} onClick={() => changeSection(value)}
          className={`min-h-11 border px-5 text-sm font-semibold transition-colors ${section === value ? 'border-brand-navy bg-brand-navy text-white' : 'border-brand-border bg-transparent text-brand-navy hover:border-brand-navy'}`}>
          {label}
        </button>)}
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div><label htmlFor="catalog-search" className="mb-2 block text-xs font-semibold text-brand-navy">Search products</label>
          <input id="catalog-search" type="search" value={search} placeholder="Product, model or keyword" className="catalog-field"
            onChange={(event) => { setSearch(event.target.value); updateUrl(event.target.value, category, brand, section); }} /></div>
        <button type="button" className="button-secondary min-h-12 justify-between sm:hidden" aria-expanded={filtersOpen} aria-controls="catalog-more-filters" onClick={() => setFiltersOpen(!filtersOpen)}>
          Filter and sort <span aria-hidden="true">{filtersOpen ? '−' : '+'}</span>
        </button>
        <div id="catalog-more-filters" className={`${filtersOpen ? 'grid' : 'hidden'} gap-4 sm:contents`}>
        <div><label htmlFor="catalog-category" className="mb-2 block text-xs font-semibold text-brand-navy">Category</label>
          <select id="catalog-category" value={category} className="catalog-field" onChange={(event) => { setCategory(event.target.value); updateUrl(search, event.target.value, brand, section); }}>
            <option value="all">All categories</option>{availableCategories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
          </select></div>
        <div><label htmlFor="catalog-brand" className="mb-2 block text-xs font-semibold text-brand-navy">Brand</label>
          <select id="catalog-brand" value={brand} className="catalog-field" onChange={(event) => { setBrand(event.target.value); updateUrl(search, category, event.target.value, section); }}>
            <option value="all">All brands</option>{brands.map((item) => <option key={item} value={item}>{item}</option>)}
          </select></div>
        <div><label htmlFor="catalog-sort" className="mb-2 block text-xs font-semibold text-brand-navy">Sort by</label>
          <select id="catalog-sort" value={sort} className="catalog-field" onChange={(event) => setSort(event.target.value as 'asc' | 'desc')}>
            <option value="asc">Name: A to Z</option><option value="desc">Name: Z to A</option>
          </select></div>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-brand-muted" aria-live="polite">
        <p>Showing <strong className="text-brand-navy">{filtered.length}</strong> of {products.length} products</p>
        {hasFilters && <button type="button" onClick={clearFilters} className="inline-flex min-h-11 items-center font-semibold text-brand-blue underline underline-offset-4 hover:text-brand-navy">Clear filters</button>}
      </div>
    </div>

    {filtered.length ? <div className="grid gap-x-6 gap-y-12 py-8 sm:grid-cols-2 sm:py-10 lg:grid-cols-3">
      {filtered.map((item) => <article key={item.id} className="product-card group">
        <a href={withBase(`/product/${item.slug}/`)} className="product-card-image" aria-label={`View ${item.title}`}>
          {item.media?.[0] ? <img src={withBase(item.media[0])} alt="" loading="lazy" width="520" height="560" />
            : <span className="px-6 text-center text-sm text-brand-muted">Product image unavailable</span>}
        </a>
        <p className="product-card-meta">{item.primaryBrand} <span className="mx-2 text-brand-border">/</span> {item.categoryName}</p>
        <h2 className="product-card-title"><a href={withBase(`/product/${item.slug}/`)}>{item.title}</a></h2>
        <a href={withBase(`/product/${item.slug}/`)} className="product-card-link">View product <span aria-hidden="true">↗</span></a>
      </article>)}
    </div> : <div className="py-24 text-center" role="status">
      <h2 className="font-serif text-2xl font-semibold">No matching products</h2>
      <p className="mt-3 text-brand-muted">Try a different search or clear your filters.</p>
      <button type="button" onClick={clearFilters} className="button-primary mt-7">Show all products</button>
    </div>}
  </div>;
}
