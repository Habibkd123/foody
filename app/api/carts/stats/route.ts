// Cart statistics and analytics API

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Cart from '@/app/models/Cart';
import Product from '@/app/models/Product';
import { cartStatsQuerySchema } from '@/lib/cart-validations';
import { 
  handleCartError, 
  createCartSuccessResponse,
  calculateCartStats
} from '@/utils/cart-utils';
import { CartStatsResponse } from '@/types/cart';

// GET - Get cart statistics
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const queryData = Object.fromEntries(searchParams.entries());

    const { startDate, endDate, userId } = cartStatsQuerySchema.parse(queryData);

    // Build date filter if provided
    const dateFilter: any = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Add user filter if provided
    if (userId) {
      dateFilter.user = userId;
    }

    // Get current date boundaries for time-based stats
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Execute all statistics queries in parallel
    const [
      totalCarts,
      cartsWithItems,
      emptyCartCount,
      cartsToday,
      cartsThisWeek,
      cartsThisMonth,
      cartAggregation,
      topProducts,
      abandonedCarts
    ] = await Promise.all([
      // Total carts
      Cart.countDocuments(dateFilter),

      // Carts with items
      Cart.countDocuments({
        ...dateFilter,
        items: { $exists: true, $not: { $size: 0 } }
      }),

      // Empty carts
      Cart.countDocuments({
        ...dateFilter,
        $or: [
          { items: { $exists: false } },
          { items: { $size: 0 } }
        ]
      }),

      // New carts today
      Cart.countDocuments({
        ...dateFilter,
        createdAt: { $gte: todayStart }
      }),

      // New carts this week
      Cart.countDocuments({
        ...dateFilter,
        createdAt: { $gte: weekStart }
      }),

      // New carts this month
      Cart.countDocuments({
        ...dateFilter,
        createdAt: { $gte: monthStart }
      }),

      // Cart value aggregation
      Cart.aggregate([
        { $match: { ...dateFilter, items: { $exists: true, $not: { $size: 0 } } } },
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
                  product: '$$item.product',
                  quantity: '$$item.quantity',
                  productInfo: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: '$productDetails',
                          cond: { $eq: ['$$this._id', '$$item.product'] }
                        }
                      },
                      0
                    ]
                  }
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
                  in: { 
                    $multiply: [
                      '$$this.quantity', 
                      { $ifNull: ['$$this.productInfo.price', 0] }
                    ] 
                  }
                }
              }
            },
            itemCount: { $sum: '$items.quantity' }
          }
        },
        {
          $group: {
            _id: null,
            totalValue: { $sum: '$totalAmount' },
            averageValue: { $avg: '$totalAmount' },
            totalItems: { $sum: '$itemCount' },
            averageItemsPerCart: { $avg: '$itemCount' },
            maxCartValue: { $max: '$totalAmount' },
            minCartValue: { $min: '$totalAmount' }
          }
        }
      ]),

      // Top products in carts
      Cart.aggregate([
        { $match: { ...dateFilter, items: { $exists: true, $not: { $size: 0 } } } },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.product',
            totalQuantity: { $sum: '$items.quantity' },
            totalCarts: { $sum: 1 }
          }
        },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        {
          $project: {
            product: {
              _id: '$product._id',
              name: '$product.name'
            },
            totalQuantity: 1,
            totalCarts: 1
          }
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 10 }
      ]),

      // Abandoned carts (not updated in last 7 days)
      Cart.countDocuments({
        ...dateFilter,
        items: { $exists: true, $not: { $size: 0 } },
        updatedAt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      })
    ]);

    const activeCarts = cartsWithItems - abandonedCarts;
    const aggregationResult = cartAggregation[0] || {};

    const stats: CartStatsResponse = {
      totalCarts,
      activeCarts,
      abandonedCarts,
      totalItemsInCarts: aggregationResult.totalItems || 0,
      averageItemsPerCart: Math.round((aggregationResult.averageItemsPerCart || 0) * 100) / 100,
      averageCartValue: Math.round((aggregationResult.averageValue || 0) * 100) / 100,
      topProducts: topProducts || [],
    };

    const responseData = {
      ...stats,
      emptyCartCount,
      cartsToday,
      cartsThisWeek,
      cartsThisMonth,
      totalCartValue: Math.round((aggregationResult.totalValue || 0) * 100) / 100,
      maxCartValue: Math.round((aggregationResult.maxCartValue || 0) * 100) / 100,
      minCartValue: Math.round((aggregationResult.minCartValue || 0) * 100) / 100,
      conversionRate: totalCarts > 0 ? Math.round((cartsWithItems / totalCarts) * 10000) / 100 : 0,
      abandonmentRate: cartsWithItems > 0 ? Math.round((abandonedCarts / cartsWithItems) * 10000) / 100 : 0,
    };

    return createCartSuccessResponse(responseData);

  } catch (error) {
    return handleCartError(error);
  }
}

// POST - Get detailed cart analytics
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { 
      groupBy = 'day', 
      period = 30,
      metrics = ['carts', 'value', 'items'],
      userId
    } = body;

    const periodStart = new Date(Date.now() - period * 24 * 60 * 60 * 1000);

    let dateFormat = '%Y-%m-%d';
    if (groupBy === 'month') {
      dateFormat = '%Y-%m';
    } else if (groupBy === 'week') {
      dateFormat = '%Y-W%V';
    } else if (groupBy === 'hour') {
      dateFormat = '%Y-%m-%d %H:00';
    }

    const matchFilter: any = { createdAt: { $gte: periodStart } };
    if (userId) {
      matchFilter.user = userId;
    }

    const queries = [];

    // Cart creation metrics
    if (metrics.includes('carts')) {
      queries.push(
        Cart.aggregate([
          { $match: matchFilter },
          {
            $group: {
              _id: {
                period: { $dateToString: { format: dateFormat, date: '$createdAt' } },
                hasItems: { 
                  $cond: { 
                    if: { $gt: [{ $size: { $ifNull: ['$items', []] } }, 0] }, 
                    then: 'withItems', 
                    else: 'empty' 
                  } 
                }
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { '_id.period': 1 } }
        ])
      );
    }

    // Cart value metrics
    if (metrics.includes('value')) {
      queries.push(
        Cart.aggregate([
          { 
            $match: { 
              ...matchFilter,
              items: { $exists: true, $not: { $size: 0 } }
            }
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
              totalAmount: {
                $sum: {
                  $map: {
                    input: '$items',
                    as: 'item',
                    in: {
                      $multiply: [
                        '$$item.quantity',
                        {
                          $ifNull: [
                            {
                              $getField: {
                                field: 'price',
                                input: {
                                  $arrayElemAt: [
                                    {
                                      $filter: {
                                        input: '$productDetails',
                                        cond: { $eq: ['$$this._id', '$$item.product'] }
                                      }
                                    },
                                    0
                                  ]
                                }
                              }
                            },
                            0
                          ]
                        }
                      ]
                    }
                  }
                }
              }
            }
          },
          {
            $group: {
              _id: {
                period: { $dateToString: { format: dateFormat, date: '$createdAt' } }
              },
              totalValue: { $sum: '$totalAmount' },
              averageValue: { $avg: '$totalAmount' },
              cartCount: { $sum: 1 }
            }
          },
          { $sort: { '_id.period': 1 } }
        ])
      );
    }

    // Item quantity metrics
    if (metrics.includes('items')) {
      queries.push(
        Cart.aggregate([
          { 
            $match: { 
              ...matchFilter,
              items: { $exists: true, $not: { $size: 0 } }
            }
          },
          {
            $addFields: {
              itemCount: { $sum: '$items.quantity' }
            }
          },
          {
            $group: {
              _id: {
                period: { $dateToString: { format: dateFormat, date: '$createdAt' } }
              },
              totalItems: { $sum: '$itemCount' },
              averageItemsPerCart: { $avg: '$itemCount' },
              cartCount: { $sum: 1 }
            }
          },
          { $sort: { '_id.period': 1 } }
        ])
      );
    }

    const results = await Promise.all(queries);

    const analytics = {
      period: period,
      groupBy: groupBy,
      metrics: {},
      summary: {
        totalPeriods: 0,
        dateRange: {
          start: periodStart.toISOString(),
          end: new Date().toISOString()
        }
      }
    };

    // Process results
    if (metrics.includes('carts') && results[0]) {
      analytics.metrics.carts = results[0];
    }

    if (metrics.includes('value') && results[1]) {
      analytics.metrics.value = results[1];
    }

    if (metrics.includes('items') && results[2]) {
      analytics.metrics.items = results[2];
    }

    return createCartSuccessResponse(analytics);

  } catch (error) {
    return handleCartError(error);
  }
}