import mongoose, { Schema, model, Types, Document, Model } from 'mongoose';
import { OrderStatus } from './User';


export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
  price: number;
}
export interface IOrder extends Document {
  user: Types.ObjectId;
  items: IOrderItem[];
  total: number;
  status: OrderStatus;
  payment: Types.ObjectId;
  delivery: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: Number,
    price: Number,
  }],
  total: { type: Number, required: true },
  status: { type: String, enum: Object.values(OrderStatus), default: OrderStatus.PENDING },
  payment: { type: Schema.Types.ObjectId, ref: 'Payment' },
  delivery: { type: Schema.Types.ObjectId, ref: 'Delivery' },
}, { timestamps: true });

export default mongoose.models.Order || model<IOrder>('Order', OrderSchema);
