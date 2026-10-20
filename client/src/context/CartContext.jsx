import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { calcShipping } from '../lib/format.js';

const CartContext = createContext(null);
const STORAGE_KEY = 'halden-cart';
const MAX_QTY = 20;

const lineKey = (id, color) => `${id}:${color || ''}`;

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const { product, quantity, color } = action;
      const key = lineKey(product._id, color);
      const cap = Math.min(MAX_QTY, product.stock);
      const existing = state.find((l) => l.key === key);
      if (existing) {
        return state.map((l) =>
          l.key === key ? { ...l, quantity: Math.min(cap, l.quantity + quantity) } : l
        );
      }
      return [
        ...state,
        {
          key,
          id: product._id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.image,
          stock: product.stock,
          color,
          quantity: Math.min(cap, quantity),
        },
      ];
    }
    case 'setQty':
      return state
        .map((l) =>
          l.key === action.key
            ? { ...l, quantity: Math.max(0, Math.min(MAX_QTY, l.stock, action.quantity)) }
            : l
        )
        .filter((l) => l.quantity > 0);
    case 'remove':
      return state.filter((l) => l.key !== action.key);
    case 'clear':
      return [];
    default:
      return state;
  }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(reducer, undefined, load);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable: cart still works for this visit */
    }
  }, [lines]);

  const add = useCallback((product, quantity = 1, color) => {
    dispatch({ type: 'add', product, quantity, color });
  }, []);

  const value = useMemo(() => {
    const count = lines.reduce((s, l) => s + l.quantity, 0);
    const subtotal = Math.round(lines.reduce((s, l) => s + l.price * l.quantity, 0) * 100) / 100;
    const shipping = calcShipping(subtotal);
    return {
      lines,
      count,
      subtotal,
      shipping,
      total: subtotal + shipping,
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      add,
      setQty: (key, quantity) => dispatch({ type: 'setQty', key, quantity }),
      remove: (key) => dispatch({ type: 'remove', key }),
      clear: () => dispatch({ type: 'clear' }),
    };
  }, [lines, isOpen, add]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
