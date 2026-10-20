import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import Toaster from './components/Toaster.jsx';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import ProductPage from './pages/ProductPage.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx';
import Policies from './pages/Policies.jsx';
import NotFound from './pages/NotFound.jsx';

function Page({ children }) {
  return (
    <motion.main
      id="main"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.main>
  );
}

export default function App() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) window.scrollTo({ top: 0 });
  }, [location.pathname, location.hash]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar />
      {/* Pages fade in on route change. No exit animation: a page-level
          AnimatePresence in "wait" mode can stall when nested AnimatePresence
          grids are mid-exit, leaving the old page on screen. */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Page><Home /></Page>} />
        <Route path="/shop" element={<Page><Shop /></Page>} />
        <Route path="/product/:slug" element={<Page><ProductPage /></Page>} />
        <Route path="/checkout" element={<Page><Checkout /></Page>} />
        <Route path="/order/:id" element={<Page><OrderSuccess /></Page>} />
        <Route path="/policies" element={<Page><Policies /></Page>} />
        <Route path="*" element={<Page><NotFound /></Page>} />
      </Routes>
      <Footer />
      <CartDrawer />
      <Toaster />
    </>
  );
}
