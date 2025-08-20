import mongoose, { Schema, model, Types, Document, Model } from 'mongoose';
export interface IReview extends Document {
  user: Types.ObjectId;
  product: Types.ObjectId;
  rating: number;
  comment?: string;
  date: Date;
  verified?: boolean;
  helpful?: number;
  images?: string[];
  // Additional fields can be added as needed
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String,
   date: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false },
  helpful: { type: Number, default: 0 },
  images: [String],
}, { timestamps: true });

export default mongoose.models.Review || model<IReview>('Review', ReviewSchema);
