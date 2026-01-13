import mongoose, { Schema, Types } from 'mongoose';

export type ActivityAction =
  | 'login_success'
  | 'login_failed'
  | 'logout'
  | 'session_revoked'
  | 'session_created';

export interface IActivityLog extends mongoose.Document {
  userId?: Types.ObjectId;
  role?: string;
  action: ActivityAction;
  ip?: string;
  userAgent?: string;
  deviceId?: string;
  sessionId?: string;
  meta?: Record<string, any>;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    role: { type: String, index: true },
    action: { type: String, required: true, index: true },
    ip: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    deviceId: { type: String, default: '' },
    sessionId: { type: String, default: '', index: true },
    meta: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

ActivityLogSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
