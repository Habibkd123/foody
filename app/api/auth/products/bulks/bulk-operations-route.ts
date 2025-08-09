import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/app/models/Product';
import { createProductSchema } from '@/utils/validations';
import { 
  handleError, 
  formatProductResponse, 
  createSuccessResponse, 
  createErrorResponse 
} from '@/utils/ProductResponse';
import { ApiResponse } from '@/types/product';

// POST - Bulk create products
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    if (!Array.isArray(body) || body.length === 0) {
      return createErrorResponse(
        'Invalid request',
        'Request body must be a non-empty array of products',
        400
      );
    }

    if (body.length > 100) {
      return createErrorResponse(
        'Too many products',
        'Maximum 100 products can be created at once',
        400
      );
    }

    // Validate all products
    const validatedProducts = [];
    const validationErrors = [];

    for (let i = 0; i < body.length; i++) {
      try {
        const validatedProduct = createProductSchema.parse(body[i]);
        validatedProducts.push(validatedProduct);
      } catch (error:any) {
        validationErrors.push({
          index: i,
          product: body[i],
          errors: error.errors
        });
      }
    }

    if (validationErrors.length > 0) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Validation errors',
        message: `${validationErrors.length} products failed validation`,
        data: validationErrors
      }, { status: 400 });
    }

    // Check for duplicate names in the batch
    const names = validatedProducts.map(p => p.name.toLowerCase());
    const duplicateNames = names.filter((name, index) => names.indexOf(name) !== index);

    if (duplicateNames.length > 0) {
      return createErrorResponse(
        'Duplicate products in batch',
        `Duplicate product names found: ${[...new Set(duplicateNames)].join(', ')}`,
        400
      );
    }

    // Check for existing products in database
    const existingProducts = await Product.find({
      name: { $in: validatedProducts.map(p => p.name) }
    }).select('name');

    if (existingProducts.length > 0) {
      return createErrorResponse(
        'Products already exist',
        `These products already exist: ${existingProducts.map(p => p.name).join(', ')}`,
        409
      );
    }

    // Create products in bulk
    const createdProducts = await Product.insertMany(validatedProducts);

    // Populate categories
    await Product.populate(createdProducts, { path: 'category', select: 'name' });

    const formattedProducts = createdProducts.map(formatProductResponse);

    return createSuccessResponse(
      {
        products: formattedProducts,
        count: formattedProducts.length
      },
      `${formattedProducts.length} products created successfully`,
      201
    );

  } catch (error) {
    return handleError(error);
  }
}

// PUT - Bulk update products
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    if (!Array.isArray(body) || body.length === 0) {
      return createErrorResponse(
        'Invalid request',
        'Request body must be a non-empty array of product updates',
        400
      );
    }

    if (body.length > 50) {
      return createErrorResponse(
        'Too many products',
        'Maximum 50 products can be updated at once',
        400
      );
    }

    const updateResults = [];
    const errors = [];

    for (const updateData of body) {
      try {
        if (!updateData._id) {
          errors.push({
            product: updateData,
            error: 'Product ID is required for update'
          });
          continue;
        }

        const { _id, ...updateFields } = updateData;

        const updatedProduct = await Product.findByIdAndUpdate(
          _id,
          updateFields,
          { new: true, runValidators: true }
        ).populate('category', 'name');

        if (updatedProduct) {
          updateResults.push(formatProductResponse(updatedProduct));
        } else {
          errors.push({
            product: updateData,
            error: 'Product not found'
          });
        }
      } catch (error) {
        errors.push({
          product: updateData,
          error: error.message
        });
      }
    }

    return createSuccessResponse({
      updated: updateResults,
      errors: errors,
      updatedCount: updateResults.length,
      errorCount: errors.length
    });

  } catch (error) {
    return handleError(error);
  }
}

// DELETE - Bulk delete products
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    if (!Array.isArray(body) || body.length === 0) {
      return createErrorResponse(
        'Invalid request',
        'Request body must be a non-empty array of product IDs',
        400
      );
    }

    if (body.length > 50) {
      return createErrorResponse(
        'Too many products',
        'Maximum 50 products can be deleted at once',
        400
      );
    }

    // Validate all IDs
    const invalidIds = body.filter(id => !validateObjectId(id));
    if (invalidIds.length > 0) {
      return createErrorResponse(
        'Invalid product IDs',
        `Invalid ObjectId format: ${invalidIds.join(', ')}`,
        400
      );
    }

    const deleteResult = await Product.deleteMany({
      _id: { $in: body }
    });

    return createSuccessResponse({
      deletedCount: deleteResult.deletedCount,
      requestedCount: body.length
    }, `${deleteResult.deletedCount} products deleted successfully`);

  } catch (error) {
    return handleError(error);
  }
}