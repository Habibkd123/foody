import mongoose, { Schema, model, Types, Document } from 'mongoose';

export interface IWishlist extends Document {
  user_id: Types.ObjectId;
  products: Types.ObjectId[];
}

const WishlistSchema = new Schema<IWishlist>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product', required: true }],
}, { timestamps: true });

export default mongoose.models.Wishlist || model<IWishlist>('Wishlist', WishlistSchema);
