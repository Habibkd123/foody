import mongoose, { Schema, model, Types, Document, Model } from 'mongoose';

export enum UserRole { USER = 'user', ADMIN = 'admin' }
export enum ProductStatus { ACTIVE = 'active', INACTIVE = 'inactive' }
export enum OrderStatus { PENDING = 'pending', PAID = 'paid', SHIPPED = 'shipped', DELIVERED = 'delivered', CANCELED = 'canceled' }
export enum PaymentStatus { PENDING = 'pending', SUCCESS = 'success', FAILED = 'failed' }
export enum DeliveryStatus { PENDING = 'pending', DISPATCHED = 'dispatched', DELIVERED = 'delivered', RETURNED = 'returned' }

export interface IUser extends Document {
  username: string;
  firstName: string;
  lastName: string;

  email: string;
  phone: number;
  password: string;
  role: UserRole;
  addresses: Array<{
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  username: { type: String },
  firstName: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
  },
  email: { type: String, unique: true },
  phone: { type: Number, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
  addresses: [{
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  }]
}, { timestamps: true });

UserSchema.index({ email: 1 }, { unique: true });


export default mongoose.models.User || model<IUser>('User', UserSchema); 
