import mongoose, { Schema, model, Types, Document } from 'mongoose';

export interface IInventoryItem extends Document {
  restaurantId: Types.ObjectId;
  name: string;
  unit: string;
  quantity: number;
  lowStockThreshold: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InventoryItemSchema = new Schema<IInventoryItem>(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    unit: { type: String, default: 'unit', trim: true },
    quantity: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

InventoryItemSchema.index({ restaurantId: 1, name: 1 }, { unique: true });

export default (mongoose.models.InventoryItem as mongoose.Model<IInventoryItem>) ||
  model<IInventoryItem>('InventoryItem', InventoryItemSchema);
