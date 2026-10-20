import { formatPrice } from '../lib/format.js';

export default function Price({ price, compareAtPrice, size }) {
  const onSale = compareAtPrice && compareAtPrice > price;
  return (
    <span className={`price ${size ? `price--${size}` : ''}`}>
      <span className={onSale ? 'price__now price__now--sale' : 'price__now'}>{formatPrice(price)}</span>
      {onSale && (
        <s className="price__was">
          <span className="sr-only">Was </span>
          {formatPrice(compareAtPrice)}
        </s>
      )}
    </span>
  );
}
