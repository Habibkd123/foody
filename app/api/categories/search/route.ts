// Category tree/hierarchy API


import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/app/models/Category';
import type { PipelineStage } from 'mongoose';
import { 
  handleCategoryError, 
  formatCategoryResponse, 
  createCategorySuccessResponse, 
  createCategoryErrorResponse 
} from '@/utils/category-utils';
import { ApiResponse, CategoryResponse } from '@/types/category';


// GET - Simple category search
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = Math.min(Number(searchParams.get('limit')) || 20, 100);
    const includeSubcategories = searchParams.get('includeSubcategories') === 'true';

    if (!query || query.trim().length < 2) {
      return createCategoryErrorResponse(
        'Invalid search query',
        'Search query must be at least 2 characters long',
        400
      );
    }

    const searchRegex = new RegExp(query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

    const pipeline: PipelineStage[] = [
      {
        $match: {
          name: { $regex: searchRegex }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'parent',
          foreignField: '_id',
          as: 'parentCategory'
        }
      },
      {
        $unwind: {
          path: '$parentCategory',
          preserveNullAndEmptyArrays: true
        }
      }
    ];

    if (includeSubcategories) {
      pipeline.push({
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: 'parent',
          as: 'subcategories'
        }
      });
    }

    pipeline.push(
      { $sort: { name: 1 } },
      { $limit: limit }
    );

    const categories = await Category.aggregate(pipeline);

    const formattedCategories = categories.map(cat => 
      formatCategoryResponse(cat, includeSubcategories)
    );

    return createCategorySuccessResponse({
      query,
      results: formattedCategories,
      count: formattedCategories.length
    });

  } catch (error) {
    return handleCategoryError(error);
  }
}

// POST - Advanced category search with filters
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { 
      query, 
      filters = {}, 
      sort = { name: 1 }, 
      limit = 50,
      includeSubcategories = false
    } = body;

    if (!query || query.trim().length < 2) {
      return createCategoryErrorResponse(
        'Invalid search query',
        'Search query must be at least 2 characters long',
        400
      );
    }

    const searchRegex = new RegExp(query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

    // Build match conditions
    const matchConditions: any = {
      name: { $regex: searchRegex }
    };

    // Add filters
    if (filters.parent !== undefined) {
      matchConditions.parent = filters.parent;
    }

    if (filters.hasImage !== undefined) {
      if (filters.hasImage) {
        matchConditions.image = { $exists: true, $ne: null };
      } else {
        matchConditions.$or = [
          { image: { $exists: false } },
          { image: null }
        ];
      }
    }

    if (filters.level !== undefined) {
      // This would require a more complex aggregation to calculate level
      // For now, we can filter by parent to approximate level
      if (filters.level === 0) {
        matchConditions.parent = null;
      }
    }

    const pipeline: PipelineStage[] = [
      { $match: matchConditions },
      {
        $lookup: {
          from: 'categories',
          localField: 'parent',
          foreignField: '_id',
          as: 'parentCategory'
        }
      },
      {
        $unwind: {
          path: '$parentCategory',
          preserveNullAndEmptyArrays: true
        }
      }
    ];

    if (includeSubcategories) {
      pipeline.push({
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: 'parent',
          as: 'subcategories'
        }
      });
    }

    pipeline.push(
      { $sort: sort },
      { $limit: Math.min(limit, 100) }
    );

    const categories = await Category.aggregate(pipeline);

    const formattedCategories = categories.map(cat => 
      formatCategoryResponse(cat, includeSubcategories)
    );

    return createCategorySuccessResponse({
      query,
      filters,
      results: formattedCategories,
      count: formattedCategories.length
    });

  } catch (error) {
    return handleCategoryError(error);
  }
}