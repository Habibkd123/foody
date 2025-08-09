import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Cart from '@/app/models/Cart';
import Product from '@/app/models/Product';
import { updateCartSchema } from '@/lib/cart-validations';
import { 
  handleCartError, 
  validateCartObjectId, 
  formatCartResponse, 
  createCartSuccessResponse, 
  createCartErrorResponse,
  validateProductAvailability,
  mergeCartItems
} from '@/utils/cart-utils';
import { ApiResponse, CartResponse } from '@/types/cart';

// GET - Fetch cart by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    if (!validateCartObjectId(id)) {
      return createCartErrorResponse(
        'Invalid cart ID format',
        'The provided ID is not a valid MongoDB ObjectId',
        400
      );
    }

    const cart = await Cart.findById(id)
      .populate({
        path: 'user',
        select: 'firstName lastName email'
      })
      .populate({
        path: 'items.product',
        select: 'name price images stock status'
      })
      .lean();

    if (!cart) {
      return createCartErrorResponse(
        'Cart not found',
        'No cart found with the provided ID',
        404
      );
    }

    const formattedCart = formatCartResponse(cart, true);

    return createCartSuccessResponse(formattedCart);

  } catch (error) {
    return handleCartError(error);
  }
}

// PUT - Update cart by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    if (!validateCartObjectId(id)) {
      return createCartErrorResponse(
        'Invalid cart ID format',
        'The provided ID is not a valid MongoDB ObjectId',
        400
      );
    }

    const body = await request.json();

    if (!body || Object.keys(body).length === 0) {
      return createCartErrorResponse(
        'No data provided',
        'Request body cannot be empty for update operation',
        400
      );
    }

    const validatedData = updateCartSchema.parse(body);

    // Check if cart exists
    const existingCart = await Cart.findById(id);
    if (!existingCart) {
      return createCartErrorResponse(
        'Cart not found',
        'No cart found with the provided ID',
        404
      );
    }

    // If updating items, validate products
    if (validatedData.items) {
      const productIds = validatedData.items.map(item => item.product);
      const products = await Product.find({ _id: { $in: productIds } });

      if (products.length !== productIds.length) {
        return createCartErrorResponse(
          'Products not found',
          'One or more products do not exist',
          400
        );
      }

      // Validate product availability and stock
      for (const item of validatedData.items) {
        const product = products.find(p => p._id.toString() === item.product);
        const validation = validateProductAvailability(product, item.quantity);

        if (!validation.isValid) {
          return createCartErrorResponse(
            'Product unavailable',
            `${product?.name}: ${validation.message}`,
            400
          );
        }
      }

      // Merge items with same product (combine quantities)
      validatedData.items = mergeCartItems(validatedData.items);
    }

    const updatedCart = await Cart.findByIdAndUpdate(
      id,
      validatedData,
      { new: true, runValidators: true }
    )
    .populate({
      path: 'user',
      select: 'firstName lastName email'
    })
    .populate({
      path: 'items.product',
      select: 'name price images stock status'
    });

    const formattedCart = formatCartResponse(updatedCart!, true);

    return createCartSuccessResponse(
      formattedCart,
      'Cart updated successfully'
    );

  } catch (error) {
    return handleCartError(error);
  }
}

// DELETE - Delete cart by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    if (!validateCartObjectId(id)) {
      return createCartErrorResponse(
        'Invalid cart ID format',
        'The provided ID is not a valid MongoDB ObjectId',
        400
      );
    }

    const cart = await Cart.findById(id);
    if (!cart) {
      return createCartErrorResponse(
        'Cart not found',
        'No cart found with the provided ID',
        404
      );
    }

    await Cart.findByIdAndDelete(id);

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: 'Cart deleted successfully',
    });

  } catch (error) {
    return handleCartError(error);
  }
}