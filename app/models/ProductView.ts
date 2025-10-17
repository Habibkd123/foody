import mongoose, { Schema, model, Types, Document } from 'mongoose'

export interface IProductView extends Document {
  user?: Types.ObjectId | null
  sessionId?: string | null
  product: Types.ObjectId
  count: number
  lastViewedAt: Date
}

const ProductViewSchema = new Schema<IProductView>({
  user: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  sessionId: { type: String, default: null },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  count: { type: Number, default: 1 },
  lastViewedAt: { type: Date, default: Date.now }
}, { timestamps: true })

ProductViewSchema.index({ user: 1, product: 1 }, { unique: false })
ProductViewSchema.index({ sessionId: 1, product: 1 }, { unique: false })

export default mongoose.models.ProductView || model<IProductView>('ProductView', ProductViewSchema)
