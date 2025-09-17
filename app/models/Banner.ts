import mongoose, { Schema, model, Document } from 'mongoose';



export interface IBanner extends Document {
  image: string[];
  link: string;
  title?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}



const BannerSchema = new Schema<IBanner>({
  image: [String],
  link: String,
  title : {
    type: String,
    trim: true,
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
BannerSchema.index({ active: 1 });
BannerSchema.index({ createdAt: -1 });

// Virtual for banner URL
BannerSchema.virtual('imageUrl').get(function() {
  return this.image || '';
});

// Add a static method to find active banners
BannerSchema.statics.findActive = function() {
  return this.find({ active: true }).sort({ createdAt: -1 });
};

export default mongoose.models.Banner || model<IBanner>('Banner', BannerSchema);
