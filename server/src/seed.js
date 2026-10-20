import 'dotenv/config';
import { pathToFileURL } from 'node:url';
import Product from './models/Product.js';
import products from './data/products.js';
import { connectDB, disconnectDB } from './config/db.js';

export async function seedProducts() {
  await Product.deleteMany({});
  // Stagger timestamps so "newest" sorting is stable and meaningful.
  const now = Date.now();
  const docs = products.map((p, i) => ({ ...p, createdAt: new Date(now - i * 3600_000) }));
  await Product.insertMany(docs);
  console.log(`Seeded ${docs.length} products`);
}

// Run directly: npm run seed
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    if (!process.env.MONGO_URI) {
      console.error('Set MONGO_URI to seed a persistent database (in-memory mode seeds itself).');
      process.exit(1);
    }
    await connectDB();
    await seedProducts();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    await disconnectDB();
  }
}
