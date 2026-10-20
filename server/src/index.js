import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';
import { seedProducts } from './seed.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import { errorHandler, notFound } from './middleware/error.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';
// Hosting platforms inject PORT in production; in development the Vite proxy
// expects the API on API_PORT (default 5000).
const PORT = Number(isProd ? process.env.PORT : process.env.API_PORT) || 5000;

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'img-src': ["'self'", 'data:', 'https://images.unsplash.com'],
        'font-src': ["'self'", 'https://fonts.gstatic.com'],
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      },
    },
  })
);
app.use(compression());
app.use(express.json({ limit: '50kb' }));
if (!isProd) app.use(morgan('dev'));

const origins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',').map((s) => s.trim());
app.use('/api', cors({ origin: origins }));

app.use('/api', rateLimit({ windowMs: 60_000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false }));
const orderLimiter = rateLimit({ windowMs: 15 * 60_000, limit: 20, standardHeaders: 'draft-7', legacyHeaders: false });

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/products', productRoutes);
app.use('/api/orders', orderLimiter, orderRoutes);
app.use('/api', notFound);

// In production the API also serves the built React app.
if (isProd) {
  const dist = path.resolve(__dirname, '../../client/dist');
  app.use(express.static(dist, { maxAge: '7d', index: false }));
  app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.use(errorHandler);

try {
  const inMemory = await connectDB();
  if (inMemory) await seedProducts();
  app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
} catch (err) {
  console.error('Failed to start server:', err.message);
  process.exit(1);
}
