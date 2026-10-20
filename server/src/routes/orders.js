import { Router } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { asyncHandler, HttpError } from '../middleware/error.js';
import { calcShipping, round2 } from '../config/pricing.js';

const router = Router();

const objectId = z.string().refine((v) => mongoose.isValidObjectId(v), 'Invalid id');

const orderBody = z.object({
  items: z
    .array(z.object({ productId: objectId, quantity: z.number().int().min(1).max(20) }))
    .min(1)
    .max(50),
  customer: z.object({
    name: z.string().trim().min(2).max(80),
    email: z.string().trim().email().max(120),
    address: z.string().trim().min(4).max(160),
    city: z.string().trim().min(2).max(80),
    postalCode: z.string().trim().regex(/^[A-Za-z0-9 -]{3,12}$/, 'Invalid postal code'),
    country: z.string().trim().min(2).max(60),
  }),
});

// POST /api/orders
// Prices always come from the database, never from the client.
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const body = orderBody.parse(req.body);

    // Merge duplicate lines.
    const qtyById = new Map();
    for (const { productId, quantity } of body.items) {
      qtyById.set(productId, (qtyById.get(productId) || 0) + quantity);
    }

    const products = await Product.find({ _id: { $in: [...qtyById.keys()] } });
    if (products.length !== qtyById.size) throw new HttpError(400, 'Some products no longer exist');

    // Reserve stock atomically per product; roll back on any failure.
    const reserved = [];
    try {
      for (const p of products) {
        const qty = qtyById.get(String(p._id));
        const updated = await Product.findOneAndUpdate(
          { _id: p._id, stock: { $gte: qty } },
          { $inc: { stock: -qty } },
          { new: true }
        );
        if (!updated) throw new HttpError(409, `Not enough stock for "${p.name}"`);
        reserved.push({ id: p._id, qty });
      }
    } catch (err) {
      await Promise.all(
        reserved.map((r) => Product.updateOne({ _id: r.id }, { $inc: { stock: r.qty } }))
      );
      throw err;
    }

    const items = products.map((p) => ({
      product: p._id,
      name: p.name,
      image: p.image,
      price: p.price,
      quantity: qtyById.get(String(p._id)),
    }));
    const subtotal = round2(items.reduce((s, i) => s + i.price * i.quantity, 0));
    const shipping = calcShipping(subtotal);

    const order = await Order.create({
      items,
      customer: body.customer,
      subtotal,
      shipping,
      total: round2(subtotal + shipping),
    });

    res.status(201).json(order);
  })
);

// GET /api/orders/:id?email=...  (email must match, so ids alone reveal nothing)
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = objectId.parse(req.params.id);
    const email = z.string().trim().toLowerCase().email().parse(req.query.email);
    const order = await Order.findOne({ _id: id, 'customer.email': email });
    if (!order) throw new HttpError(404, 'Order not found');
    res.json(order);
  })
);

export default router;
