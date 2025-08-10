import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { ApiResponse, CategoryResponse } from '@/types/category';

export function handleCategoryError(error: any): NextResponse<ApiResponse<null>> {
  console.error('Category API Error:', error);

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: 'Validation error',
        message:error.message
        // message: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      },
      { status: 400 }
    );
  }

  if (error.name === 'CastError') {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid ID format',
        message: 'The provided ID is not in valid MongoDB ObjectId format'
      },
      { status: 400 }
    );
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || 'field';
    return NextResponse.json(
      {
        success: false,
        error: 'Duplicate entry',
        message: `Category with this ${field} already exists`
      },
      { status: 409 }
    );
  }

  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((err: any) => err.message);
    return NextResponse.json(
      {
        success: false,
        error: 'Validation error',
        message: messages.join(', ')
      },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      error: 'Internal server error',
      message: 'Something went wrong on the server'
    },
    { status: 500 }
  );
}

export function validateCategoryObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export function formatCategoryResponse(category: any, includeSubcategories = false): CategoryResponse {
  const formatted: CategoryResponse = {
    _id: category._id.toString(),
    name: category.name,
    parent: category.parent ? category.parent.toString() : null,
    parentCategory: category.parentCategory ? {
      _id: category.parentCategory._id.toString(),
      name: category.parentCategory.name
    } : null,
    image: category.image,
    description: category.description,
    status: category.status,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };

  if (includeSubcategories && category.subcategories) {
    formatted.subcategories = category.subcategories.map((sub: any) => 
      formatCategoryResponse(sub, false)
    );
  }

  if (category.level !== undefined) {
    formatted.level = category.level;
  }

  return formatted;
}

export function createCategorySuccessResponse<T>(
  data: T, 
  message?: string, 
  statusCode = 200
) {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      data,
      message,
    },
    { status: statusCode }
  );
}

export function createCategoryErrorResponse(
  error: string, 
  message?: string, 
  statusCode = 400
) {
  return NextResponse.json<ApiResponse<null>>(
    {
      success: false,
      error,
      message,
    },
    { status: statusCode }
  );
}

// Check if category would create circular reference
export async function checkCircularReference(
  Category: any,
  categoryId: string,
  newParentId: string
): Promise<boolean> {
  if (categoryId === newParentId) return true;

  let currentParentId = newParentId;
  const visitedIds = new Set([categoryId]);

  while (currentParentId) {
    if (visitedIds.has(currentParentId)) {
      return true; // Circular reference found
    }

    visitedIds.add(currentParentId);

    const parent = await Category.findById(currentParentId).select('parent').lean();
    if (!parent) break;

    currentParentId = parent.parent?.toString();
  }

  return false;
}

// Get category hierarchy level
export async function getCategoryLevel(Category: any, categoryId: string): Promise<number> {
  let level = 0;
  let currentId = categoryId;

  while (currentId) {
    const category = await Category.findById(currentId).select('parent').lean();
    if (!category || !category.parent) break;

    level++;
    currentId = category.parent.toString();

    // Prevent infinite loops
    if (level > 10) break;
  }

  return level;
}