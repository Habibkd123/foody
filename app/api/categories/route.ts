import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/app/models/Category'; // Your existing model
import { createCategorySchema, categoryQuerySchema } from '@/lib/category-validations';
import { 
  handleCategoryError, 
  formatCategoryResponse, 
  createCategorySuccessResponse,
  checkCircularReference
} from '@/utils/category-utils';
import { ApiResponse, CategoryResponse, CategoryListResponse } from '@/types/category';

// GET - Fetch all categories with pagination, filtering, and hierarchy
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const queryData = Object.fromEntries(searchParams.entries());

    const { 
      page = 1, 
      limit = 20, 
      parent, 
      search, 
      includeSubcategories = false,
      level
    } = categoryQuerySchema.parse(queryData);

    // Build filter object
    const filter: any = {};

    // Filter by parent (null for root categories)
    if (parent === 'null' || parent === null) {
      filter.parent = null;
    } else if (parent) {
      filter.parent = parent;
    }

    // Search functionality
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;

    // Base aggregation pipeline
    const pipeline: any[] = [
      { $match: filter },
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

    // Add subcategories if requested
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

    // Add sorting
    pipeline.push({ $sort: { name: 1 } });

    // Execute aggregation for total count
    const totalPipeline = [...pipeline, { $count: "total" }];
    const totalResult = await Category.aggregate(totalPipeline);
    const total = totalResult[0]?.total || 0;

    // Add pagination
    pipeline.push({ $skip: skip }, { $limit: limit });

    // Execute main query
    const categories = await Category.aggregate(pipeline);

    const formattedCategories = categories.map(cat => 
      formatCategoryResponse(cat, includeSubcategories)
    );

    const responseData: CategoryListResponse = {
      categories: formattedCategories,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
        limit,
      },
    };

    return createCategorySuccessResponse(responseData);

  } catch (error) {
    return handleCategoryError(error);
  }
}

// POST - Create a new category
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    console.log("Request body:", body);
    const validatedData = createCategorySchema.parse(body);
console.log("Validated data:", validatedData);
    // Check for existing category
    // const existingCategory = await Category.findOne({
    //   name: validatedData.name,
    //   parent: validatedData.parent || null
    // });

    // if (existingCategory) {
    //   return NextResponse.json({
    //     success: false,
    //     error: 'Category already exists',
    //     message: 'A category with this name already exists at this level'
    //   }, { status: 409 });
    // }

    // Validate parent
    if (validatedData.parent) {
      const parentCategory = await Category.findById(validatedData.parent);
      if (!parentCategory) {
        return NextResponse.json({
          success: false,
          error: 'Parent category not found',
          message: 'The specified parent category does not exist'
        }, { status: 400 });
      }
    }
console.log("Parent category validated",validatedData);
    const category = await Category.create(validatedData);
console.log("Category created:", category);
    // Populate parent info (don't use execPopulate!)
    await category.populate({
      path: 'parent',
      select: 'name _id image createdAt updatedAt status slug description '
    });

    const formattedCategory = formatCategoryResponse(category);

    return createCategorySuccessResponse(
      formattedCategory,
      'Category created successfully',
      201
    );

  } catch (error) {
    return handleCategoryError(error);
  }
}


