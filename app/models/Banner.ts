import mongoose, { Schema, model, Document } from 'mongoose';



export interface IBanner extends Document {
  image: string[];
  link: string;
  title?: string;
  type: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}



const BannerSchema = new Schema<IBanner>({
  image: [String],
  link: { $type: String },
  title : {
    $type: String,
    trim: true,
  },
  type: {
    $type: String,
    default: "Home"
  },
  active: {
    $type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  // Use a different key for schema types so that a field literally named 'type' works as expected
  typeKey: '$type'
});

// Indexes for better query performance
BannerSchema.index({ active: 1 });
BannerSchema.index({ createdAt: -1 });
// Ensure only one active banner per type
BannerSchema.index(
  { type: 1 },
  { unique: true, partialFilterExpression: { active: true } }
);

// When a banner is set to active, deactivate other active banners of the same type
BannerSchema.pre('save', async function (next) {
  try {
    if (this.isModified('active') && this.active) {
      const targetType = this.type; // Use the current banner's type dynamically

      await mongoose.models.Banner.updateMany(
        { _id: { $ne: this._id }, type: targetType, active: true },
        { $set: { active: false } }
      );
    }
    next();
  } catch (err) {
    next(err as any);
  }
});

BannerSchema.pre('findOneAndUpdate', async function (next) {
  try {
    const update: any = this.getUpdate() || {};
    const set = update.$set ?? update;
    const activating = set.active === true;
    if (activating) {
      const query = this.getQuery();
      const current = await this.model.findOne(query);
      if (current) {
        // Dynamically get the new type or fallback to current
        const targetType = set.type ?? current.type;

        await this.model.updateMany(
          { _id: { $ne: current._id }, type: targetType, active: true },
          { $set: { active: false } }
        );
      }
    }
    next();
  } catch (err) {
    next(err as any);
  }
});


// Virtual for banner URL
BannerSchema.virtual('imageUrl').get(function() {
  return this.image || '';
});

// Add a static method to find active banners
BannerSchema.statics.findActive = function() {
  return this.find({ active: true }).sort({ createdAt: -1 });
};

export default mongoose.models.Banner || model<IBanner>('Banner', BannerSchema);
