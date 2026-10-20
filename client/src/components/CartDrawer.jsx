import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../context/CartContext.jsx';
import { CloseIcon, MinusIcon, PlusIcon, TrashIcon, BagIcon } from './Icons.jsx';
import { FREE_SHIPPING_THRESHOLD, formatPrice } from '../lib/format.js';

export function QtyStepper({ value, onChange, max = 20, label }) {
  return (
    <div className="qty" role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(value - 1)} aria-label="Decrease quantity">
        <MinusIcon width={16} height={16} />
      </button>
      <output aria-live="polite">{value}</output>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <PlusIcon width={16} height={16} />
      </button>
    </div>
  );
}

export function ShippingProgress({ subtotal }) {
  const left = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  return (
    <div className="ship-progress">
      <p>
        {left > 0 ? (
          <>
            Add <strong>{formatPrice(left)}</strong> more for free shipping
          </>
        ) : (
          <strong>You have unlocked free shipping</strong>
        )}
      </p>
      <div className="ship-progress__track">
        <motion.div
          className="ship-progress__bar"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}

export default function CartDrawer() {
  const { lines, isOpen, close, setQty, remove, subtotal, shipping, count } = useCart();
  const navigate = useNavigate();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const prev = document.activeElement;
    panelRef.current?.focus();
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      prev?.focus?.();
    };
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="overlay"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            ref={panelRef}
            tabIndex={-1}
            className="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          >
            <header className="drawer__head">
              <h2>Your cart <span className="muted">({count})</span></h2>
              <button className="icon-btn" onClick={close} aria-label="Close cart">
                <CloseIcon />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="drawer__empty">
                <motion.div
                  className="drawer__empty-icon"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                >
                  <BagIcon width={36} height={36} />
                </motion.div>
                <p>Your cart is empty.</p>
                <Link to="/shop" className="btn btn--primary" onClick={close}>
                  Start shopping
                </Link>
              </div>
            ) : (
              <>
                <ShippingProgress subtotal={subtotal} />
                <ul className="drawer__lines">
                  <AnimatePresence initial={false}>
                    {lines.map((l) => (
                      <motion.li
                        key={l.key}
                        layout
                        className="line"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <img src={l.image.replace('w=900', 'w=200')} alt="" width="80" height="80" />
                        <div className="line__info">
                          <Link to={`/product/${l.slug}`} onClick={close} className="line__name">
                            {l.name}
                          </Link>
                          {l.color && <span className="muted small">{l.color}</span>}
                          <div className="line__row">
                            <QtyStepper
                              value={l.quantity}
                              max={Math.min(20, l.stock)}
                              onChange={(q) => setQty(l.key, q)}
                              label={`Quantity of ${l.name}`}
                            />
                            <span className="line__price">{formatPrice(l.price * l.quantity)}</span>
                          </div>
                        </div>
                        <button
                          className="icon-btn icon-btn--sm"
                          onClick={() => remove(l.key)}
                          aria-label={`Remove ${l.name}`}
                        >
                          <TrashIcon width={16} height={16} />
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                <footer className="drawer__foot">
                  <dl className="summary">
                    <div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
                    <div><dt>Shipping</dt><dd>{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd></div>
                    <div className="summary__total"><dt>Total</dt><dd>{formatPrice(subtotal + shipping)}</dd></div>
                  </dl>
                  <button
                    className="btn btn--primary btn--block"
                    onClick={() => {
                      close();
                      navigate('/checkout');
                    }}
                  >
                    Checkout
                  </button>
                  <p className="muted small center">Shipping is shown upfront. No extra fees at checkout.</p>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
