import { ProductStatus } from '@/types/product';
import mongoose, { Schema, model, Types, Document } from 'mongoose';

interface IProduct extends Document {
  restaurantId?: Types.ObjectId;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  name: string;
  description?: string;
  images?: string[];
  price: number;
  originalPrice?: number;
  category: Types.ObjectId;
  stock?: number;
  inStock?: boolean;
  recipe?: Array<{ item: Types.ObjectId; qty: number }>;
  addonGroups?: Array<{
    name: string;
    selectionType: 'single' | 'multiple';
    min?: number;
    max?: number;
    options: Array<{ name: string; price: number; inStock?: boolean }>;
  }>;
  variants?: Array<{
    name: string;
    selectionType: 'single';
    options: Array<{ name: string; price: number; inStock?: boolean }>;
  }>;
  isCombo?: boolean;
  comboItems?: Array<{ product: Types.ObjectId; quantity: number }>;
  brand?: string;
  sku?: string;
  weight?: string;
  dimensions?: string;
  tags?: string[];
  features?: string[];
  specifications?: Map<string, string>;
  nutritionalInfo?: Map<string, string>;
  deliveryInfo?: {
    freeDelivery?: boolean;
    estimatedDays?: string;
    expressAvailable?: boolean;
    expressDays?: string;
  };
  warranty?: string;
  warrantyPeriod?: string;
  rating?: number;
  totalReviews?: number;
  status?: ProductStatus;
}

const ProductSchema = new Schema<IProduct>({
  restaurantId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved', index: true },
  name: { type: String, required: true },
  description: String,
  images: [String],
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  stock: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },

  recipe: [
    {
      item: { type: Schema.Types.ObjectId, ref: 'InventoryItem', required: true },
      qty: { type: Number, required: true, min: 0 },
    },
  ],

  addonGroups: [
    {
      name: { type: String, required: true, trim: true },
      selectionType: { type: String, enum: ['single', 'multiple'], default: 'multiple' },
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      options: [
        {
          name: { type: String, required: true, trim: true },
          price: { type: Number, default: 0 },
          inStock: { type: Boolean, default: true },
        },
      ],
    },
  ],

  variants: [
    {
      name: { type: String, required: true, trim: true },
      selectionType: { type: String, enum: ['single'], default: 'single' },
      options: [
        {
          name: { type: String, required: true, trim: true },
          price: { type: Number, default: 0 },
          inStock: { type: Boolean, default: true },
        },
      ],
    },
  ],

  isCombo: { type: Boolean, default: false },
  comboItems: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, default: 1 },
    },
  ],

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

export default (mongoose.models.Product as mongoose.Model<IProduct>) || model<IProduct>('Product', ProductSchema);
