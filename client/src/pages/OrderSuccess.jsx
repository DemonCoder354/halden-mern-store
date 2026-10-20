import { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatPrice } from '../lib/format.js';
import { useCart } from '../context/CartContext.jsx';

export default function OrderSuccess() {
  const { id } = useParams();
  const { state } = useLocation();
  const order = state?.order;
  const { clear } = useCart();

  useEffect(() => {
    if (order) clear();
  }, [order]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="container success">
      <motion.svg
        className="success__check"
        viewBox="0 0 52 52"
        initial="hidden"
        animate="show"
        aria-hidden="true"
      >
        <motion.circle
          cx="26" cy="26" r="24" fill="none" strokeWidth="3"
          variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 0.6 } } }}
        />
        <motion.path
          d="M15 27l7 7 15-16" fill="none" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
          variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 0.4, delay: 0.55 } } }}
        />
      </motion.svg>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <h1>Thank you{order ? `, ${order.customer.name.split(' ')[0]}` : ''}!</h1>
        <p className="muted">
          Your order <strong>#{id.slice(-8).toUpperCase()}</strong> has been placed.
          {order && <> A confirmation would be sent to <strong>{order.customer.email}</strong> in a live store.</>}
        </p>

        {order && (
          <div className="success__card">
            <ul className="mini-lines">
              {order.items.map((i) => (
                <li key={i.product}>
                  <span className="mini-lines__img">
                    <img src={i.image.replace('w=900', 'w=160')} alt="" width="56" height="56" />
                    <span className="mini-lines__qty">{i.quantity}</span>
                  </span>
                  <span className="mini-lines__name">{i.name}</span>
                  <span>{formatPrice(i.price * i.quantity)}</span>
                </li>
              ))}
            </ul>
            <dl className="summary">
              <div><dt>Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
              <div><dt>Shipping</dt><dd>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</dd></div>
              <div className="summary__total"><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div>
            </dl>
          </div>
        )}

        <Link to="/shop" className="btn btn--primary">Continue shopping</Link>
      </motion.div>
    </div>
  );
}
