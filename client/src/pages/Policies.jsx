import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FLAT_SHIPPING, FREE_SHIPPING_THRESHOLD } from '../lib/format.js';

// Template policy text for the demo store. Replace with reviewed legal copy
// and real business details before running a live shop.
const SECTIONS = [
  {
    id: 'shipping',
    title: 'Shipping',
    body: [
      `Orders of $${FREE_SHIPPING_THRESHOLD} or more ship for free. Smaller orders have a flat $${FLAT_SHIPPING} shipping fee, shown in the cart before checkout. There are no other fees.`,
      'In-stock items are dispatched within 1 to 2 business days.',
    ],
  },
  {
    id: 'returns',
    title: 'Returns & refunds',
    body: [
      'You can return any unused item in its original packaging within 30 days of delivery for a full refund to the original payment method.',
      'Refunds are issued within 5 business days of receiving the return. Sale items are covered by the same policy.',
    ],
  },
  {
    id: 'warranty',
    title: 'Warranty',
    body: ['Every product carries a 2-year warranty against manufacturing defects. Contact us with your order number to start a claim.'],
  },
  {
    id: 'privacy',
    title: 'Privacy policy',
    body: [
      'We collect only what is needed to fulfil an order: your name, email and shipping address. We do not sell or share this data with third parties, and we do not use analytics or advertising trackers.',
      'Order data is kept for as long as required for accounting and warranty purposes.',
    ],
  },
  {
    id: 'cookies',
    title: 'Cookie policy',
    body: [
      'This site does not set tracking or advertising cookies. Your cart contents and theme preference are stored in your browser (localStorage) so they survive a page reload. This data never leaves your device unless you place an order.',
    ],
  },
  {
    id: 'terms',
    title: 'Terms of service',
    body: [
      'Halden is a demonstration store. Orders placed on this site are stored for demo purposes only and no payment is taken. Prices are in US dollars.',
      'By placing an order you confirm that the details you provide are accurate and that you are at least 16 years old.',
    ],
  },
  {
    id: 'data',
    title: 'Data deletion',
    body: [
      'You can ask us to delete any personal data linked to your orders at any time. Email privacy@halden.example with the email address you used and we will remove it within 30 days.',
      'To clear your cart and preferences from this browser, clear the site data in your browser settings.',
    ],
  },
];

export default function Policies() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [hash]);

  return (
    <div className="container policies">
      <header className="shop__head">
        <p className="eyebrow">Help & legal</p>
        <h1>Store policies</h1>
        <p className="muted">Plain-language policies for shipping, returns and your data.</p>
      </header>
      <div className="policies__layout">
        <nav className="policies__toc" aria-label="Policy sections">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={hash === `#${s.id}` ? 'is-active' : undefined}>{s.title}</a>
          ))}
        </nav>
        <div>
          {SECTIONS.map((s) => (
            <section key={s.id} id={s.id} className="policy">
              <h2>{s.title}</h2>
              {s.body.map((p) => <p key={p}>{p}</p>)}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
