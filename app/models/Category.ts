import mongoose, { Schema, model, Types, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  parent?: Types.ObjectId | null; // Reference to parent for subcategories
  image?: string;
  description?: string;
  status?: 'active' | 'inactive';
  slug?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: false, trim: true, maxlength: 50 },
  parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
  image: String,
  description: String,
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  slug: { type: String, unique: true, sparse: true }, // Unique slug for SEO
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true
},);

export default mongoose.models.Category || model<ICategory>('Category', CategorySchema);
