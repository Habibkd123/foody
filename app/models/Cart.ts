import mongoose, { Schema, model, Types, Document, Model } from 'mongoose';
export interface ICartItem {
  product: Types.ObjectId;
  quantity: number;
}
export interface ICart extends Document {
  user: Types.ObjectId;
  items: ICartItem[];
  status: 'active' | 'purchased' | 'abandoned';
  expiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const CartSchema = new Schema<ICart>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1 },
  }],
  status: { type: String, enum: ['active', 'purchased', 'abandoned'], default: 'active' },
  // TTL date field. Only set for non-purchased carts. When this date passes, MongoDB will remove the document.
  expiresAt: { type: Date, default: () => new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), index: true },
}, { timestamps: true });

// Ensure TTL behavior: expireAfterSeconds must be set via index on the date field.
// Using 0 here means expire exactly at expiresAt timestamp.
// Note: TTL indexes ignore documents where the field is null or missing.
CartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Cart || model<ICart>('Cart', CartSchema);
