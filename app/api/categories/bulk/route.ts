// Bulk operations API


import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/app/models/Category';
import { createCategorySchema } from '@/lib/category-validations';
import { 
  handleCategoryError, 
  formatCategoryResponse, 
  createCategorySuccessResponse, 
  createCategoryErrorResponse,
  validateCategoryObjectId,
  checkCircularReference
} from '@/utils/category-utils';
import { ApiResponse } from '@/types/category';

// POST - Bulk create categories
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    if (!Array.isArray(body) || body.length === 0) {
      return createCategoryErrorResponse(
        'Invalid request',
        'Request body must be a non-empty array of categories',
        400
      );
    }

    if (body.length > 100) {
      return createCategoryErrorResponse(
        'Too many categories',
        'Maximum 100 categories can be created at once',
        400
      );
    }

    // Validate all categories
    const validatedCategories = [];
    const validationErrors = [];

    for (let i = 0; i < body.length; i++) {
      try {
        const validatedCategory = createCategorySchema.parse(body[i]);
        validatedCategories.push(validatedCategory);
      } catch (error) {
        validationErrors.push({
          index: i,
          category: body[i],
          errors: error.errors
        });
      }
    }

    if (validationErrors.length > 0) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Validation errors',
        message: `${validationErrors.length} categories failed validation`,
        data: validationErrors
      }, { status: 400 });
    }

    // Check for duplicate names at same level in the batch
    const nameParentPairs = validatedCategories.map(c => 
      `${c.name.toLowerCase()}_${c.parent || 'root'}`
    );
    const duplicateNames = nameParentPairs.filter(
      (pair, index) => nameParentPairs.indexOf(pair) !== index
    );

    if (duplicateNames.length > 0) {
      return createCategoryErrorResponse(
        'Duplicate categories in batch',
        'Duplicate category names found at the same level within the batch',
        400
      );
    }

    // Check for existing categories in database
    const existingChecks = await Promise.all(
      validatedCategories.map(cat => 
        Category.findOne({ 
          name: cat.name, 
          parent: cat.parent || null 
        }).select('name parent')
      )
    );

    const existingCategories = existingChecks.filter(Boolean);
    if (existingCategories.length > 0) {
      const existingNames = existingCategories.map(c => c!.name);
      return createCategoryErrorResponse(
        'Categories already exist',
        `These categories already exist: ${existingNames.join(', ')}`,
        409
      );
    }

    // Validate parent categories exist
    const parentIds = [...new Set(validatedCategories
      .map(cat => cat.parent)
      .filter(Boolean))];

    if (parentIds.length > 0) {
      const parentCategories = await Category.find({
        _id: { $in: parentIds }
      }).select('_id');

      const existingParentIds = parentCategories.map(p => p._id.toString());
      const missingParents = parentIds.filter(id => 
        !existingParentIds.includes(id!)
      );

      if (missingParents.length > 0) {
        return createCategoryErrorResponse(
          'Parent categories not found',
          `These parent category IDs do not exist: ${missingParents.join(', ')}`,
          400
        );
      }
    }

    // Create categories in bulk
    const createdCategories = await Category.insertMany(validatedCategories);

    // Populate parent information
    await Category.populate(createdCategories, { path: 'parent', select: 'name' });

    const formattedCategories = createdCategories.map(formatCategoryResponse);

    return createCategorySuccessResponse(
      {
        categories: formattedCategories,
        count: formattedCategories.length
      },
      `${formattedCategories.length} categories created successfully`,
      201
    );

  } catch (error) {
    return handleCategoryError(error);
  }
}

// PUT - Bulk update categories
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    if (!Array.isArray(body) || body.length === 0) {
      return createCategoryErrorResponse(
        'Invalid request',
        'Request body must be a non-empty array of category updates',
        400
      );
    }

    if (body.length > 50) {
      return createCategoryErrorResponse(
        'Too many categories',
        'Maximum 50 categories can be updated at once',
        400
      );
    }

    const updateResults = [];
    const errors = [];

    for (const updateData of body) {
      try {
        if (!updateData._id) {
          errors.push({
            category: updateData,
            error: 'Category ID is required for update'
          });
          continue;
        }

        if (!validateCategoryObjectId(updateData._id)) {
          errors.push({
            category: updateData,
            error: 'Invalid category ID format'
          });
          continue;
        }

        const { _id, ...updateFields } = updateData;

        // Check for circular reference if updating parent
        if (updateFields.parent) {
          const wouldCreateCircle = await checkCircularReference(
            Category, 
            _id, 
            updateFields.parent
          );

          if (wouldCreateCircle) {
            errors.push({
              category: updateData,
              error: 'Would create circular reference'
            });
            continue;
          }
        }

        const updatedCategory = await Category.findByIdAndUpdate(
          _id,
          updateFields,
          { new: true, runValidators: true }
        ).populate('parent', 'name');

        if (updatedCategory) {
          updateResults.push(formatCategoryResponse(updatedCategory));
        } else {
          errors.push({
            category: updateData,
            error: 'Category not found'
          });
        }
      } catch (error) {
        errors.push({
          category: updateData,
          error: error.message
        });
      }
    }

    return createCategorySuccessResponse({
      updated: updateResults,
      errors: errors,
      updatedCount: updateResults.length,
      errorCount: errors.length
    });

  } catch (error) {
    return handleCategoryError(error);
  }
}

// DELETE - Bulk delete categories
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { categoryIds, force = false } = body;

    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      return createCategoryErrorResponse(
        'Invalid request',
        'categoryIds must be a non-empty array of category IDs',
        400
      );
    }

    if (categoryIds.length > 50) {
      return createCategoryErrorResponse(
        'Too many categories',
        'Maximum 50 categories can be deleted at once',
        400
      );
    }

    // Validate all IDs
    const invalidIds = categoryIds.filter(id => !validateCategoryObjectId(id));
    if (invalidIds.length > 0) {
      return createCategoryErrorResponse(
        'Invalid category IDs',
        `Invalid ObjectId format: ${invalidIds.join(', ')}`,
        400
      );
    }

    if (!force) {
      // Check if any categories have subcategories
      const categoriesWithSubs = await Category.find({
        parent: { $in: categoryIds }
      }).select('parent').lean();

      if (categoriesWithSubs.length > 0) {
        const parentIds = [...new Set(categoriesWithSubs.map(c => c.parent.toString()))];
        return createCategoryErrorResponse(
          'Categories have subcategories',
          `Cannot delete categories with subcategories: ${parentIds.join(', ')}. Use force: true to delete recursively`,
          409
        );
      }
    }

    let deletedCount = 0;

    if (force) {
      // Recursively delete categories and their subcategories
      for (const categoryId of categoryIds) {
        const count = await deleteRecursively(categoryId);
        deletedCount += count;
      }
    } else {
      // Simple delete
      const deleteResult = await Category.deleteMany({
        _id: { $in: categoryIds }
      });
      deletedCount = deleteResult.deletedCount;
    }

    return createCategorySuccessResponse({
      deletedCount,
      requestedCount: categoryIds.length,
      recursive: force
    }, `${deletedCount} categories deleted successfully${force ? ' (including subcategories)' : ''}`);

  } catch (error) {
    return handleCategoryError(error);
  }
}

// Helper function to recursively delete categories
async function deleteRecursively(categoryId: string): Promise<number> {
  let count = 0;

  // Find all subcategories
  const subcategories = await Category.find({ parent: categoryId }).select('_id');

  // Recursively delete subcategories
  for (const sub of subcategories) {
    count += await deleteRecursively(sub._id.toString());
  }

  // Delete the category itself
  const deleted = await Category.findByIdAndDelete(categoryId);
  if (deleted) count++;

  return count;
}