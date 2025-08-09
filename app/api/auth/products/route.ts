import { NextRequest, NextResponse } from 'next/server';
import Product from '@/app/models/Product'; // Your existing model
import { createProductSchema, querySchema } from '@/utils/validations';
import { handleError, formatProductResponse, createSuccessResponse } from '@/utils/ProductResponse';
import { ApiResponse, ProductResponse, ProductListResponse } from '@/types/product';
import connectDB from '@/lib/mongodb';

// GET - Fetch all products with pagination and filters
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const queryData = Object.fromEntries(searchParams.entries());

    const { page = 1, limit = 10, status, category, search } = querySchema.parse(queryData);

    // Build filter object
    const filter: any = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    // Execute queries in parallel
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter)
    ]);

    const formattedProducts = products.map(formatProductResponse);

    const responseData: ProductListResponse = {
      products: formattedProducts,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
        limit,
      },
    };

    return createSuccessResponse(responseData);

  } catch (error) {
    return handleError(error);
  }
}

// POST - Create a new product
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const validatedData = createProductSchema.parse(body);

    // Check if product with same name already exists
    const existingProduct = await Product.findOne({ name: validatedData.name });
    if (existingProduct) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Product already exists',
        message: 'A product with this name already exists'
      }, { status: 409 });
    }

    const product = await Product.create(validatedData);
    await product.populate('category', 'name');

    const formattedProduct = formatProductResponse(product);

    return createSuccessResponse(
      formattedProduct, 
      'Product created successfully', 
      201
    );

  } catch (error) {
    return handleError(error);
  }
}