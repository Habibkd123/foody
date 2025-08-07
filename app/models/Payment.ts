
import mongoose, { Schema, model, Types, Document, Model } from 'mongoose';
import { PaymentStatus } from './User';
export interface IPayment extends Document {
  user: Types.ObjectId;
  order: Types.ObjectId;
  amount: number;
  status: PaymentStatus;
  method: string;
  transactionId: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING },
  method: String,
  transactionId: String,
}, { timestamps: true });

export default mongoose.models.Payment || model<IPayment>('Payment', PaymentSchema);
