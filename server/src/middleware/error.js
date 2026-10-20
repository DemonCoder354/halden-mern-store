import { ZodError } from 'zod';

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export function notFound(req, res) {
  res.status(404).json({ message: 'Not found' });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: err.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
    });
  }
  if (err.name === 'CastError') {
    return res.status(404).json({ message: 'Not found' });
  }

  const status = err.status || 500;
  if (status >= 500) console.error(err);
  // Never leak internals for unexpected errors.
  res.status(status).json({ message: status >= 500 ? 'Internal server error' : err.message });
}
