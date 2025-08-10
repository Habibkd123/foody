import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/app/models/Category';
import { updateCategorySchema } from '@/lib/category-validations';
import { 
  handleCategoryError, 
  validateCategoryObjectId, 
  formatCategoryResponse, 
  createCategorySuccessResponse, 
  createCategoryErrorResponse,
  checkCircularReference
} from '@/utils/category-utils';
import { ApiResponse, CategoryResponse } from '@/types/category';
import Product from '@/app/models/Product';

// GET - Fetch category by ID with subcategories
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;
    const { searchParams } = new URL(request.url);
    const includeSubcategories = searchParams.get('includeSubcategories') === 'true';

    if (!validateCategoryObjectId(id)) {
      return createCategoryErrorResponse(
        'Invalid category ID format',
        'The provided ID is not a valid MongoDB ObjectId',
        400
      );
    }

    // Build aggregation pipeline
    const pipeline = [
      { $match: { _id: new (await import('mongoose')).Types.ObjectId(id) } },
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

    const categories = await Category.aggregate(pipeline);
    const category = categories[0];

    if (!category) {
      return createCategoryErrorResponse(
        'Category not found',
        'No category found with the provided ID',
        404
      );
    }

    const formattedCategory = formatCategoryResponse(category, includeSubcategories);

    return createCategorySuccessResponse(formattedCategory);

  } catch (error) {
    return handleCategoryError(error);
  }
}

// PUT - Update category by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const { id } = params;

    if (!validateCategoryObjectId(id)) {
      return createCategoryErrorResponse('Invalid ID', 'Invalid MongoDB ObjectId', 400);
    }

    const body = await request.json();
    if (!body || Object.keys(body).length === 0) {
      return createCategoryErrorResponse('No data', 'Request body cannot be empty', 400);
    }

    const validatedData = updateCategorySchema.parse(body);

    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return createCategoryErrorResponse('Not found', 'Category does not exist', 404);
    }

    // --- Duplicate check (name) ---
    // if (validatedData.name) {
    //   const parentId = validatedData.parent !== undefined ? validatedData.parent : existingCategory.parent;
    //   const duplicateCategory = await Category.findOne({
    //     name: validatedData.name,
    //     parent: parentId,
    //     _id: { $ne: id }
    //   });
    //   if (duplicateCategory) {
    //     return createCategoryErrorResponse('Duplicate name', 'Category with this name already exists', 409);
    //   }
    // }

    // --- Parent validation & circular check ---
    if (validatedData.parent !== undefined && validatedData.parent) {
      const parentCategory = await Category.findById(validatedData.parent);
      if (!parentCategory) {
        return createCategoryErrorResponse('Parent not found', 'The specified parent does not exist', 400);
      }
      const circle = await checkCircularReference(Category, id, validatedData.parent);
      if (circle) {
        return createCategoryErrorResponse('Circular reference', 'Invalid parent assignment', 400);
      }
    }

    // ✅ Filter only provided fields
    const updateFields: Record<string, any> = {};
    for (const key in validatedData) {
      if (validatedData[key as keyof typeof validatedData] !== undefined) {
        updateFields[key] = validatedData[key as keyof typeof validatedData];
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate('parent', 'name');

    const formattedCategory = formatCategoryResponse(updatedCategory!);

    return createCategorySuccessResponse(formattedCategory, 'Category updated successfully');

  } catch (error) {
    return handleCategoryError(error);
  }
}


// DELETE - Delete category by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;
    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';

    if (!validateCategoryObjectId(id)) {
      return createCategoryErrorResponse(
        'Invalid category ID format',
        'The provided ID is not a valid MongoDB ObjectId',
        400
      );
    }

    const category = await Category.findById(id);
    if (!category) {
      return createCategoryErrorResponse(
        'Category not found',
        'No category found with the provided ID',
        404
      );
    }

    // Check for subcategories
    const subcategoriesCount = await Category.countDocuments({ parent: id });

    if (subcategoriesCount > 0 && !force) {
      return createCategoryErrorResponse(
        'Category has subcategories',
        `Cannot delete category with ${subcategoriesCount} subcategories. Use ?force=true to delete recursively`,
        409
      );
    }

    // Check for products using this category (you might want to add this)
    const productsCount = await Product.countDocuments({ category: id });
    if (productsCount > 0) {
      return createCategoryErrorResponse(
        'Category is in use',
        `Cannot delete category that is used by ${productsCount} products`,
        409
      );
    }

    if (force && subcategoriesCount > 0) {
      // Recursively delete all subcategories
      await deleteSubcategoriesRecursively(id);
    }

    await Category.findByIdAndDelete(id);

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: `Category "${category.name}" deleted successfully${force ? ' (including subcategories)' : ''}`,
    });

  } catch (error) {
    return handleCategoryError(error);
  }
}

// Helper function to recursively delete subcategories
async function deleteSubcategoriesRecursively(parentId: string) {
  const subcategories = await Category.find({ parent: parentId }).select('_id');

  for (const subcategory of subcategories) {
    await deleteSubcategoriesRecursively(subcategory._id.toString());
    await Category.findByIdAndDelete(subcategory._id);
  }
}