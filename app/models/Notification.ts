import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'announcement';
  status: 'draft' | 'scheduled' | 'active' | 'expired';
  priority: 'low' | 'medium' | 'high';
  icon?: string;
  link?: string;
  linkText?: string;
  startDate?: Date;
  endDate?: Date;
  scheduledDate?: Date;
  targetAudience: 'all' | 'new' | 'active' | 'premium';
  displayLocation: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
  clickCount: number;
}

const NotificationSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters']
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error', 'announcement'],
      default: 'info'
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'active', 'expired'],
      default: 'draft'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    icon: {
      type: String,
      default: '🔔'
    },
    link: {
      type: String,
      trim: true
    },
    linkText: {
      type: String,
      trim: true,
      default: 'Learn More'
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
    scheduledDate: {
      type: Date
    },
    targetAudience: {
      type: String,
      enum: ['all', 'new', 'active', 'premium'],
      default: 'all'
    },
    displayLocation: {
      type: [String],
      default: ['home', 'products']
    },
    createdBy: {
      type: String,
      required: true
    },
    viewCount: {
      type: Number,
      default: 0
    },
    clickCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient queries
NotificationSchema.index({ status: 1, startDate: 1, endDate: 1 });
NotificationSchema.index({ createdAt: -1 });

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
