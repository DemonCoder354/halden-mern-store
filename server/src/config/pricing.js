// Shipping rules are shown to the customer before checkout (no hidden fees).
export const FREE_SHIPPING_THRESHOLD = 150;
export const FLAT_SHIPPING = 9;

export function calcShipping(subtotal) {
  return subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : FLAT_SHIPPING;
}

export const round2 = (n) => Math.round(n * 100) / 100;
