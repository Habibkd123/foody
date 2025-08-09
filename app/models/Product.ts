import { IProduct, ProductStatus } from '@/types/product';
import mongoose, { Schema, model, Types, Document } from 'mongoose';

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: String,
  images: [String],
  price: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  stock: { type: Number, default: 0 },
  status: { type: String, enum: Object.values(ProductStatus), default: ProductStatus.ACTIVE }
}, { timestamps: true });

export default mongoose.models.Product || model<IProduct>('Product', ProductSchema);
