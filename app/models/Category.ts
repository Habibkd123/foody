import mongoose, { Schema, model, Types, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  parent?: Types.ObjectId | null; // Reference to parent for subcategories
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
  image: String,
}, { timestamps: true });

export default mongoose.models.Category || model<ICategory>('Category', CategorySchema);
