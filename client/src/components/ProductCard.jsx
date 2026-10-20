import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Price from './Price.jsx';
import { PlusIcon } from './Icons.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useUI } from '../context/UIContext.jsx';
import { categoryLabel } from '../lib/format.js';

// forwardRef lets AnimatePresence (mode="popLayout") measure exiting cards.
const ProductCard = forwardRef(function ProductCard({ product, index = 0 }, ref) {
  const { add } = useCart();
  const { toast } = useUI();
  const soldOut = product.stock === 0;
  const onSale = product.compareAtPrice > product.price;
  const discount = onSale ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;

  const quickAdd = (e) => {
    e.preventDefault();
    add(product, 1, product.colors?.[0]?.name);
    toast(`${product.name} added to your cart`, { image: product.image });
  };

  return (
    <motion.article
      ref={ref}
      layout
      className="card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, delay: Math.min(index, 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/product/${product.slug}`} className="card__link">
        <div className="card__media">
          <img
            src={product.image.replace('w=900', 'w=600')}
            alt={product.name}
            loading="lazy"
            width="600"
            height="600"
          />
          <div className="card__badges">
            {onSale && <span className="badge badge--sale">-{discount}%</span>}
            {product.isNewArrival && <span className="badge">New</span>}
            {soldOut && <span className="badge badge--muted">Sold out</span>}
          </div>
          {!soldOut && (
            <button className="card__quick" onClick={quickAdd} aria-label={`Add ${product.name} to cart`}>
              <PlusIcon width={18} height={18} />
              <span>Quick add</span>
            </button>
          )}
        </div>
        <div className="card__body">
          <p className="card__cat">{categoryLabel(product.category)}</p>
          <h3 className="card__title">{product.name}</h3>
          <Price price={product.price} compareAtPrice={product.compareAtPrice} />
        </div>
      </Link>
    </motion.article>
  );
});

export default ProductCard;

export function CardSkeleton() {
  return (
    <div className="card card--skeleton" aria-hidden="true">
      <div className="card__media skeleton" />
      <div className="card__body">
        <div className="skeleton skeleton--line" style={{ width: '35%' }} />
        <div className="skeleton skeleton--line" style={{ width: '75%' }} />
        <div className="skeleton skeleton--line" style={{ width: '25%' }} />
      </div>
    </div>
  );
}
