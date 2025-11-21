import mongoose, { Schema, model, Document } from 'mongoose';

export interface ICouponRedemption extends Document {
  coupon: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  count: number;
  createdAt: Date;
  updatedAt: Date;
}

const CouponRedemptionSchema = new Schema<ICouponRedemption>({
  coupon: { type: Schema.Types.ObjectId, ref: 'Coupon', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  count: { type: Number, default: 0 },
}, { timestamps: true });

CouponRedemptionSchema.index({ coupon: 1, user: 1 }, { unique: true });

export default mongoose.models.CouponRedemption || model<ICouponRedemption>('CouponRedemption', CouponRedemptionSchema);
