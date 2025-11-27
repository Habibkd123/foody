import { ApiResponse } from '@/types/product';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function handleError(error: any): NextResponse<ApiResponse<null>> {
  console.error('API Error:', error);

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: 'Validation error',
        message: error.message
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
    const field = Object.keys(error.keyPattern)[0];
    return NextResponse.json(
      {
        success: false,
        error: 'Duplicate entry',
        message: `${field} already exists`
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

export function validateObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

function toPlainObject(input: any): Record<string, any> {
  if (!input) return {};
  // Map
  if (input instanceof Map) {
    return Object.fromEntries(input);
  }
  // Array of [key, value]
  if (Array.isArray(input)) {
    if (input.length === 0) return {};
    const first = input[0];
    if (Array.isArray(first) && first.length === 2) {
      try {
        return Object.fromEntries(input as [string, any][]);
      } catch {
        return {};
      }
    }
    // Array of objects like { key, value }
    if (typeof first === 'object' && first !== null && 'key' in first && 'value' in first) {
      const obj: Record<string, any> = {};
      for (const item of input as Array<{ key: string; value: any }>) {
        obj[item.key] = item.value;
      }
      return obj;
    }
    return {};
  }
  // Plain object
  if (typeof input === 'object') {
    return { ...input };
  }
  return {};
}

export function formatProductResponse(product: any) {
  return {
    _id: product._id.toString(),
    name: product.name,
    description: product.description || '',
    images: product.images || [],
    price: product.price,
    originalPrice: product.originalPrice || null,
    category: product.category
      ? (product.category._id
          ? { ...product.category, _id: product.category._id.toString() }
          : product.category)
      : null,
    stock: product.stock || 0,
    inStock: product.inStock || false,
    brand: product.brand || '',
    sku: product.sku || '',
    weight: product.weight || '',
    dimensions: product.dimensions || '',
    tags: product.tags || [],
    features: product.features || [],
    specifications: toPlainObject(product.specifications),
    nutritionalInfo: toPlainObject(product.nutritionalInfo),
    deliveryInfo: {
      freeDelivery: product.deliveryInfo?.freeDelivery || false,
      estimatedDays: product.deliveryInfo?.estimatedDays || '2-3 days',
      expressAvailable: product.deliveryInfo?.expressAvailable || false,
      expressDays: product.deliveryInfo?.expressDays || ''
    },
    warranty: product.warranty || '',
    warrantyPeriod: product.warrantyPeriod || '',
    rating: product.rating || 0,
    totalReviews: product.totalReviews || 0,
    status: product.status || 'active',
    createdAt: product.createdAt ? product.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: product.updatedAt ? product.updatedAt.toISOString() : new Date().toISOString(),
  };
}

export function createSuccessResponse<T>(data: T, message?: string, statusCode = 200) {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      data,
      message,
    },
    { status: statusCode }
  );
}

export function createErrorResponse(error: string, message?: string, statusCode = 400) {
  return NextResponse.json<ApiResponse<null>>(
    {
      success: false,
      error,
      message,
    },
    { status: statusCode }
  );
}