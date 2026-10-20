import { Router } from 'express';
import { z } from 'zod';
import Product, { CATEGORIES } from '../models/Product.js';
import { asyncHandler, HttpError } from '../middleware/error.js';

const router = Router();

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const SORTS = {
  newest: { createdAt: -1 },
  'price-asc': { price: 1 },
  'price-desc': { price: -1 },
  name: { name: 1 },
};

const listQuery = z.object({
  search: z.string().trim().max(80).optional(),
  category: z.enum(CATEGORIES).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  onSale: z.enum(['true', 'false']).optional(),
  sort: z.enum(Object.keys(SORTS)).default('newest'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(48).default(12),
});

// GET /api/products
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const q = listQuery.parse(req.query);
    const filter = {};

    if (q.search) {
      const rx = new RegExp(escapeRegex(q.search), 'i');
      filter.$or = [{ name: rx }, { tagline: rx }, { description: rx }];
    }
    if (q.category) filter.category = q.category;
    if (q.minPrice !== undefined || q.maxPrice !== undefined) {
      filter.price = {};
      if (q.minPrice !== undefined) filter.price.$gte = q.minPrice;
      if (q.maxPrice !== undefined) filter.price.$lte = q.maxPrice;
    }
    if (q.onSale === 'true') {
      filter.$expr = { $gt: ['$compareAtPrice', '$price'] };
    }

    const [items, total] = await Promise.all([
      Product.find(filter)
        .sort({ ...SORTS[q.sort], _id: 1 })
        .skip((q.page - 1) * q.limit)
        .limit(q.limit),
      Product.countDocuments(filter),
    ]);

    res.json({
      items,
      page: q.page,
      pages: Math.max(1, Math.ceil(total / q.limit)),
      total,
    });
  })
);

// GET /api/products/featured
router.get(
  '/featured',
  asyncHandler(async (req, res) => {
    const items = await Product.find({ featured: true }).sort({ createdAt: -1 }).limit(8);
    res.json(items);
  })
);

// GET /api/products/categories
router.get(
  '/categories',
  asyncHandler(async (req, res) => {
    const rows = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, image: { $first: '$image' } } },
      { $sort: { _id: 1 } },
    ]);
    res.json(rows.map((r) => ({ slug: r._id, count: r.count, image: r.image })));
  })
);

// GET /api/products/:slug
router.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const slug = z
      .string()
      .regex(/^[a-z0-9-]{1,120}$/)
      .parse(req.params.slug);
    const product = await Product.findOne({ slug });
    if (!product) throw new HttpError(404, 'Product not found');

    const related = await Product.find({ category: product.category, _id: { $ne: product._id } })
      .limit(4)
      .select('name slug price compareAtPrice image category stock isNewArrival');

    res.json({ product, related });
  })
);

export default router;
