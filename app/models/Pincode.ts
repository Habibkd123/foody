import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IPincode extends Document {
  pincode: string;
  city: string;
  deliveryDays: number;
  serviceable: boolean;
  PostOfficeName:string;
  State:string;

}

const PincodeSchema = new Schema<IPincode>({
  pincode: { type: String, required: true, unique: false },
  city: { type: String, required: true },
  State: { type: String, },
  PostOfficeName: { type: String, },
  deliveryDays: { type: Number, required: true },
  serviceable: { type: Boolean, default: true }
});

export default models.Pincode || model<IPincode>("Pincode", PincodeSchema);
