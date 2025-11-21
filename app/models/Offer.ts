import mongoose, { Schema, model } from 'mongoose';

export type OfferScope = {
  type: 'product' | 'category' | 'tag';
  productIds?: string[];
  categoryIds?: string[];
  tags?: string[];
};

export interface OfferDoc extends mongoose.Document {
  title: string;
  description?: string;
  code?: string;
  discountType: 'percent' | 'fixed';
  discountValue: number; // percent: 1-100, fixed: currency units
  maxDiscount?: number; // optional cap
  minOrderAmount?: number;
  scope: OfferScope;
  startsAt?: Date;
  endsAt?: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OfferSchema = new Schema<OfferDoc>({
  title: { type: String, required: true },
  description: String,
  code: { type: String, trim: true },
  discountType: { type: String, enum: ['percent', 'fixed'], required: true },
  discountValue: { type: Number, required: true, min: 0 },
  maxDiscount: { type: Number },
  minOrderAmount: { type: Number },
  scope: {
    type: {
      type: String,
      enum: ['product', 'category', 'tag'],
      required: true,
    },
    productIds: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    categoryIds: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    tags: [String],
  },
  startsAt: { type: Date },
  endsAt: { type: Date },
  active: { type: Boolean, default: true },
}, { timestamps: true });

OfferSchema.index({ code: 1 }, { unique: false, sparse: true });
OfferSchema.index({ 'scope.type': 1 });
OfferSchema.index({ startsAt: 1, endsAt: 1, active: 1 });

export default (mongoose.models.Offer as mongoose.Model<OfferDoc>) || model<OfferDoc>('Offer', OfferSchema);
