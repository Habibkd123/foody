import mongoose, { Schema, model, Types, Document, Model } from 'mongoose';
import { DeliveryStatus } from './User';

export interface IDelivery extends Document {
  order: Types.ObjectId;
  status: DeliveryStatus;
  courier: string;
  trackingNumber: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

const DeliverySchema = new Schema<IDelivery>({
  order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  status: { type: String, enum: Object.values(DeliveryStatus), default: DeliveryStatus.PENDING },
  courier: String,
  trackingNumber: String,
  address: String,
}, { timestamps: true });

export default mongoose.models.Delivery || model<IDelivery>('Delivery', DeliverySchema);
