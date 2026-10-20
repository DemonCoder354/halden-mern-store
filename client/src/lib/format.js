const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export const formatPrice = (n) => currency.format(n);

// Mirrors server/src/config/pricing.js. The server is the source of truth.
export const FREE_SHIPPING_THRESHOLD = 150;
export const FLAT_SHIPPING = 9;
export const calcShipping = (subtotal) =>
  subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : FLAT_SHIPPING;

export const CATEGORY_META = {
  audio: { label: 'Audio', blurb: 'Headphones tuned for long listening.' },
  wearables: { label: 'Wearables', blurb: 'Watches for every wrist.' },
  workspace: { label: 'Workspace', blurb: 'Tools for a calmer desk.' },
  home: { label: 'Home', blurb: 'Pieces that settle in.' },
  lifestyle: { label: 'Lifestyle', blurb: 'Carry, wear, repeat.' },
};

export const categoryLabel = (slug) => CATEGORY_META[slug]?.label ?? slug;
