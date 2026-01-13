import mongoose, { Schema, Types } from 'mongoose';

export interface IAuthSession extends mongoose.Document {
  sessionId: string;
  userId: Types.ObjectId;
  role: string;
  deviceId?: string;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
  lastSeenAt?: Date;
  revokedAt?: Date;
  revokedReason?: string;
}

const AuthSessionSchema = new Schema<IAuthSession>(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    role: { type: String, required: true, index: true },
    deviceId: { type: String, default: '' },
    ip: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    lastSeenAt: { type: Date },
    revokedAt: { type: Date },
    revokedReason: { type: String, default: '' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

AuthSessionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.AuthSession || mongoose.model<IAuthSession>('AuthSession', AuthSessionSchema);
