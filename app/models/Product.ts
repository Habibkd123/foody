import mongoose, { Schema, model, Types, Document } from 'mongoose';

export enum ProductStatus { ACTIVE = 'active', INACTIVE = 'inactive' }

export interface IProduct extends Document {
  name: string;
  description?: string;
  images: string[];
  price: number;
  category: Types.ObjectId; // Reference to subcategory
  stock: number;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
}

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
