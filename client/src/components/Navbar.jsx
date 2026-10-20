import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useCart } from '../context/CartContext.jsx';
import { useUI } from '../context/UIContext.jsx';
import { BagIcon, CloseIcon, MenuIcon, MoonIcon, SearchIcon, SunIcon } from './Icons.jsx';
import { CATEGORY_META } from '../lib/format.js';

export default function Navbar() {
  const { count, open } = useCart();
  const { theme, toggleTheme } = useUI();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { scrollY } = useScroll();
  const onShop = location.pathname === '/shop';
  const activeCat = new URLSearchParams(location.search).get('category');

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 12));

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const submit = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/shop?search=${encodeURIComponent(q)}` : '/shop');
    setSearchOpen(false);
  };

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="container nav__inner">
        <button
          className="icon-btn nav__burger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        <Link to="/" className="logo" aria-label="Halden home">
          <span className="logo__mark" aria-hidden="true">H</span>
          Halden
        </Link>

        <nav className="nav__links" aria-label="Main">
          <Link to="/shop" className={onShop && !activeCat ? 'active' : undefined}>Shop all</Link>
          {['audio', 'wearables', 'workspace', 'home'].map((c) => (
            <Link
              key={c}
              to={`/shop?category=${c}`}
              className={onShop && activeCat === c ? 'active' : undefined}
              aria-current={onShop && activeCat === c ? 'page' : undefined}
            >
              {CATEGORY_META[c].label}
            </Link>
          ))}
        </nav>

        <div className="nav__actions">
          <AnimatePresence initial={false}>
            {searchOpen && (
              <motion.form
                key="search"
                role="search"
                className="nav__search"
                onSubmit={submit}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 220, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <label htmlFor="nav-search" className="sr-only">Search products</label>
                <input
                  id="nav-search"
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)}
                  placeholder="Search products"
                  maxLength={80}
                />
              </motion.form>
            )}
          </AnimatePresence>
          <button
            className="icon-btn"
            aria-label={searchOpen ? 'Close search' : 'Search'}
            onClick={() => setSearchOpen((v) => !v)}
          >
            {searchOpen ? <CloseIcon /> : <SearchIcon />}
          </button>
          <button
            className="icon-btn"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            onClick={toggleTheme}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                style={{ display: 'grid' }}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </motion.span>
            </AnimatePresence>
          </button>
          <button className="icon-btn cart-btn" aria-label={`Open cart, ${count} items`} onClick={open}>
            <BagIcon />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  className="cart-btn__badge"
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="mobile-menu"
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="container mobile-menu__inner">
              <Link to="/shop">Shop all</Link>
              {Object.entries(CATEGORY_META).map(([slug, m]) => (
                <Link key={slug} to={`/shop?category=${slug}`}>{m.label}</Link>
              ))}
              <Link to="/policies">Shipping & returns</Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
