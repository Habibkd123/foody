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
  itemsSubtotal?: number;
  couponCode?: string;
  discountAmount?: number;
  total: number;
  status: OrderStatus;
  invoice?: {
    invoiceNumber?: string;
    invoiceDate?: Date;
    gstRate?: number;
    taxableValue?: number;
    gstAmount?: number;
    cgstAmount?: number;
    sgstAmount?: number;
    igstAmount?: number;
    currency?: string;
  };
  cancellationPenaltyAmount?: number;
  cancellationPenaltyReason?: string;
  canceledAt?: Date;
  refundAmount?: number;
  refundReason?: string;
  refundDate?: Date;
  refundStatus?: 'pending' | 'processed' | 'failed';
  refundId?: string;
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
  itemsSubtotal: { type: Number },
  couponCode: { type: String, trim: true, uppercase: true },
  discountAmount: { type: Number },
  total: { type: Number, required: true },
  status: { type: String, enum: Object.values(OrderStatus), default: OrderStatus.PENDING },
  invoice: {
    invoiceNumber: { type: String, index: true, sparse: true },
    invoiceDate: { type: Date },
    gstRate: { type: Number, default: 0 },
    taxableValue: { type: Number, default: 0 },
    gstAmount: { type: Number, default: 0 },
    cgstAmount: { type: Number, default: 0 },
    sgstAmount: { type: Number, default: 0 },
    igstAmount: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
  },
  cancellationPenaltyAmount: { type: Number, default: 0 },
  cancellationPenaltyReason: { type: String, default: '' },
  canceledAt: { type: Date },
  refundAmount: { type: Number },
  refundReason: { type: String },
  refundDate: { type: Date },
  refundStatus: { type: String, enum: ['pending', 'processed', 'failed'] },
  refundId: { type: String },
  orderId: { type: String, required: true },
  notes: { type: String },
  // payment: { type: Schema.Types.ObjectId, ref: 'Payment' },
  paymentId: { type: String, required: true },
  delivery: { type: Schema.Types.ObjectId, ref: 'Delivery' },
  rider: { type: Schema.Types.ObjectId, ref: 'User' },
  method: { type: String, enum: ["card", "upi", 'razorpay'], default: "card" },
}, { timestamps: true });

export default mongoose.models.Order || model<IOrder>('Order', OrderSchema);
