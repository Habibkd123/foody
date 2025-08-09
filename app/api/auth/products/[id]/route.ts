import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/app/models/Product';
import { updateProductSchema } from '@/utils/validations';
import { 
  handleError, 
  validateObjectId, 
  formatProductResponse, 
  createSuccessResponse, 
  createErrorResponse 
} from '@/utils/ProductResponse';
import { ApiResponse, ProductResponse } from '@/types/product';

// GET - Fetch product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    if (!validateObjectId(id)) {
      return createErrorResponse(
        'Invalid product ID format',
        'The provided ID is not a valid MongoDB ObjectId',
        400
      );
    }

    const product = await Product.findById(id)
      .populate('category', 'name')
      .lean();

    if (!product) {
      return createErrorResponse(
        'Product not found',
        'No product found with the provided ID',
        404
      );
    }

    const formattedProduct = formatProductResponse(product);

    return createSuccessResponse(formattedProduct);

  } catch (error) {
    return handleError(error);
  }
}

// PUT - Update product by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    if (!validateObjectId(id)) {
      return createErrorResponse(
        'Invalid product ID format',
        'The provided ID is not a valid MongoDB ObjectId',
        400
      );
    }

    const body = await request.json();

    // Check if body is empty
    if (!body || Object.keys(body).length === 0) {
      return createErrorResponse(
        'No data provided',
        'Request body cannot be empty for update operation',
        400
      );
    }

    const validatedData = updateProductSchema.parse(body);

    // If updating name, check for duplicates
    if (validatedData.name) {
      const existingProduct = await Product.findOne({ 
        name: validatedData.name, 
        _id: { $ne: id } 
      });
      if (existingProduct) {
        return createErrorResponse(
          'Product name already exists',
          'A product with this name already exists',
          409
        );
      }
    }

    const product = await Product.findByIdAndUpdate(
      id,
      validatedData,
      { new: true, runValidators: true }
    ).populate('category', 'name');

    if (!product) {
      return createErrorResponse(
        'Product not found',
        'No product found with the provided ID',
        404
      );
    }

    const formattedProduct = formatProductResponse(product);

    return createSuccessResponse(
      formattedProduct, 
      'Product updated successfully'
    );

  } catch (error) {
    return handleError(error);
  }
}

// DELETE - Delete product by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    if (!validateObjectId(id)) {
      return createErrorResponse(
        'Invalid product ID format',
        'The provided ID is not a valid MongoDB ObjectId',
        400
      );
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return createErrorResponse(
        'Product not found',
        'No product found with the provided ID',
        404
      );
    }

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: `Product "${product.name}" deleted successfully`,
    });

  } catch (error) {
    return handleError(error);
  }
}