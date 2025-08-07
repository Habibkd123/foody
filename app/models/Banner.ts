import mongoose, { Schema, model, Types, Document, Model } from 'mongoose';

export interface IBanner extends Document {
  image: string;
  link: string;
  title: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>({
  image: { type: String, required: true },
  link: String,
  title: String,
  active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Banner || model<IBanner>('Banner', BannerSchema);
