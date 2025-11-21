import mongoose, { Schema, model, Types, Document } from 'mongoose';

export interface IReview extends Document {
  user: Types.ObjectId;
  product: Types.ObjectId;
  rating: number;
  comment?: string;
  date: Date;
  verified?: boolean;
  helpful?: number;
  notHelpful?: number;
  replies?: { user?: Types.ObjectId; comment: string; createdAt: Date }[];
  images?: string[];
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
  notHelpful: { type: Number, default: 0 },
  replies: [
    new Schema(
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
      { _id: false }
    ),
  ],
  images: [String],
}, { timestamps: true });

export default (mongoose.models.Review as mongoose.Model<IReview>) || model<IReview>('Review', ReviewSchema);
