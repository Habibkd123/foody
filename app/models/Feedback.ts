import mongoose, { Schema, model, Types, Document } from 'mongoose';

export interface IFeedback extends Document {
  user?: Types.ObjectId;
  order?: Types.ObjectId;
  rating?: number;
  comment?: string;
  contactEmail?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  order: { type: Schema.Types.ObjectId, ref: 'Order' },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String, trim: true, maxlength: 2000 },
  contactEmail: { type: String, trim: true },
}, { timestamps: true });

export default mongoose.models.Feedback || model<IFeedback>('Feedback', FeedbackSchema);
