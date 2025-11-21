import mongoose, { Schema, model, Document } from 'mongoose';

export type CouponType = 'percent' | 'flat';

export interface ICoupon extends Document {
  code: string;
  type: CouponType;
  value: number; // percent 1-100 or flat amount
  minTotal?: number;
  maxDiscount?: number;
  startsAt?: Date;
  endsAt?: Date;
  usageLimit?: number; // global
  perUserLimit?: number; // per user
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  type: { type: String, enum: ['percent', 'flat'], required: true },
  value: { type: Number, required: true },
  minTotal: { type: Number },
  maxDiscount: { type: Number },
  startsAt: { type: Date },
  endsAt: { type: Date },
  usageLimit: { type: Number },
  perUserLimit: { type: Number },
  active: { type: Boolean, default: true },
}, { timestamps: true });

CouponSchema.index({ code: 1 });
CouponSchema.index({ active: 1, startsAt: 1, endsAt: 1 });

export default mongoose.models.Coupon || model<ICoupon>('Coupon', CouponSchema);
