const BASE = import.meta.env.VITE_API_URL || '/api';

export class ApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function request(path, { signal, ...options } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    signal,
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.message || 'Request failed', res.status, data.errors);
  return data;
}

export const api = {
  products: (params = {}, signal) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null)
    );
    return request(`/products?${qs}`, { signal });
  },
  featured: (signal) => request('/products/featured', { signal }),
  categories: (signal) => request('/products/categories', { signal }),
  product: (slug, signal) => request(`/products/${encodeURIComponent(slug)}`, { signal }),
  createOrder: (body) => request('/orders', { method: 'POST', body: JSON.stringify(body) }),
};
