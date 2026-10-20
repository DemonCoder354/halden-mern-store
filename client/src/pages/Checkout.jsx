import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../context/CartContext.jsx';
import { useUI } from '../context/UIContext.jsx';
import { api } from '../lib/api.js';
import { formatPrice } from '../lib/format.js';
import { ShippingProgress } from '../components/CartDrawer.jsx';

const FIELDS = [
  { name: 'name', label: 'Full name', autoComplete: 'name', span: 2 },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', span: 2 },
  { name: 'address', label: 'Street address', autoComplete: 'street-address', span: 2 },
  { name: 'city', label: 'City', autoComplete: 'address-level2' },
  { name: 'postalCode', label: 'Postal code', autoComplete: 'postal-code' },
  { name: 'country', label: 'Country', autoComplete: 'country-name', span: 2 },
];

function validate(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = 'Please enter your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = 'Please enter a valid email.';
  if (v.address.trim().length < 4) e.address = 'Please enter your street address.';
  if (v.city.trim().length < 2) e.city = 'Please enter your city.';
  if (!/^[A-Za-z0-9 -]{3,12}$/.test(v.postalCode.trim())) e.postalCode = 'Please enter a valid postal code.';
  if (v.country.trim().length < 2) e.country = 'Please enter your country.';
  if (!v.agree) e.agree = 'Please accept the terms to place your order.';
  return e;
}

export default function Checkout() {
  const { lines, subtotal, shipping, total } = useCart();
  const { toast } = useUI();
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: '', email: '', address: '', city: '', postalCode: '', country: '', agree: false });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (lines.length === 0) {
    return (
      <div className="container section empty">
        <h1>Your cart is empty</h1>
        <p className="muted">Add a few things before checking out.</p>
        <Link to="/shop" className="btn btn--primary">Browse products</Link>
      </div>
    );
  }

  const set = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setValues((v) => ({ ...v, [k]: val }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(`f-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    setSubmitting(true);
    try {
      const { agree, ...customer } = values;
      const order = await api.createOrder({
        items: lines.map((l) => ({ productId: l.id, quantity: l.quantity })),
        customer,
      });
      // The success page clears the cart, so this page never flashes an empty state.
      navigate(`/order/${order._id}`, { state: { order } });
    } catch (err) {
      if (err.errors) {
        const mapped = {};
        err.errors.forEach((x) => { mapped[x.field.replace('customer.', '')] = x.message; });
        setErrors(mapped);
      }
      toast(err.message || 'Could not place your order.', { tone: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container checkout">
      <h1 className="checkout__title">Checkout</h1>
      <div className="checkout__layout">
        <form className="checkout__form" onSubmit={submit} noValidate>
          <h2>Shipping details</h2>
          <p className="muted small">
            We only ask for what we need to deliver your order. See our <Link to="/policies#privacy">privacy policy</Link>.
          </p>
          <div className="form-grid">
            {FIELDS.map((f) => (
              <div key={f.name} className={`form-field ${f.span === 2 ? 'form-field--full' : ''} ${errors[f.name] ? 'has-error' : ''}`}>
                <label htmlFor={`f-${f.name}`}>{f.label}</label>
                <input
                  id={`f-${f.name}`}
                  type={f.type || 'text'}
                  autoComplete={f.autoComplete}
                  value={values[f.name]}
                  onChange={set(f.name)}
                  aria-invalid={Boolean(errors[f.name])}
                  aria-describedby={errors[f.name] ? `e-${f.name}` : undefined}
                  maxLength={160}
                  required
                />
                <AnimatePresence>
                  {errors[f.name] && (
                    <motion.p id={`e-${f.name}`} className="form-error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      {errors[f.name]}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className={`form-field ${errors.agree ? 'has-error' : ''}`}>
            <label className="check">
              <input id="f-agree" type="checkbox" checked={values.agree} onChange={set('agree')} aria-describedby={errors.agree ? 'e-agree' : undefined} />
              <span>
                I agree to the <Link to="/policies#terms" target="_blank">terms of service</Link> and{' '}
                <Link to="/policies#returns" target="_blank">refund policy</Link>.
              </span>
            </label>
            {errors.agree && <p id="e-agree" className="form-error">{errors.agree}</p>}
          </div>

          <div className="notice">
            This is a demo store. No payment is taken; placing an order just saves it to the database.
          </div>

          <motion.button type="submit" className="btn btn--primary btn--lg btn--block" disabled={submitting} whileTap={{ scale: 0.98 }}>
            {submitting ? <span className="spinner" aria-label="Placing order" /> : `Place order, ${formatPrice(total)}`}
          </motion.button>
        </form>

        <aside className="checkout__summary">
          <h2>Order summary</h2>
          <ShippingProgress subtotal={subtotal} />
          <ul className="mini-lines">
            {lines.map((l) => (
              <li key={l.key}>
                <span className="mini-lines__img">
                  <img src={l.image.replace('w=900', 'w=160')} alt="" width="56" height="56" />
                  <span className="mini-lines__qty">{l.quantity}</span>
                </span>
                <span className="mini-lines__name">
                  {l.name}
                  {l.color && <span className="muted small">{l.color}</span>}
                </span>
                <span>{formatPrice(l.price * l.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="summary">
            <div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            <div><dt>Shipping</dt><dd>{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd></div>
            <div className="summary__total"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
