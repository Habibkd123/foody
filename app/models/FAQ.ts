import mongoose, { Schema, model, Document } from 'mongoose';

export interface IFAQ extends Document {
  question: string;
  answer: string;
  category?: string;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema = new Schema<IFAQ>({
  question: { type: String, required: true, trim: true, maxlength: 500 },
  answer: { type: String, required: true, maxlength: 5000 },
  category: { type: String, trim: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.FAQ || model<IFAQ>('FAQ', FAQSchema);
