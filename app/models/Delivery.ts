import mongoose, { Schema, model, Types, Document, Model } from 'mongoose';
import { DeliveryStatus } from './User';

export interface IDelivery extends Document {
  order: Types.ObjectId;
  status: DeliveryStatus;
  courier: string;
  trackingNumber: string;
  freeDelivery?: boolean;
  estimatedDays?: string;
  expressAvailable?: boolean;
  expressDays?: string;
  product: Types.ObjectId; // Reference to the product being delivered
  // Additional fields can be added as needed
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

const DeliverySchema = new Schema<IDelivery>({
  order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  status: { type: String, enum: Object.values(DeliveryStatus), default: DeliveryStatus.PENDING },
  courier: String,
  trackingNumber: String,
  address: String,
  freeDelivery: { type: Boolean, default: false },
  estimatedDays: String,
  expressAvailable: { type: Boolean, default: false },
  expressDays: String,
}, { timestamps: true });
DeliverySchema.index({ order: 1 }, { unique: true });

DeliverySchema.pre<IDelivery>('save', function (next) {
  if (this.isNew && !this.trackingNumber) {
    this.trackingNumber = `TRK-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }
  next();
});
export default mongoose.models.Delivery || model<IDelivery>('Delivery', DeliverySchema);
