import { useState, useMemo, useEffect } from 'react';
import { withBase } from '../lib/paths';
import type { Product, Category, Brand } from '../types';

interface CatalogFilterProps {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  telegramUrl: string;
}

export default function CatalogFilter({
  products,
  categories,
  brands: _brands,
  telegramUrl,
}: CatalogFilterProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedSection, setSelectedSection] = useState<'all' | 'solar' | 'sound'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Read URL query parameters on initial client mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const qParam = params.get('q');
    const catParam = params.get('category');
    const brandParam = params.get('brand');
    const secParam = params.get('section');

    if (qParam) setSearch(qParam);
    if (catParam) setSelectedCategory(catParam);
    if (brandParam) setSelectedBrand(brandParam);
    if (secParam && (secParam === 'solar' || secParam === 'sound')) {
      setSelectedSection(secParam);
    }
  }, []);

  // Sync state to URL search params
  const updateUrl = (
    newSearch: string,
    newCat: string,
    newBrand: string,
    newSec: 'all' | 'solar' | 'sound'
  ) => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    if (newSearch) params.set('q', newSearch);
    if (newCat !== 'all') params.set('category', newCat);
    if (newBrand !== 'all') params.set('brand', newBrand);
    if (newSec !== 'all') params.set('section', newSec);

    const queryString = params.toString();
    const newUrl = queryString
      ? `${window.location.pathname}?${queryString}`
      : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    updateUrl(val, selectedCategory, selectedBrand, selectedSection);
  };

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val);
    updateUrl(search, val, selectedBrand, selectedSection);
  };

  const handleBrandChange = (val: string) => {
    setSelectedBrand(val);
    updateUrl(search, selectedCategory, val, selectedSection);
  };

  const handleSectionChange = (val: 'all' | 'solar' | 'sound') => {
    setSelectedSection(val);
    // If selecting section incompatible with active category, reset category to 'all'
    if (val !== 'all') {
      const activeCatObj = categories.find((c) => c.slug === selectedCategory);
      if (activeCatObj && activeCatObj.section !== val) {
        setSelectedCategory('all');
        updateUrl(search, 'all', selectedBrand, val);
        return;
      }
    }
    updateUrl(search, selectedCategory, selectedBrand, val);
  };

  const handleReset = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedSection('all');
    setSortOrder('asc');
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  const hasActiveFilters =
    search.trim() !== '' ||
    selectedCategory !== 'all' ||
    selectedBrand !== 'all' ||
    selectedSection !== 'all';

  // Filtered categories based on selected section
  const availableCategories = useMemo(() => {
    if (selectedSection === 'all') return categories;
    return categories.filter((c) => c.section === selectedSection);
  }, [categories, selectedSection]);

  // Unique brands present in products
  const uniqueProductBrands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.primaryBrand) set.add(p.primaryBrand);
    });
    return Array.from(set).sort();
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products.filter((item) => {
      // Section check
      if (selectedSection !== 'all' && item.section !== selectedSection) {
        return false;
      }

      // Category check
      if (selectedCategory !== 'all' && item.categorySlug !== selectedCategory) {
        return false;
      }

      // Brand check
      if (selectedBrand !== 'all' && item.primaryBrand.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }

      // Search query check
      if (search.trim()) {
        const query = search.toLowerCase().trim();
        const titleMatch = item.title.toLowerCase().includes(query);
        const brandMatch = item.primaryBrand.toLowerCase().includes(query);
        const catMatch = item.categoryName.toLowerCase().includes(query);
        const descMatch = item.descriptionText.toLowerCase().includes(query);
        if (!titleMatch && !brandMatch && !catMatch && !descMatch) {
          return false;
        }
      }

      return true;
    });

    // Alphabetical sort (A-Z or Z-A)
    result.sort((a, b) => {
      const comp = a.title.localeCompare(b.title);
      return sortOrder === 'asc' ? comp : -comp;
    });

    return result;
  }, [products, search, selectedCategory, selectedBrand, selectedSection, sortOrder]);

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="bg-brand-offwhite p-4 sm:p-6 rounded-xl border border-brand-border">
        {/* Section Tabs */}
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-200">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-muted mr-2">
            Domain:
          </span>
          <button
            type="button"
            onClick={() => handleSectionChange('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              selectedSection === 'all'
                ? 'bg-brand-navy text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Products ({products.length})
          </button>
          <button
            type="button"
            onClick={() => handleSectionChange('solar')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              selectedSection === 'solar'
                ? 'bg-brand-blue text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Solar ({products.filter((p) => p.section === 'solar').length})
          </button>
          <button
            type="button"
            onClick={() => handleSectionChange('sound')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              selectedSection === 'sound'
                ? 'bg-brand-navy text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Sound ({products.filter((p) => p.section === 'sound').length})
          </button>
        </div>

        {/* Search & Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Keyword Search */}
          <div>
            <label htmlFor="catalog-search" className="block text-xs font-medium text-slate-700 mb-1">
              Search by Model / Keyword
            </label>
            <div className="relative">
              <input
                id="catalog-search"
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="e.g. MUST, Inverter, Ahuja, 48V..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-brand-border rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
              <svg
                className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="catalog-category" className="block text-xs font-medium text-slate-700 mb-1">
              Filter by Category
            </label>
            <select
              id="catalog-category"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-brand-border rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              <option value="all">All Categories</option>
              {availableCategories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name} ({c.count})
                </option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div>
            <label htmlFor="catalog-brand" className="block text-xs font-medium text-slate-700 mb-1">
              Filter by Brand
            </label>
            <select
              id="catalog-brand"
              value={selectedBrand}
              onChange={(e) => handleBrandChange(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-brand-border rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              <option value="all">All Brands</option>
              {uniqueProductBrands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Alphabetical Sort */}
          <div>
            <label htmlFor="catalog-sort" className="block text-xs font-medium text-slate-700 mb-1">
              Sort Order
            </label>
            <select
              id="catalog-sort"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="w-full px-3 py-2 text-sm bg-white border border-brand-border rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              <option value="asc">Name: A to Z</option>
              <option value="desc">Name: Z to A</option>
            </select>
          </div>
        </div>

        {/* Active Filters Bar & Reset Action */}
        <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs text-brand-muted">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-brand-dark">{filteredProducts.length}</strong> of{' '}
              {products.length} products
            </span>
            {hasActiveFilters && (
              <span className="inline-flex items-center gap-1.5 ml-2 text-brand-blue">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span>
                Filtered view
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Reset All Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Grid or Empty State */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.map((p) => {
            const hasImage = p.media && p.media.length > 0;
            const primaryImg = hasImage ? p.media[0] : null;
            const telegramText = encodeURIComponent(
              `Hello Universal Electronics, I would like to ask about ${p.title}.`
            );
            const tgLink = `${telegramUrl}?text=${telegramText}`;

            return (
              <div
                key={p.id}
                className="group flex flex-col bg-white rounded-lg border border-brand-border/90 hover:border-brand-blue/50 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                {/* Image */}
                <a
                  href={withBase(`/product/${p.slug}/`)}
                  className="relative block aspect-[4/3] bg-brand-offwhite overflow-hidden border-b border-slate-100 focus:outline-none"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  {primaryImg ? (
                    <img
                      src={withBase(primaryImg)}
                      alt={p.title}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-400 bg-slate-50">
                      <svg className="w-12 h-12 mb-2 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs font-medium text-slate-500">Image unavailable</span>
                    </div>
                  )}

                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-white/95 text-brand-navy shadow-sm border border-slate-200/80">
                      {p.categoryName}
                    </span>
                  </div>
                </a>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex items-center justify-between text-xs text-brand-muted mb-1.5">
                    <span className="font-medium text-brand-blue truncate">{p.primaryBrand}</span>
                    <span className="text-[11px] text-slate-400 capitalize">{p.section}</span>
                  </div>

                  <h3 className="font-medium text-brand-dark text-sm sm:text-base line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] mb-2 group-hover:text-brand-blue transition-colors">
                    <a href={withBase(`/product/${p.slug}/`)} className="focus:outline-none">
                      {p.title}
                    </a>
                  </h3>

                  <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <a
                      href={withBase(`/product/${p.slug}/`)}
                      className="inline-flex items-center text-xs font-semibold text-brand-navy hover:text-brand-blue transition-colors py-1"
                    >
                      <span>View Details</span>
                      <svg className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </a>

                    <a
                      href={tgLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium bg-sky-50 text-brand-telegram hover:bg-sky-100 transition-colors"
                      title="Inquire about this product on Telegram"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.37.74-.56 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24-.01.44z"/>
                      </svg>
                      <span>Enquire</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 bg-white rounded-xl border border-dashed border-slate-300">
          <svg className="w-12 h-12 text-slate-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h4 className="text-base font-semibold text-brand-dark mb-1">No products match your criteria</h4>
          <p className="text-sm text-brand-muted max-w-md mx-auto mb-5">
            We couldn't find any products matching your current search term or filter selection.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-brand-navy text-white text-sm font-medium rounded-lg hover:bg-brand-navyDark transition-colors shadow-sm"
          >
            Clear Filters and Show All 59 Products
          </button>
        </div>
      )}
    </div>
  );
}
