import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/app/models/Product'
import Order, { IOrder } from '@/app/models/Order'
import Wishlist, { IWishlist } from '@/app/models/WishList'
import Cart, { ICart } from '@/app/models/Cart'
import { Types } from 'mongoose'
import { createErrorResponse, createSuccessResponse, formatProductResponse, validateObjectId } from '@/utils/ProductResponse'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    await connectDB()
    const { userId } = await params
    const { searchParams } = new URL(_request.url)
    const limit = parseInt(searchParams.get('limit') || '12', 10)

    if (!validateObjectId(userId)) {
      return createErrorResponse('Invalid user ID format', 'The provided ID is not a valid MongoDB ObjectId', 400)
    }

    const userObjectId = new Types.ObjectId(userId)

    const orders = await Order.find({ user: userObjectId }).select('items createdAt').lean<IOrder[]>()
    const wishlist = await Wishlist.findOne({ user_id: userObjectId }).select('products').lean<IWishlist | null>()
    const cart = await Cart.findOne({ user: userObjectId, status: 'active' }).select('items').lean<ICart | null>()

    const purchasedIds = new Set<string>()
    for (const o of orders || []) {
      for (const it of o.items || []) {
        if (it.product) purchasedIds.add(String(it.product))
      }
    }

    const wishIds = new Set<string>((wishlist?.products || []).map(p => String(p)))
    const cartIds = new Set<string>((cart?.items || []).map(i => String(i.product)))

    const interactedIds = new Set<string>([...purchasedIds, ...wishIds, ...cartIds])

    const weights: Record<string, number> = { purchased: 5, wishlist: 3, cart: 2 }

    const interactedList = Array.from(interactedIds).map(id => new Types.ObjectId(id))
    const interactedProducts: any[] = interactedList.length
      ? await Product.find({ _id: { $in: interactedList } }).select('category tags brand').lean()
      : []

    const categoryScore = new Map<string, number>()
    const tagScore = new Map<string, number>()
    const brandScore = new Map<string, number>()

    function inc(map: Map<string, number>, key: string, by: number) {
      map.set(key, (map.get(key) || 0) + by)
    }

    for (const p of interactedProducts) {
      const idStr = String(p._id)
      const w = purchasedIds.has(idStr) ? weights.purchased : wishIds.has(idStr) ? weights.wishlist : cartIds.has(idStr) ? weights.cart : 1
      const catId = p.category ? String(p.category) : ''
      if (catId) inc(categoryScore, catId, w)
      for (const t of p.tags || []) inc(tagScore, t, w)
      if (p.brand) inc(brandScore, p.brand, w)
    }

    const topCategories = Array.from(categoryScore.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5).map(e => new Types.ObjectId(e[0]))

    let candidates: any[] = []
    if (topCategories.length > 0) {
      candidates = await Product.find({ category: { $in: topCategories }, status: 'active' }).select('name price originalPrice images rating category tags brand createdAt updatedAt deliveryInfo specifications nutritionalInfo features stock inStock sku weight dimensions warranty warrantyPeriod totalReviews').limit(150).lean()
    } else {
      candidates = await Product.find({ status: 'active' }).select('name price originalPrice images rating category tags brand createdAt updatedAt deliveryInfo specifications nutritionalInfo features stock inStock sku weight dimensions warranty warrantyPeriod totalReviews').sort({ rating: -1, createdAt: -1 }).limit(150).lean()
    }

    const interactedIdStrings = new Set(Array.from(interactedIds))
    const filtered = candidates.filter(c => !interactedIdStrings.has(String(c._id)))

    function scoreProduct(p: any): number {
      const cat = p.category ? String(p.category) : ''
      const catScore = categoryScore.get(cat) || 0
      const brand = p.brand || ''
      const bScore = brand ? (brandScore.get(brand) || 0) : 0
      let tScore = 0
      for (const t of p.tags || []) tScore += tagScore.get(t) || 0
      const tagOverlap = (p.tags || []).length ? tScore / (p.tags.length) : 0
      const rating = typeof p.rating === 'number' ? p.rating : 0
      return 0.5 * catScore + 0.3 * tagOverlap + 0.2 * (bScore > 0 ? 1 : 0) + 0.1 * rating
    }

    const limitParam = Number.isFinite(limit) && limit > 0 ? limit : 12
    const ranked = filtered
      .map((p: any) => ({ p, s: scoreProduct(p) }))
      .sort((a, b) => b.s - a.s)
      .slice(0, limitParam)
      .map(({ p }) => formatProductResponse(p))

    return createSuccessResponse(ranked, 'Recommendations fetched successfully', 200)
  } catch (error) {
    return createErrorResponse('Failed to fetch recommendations', (error as any)?.message || 'Unexpected error', 500)
  }
}
