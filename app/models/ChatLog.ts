import mongoose, { Schema, model, Document, Types } from 'mongoose';

export interface IChatLog extends Document {
  userMessage: string;
  aiReply: string;
  matchedProducts: Array<{
    _id: Types.ObjectId;
    name: string;
    price: number;
    inStock?: boolean;
  }>;
  meta?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const ChatLogSchema = new Schema<IChatLog>(
  {
    userMessage: { type: String, required: true },
    aiReply: { type: String, required: true },
    matchedProducts: [
      {
        _id: { type: Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        price: Number,
        inStock: Boolean,
      },
    ],
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.models.ChatLog || model<IChatLog>('ChatLog', ChatLogSchema);
