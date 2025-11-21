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
  // payment: Types.ObjectId;
  paymentId: string;
  delivery: Types.ObjectId;
  orderId: string;
  method: string;
  createdAt: Date;
  updatedAt: Date;
  notes: string;
  rider?: Types.ObjectId | null;
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
  orderId: { type: String, required: true },
  notes: { type: String },
  // payment: { type: Schema.Types.ObjectId, ref: 'Payment' },
  paymentId: { type: String, required: true },
  delivery: { type: Schema.Types.ObjectId, ref: 'Delivery' },
  rider: { type: Schema.Types.ObjectId, ref: 'Rider' },
  method: { type: String, enum: ["card", "upi",'razorpay'], default: "card" },
}, { timestamps: true });

export default mongoose.models.Order || model<IOrder>('Order', OrderSchema);
