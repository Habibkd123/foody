import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Cart from '@/app/models/Cart'; // Your existing model
import Product from '@/app/models/Product';
import User from '@/app/models/User';
import { createCartSchema, cartQuerySchema } from '@/lib/cart-validations';
import { 
  handleCartError, 
  formatCartResponse, 
  createCartSuccessResponse,
  createCartErrorResponse,
  validateProductAvailability,
  mergeCartItems
} from '@/utils/cart-utils';
import { ApiResponse, CartResponse } from '@/types/cart';

// GET - Fetch all carts with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const queryData = Object.fromEntries(searchParams.entries());

    const { 
      page = 1, 
      limit = 20, 
      user,
      hasItems,
      minAmount,
      maxAmount,
      sortBy = 'updatedAt',
      sortOrder = 'desc'
    } = cartQuerySchema.parse(queryData);

    // Build filter object
    const filter: any = {};

    // Filter by user
    if (user) {
      filter.user = user;
    }

    // Filter by carts with/without items
    if (hasItems !== undefined) {
      if (hasItems) {
        filter.items = { $exists: true, $not: { $size: 0 } };
      } else {
        filter.$or = [
          { items: { $exists: false } },
          { items: { $size: 0 } }
        ];
      }
    }

    const skip = (page - 1) * limit;

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Use aggregation pipeline for complex filtering
    const pipeline: any[] = [
      { $match: filter },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
          pipeline: [
            { $project: { firstName: 1, lastName: 1, email: 1 } }
          ]
        }
      },
      {
        $unwind: '$user'
      },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      {
        $addFields: {
          items: {
            $map: {
              input: '$items',
              as: 'item',
              in: {
                _id: '$$item._id',
                product: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: '$productDetails',
                        cond: { $eq: ['$$this._id', '$$item.product'] }
                      }
                    },
                    0
                  ]
                },
                quantity: '$$item.quantity'
              }
            }
          }
        }
      },
      {
        $addFields: {
          totalAmount: {
            $sum: {
              $map: {
                input: '$items',
                in: { $multiply: ['$$this.quantity', '$$this.product.price'] }
              }
            }
          },
          itemCount: { $sum: '$items.quantity' }
        }
      }
    ];

    // Add amount filtering after calculating totalAmount
    if (minAmount !== undefined || maxAmount !== undefined) {
      const amountFilter: any = {};
      if (minAmount !== undefined) amountFilter.$gte = minAmount;
      if (maxAmount !== undefined) amountFilter.$lte = maxAmount;
      pipeline.push({ $match: { totalAmount: amountFilter } });
    }

    // Add sorting and pagination
    pipeline.push(
      { $sort: sort },
      { $skip: skip },
      { $limit: limit }
    );

    // Execute main query and count
    const [carts, totalResult] = await Promise.all([
      Cart.aggregate(pipeline),
      Cart.aggregate([
        ...pipeline.slice(0, -3), // Remove sort, skip, limit
        { $count: 'total' }
      ])
    ]);

    const total = totalResult[0]?.total || 0;

    const formattedCarts = carts.map(cart => formatCartResponse(cart, true));

    const responseData = {
      carts: formattedCarts,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
        limit,
      },
    };

    return createCartSuccessResponse(responseData);

  } catch (error) {
    return handleCartError(error);
  }
}

// POST - Create a new cart
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const validatedData = createCartSchema.parse(body);

    // Check if user exists
    const user = await User.findById(validatedData.user);
    if (!user) {
      return createCartErrorResponse(
        'User not found',
        'The specified user does not exist',
        400
      );
    }

    // Check if user already has an active cart
    const existingCart = await Cart.findOne({ user: validatedData.user });
    if (existingCart) {
      return createCartErrorResponse(
        'Cart already exists',
        'User already has an active cart. Use PUT to update or add items.',
        409
      );
    }

    // Validate all products exist and are available
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
    const mergedItems = mergeCartItems(validatedData.items);

    const cart = await Cart.create({
      user: validatedData.user,
      items: mergedItems
    });

    // Populate the cart with user and product details
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
      'Cart created successfully',
      201
    );

  } catch (error) {
    return handleCartError(error);
  }
}