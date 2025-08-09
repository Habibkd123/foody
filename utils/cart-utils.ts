import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { ApiResponse, CartResponse, CartItemResponse, CartSummaryResponse } from '@/types/cart';

export function handleCartError(error: any): NextResponse<ApiResponse<null>> {
  console.error('Cart API Error:', error);

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: 'Validation error',
        message: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
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
    return NextResponse.json(
      {
        success: false,
        error: 'Duplicate cart',
        message: 'User already has an active cart'
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

export function validateCartObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export function calculateCartTotals(items: any[]): { itemCount: number; totalAmount: number } {
  let itemCount = 0;
  let totalAmount = 0;

  items.forEach(item => {
    itemCount += item.quantity;
    if (item.product && item.product.price) {
      totalAmount += item.product.price * item.quantity;
    }
  });

  return {
    itemCount: Math.round(itemCount),
    totalAmount: Math.round(totalAmount * 100) / 100 // Round to 2 decimal places
  };
}

export function formatCartResponse(cart: any, includeProductDetails = true): CartResponse {
  const formattedItems: CartItemResponse[] = cart.items.map((item: any) => {
    const subtotal = item.product?.price ? item.product.price * item.quantity : 0;

    return {
      _id: item._id?.toString(),
      product: includeProductDetails ? {
        _id: item.product._id.toString(),
        name: item.product.name,
        price: item.product.price,
        images: item.product.images || [],
        stock: item.product.stock || 0,
        status: item.product.status
      } : item.product,
      quantity: item.quantity,
      subtotal: Math.round(subtotal * 100) / 100
    };
  });

  const { itemCount, totalAmount } = calculateCartTotals(cart.items);

  return {
    _id: cart._id.toString(),
    user: cart.user ? {
      _id: cart.user._id ? cart.user._id.toString() : cart.user.toString(),
      firstName: cart.user.firstName || '',
      lastName: cart.user.lastName || '',
      email: cart.user.email || ''
    } : cart.user,
    items: formattedItems,
    itemCount,
    totalAmount,
    createdAt: cart.createdAt.toISOString(),
    updatedAt: cart.updatedAt.toISOString(),
  };
}

export function formatCartSummary(cart: any): CartSummaryResponse {
  const { itemCount, totalAmount } = calculateCartTotals(cart.items);

  return {
    _id: cart._id.toString(),
    user: cart.user._id ? cart.user._id.toString() : cart.user.toString(),
    itemCount,
    totalAmount,
    createdAt: cart.createdAt.toISOString(),
    updatedAt: cart.updatedAt.toISOString(),
  };
}

export function createCartSuccessResponse<T>(
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

export function createCartErrorResponse(
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

// Check if product is available for the requested quantity
export function validateProductAvailability(product: any, requestedQuantity: number): { isValid: boolean; message: string } {
  if (!product) {
    return { isValid: false, message: 'Product not found' };
  }

  if (product.status !== 'active') {
    return { isValid: false, message: 'Product is not available' };
  }

  if (product.stock < requestedQuantity) {
    return { isValid: false, message: `Only ${product.stock} items available in stock` };
  }

  return { isValid: true, message: 'Product is available' };
}

// Merge cart items - combine quantities for same products
export function mergeCartItems(items: any[]): any[] {
  const merged = new Map();

  items.forEach(item => {
    const productId = item.product._id ? item.product._id.toString() : item.product.toString();

    if (merged.has(productId)) {
      const existing = merged.get(productId);
      existing.quantity += item.quantity;
    } else {
      merged.set(productId, {
        product: item.product._id ? item.product._id : item.product,
        quantity: item.quantity
      });
    }
  });

  return Array.from(merged.values());
}

// Calculate cart statistics
export function calculateCartStats(carts: any[]): any {
  let totalItems = 0;
  let totalAmount = 0;
  let activeCarts = 0;
  let abandonedCarts = 0;

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  carts.forEach(cart => {
    const { itemCount, totalAmount: cartTotal } = calculateCartTotals(cart.items);
    totalItems += itemCount;
    totalAmount += cartTotal;

    // Consider cart abandoned if not updated in last 30 days
    if (new Date(cart.updatedAt) > thirtyDaysAgo) {
      activeCarts++;
    } else {
      abandonedCarts++;
    }
  });

  return {
    totalCarts: carts.length,
    activeCarts,
    abandonedCarts,
    totalItemsInCarts: totalItems,
    averageItemsPerCart: carts.length > 0 ? Math.round((totalItems / carts.length) * 100) / 100 : 0,
    averageCartValue: carts.length > 0 ? Math.round((totalAmount / carts.length) * 100) / 100 : 0,
  };
}

// Find existing cart item by product ID
export function findCartItem(cart: any, productId: string): any {
  return cart.items.find((item: any) => {
    const itemProductId = item.product._id ? item.product._id.toString() : item.product.toString();
    return itemProductId === productId;
  });
}

// Remove item from cart items array
export function removeCartItem(items: any[], productId: string): any[] {
  return items.filter((item: any) => {
    const itemProductId = item.product._id ? item.product._id.toString() : item.product.toString();
    return itemProductId !== productId;
  });
}

// Validate cart ownership
export function validateCartOwnership(cart: any, userId: string): boolean {
  const cartUserId = cart.user._id ? cart.user._id.toString() : cart.user.toString();
  return cartUserId === userId;
}

// Clean up expired carts (utility for maintenance)
export function isCartExpired(cart: any, expiryDays = 30): boolean {
  const expiryDate = new Date(Date.now() - expiryDays * 24 * 60 * 60 * 1000);
  return new Date(cart.updatedAt) < expiryDate;
}

// Format price for display
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(price);
}

// Calculate discount if applicable
export function calculateDiscount(cart: any, discountRules?: any): { discount: number; finalAmount: number } {
  const { totalAmount } = calculateCartTotals(cart.items);
  let discount = 0;

  // Example discount rules - customize as needed
  if (discountRules) {
    if (discountRules.minAmount && totalAmount >= discountRules.minAmount) {
      discount = Math.min(totalAmount * (discountRules.percentage / 100), discountRules.maxDiscount || Infinity);
    }
  }

  return {
    discount: Math.round(discount * 100) / 100,
    finalAmount: Math.round((totalAmount - discount) * 100) / 100
  };
}