import mongoose, { Schema, model, Types, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export enum UserRole { USER = 'user', ADMIN = 'admin' }
export enum ProductStatus { ACTIVE = 'active', INACTIVE = 'inactive' }
export enum OrderStatus { PENDING = 'pending', PENDING_UPPER = 'PENDING', PAID = 'paid', SHIPPED = 'shipped', DELIVERED = 'delivered', CANCELED = 'canceled', PROCESSING = 'processing' }
export enum PaymentStatus { PENDING = 'pending', SUCCESS = 'success', FAILED = 'failed' }
export enum DeliveryStatus { PENDING = 'pending', DISPATCHED = 'dispatched', DELIVERED = 'delivered', RETURNED = 'returned' }

export interface IUser extends Document {
  username: string;
  firstName: string;
  lastName: string;

  email: string;
  phone: String;
  password: string;
  role: UserRole;
  addresses: Array<{
    address?: string;
    area?: string;
    city: string;
    flatNumber?: string;
    floor?: string;
    isDefault?: boolean;
    label: string;
    landmark?: string;
    lat?: number;
    lng?: number;
    name?: string;
    phone?: number;
    state: string;
    street?: string;
    zipCode?: string;
    createdAt?: Date;
    updatedAt?: Date;
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
  email: { type: String, trim: true, lowercase: true, default: undefined },
  phone: { type: String, trim: true, default: undefined },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
  addresses: [{
    address: { type: String, default: '' },
    area: { type: String, default: '' },
    city: { type: String, required: false, default: '' },
    flatNumber: { type: String, default: '' },
    floor: { type: String, default: '' },
    isDefault: { type: Boolean, default: false },
    label: { type: String, required: false, default: '' },
    landmark: { type: String, default: '' },
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
    name: { type: String, default: '' },
    phone: { type: Number, default: 0 },
    state: { type: String, required: false, default: '' },
    street: { type: String, default: '' },
    zipCode: { type: String, default: '' }
  }]
}, { timestamps: true });

UserSchema.index({ email: 1 }, { unique: true });

// Hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};
// Remove any path-level unique: true and use indexes instead:
UserSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { email: { $type: "string", $ne: "" } } }
);

UserSchema.index(
  { phone: 1 },
  { unique: true, partialFilterExpression: { phone: { $type: "string", $ne: "" } } }
);
export default mongoose.models.User || model<IUser>('User', UserSchema); 
