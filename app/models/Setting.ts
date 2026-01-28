import mongoose, { Schema, model, Document } from 'mongoose';

export type PaymentGateway = 'stripe' | 'razorpay';

export interface IReminderSetting {
  label: string;
  unit: string;
  value: string;
  disabled: boolean;
}

export interface ISetting extends Document {
  paymentGateway: PaymentGateway;
  reminders: IReminderSetting[];
  updatedAt: Date;
  createdAt: Date;
}

const ReminderSettingSchema = new Schema<IReminderSetting>({
  label: { type: String, required: true },
  unit: { type: String, default: 'Minutes' },
  value: { type: String, default: '10' },
  disabled: { type: Boolean, default: false }
}, { _id: false });

const SettingSchema = new Schema<ISetting>({
  paymentGateway: { type: String, enum: ['stripe', 'razorpay'], default: 'stripe', required: true },
  reminders: {
    type: [ReminderSettingSchema],
    default: [
      { label: 'First Reminder', unit: 'Minutes', value: '10', disabled: false },
      { label: 'Second Reminder', unit: 'Hours', value: '1', disabled: false },
      { label: 'Third Reminder', unit: 'Hours', value: '2', disabled: false },
      { label: 'Fourth Reminder', unit: 'Days', value: '1', disabled: false },
      { label: 'Fifth Reminder', unit: 'Days', value: '2', disabled: false },
    ]
  }
}, { timestamps: true });

export default mongoose.models.Setting || model<ISetting>('Setting', SettingSchema);
