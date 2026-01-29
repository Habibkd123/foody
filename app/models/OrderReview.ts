import mongoose, { Schema, model, Types, Document } from 'mongoose';

export interface IOrderReview extends Document {
    user: Types.ObjectId;
    order: Types.ObjectId;
    restaurant: Types.ObjectId;
    driver?: Types.ObjectId;
    restaurantRating: number;
    restaurantComment?: string;
    driverRating?: number;
    driverComment?: string;
    createdAt: Date;
    updatedAt: Date;
}

const OrderReviewSchema = new Schema<IOrderReview>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
    restaurant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    driver: { type: Schema.Types.ObjectId, ref: 'User' },
    restaurantRating: { type: Number, min: 1, max: 5, required: true },
    restaurantComment: { type: String, trim: true },
    driverRating: { type: Number, min: 1, max: 5 },
    driverComment: { type: String, trim: true },
}, { timestamps: true });

// Ensure one review per order
OrderReviewSchema.index({ order: 1 }, { unique: true });

export default (mongoose.models.OrderReview as mongoose.Model<IOrderReview>) || model<IOrderReview>('OrderReview', OrderReviewSchema);
