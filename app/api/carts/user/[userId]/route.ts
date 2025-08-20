// user-specific cart management API

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Cart from '@/app/models/Cart';
import Product from '@/app/models/Product';
import User from '@/app/models/User';
import { addToCartSchema, updateCartItemSchema, bulkUpdateCartSchema } from '@/lib/cart-validations';
import { 
  handleCartError, 
  validateCartObjectId, 
  formatCartResponse, 
  createCartSuccessResponse, 
  createCartErrorResponse,
  validateProductAvailability,
  findCartItem,
  removeCartItem
} from '@/utils/cart-utils';
import { ApiResponse, CartResponse } from '@/types/cart';

// GET - Get user's cart
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();

    const { userId } = params;

    if (!validateCartObjectId(userId)) {
      return createCartErrorResponse(
        'Invalid user ID format',
        'The provided user ID is not a valid MongoDB ObjectId',
        400
      );
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return createCartErrorResponse(
        'User not found',
        'The specified user does not exist',
        404
      );
    }

    let cart = await Cart.findOne({ user: userId })
      .populate({
        path: 'user',
        select: 'firstName lastName email'
      })
      .populate({
        path: 'items.product',
        select: 'name price images stock status'
      })
      .lean();

    // If no cart exists, create an empty one
    if (!cart) {
      const newCart = await Cart.create({
        user: userId,
        items: []
      });

      await newCart.populate([
        {
          path: 'user',
          select: 'firstName lastName email'
        }
      ]);

      cart = newCart.toObject();
    }

    const formattedCart = formatCartResponse(cart, true);

    return createCartSuccessResponse(formattedCart);

  } catch (error) {
    return handleCartError(error);
  }
}

// POST - Add item to user's cart
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();

    const { userId } = params;

    if (!validateCartObjectId(userId)) {
      return createCartErrorResponse(
        'Invalid user ID format',
        'The provided user ID is not a valid MongoDB ObjectId',
        400
      );
    }

    const body = await request.json();
    const validatedData = addToCartSchema.parse(body);

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return createCartErrorResponse(
        'User not found',
        'The specified user does not exist',
        404
      );
    }

    // Check if product exists and is available
    const product = await Product.findById(validatedData.productId);
    const validation = validateProductAvailability(product, validatedData.quantity);

    if (!validation.isValid) {
      return createCartErrorResponse(
        'Product unavailable',
        validation.message,
        400
      );
    }

    // Find or create user's cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [{
          product: validatedData.productId,
          quantity: validatedData.quantity
        }]
      });
    } else {
      // Check if product already exists in cart
      const existingItemIndex = cart.items.findIndex(
        item => item.product.toString() === validatedData.productId
      );

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const newQuantity = cart.items[existingItemIndex].quantity + validatedData.quantity;

        // Validate new total quantity
        const stockValidation = validateProductAvailability(product, newQuantity);
        if (!stockValidation.isValid) {
          return createCartErrorResponse(
            'Product unavailable',
            `Cannot add ${validatedData.quantity} more items. ${stockValidation.message}`,
            400
          );
        }

        cart.items[existingItemIndex].quantity = newQuantity;
      } else {
        // Add new item to cart
        cart.items.push({
          product: validatedData.productId,
          quantity: validatedData.quantity
        });
      }

      await cart.save();
    }

    // Populate cart with details
    await cart.populate([
      {
        path: 'user',
        select: 'firstName lastName email'
      },
      {
        path: 'items.product',
        select: 'name price images stock status'
      }
    ]);

    const formattedCart = formatCartResponse(cart, true);

    return createCartSuccessResponse(
      formattedCart,
      'Item added to cart successfully',
      201
    );

  } catch (error) {
    return handleCartError(error);
  }
}

// PUT - Update item in user's cart
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();

    const { userId } = params;
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'updateItem';

    if (!validateCartObjectId(userId)) {
      return createCartErrorResponse(
        'Invalid user ID format',
        'The provided user ID is not a valid MongoDB ObjectId',
        400
      );
    }

    const body = await request.json();

    if (action === 'bulk') {
      return await handleBulkUpdate(userId, body);
    } else {
      return await handleSingleItemUpdate(userId, body);
    }

  } catch (error) {
    return handleCartError(error);
  }
}

async function handleSingleItemUpdate(userId: string, body: any) {
  const validatedData = updateCartItemSchema.parse(body);

  // Find user's cart
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    return createCartErrorResponse(
      'Cart not found',
      'User does not have an active cart',
      404
    );
  }

  // Find the item in cart
  const itemIndex = cart.items.findIndex(
    item => item.product.toString() === validatedData.productId
  );

  if (itemIndex === -1) {
    return createCartErrorResponse(
      'Item not found',
      'The specified product is not in the cart',
      404
    );
  }

  // If quantity is 0, remove the item
  if (validatedData.quantity === 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    // Validate product availability
    const product = await Product.findById(validatedData.productId);
    const validation = validateProductAvailability(product, validatedData.quantity);

    if (!validation.isValid) {
      return createCartErrorResponse(
        'Product unavailable',
        validation.message,
        400
      );
    }

    // Update quantity
    cart.items[itemIndex].quantity = validatedData.quantity;
  }

  await cart.save();

  // Populate and return updated cart
  await cart.populate([
    {
      path: 'user',
      select: 'firstName lastName email'
    },
    {
      path: 'items.product',
      select: 'name price images stock status'
    }
  ]);

  const formattedCart = formatCartResponse(cart, true);

  return createCartSuccessResponse(
    formattedCart,
    validatedData.quantity === 0 ? 'Item removed from cart' : 'Cart updated successfully'
  );
}

// DELETE - Clear user's cart or remove specific item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();

    const { userId } = params;
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!validateCartObjectId(userId)) {
      return createCartErrorResponse(
        'Invalid user ID format',
        'The provided user ID is not a valid MongoDB ObjectId',
        400
      );
    }

    // Find user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return createCartErrorResponse(
        'Cart not found',
        'User does not have an active cart',
        404
      );
    }

    if (productId) {
      // Remove specific item from cart
      if (!validateCartObjectId(productId)) {
        return createCartErrorResponse(
          'Invalid product ID format',
          'The provided product ID is not a valid MongoDB ObjectId',
          400
        );
      }

      const initialItemCount = cart.items.length;
      cart.items = cart.items.filter(
        item => item.product.toString() !== productId
      );

      if (cart.items.length === initialItemCount) {
        return createCartErrorResponse(
          'Item not found',
          'The specified product is not in the cart',
          404
        );
      }

      await cart.save();

      return NextResponse.json<ApiResponse<null>>({
        success: true,
        message: 'Item removed from cart successfully',
      });
    } else {
      // Clear entire cart
      cart.items = [];
      await cart.save();

      return NextResponse.json<ApiResponse<null>>({
        success: true,
        message: 'Cart cleared successfully',
      });
    }

  } catch (error) {
    return handleCartError(error);
  }
}



async function handleBulkUpdate(userId: string, body: any) {
  const validatedData = bulkUpdateCartSchema.parse(body);

  // Find user's cart
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    return createCartErrorResponse(
      'Cart not found',
      'User does not have an active cart',
      404
    );
  }

  // Validate all products
  const productIds = validatedData.items.map(item => item.productId);
  const products = await Product.find({ _id: { $in: productIds } });

  for (const item of validatedData.items) {
    if (item.quantity > 0) {
      const product = products.find(p => p._id.toString() === item.productId);
      const validation = validateProductAvailability(product, item.quantity);

      if (!validation.isValid) {
        return createCartErrorResponse(
          'Product unavailable',
          `${product?.name}: ${validation.message}`,
          400
        );
      }
    }
  }

  // Update cart items
  const updatedItems = [];

  for (const updateItem of validatedData.items) {
    if (updateItem.quantity > 0) {
      updatedItems.push({
        product: updateItem.productId,
        quantity: updateItem.quantity
      });
    }
    // If quantity is 0, item is effectively removed
  }

  cart.items = updatedItems;
  await cart.save();

  // Populate and return updated cart
  await cart.populate([
    {
      path: 'user',
      select: 'firstName lastName email'
    },
    {
      path: 'items.product',
      select: 'name price images stock status'
    }
  ]);

  const formattedCart = formatCartResponse(cart, true);

  return createCartSuccessResponse(
    formattedCart,
    'Cart updated successfully'
  );
}
