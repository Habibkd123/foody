import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/app/models/Order';
import { OrderStatus } from '@/app/models/User';
import mongoose from 'mongoose';

// POST /api/orders/search - Advanced search for orders
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const {
      query,
      filters = {},
      sort = { createdAt: -1 },
      page = 1,
      limit = 10,
      populate = true
    } = body;
    
    // Build search filter
    const searchFilter: any = {};
    
    // Text search across multiple fields if query is provided
    if (query && typeof query === 'string' && query.trim()) {
      searchFilter.$or = [
        { orderId: { $regex: query.trim(), $options: 'i' } },
        { paymentId: { $regex: query.trim(), $options: 'i' } },
        { 'user.firstName': { $regex: query.trim(), $options: 'i' } },
        { 'user.lastName': { $regex: query.trim(), $options: 'i' } },
        { 'user.email': { $regex: query.trim(), $options: 'i' } }
      ];
    }
    
    // Apply additional filters
    if (filters.status && Object.values(OrderStatus).includes(filters.status)) {
      searchFilter.status = filters.status;
    }
    
    if (filters.userId && mongoose.Types.ObjectId.isValid(filters.userId)) {
      searchFilter.user = filters.userId;
    }
    
    if (filters.paymentMethod && ['card', 'upi'].includes(filters.paymentMethod)) {
      searchFilter.method = filters.paymentMethod;
    }
    
    if (filters.minTotal && typeof filters.minTotal === 'number') {
      searchFilter.total = { ...searchFilter.total, $gte: filters.minTotal };
    }
    
    if (filters.maxTotal && typeof filters.maxTotal === 'number') {
      searchFilter.total = { ...searchFilter.total, $lte: filters.maxTotal };
    }
    
    if (filters.startDate) {
      searchFilter.createdAt = { ...searchFilter.createdAt, $gte: new Date(filters.startDate) };
    }
    
    if (filters.endDate) {
      searchFilter.createdAt = { ...searchFilter.createdAt, $lte: new Date(filters.endDate) };
    }
    
    if (filters.hasDelivery !== undefined) {
      if (filters.hasDelivery) {
        searchFilter.delivery = { $exists: true, $ne: null };
      } else {
        searchFilter.delivery = { $exists: false };
      }
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build query
    let query_builder = Order.find(searchFilter)
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    // Add population if requested
    if (populate) {
      query_builder = query_builder
        .populate('user', 'firstName lastName email phone addresses')
        .populate('items.product', 'name price image category description stock')
        .populate('delivery', 'address status estimatedDelivery trackingNumber');
    }
    
    // Execute query
    const orders = await query_builder.lean();
    
    // Get total count for pagination
    const totalOrders = await Order.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalOrders / limit);
    
    // Get aggregated data for the search results
    const aggregatedData = await Order.aggregate([
      { $match: searchFilter },
      {
        $group: {
          _id: null,
          totalValue: { $sum: '$total' },
          averageValue: { $avg: '$total' },
          statusBreakdown: {
            $push: '$status'
          }
        }
      }
    ]);
    
    // Process status breakdown
    let statusCounts = {};
    if (aggregatedData.length > 0 && aggregatedData[0].statusBreakdown) {
      statusCounts = aggregatedData[0].statusBreakdown.reduce((acc: any, status: string) => {
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});
    }
    
    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      aggregation: {
        totalValue: aggregatedData[0]?.totalValue || 0,
        averageValue: aggregatedData[0]?.averageValue || 0,
        statusCounts
      },
      searchQuery: query,
      appliedFilters: filters
    });
    
  } catch (error: any) {
    console.error('Error searching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search orders', details: error.message },
      { status: 500 }
    );
  }
}
