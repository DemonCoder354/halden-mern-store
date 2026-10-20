import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { api } from '../lib/api.js';
import { useFetch } from '../lib/useFetch.js';
import { categoryLabel, FREE_SHIPPING_THRESHOLD, FLAT_SHIPPING } from '../lib/format.js';
import { useCart } from '../context/CartContext.jsx';
import { useUI } from '../context/UIContext.jsx';
import Price from '../components/Price.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Reveal from '../components/Reveal.jsx';
import { QtyStepper } from '../components/CartDrawer.jsx';
import { BagIcon, CheckIcon, ReturnIcon, TruckIcon } from '../components/Icons.jsx';
import NotFound from './NotFound.jsx';

function ZoomImage({ src, alt }) {
  const [origin, setOrigin] = useState('50% 50%');
  const [zoomed, setZoomed] = useState(false);
  return (
    <div
      className={`zoom ${zoomed ? 'is-zoomed' : ''}`}
      onMouseEnter={() => setZoomed(true)}
      onMouseLeave={() => setZoomed(false)}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
      }}
    >
      <motion.img
        src={src.replace('w=900', 'w=1200')}
        alt={alt}
        style={{ transformOrigin: origin }}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        width="1200"
        height="1200"
      />
    </div>
  );
}

export default function ProductPage() {
  const { slug } = useParams();
  const { data, loading, error } = useFetch((s) => api.product(slug, s), [slug]);
  const { add, open } = useCart();
  const { toast } = useUI();
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setQty(1);
    setColor(data?.product.colors?.[0]?.name);
    if (data) document.title = `${data.product.name} | Halden`;
    return () => {
      document.title = 'Halden | Considered goods';
    };
  }, [data]);

  if (error?.status === 404) return <NotFound />;
  if (error) return <div className="container section"><p className="error-box">Could not load this product.</p></div>;

  if (loading || !data) {
    return (
      <div className="container pdp">
        <div className="pdp__media skeleton" />
        <div className="pdp__info">
          <div className="skeleton skeleton--line" style={{ width: '30%' }} />
          <div className="skeleton skeleton--title" />
          <div className="skeleton skeleton--line" style={{ width: '20%' }} />
          <div className="skeleton skeleton--block" />
        </div>
      </div>
    );
  }

  const { product, related } = data;
  const soldOut = product.stock === 0;
  const maxQty = Math.min(20, product.stock);

  const handleAdd = () => {
    add(product, qty, color);
    setAdded(true);
    toast(`${qty} x ${product.name} added to your cart`, { image: product.image });
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <>
      <div className="container">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to={`/shop?category=${product.category}`}>{categoryLabel(product.category)}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{product.name}</span>
        </nav>
      </div>

      <div className="container pdp">
        <div className="pdp__media">
          <ZoomImage src={product.image} alt={product.name} />
          <div className="card__badges">
            {product.onSale && <span className="badge badge--sale">Sale</span>}
            {product.isNewArrival && <span className="badge">New</span>}
          </div>
        </div>

        <motion.div
          className="pdp__info"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.07 } } }}
        >
          {[
            <p key="cat" className="eyebrow">{categoryLabel(product.category)}</p>,
            <h1 key="name" className="pdp__title">{product.name}</h1>,
            <p key="tag" className="pdp__tagline">{product.tagline}</p>,
            <Price key="price" price={product.price} compareAtPrice={product.compareAtPrice} size="lg" />,
          ].map((el) => (
            <motion.div key={el.key} variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}>
              {el}
            </motion.div>
          ))}

          <motion.p className="pdp__desc" variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}>
            {product.description}
          </motion.p>

          {product.colors?.length > 0 && (
            <motion.fieldset className="swatches" variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}>
              <legend>Colour: <strong>{color}</strong></legend>
              <div className="swatches__row">
                {product.colors.map((c) => (
                  <label key={c.name} className="swatch" title={c.name}>
                    <input
                      type="radio"
                      name="color"
                      value={c.name}
                      checked={color === c.name}
                      onChange={() => setColor(c.name)}
                    />
                    <span style={{ background: c.hex }} />
                    <span className="sr-only">{c.name}</span>
                  </label>
                ))}
              </div>
            </motion.fieldset>
          )}

          <motion.div className="pdp__buy" variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}>
            {!soldOut && <QtyStepper value={qty} max={maxQty} onChange={(q) => setQty(Math.max(1, Math.min(maxQty, q)))} label="Quantity" />}
            <motion.button
              className="btn btn--primary btn--lg pdp__add"
              onClick={handleAdd}
              disabled={soldOut}
              whileTap={{ scale: 0.97 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={added ? 'added' : 'add'}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="btn__inner"
                >
                  {soldOut ? 'Sold out' : added ? <><CheckIcon width={18} height={18} /> Added</> : <><BagIcon width={18} height={18} /> Add to cart</>}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </motion.div>
          {added && (
            <button className="link-btn" onClick={open}>View cart</button>
          )}

          <p className={`stock ${product.stock <= 5 ? 'stock--low' : ''}`}>
            <span className="dot" />
            {soldOut ? 'Out of stock' : product.stock <= 5 ? `Only ${product.stock} left in stock` : 'In stock, ships in 1 to 2 business days'}
          </p>

          <ul className="pdp__perks">
            <li><TruckIcon /> Free shipping over ${FREE_SHIPPING_THRESHOLD}, otherwise ${FLAT_SHIPPING} flat.</li>
            <li><ReturnIcon /> 30-day returns. <Link to="/policies#returns">Read the policy</Link></li>
          </ul>

          {product.specs?.length > 0 && (
            <details className="specs" open>
              <summary>Specifications</summary>
              <dl>
                {product.specs.map((s) => (
                  <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>
                ))}
              </dl>
            </details>
          )}
        </motion.div>
      </div>

      {related.length > 0 && (
        <section className="section container">
          <Reveal className="section__head"><h2>You may also like</h2></Reveal>
          <div className="grid">
            {related.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </>
  );
}
