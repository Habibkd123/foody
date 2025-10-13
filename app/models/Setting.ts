import mongoose, { Schema, model, Document } from 'mongoose';

export type PaymentGateway = 'stripe' | 'razorpay';

export interface ISetting extends Document {
  paymentGateway: PaymentGateway;
  updatedAt: Date;
  createdAt: Date;
}

const SettingSchema = new Schema<ISetting>({
  paymentGateway: { type: String, enum: ['stripe', 'razorpay'], default: 'stripe', required: true },
}, { timestamps: true });

export default mongoose.models.Setting || model<ISetting>('Setting', SettingSchema);
