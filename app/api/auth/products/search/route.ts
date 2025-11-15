import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/app/models/Product';
import { searchQuerySchema } from '@/utils/validations';
import { 
  handleError, 
  formatProductResponse, 
  createSuccessResponse, 
  createErrorResponse 
} from '@/utils/ProductResponse';
import type { PipelineStage } from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const queryData = Object.fromEntries(searchParams.entries());

    const { q: query, limit = 10 } = searchQuerySchema.parse(queryData);

    if (!query || query.trim().length < 2) {
      return createErrorResponse(
        'Invalid search query',
        'Search query must be at least 2 characters long',
        400
      );
    }

    const searchRegex = new RegExp(query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

    // Build aggregation pipeline for better search
    const pipeline: PipelineStage[] = [
      {
        $match: {
          $or: [
            { name: { $regex: searchRegex } },
            { description: { $regex: searchRegex } }
          ],
          status: 'active'
        }
      } as PipelineStage,
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      } as PipelineStage,
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true
        }
      } as PipelineStage,
      {
        $sort: { 
          name: 1 
        }
      } as PipelineStage,
      {
        $limit: limit
      } as PipelineStage
    ];

    const products = await Product.aggregate(pipeline);

    const formattedProducts = products.map(formatProductResponse);

    return createSuccessResponse(formattedProducts);

  } catch (error) {
    return handleError(error);
  }
}

// POST - Advanced search with filters
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { 
      query, 
      filters = {}, 
      sort = { createdAt: -1 }, 
      limit = 20 
    } = body;

    if (!query || query.trim().length < 2) {
      return createErrorResponse(
        'Invalid search query',
        'Search query must be at least 2 characters long',
        400
      );
    }

    const searchRegex = new RegExp(query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

    // Build match conditions
    const matchConditions: any = {
      $or: [
        { name: { $regex: searchRegex } },
        { description: { $regex: searchRegex } }
      ]
    };

    // Add filters
    if (filters.status) matchConditions.status = filters.status;
    if (filters.category) matchConditions.category = filters.category;
    if (filters.minPrice) matchConditions.price = { $gte: filters.minPrice };
    if (filters.maxPrice) {
      if (matchConditions.price) {
        matchConditions.price.$lte = filters.maxPrice;
      } else {
        matchConditions.price = { $lte: filters.maxPrice };
      }
    }
    if (filters.inStock) matchConditions.stock = { $gt: 0 };

    const products = await Product.find(matchConditions)
      .populate('category', 'name')
      .sort(sort)
      .limit(Math.min(limit, 50))
      .lean();

    const formattedProducts = products.map(formatProductResponse);

    return createSuccessResponse({
      query,
      filters,
      results: formattedProducts,
      count: formattedProducts.length
    });

  } catch (error) {
    return handleError(error);
  }
}
