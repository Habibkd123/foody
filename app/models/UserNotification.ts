import mongoose, { Schema, Document } from 'mongoose';

export interface IUserNotification extends Document {
  userId: string;
  notificationId: string;
  read: boolean;
  dismissed: boolean;
  readAt?: Date;
  dismissedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserNotificationSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    notificationId: { type: String, required: true, index: true },
    read: { type: Boolean, default: false },
    dismissed: { type: Boolean, default: false },
    readAt: { type: Date },
    dismissedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

UserNotificationSchema.index({ userId: 1, notificationId: 1 }, { unique: true });

export default mongoose.models.UserNotification ||
  mongoose.model<IUserNotification>('UserNotification', UserNotificationSchema);
