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

export function formatProductResponse(product: any) {
  return {
    _id: product._id.toString(),
    name: product.name,
    description: product.description,
    images: product.images,
    price: product.price,
    category: typeof product.category === 'object' ? product.category._id.toString() : product.category.toString(),
    stock: product.stock,
    status: product.status,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
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