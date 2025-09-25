import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/app/models/Order';
import { OrderStatus } from '@/app/models/User';
import mongoose from 'mongoose';

// GET /api/orders/stats - Get order statistics
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Build filter object
    const filter: any = {};
    
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      filter.user = userId;
    }
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }
    
    // Aggregate statistics
    const stats = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          averageOrderValue: { $avg: '$total' },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$status', OrderStatus.PENDING] }, 1, 0] }
          },
          paidOrders: {
            $sum: { $cond: [{ $eq: ['$status', OrderStatus.PAID] }, 1, 0] }
          },
          shippedOrders: {
            $sum: { $cond: [{ $eq: ['$status', OrderStatus.SHIPPED] }, 1, 0] }
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ['$status', OrderStatus.DELIVERED] }, 1, 0] }
          },
          canceledOrders: {
            $sum: { $cond: [{ $eq: ['$status', OrderStatus.CANCELED] }, 1, 0] }
          }
        }
      }
    ]);
    
    // Get orders by status
    const ordersByStatus = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: '$total' }
        }
      }
    ]);
    
    // Get orders by payment method
    const ordersByMethod = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$method',
          count: { $sum: 1 },
          totalValue: { $sum: '$total' }
        }
      }
    ]);
    
    // Get daily order trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const dailyTrends = await Order.aggregate([
      { 
        $match: { 
          ...filter,
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          orderCount: { $sum: 1 },
          revenue: { $sum: '$total' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);
    
    const result = {
      overview: stats[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        pendingOrders: 0,
        paidOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
        canceledOrders: 0
      },
      ordersByStatus,
      ordersByMethod,
      dailyTrends
    };
    
    return NextResponse.json({
      success: true,
      data: result
    });
    
  } catch (error: any) {
    console.error('Error fetching order statistics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order statistics', details: error.message },
      { status: 500 }
    );
  }
}
