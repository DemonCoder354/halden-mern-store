import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { api } from '../lib/api.js';
import { useDebounced, useFetch } from '../lib/useFetch.js';
import { CATEGORY_META } from '../lib/format.js';
import ProductCard, { CardSkeleton } from '../components/ProductCard.jsx';
import { CloseIcon, FilterIcon, SearchIcon } from '../components/Icons.jsx';

const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name', label: 'Name A-Z' },
];

const PRICE_BANDS = [
  { label: 'Any price', min: '', max: '' },
  { label: 'Under $50', min: '', max: '50' },
  { label: '$50 to $150', min: '50', max: '150' },
  { label: '$150 to $400', min: '150', max: '400' },
  { label: '$400 and up', min: '400', max: '' },
];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const category = params.get('category') || '';
  const sort = params.get('sort') || 'newest';
  const minPrice = params.get('minPrice') || '';
  const maxPrice = params.get('maxPrice') || '';
  const onSale = params.get('onSale') === 'true';
  const page = Number(params.get('page')) || 1;

  const [search, setSearch] = useState(params.get('search') || '');
  const debounced = useDebounced(search, 350);

  // Keep the input in sync when the navbar search changes the URL.
  useEffect(() => {
    setSearch(params.get('search') || '');
  }, [params.get('search')]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = (patch, resetPage = true) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (resetPage) next.delete('page');
    setParams(next, { replace: true });
  };

  useEffect(() => {
    if ((params.get('search') || '') !== debounced) update({ search: debounced });
  }, [debounced]); // eslint-disable-line react-hooks/exhaustive-deps

  const query = {
    search: params.get('search') || undefined,
    category: category || undefined,
    sort,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
    onSale: onSale ? 'true' : undefined,
    page,
    limit: 12,
  };
  const { data, loading, error } = useFetch((s) => api.products(query, s), [params.toString()]);

  const activeBand = PRICE_BANDS.findIndex((b) => b.min === minPrice && b.max === maxPrice);
  const hasFilters = category || minPrice || maxPrice || onSale || params.get('search');

  const title = category ? CATEGORY_META[category]?.label : onSale ? 'On sale' : 'All products';

  return (
    <div className="container shop">
      <header className="shop__head">
        <motion.h1 key={title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {title}
        </motion.h1>
        <p className="muted">
          {category ? CATEGORY_META[category]?.blurb : 'Everything in the Halden collection.'}
        </p>
      </header>

      <div className="shop__toolbar">
        <div className="field field--icon">
          <SearchIcon />
          <label htmlFor="shop-search" className="sr-only">Search products</label>
          <input
            id="shop-search"
            type="search"
            placeholder="Search products"
            value={search}
            maxLength={80}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn--ghost shop__filter-toggle" onClick={() => setFiltersOpen(true)}>
          <FilterIcon width={18} height={18} /> Filters
        </button>
        <label className="select">
          <span className="sr-only">Sort by</span>
          <select value={sort} onChange={(e) => update({ sort: e.target.value })}>
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="shop__layout">
        <aside className={`filters ${filtersOpen ? 'is-open' : ''}`} aria-label="Filters">
          <div className="filters__head">
            <h2>Filters</h2>
            <button className="icon-btn" onClick={() => setFiltersOpen(false)} aria-label="Close filters">
              <CloseIcon />
            </button>
          </div>

          <fieldset>
            <legend>Category</legend>
            <div className="chips">
              <button className={`chip ${!category ? 'is-active' : ''}`} aria-pressed={!category} onClick={() => update({ category: '' })}>
                All
              </button>
              {Object.entries(CATEGORY_META).map(([slug, m]) => (
                <button
                  key={slug}
                  className={`chip ${category === slug ? 'is-active' : ''}`}
                  aria-pressed={category === slug}
                  onClick={() => update({ category: slug })}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Price</legend>
            <div className="radio-list">
              {PRICE_BANDS.map((b, i) => (
                <label key={b.label} className="radio">
                  <input
                    type="radio"
                    name="price"
                    checked={activeBand === i}
                    onChange={() => update({ minPrice: b.min, maxPrice: b.max })}
                  />
                  <span>{b.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Offers</legend>
            <label className="switch">
              <input type="checkbox" checked={onSale} onChange={(e) => update({ onSale: e.target.checked ? 'true' : '' })} />
              <span className="switch__track" aria-hidden="true"><span className="switch__thumb" /></span>
              <span>On sale only</span>
            </label>
          </fieldset>

          {hasFilters && (
            <button
              className="btn btn--ghost btn--block"
              onClick={() => {
                setSearch('');
                setParams({}, { replace: true });
              }}
            >
              Clear all filters
            </button>
          )}
          <button className="btn btn--primary btn--block filters__apply" onClick={() => setFiltersOpen(false)}>
            Show {data?.total ?? ''} results
          </button>
        </aside>
        {filtersOpen && <div className="overlay overlay--filters" onClick={() => setFiltersOpen(false)} />}

        <section aria-live="polite" aria-busy={loading}>
          <p className="muted small shop__count">
            {loading ? 'Loading products...' : data ? `${data.total} ${data.total === 1 ? 'product' : 'products'}` : ''}
          </p>
          {error && <p className="error-box">Could not load products. Is the API running?</p>}
          <div className="grid grid--3">
            {loading && !data
              ? Array.from({ length: 6 }, (_, i) => <CardSkeleton key={i} />)
              : (
                <AnimatePresence mode="popLayout">
                  {data?.items.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
                </AnimatePresence>
              )}
          </div>

          {data && data.items.length === 0 && !loading && (
            <motion.div className="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2>No products match</h2>
              <p className="muted">Try a different search or clear the filters.</p>
            </motion.div>
          )}

          {data && data.pages > 1 && (
            <nav className="pager" aria-label="Pagination">
              {Array.from({ length: data.pages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  className={`pager__btn ${n === page ? 'is-active' : ''}`}
                  aria-current={n === page ? 'page' : undefined}
                  onClick={() => {
                    update({ page: n === 1 ? '' : String(n) }, false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  {n}
                </button>
              ))}
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}
