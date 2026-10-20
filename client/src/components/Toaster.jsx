import { AnimatePresence, motion } from 'framer-motion';
import { useUI } from '../context/UIContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { CheckIcon } from './Icons.jsx';

export default function Toaster() {
  const { toasts, dismiss } = useUI();
  const { open, isOpen } = useCart();

  return (
    <div className="toaster" role="status" aria-live="polite">
      <AnimatePresence>
        {/* Hidden while the cart drawer is open so toasts never cover its Checkout button. */}
        {!isOpen && toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            className={`toast ${t.tone === 'error' ? 'toast--error' : ''}`}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            {t.image ? (
              <img src={t.image.replace('w=900', 'w=120')} alt="" width="44" height="44" />
            ) : (
              <span className="toast__icon"><CheckIcon width={18} height={18} /></span>
            )}
            <p>{t.message}</p>
            {t.image && (
              <button
                className="toast__action"
                onClick={() => {
                  dismiss(t.id);
                  open();
                }}
              >
                View cart
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
