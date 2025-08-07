import mongoose, { Schema, model, Types, Document, Model } from 'mongoose';
export interface ICartItem {
  product: Types.ObjectId;
  quantity: number;
}
export interface ICart extends Document {
  user: Types.ObjectId;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CartSchema = new Schema<ICart>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1 },
  }]
}, { timestamps: true });

export default mongoose.models.Cart || model<ICart>('Cart', CartSchema);
