import mongoose, { Schema, model, Document } from 'mongoose';

export interface IContactMessage extends Document {
  name?: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>({
  name: { type: String, trim: true, maxlength: 200 },
  email: { type: String, required: true, trim: true },
  subject: { type: String, trim: true, maxlength: 300 },
  message: { type: String, required: true, maxlength: 5000 },
}, { timestamps: true });

export default mongoose.models.ContactMessage || model<IContactMessage>('ContactMessage', ContactMessageSchema);
