// import mongoose, { Schema, model, Types, Document, Model } from 'mongoose';
// import bcrypt from 'bcryptjs';

// export enum UserRole { USER = 'user', ADMIN = 'admin' }
// export enum ProductStatus { ACTIVE = 'active', INACTIVE = 'inactive' }
// export enum OrderStatus { PENDING = 'pending', PENDING_UPPER = 'PENDING', PAID = 'paid', SHIPPED = 'shipped', DELIVERED = 'delivered', CANCELED = 'canceled', PROCESSING = 'processing' }
// export enum PaymentStatus { PENDING = 'pending', SUCCESS = 'success', FAILED = 'failed' }
// export enum DeliveryStatus { PENDING = 'pending', DISPATCHED = 'dispatched', DELIVERED = 'delivered', RETURNED = 'returned' }

// export interface IUser extends Document {
//   username: string;
//   firstName: string;
//   lastName: string;

//   email: string;
//   phone: String;
//   password: string;
//   role: UserRole;
//   addresses: Array<{
//     address?: string;
//     area?: string;
//     city: string;
//     flatNumber?: string;
//     floor?: string;
//     isDefault?: boolean;
//     label: string;
//     landmark?: string;
//     lat?: number;
//     lng?: number;
//     name?: string;
//     phone?: number;
//     state: string;
//     street?: string;
//     zipCode?: string;
//     createdAt?: Date;
//     updatedAt?: Date;
//   }>;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const UserSchema = new Schema<IUser>({
//   username: { type: String },
//   firstName: {
//     type: String,
//     required: [true, 'Name is required'],
//     trim: true,
//   },
//   lastName: {
//     type: String,
//     required: [true, 'Last name is required'],
//     trim: true,
//   },
//   email: { type: String, trim: true, lowercase: true, default: undefined },
//   phone: { type: String, trim: true, default: undefined },
//   password: { type: String, required: true },
//   role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
//   addresses: [{
//     address: { type: String, default: '' },
//     area: { type: String, default: '' },
//     city: { type: String, required: false, default: '' },
//     flatNumber: { type: String, default: '' },
//     floor: { type: String, default: '' },
//     isDefault: { type: Boolean, default: false },
//     label: { type: String, required: false, default: '' },
//     landmark: { type: String, default: '' },
//     lat: { type: Number, default: 0 },
//     lng: { type: Number, default: 0 },
//     name: { type: String, default: '' },
//     phone: { type: Number, default: 0 },
//     state: { type: String, required: false, default: '' },
//     street: { type: String, default: '' },
//     zipCode: { type: String, default: '' }
//   }]
// }, { timestamps: true });

// UserSchema.index({ email: 1 }, { unique: true });

// // Hash password before saving
// UserSchema.pre<IUser>('save', async function (next) {
//   if (!this.isModified('password')) return next();

//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error: any) {
//     next(error);
//   }
// });

// // Method to compare password
// UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
//   return bcrypt.compare(candidatePassword, this.password);
// };
// // Remove any path-level unique: true and use indexes instead:
// UserSchema.index(
//   { email: 1 },
//   { unique: true, partialFilterExpression: { email: { $type: "string", $ne: "" } } }
// );

// UserSchema.index(
//   { phone: 1 },
//   { unique: true, partialFilterExpression: { phone: { $type: "string", $ne: "" } } }
// );
// export default mongoose.models.User || model<IUser>('User', UserSchema); 


import mongoose, { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export enum UserRole {
  USER = 'user',
  RESTAURANT = 'restaurant',
  ADMIN = 'admin',
}
export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}
export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELED = 'canceled',
  PROCESSING = 'processing',
}
export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}
export enum DeliveryStatus {
  PENDING = 'pending',
  DISPATCHED = 'dispatched',
  DELIVERED = 'delivered',
  RETURNED = 'returned',
}

export interface IUser extends Document {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image: string;
  password: string;
  role: UserRole;
  restaurant?: {
    status: 'pending' | 'approved' | 'rejected';
    isOpen?: boolean;
    autoAcceptOrders?: boolean;
    autoRejectWhenClosed?: boolean;
    offlineMode?: {
      paused?: boolean;
      resumeAt?: Date;
    };
    location?: {
      lat?: number;
      lng?: number;
    };
    deliveryRadiusKm?: number;
    timingAutomation?: {
      enabled?: boolean;
      mode?: 'auto' | 'force_open' | 'force_closed';
      holidays?: Array<{ date: string }>;
      specialDays?: Array<{ date: string; isOpen?: boolean; openingTime?: string; closingTime?: string }>;
    };
    cancellationPenalty?: {
      enabled?: boolean;
      appliesFromStatus?: 'processing' | 'shipped';
      type?: 'percent' | 'fixed';
      value?: number;
      maxAmount?: number;
    };
    dynamicPricing?: {
      enabled?: boolean;
      weekend?: { type?: 'percent' | 'fixed'; value?: number };
      peakHours?: Array<{ start: string; end: string; type: 'percent' | 'fixed'; value: number }>;
      festivalDays?: Array<{ date: string; type: 'percent' | 'fixed'; value: number }>;
    };
    name: string;
    ownerName: string;
    address: string;
    openingTime: string;
    closingTime: string;
  };
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
  }>;
  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    image: { type: String, default: '' },
    phone: { type: String, trim: true, default: '' },
    password: { type: String, required: true, select: false }, // hide password by default
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    restaurant: {
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
      },
      isOpen: { type: Boolean, default: true },
      autoAcceptOrders: { type: Boolean, default: false },
      autoRejectWhenClosed: { type: Boolean, default: false },
      offlineMode: {
        paused: { type: Boolean, default: false },
        resumeAt: { type: Date, default: null },
      },
      location: {
        lat: { type: Number, default: null },
        lng: { type: Number, default: null },
      },
      deliveryRadiusKm: { type: Number, default: 0 },
      timingAutomation: {
        enabled: { type: Boolean, default: false },
        mode: { type: String, enum: ['auto', 'force_open', 'force_closed'], default: 'auto' },
        holidays: [
          {
            date: { type: String, required: true },
          },
        ],
        specialDays: [
          {
            date: { type: String, required: true },
            isOpen: { type: Boolean },
            openingTime: { type: String, trim: true, default: '' },
            closingTime: { type: String, trim: true, default: '' },
          },
        ],
      },
      cancellationPenalty: {
        enabled: { type: Boolean, default: false },
        appliesFromStatus: { type: String, enum: ['processing', 'shipped'], default: 'processing' },
        type: { type: String, enum: ['percent', 'fixed'], default: 'percent' },
        value: { type: Number, default: 0 },
        maxAmount: { type: Number, default: 0 },
      },
      dynamicPricing: {
        enabled: { type: Boolean, default: false },
        weekend: {
          type: { type: String, enum: ['percent', 'fixed'], default: 'percent' },
          value: { type: Number, default: 0 },
        },
        peakHours: [
          {
            start: { type: String, default: '18:00' },
            end: { type: String, default: '22:00' },
            type: { type: String, enum: ['percent', 'fixed'], default: 'percent' },
            value: { type: Number, default: 0 },
          },
        ],
        festivalDays: [
          {
            date: { type: String, required: true },
            type: { type: String, enum: ['percent', 'fixed'], default: 'percent' },
            value: { type: Number, default: 0 },
          },
        ],
      },
      name: { type: String, trim: true, default: '' },
      ownerName: { type: String, trim: true, default: '' },
      address: { type: String, trim: true, default: '' },
      openingTime: { type: String, trim: true, default: '' },
      closingTime: { type: String, trim: true, default: '' },
    },
    addresses: [
      {
        address: { type: String, default: '' },
        area: { type: String, default: '' },
        city: { type: String, default: '' },
        flatNumber: { type: String, default: '' },
        floor: { type: String, default: '' },
        isDefault: { type: Boolean, default: false },
        label: { type: String, default: '' },
        landmark: { type: String, default: '' },
        lat: { type: Number, default: 0 },
        lng: { type: Number, default: 0 },
        name: { type: String, default: '' },
        phone: { type: Number, default: 0 },
        state: { type: String, default: '' },
        street: { type: String, default: '' },
        zipCode: { type: String, default: '' },
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { email: { $type: 'string', $ne: '' } } }
);
UserSchema.index(
  { phone: 1 },
  { unique: true, partialFilterExpression: { phone: { $type: 'string', $ne: '' } } }
);

export default mongoose.models.User || model<IUser>('User', UserSchema);
