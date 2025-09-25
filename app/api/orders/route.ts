import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/app/models/Order';
import { OrderStatus } from '@/app/models/User';
import mongoose from 'mongoose';

// GET /api/orders - Fetch all orders with pagination, filtering, and population
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // Build filter object
    const filter: any = {};
    if (status && Object.values(OrderStatus).includes(status as OrderStatus)) {
      filter.status = status;
    }
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      filter.user = userId;
    }
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Fetch orders with population
    const orders = await Order.find(filter)
      .populate('user', 'firstName lastName email phone')
      .populate('items.product', 'name price image category')
      .populate('delivery', 'address status estimatedDelivery')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get total count for pagination
    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / limit);
    
    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
    
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { user, items, total, paymentId, delivery, method, orderId } = body;
    
    // Validation
    if (!user || !mongoose.Types.ObjectId.isValid(user)) {
      return NextResponse.json(
        { success: false, error: 'Valid user ID is required' },
        { status: 400 }
      );
    }
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Items array is required and cannot be empty' },
        { status: 400 }
      );
    }
    
    if (!total || typeof total !== 'number' || total <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid total amount is required' },
        { status: 400 }
      );
    }
    
    if (!paymentId || typeof paymentId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Payment ID is required' },
        { status: 400 }
      );
    }
    
    if (!orderId || typeof orderId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }
    
    // Validate items structure
    for (const item of items) {
      if (!item.product || !mongoose.Types.ObjectId.isValid(item.product)) {
        return NextResponse.json(
          { success: false, error: 'Each item must have a valid product ID' },
          { status: 400 }
        );
      }
      if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
        return NextResponse.json(
          { success: false, error: 'Each item must have a valid quantity' },
          { status: 400 }
        );
      }
      if (!item.price || typeof item.price !== 'number' || item.price <= 0) {
        return NextResponse.json(
          { success: false, error: 'Each item must have a valid price' },
          { status: 400 }
        );
      }
    }
    
    // Create order data
    const orderData: any = {
      user,
      items,
      total,
      paymentId,
      orderId,
      method: method || 'card',
      status: OrderStatus.PENDING
    };
    
    if (delivery && mongoose.Types.ObjectId.isValid(delivery)) {
      orderData.delivery = delivery;
    }
    
    // Create the order
    const newOrder = await Order.create(orderData);
    
    // Populate the created order before returning
    const populatedOrder = await Order.findById(newOrder._id)
      .populate('user', 'firstName lastName email phone')
      .populate('items.product', 'name price image category')
      .populate('delivery', 'address status estimatedDelivery');
    
    return NextResponse.json(
      { success: true, data: populatedOrder },
      { status: 201 }
    );
    
  } catch (error: any) {
    console.error('Error creating order:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Order with this ID already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create order', details: error.message },
      { status: 500 }
    );
  }
}
