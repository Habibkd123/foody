import { Product, ProductStatus } from '@/types/product';
import mongoose, { Schema, model, Types, Document } from 'mongoose';

const ProductSchema = new Schema<Product>({
  name: { type: String, required: true },
  description: String,
  images: [String],
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  stock: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },

  // Brand / SKU
  brand: { type: String },
  sku: { type: String },
  weight: { type: String },
  dimensions: { type: String },

  // Tags
  tags: [String],

  // Features
  features: [String],

  // Specifications
  specifications: {
    type: Map,
    of: String, // key-value format
  },

  // Nutritional Info
  nutritionalInfo: {
    type: Map,
    of: String,
  },

  // Delivery Info
  deliveryInfo: {
    freeDelivery: { type: Boolean, default: false },
    estimatedDays: { type: String, default: '2-3 days' },
    expressAvailable: { type: Boolean, default: false },
    expressDays: { type: String },
  },

  // Warranty
  warranty: { type: String },
  warrantyPeriod: { type: String },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  status: { type: String, enum: Object.values(ProductStatus), default: ProductStatus.ACTIVE }
}, { timestamps: true });

export default mongoose.models.Product || model<Product>('Product', ProductSchema);
