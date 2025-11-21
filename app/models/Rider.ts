import mongoose, { Schema, model, Document, Types } from 'mongoose';

export type RiderStatus = 'idle' | 'on_delivery' | 'offline';

export interface IRider extends Document {
  name: string;
  phone: string;
  status: RiderStatus;
  location?: { lat: number; lng: number; at: Date } | null;
  activeOrder?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const RiderSchema = new Schema<IRider>({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  status: { type: String, enum: ['idle', 'on_delivery', 'offline'], default: 'idle' },
  location: {
    lat: { type: Number },
    lng: { type: Number },
    at: { type: Date },
  },
  activeOrder: { type: Schema.Types.ObjectId, ref: 'Order' },
}, { timestamps: true });

RiderSchema.index({ status: 1 });
RiderSchema.index({ phone: 1 }, { unique: true });

export default mongoose.models.Rider || model<IRider>('Rider', RiderSchema);
