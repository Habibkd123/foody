import mongoose, { Schema, model, Document } from 'mongoose';

export interface IPushSubscription extends Document {
  user?: mongoose.Types.ObjectId;
  endpoint: string;
  p256dh?: string;
  auth?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PushSubscriptionSchema = new Schema<IPushSubscription>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  endpoint: { type: String, required: true, unique: true },
  p256dh: { type: String },
  auth: { type: String },
}, { timestamps: true });

PushSubscriptionSchema.index({ user: 1 });

export default mongoose.models.PushSubscription || model<IPushSubscription>('PushSubscription', PushSubscriptionSchema);
