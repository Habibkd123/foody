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

  // Virtual fields
  subcategories?: ICategory[];
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true, maxlength: 50 },
    parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    image: { type: String },
    description: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    slug: { type: String, unique: true, sparse: true }, // SEO friendly URL
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// ✅ Virtual field for subcategories (self-referencing)
CategorySchema.virtual("subcategories", {
  ref: "Category",
  localField: "_id",
  foreignField: "parent",
});

// ✅ Pre-save middleware for auto slug generation (if missing)
CategorySchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }
  next();
});

export default mongoose.models.Category ||
  model<ICategory>("Category", CategorySchema);
