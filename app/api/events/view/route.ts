import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import ProductView from '@/app/models/ProductView'
import { Types } from 'mongoose'
import { createErrorResponse, createSuccessResponse, validateObjectId } from '@/utils/ProductResponse'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const { productId, userId, sessionId } = body || {}

    if (!validateObjectId(productId)) {
      return createErrorResponse('Invalid product ID', 'productId must be a valid ObjectId', 400)
    }

    let query: any = { product: new Types.ObjectId(productId) }

    if (userId) {
      if (!validateObjectId(userId)) {
        return createErrorResponse('Invalid user ID', 'userId must be a valid ObjectId', 400)
      }
      query.user = new Types.ObjectId(userId)
    } else if (sessionId) {
      if (typeof sessionId !== 'string' || sessionId.length < 8) {
        return createErrorResponse('Invalid sessionId', 'sessionId must be a non-empty string', 400)
      }
      query.sessionId = sessionId
    } else {
      return createErrorResponse('Missing identifiers', 'Provide userId or sessionId', 400)
    }

    const update = { $inc: { count: 1 }, $set: { lastViewedAt: new Date() } }
    const options = { upsert: true, new: true }
    await ProductView.findOneAndUpdate(query, update, options)

    return createSuccessResponse(null, 'View recorded', 200)
  } catch (error) {
    return createErrorResponse('Failed to record view', (error as any)?.message || 'Unexpected error', 500)
  }
}
