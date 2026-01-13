import mongoose, { Schema, model } from 'mongoose';

export enum RestaurantFoodStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export type RestaurantFoodCategory = 'Veg' | 'Non-Veg';

export type RestaurantFoodDocument = {
  _id: string;
  restaurantId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  category: RestaurantFoodCategory;
  imageUrl?: string;
  availability: boolean;
  status: RestaurantFoodStatus;
  createdAt?: Date;
  updatedAt?: Date;
};

const RestaurantFoodSchema = new Schema<RestaurantFoodDocument>(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, enum: ['Veg', 'Non-Veg'], required: true },
    imageUrl: { type: String },
    availability: { type: Boolean, default: true },
    status: {
      type: String,
      enum: Object.values(RestaurantFoodStatus),
      default: RestaurantFoodStatus.PENDING,
      index: true,
    },
  },
  { timestamps: true }
);

export default (mongoose.models.RestaurantFood as mongoose.Model<RestaurantFoodDocument>) ||
  model<RestaurantFoodDocument>('RestaurantFood', RestaurantFoodSchema);
