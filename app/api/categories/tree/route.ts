// Category tree/hierarchy API


import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/app/models/Category';
import { categoryTreeQuerySchema } from '@/lib/category-validations';
import type { Types } from 'mongoose';
import { 
  handleCategoryError, 
  createCategorySuccessResponse,
  validateCategoryObjectId 
} from '@/utils/category-utils';
import { ApiResponse, CategoryTreeResponse } from '@/types/category';

// GET - Get category tree/hierarchy
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const queryData = Object.fromEntries(searchParams.entries());

    const { maxLevel = 5, parentId = null } = categoryTreeQuerySchema.parse(queryData);

    // Validate parentId if provided
    if (parentId && !validateCategoryObjectId(parentId)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Invalid parent ID format',
        message: 'The provided parent ID is not a valid MongoDB ObjectId'
      }, { status: 400 });
    }

    // Build the tree starting from parentId (or root if null)
    const tree = await buildCategoryTree(parentId, 0, maxLevel);

    return createCategorySuccessResponse({
      tree,
      maxLevel,
      rootParent: parentId
    });

  } catch (error) {
    return handleCategoryError(error);
  }
}

// Recursive function to build category tree
async function buildCategoryTree(
  parentId: string | null, 
  currentLevel: number, 
  maxLevel: number
): Promise<CategoryTreeResponse[]> {
  if (currentLevel >= maxLevel) {
    return [];
  }

  const categories = await Category.find({ parent: parentId })
    .select('name image')
    .sort({ name: 1 })
    .lean<Array<{ _id: Types.ObjectId; name: string; image?: string | null }>>();

  const tree: CategoryTreeResponse[] = [];

  for (const category of categories) {
    const children = await buildCategoryTree(
      category._id.toString(), 
      currentLevel + 1, 
      maxLevel
    );

    tree.push({
      _id: category._id.toString(),
      name: category.name,
      image: category.image ?? undefined,
      children,
      level: currentLevel
    });
  }

  return tree;
}

// POST - Get category path/breadcrumb
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { categoryId } = body;

    if (!categoryId || !validateCategoryObjectId(categoryId)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Invalid category ID',
        message: 'Please provide a valid category ID'
      }, { status: 400 });
    }

    const path = await getCategoryPath(categoryId);

    if (path.length === 0) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Category not found',
        message: 'No category found with the provided ID'
      }, { status: 404 });
    }

    return createCategorySuccessResponse({
      categoryId,
      path: path.reverse(), // Reverse to show root -> child order
      level: path.length - 1
    });

  } catch (error) {
    return handleCategoryError(error);
  }
}

// Helper function to get category path (breadcrumb)
async function getCategoryPath(categoryId: string): Promise<Array<{_id: string, name: string}>> {
  const path: Array<{_id: string, name: string}> = [];
  let currentId = categoryId;

  while (currentId) {
    const category = await Category.findById(currentId)
      .select('name parent')
      .lean<{ _id: Types.ObjectId; name: string; parent?: Types.ObjectId | null } | null>();

    if (!category) break;

    path.push({
      _id: category._id.toString(),
      name: category.name
    });

    currentId = category.parent?.toString() || '';

    // Prevent infinite loops
    if (path.length > 20) break;
  }

  return path;
}