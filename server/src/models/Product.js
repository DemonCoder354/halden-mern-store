import mongoose from 'mongoose';

export const CATEGORIES = ['audio', 'wearables', 'workspace', 'home', 'lifestyle'];

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    tagline: { type: String, trim: true, maxlength: 160 },
    description: { type: String, required: true, maxlength: 4000 },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    category: { type: String, required: true, enum: CATEGORIES, index: true },
    image: { type: String, required: true },
    colors: [{ name: String, hex: String }],
    specs: [{ label: String, value: String }],
    stock: { type: Number, required: true, min: 0, default: 0 },
    featured: { type: Boolean, default: false, index: true },
    isNewArrival: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', tagline: 'text', description: 'text' });

productSchema.virtual('onSale').get(function onSale() {
  return Boolean(this.compareAtPrice && this.compareAtPrice > this.price);
});

productSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret.id;
    return ret;
  },
});

export default mongoose.model('Product', productSchema);
