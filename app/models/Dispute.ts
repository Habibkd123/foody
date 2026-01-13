import mongoose, { Schema, Types } from 'mongoose';

export type DisputeStatus =
  | 'open'
  | 'awaiting_restaurant'
  | 'awaiting_customer'
  | 'under_review'
  | 'resolved'
  | 'rejected';

export interface IDisputeEvidence {
  url: string;
  uploadedByRole: 'user' | 'restaurant' | 'admin';
  uploadedBy?: Types.ObjectId;
  uploadedAt: Date;
}

export interface IDispute extends mongoose.Document {
  order: Types.ObjectId;
  user: Types.ObjectId;
  restaurantId: Types.ObjectId;
  status: DisputeStatus;

  reason: string;
  description: string;
  evidence: IDisputeEvidence[];

  restaurantResponse?: {
    message?: string;
    evidence?: IDisputeEvidence[];
    respondedAt?: Date;
  };

  adminMediation?: {
    status?: 'under_review' | 'resolved' | 'rejected';
    decisionNote?: string;
    refundRecommendation?: {
      amount?: number;
      reason?: string;
    };
    decidedAt?: Date;
    decidedBy?: Types.ObjectId;
  };

  createdAt: Date;
  updatedAt: Date;
}

const EvidenceSchema = new Schema<IDisputeEvidence>(
  {
    url: { type: String, required: true },
    uploadedByRole: { type: String, enum: ['user', 'restaurant', 'admin'], required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const DisputeSchema = new Schema<IDispute>(
  {
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    restaurantId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    status: {
      type: String,
      enum: ['open', 'awaiting_restaurant', 'awaiting_customer', 'under_review', 'resolved', 'rejected'],
      default: 'open',
      index: true,
    },

    reason: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    evidence: { type: [EvidenceSchema], default: [] },

    restaurantResponse: {
      message: { type: String, default: '' },
      evidence: { type: [EvidenceSchema], default: [] },
      respondedAt: { type: Date },
    },

    adminMediation: {
      status: { type: String, enum: ['under_review', 'resolved', 'rejected'] },
      decisionNote: { type: String, default: '' },
      refundRecommendation: {
        amount: { type: Number },
        reason: { type: String, default: '' },
      },
      decidedAt: { type: Date },
      decidedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    },
  },
  { timestamps: true }
);

DisputeSchema.index({ order: 1, status: 1 });

export default mongoose.models.Dispute || mongoose.model<IDispute>('Dispute', DisputeSchema);
