import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/app/models/Order';
import { OrderStatus } from '@/app/models/User';
import mongoose from 'mongoose';

// POST /api/orders/bulk - Bulk operations on orders
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { operation, orderIds, updateData } = body;
    
    if (!operation || typeof operation !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Operation type is required' },
        { status: 400 }
      );
    }
    
    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order IDs array is required and cannot be empty' },
        { status: 400 }
      );
    }
    
    // Validate all order IDs
    for (const id of orderIds) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { success: false, error: `Invalid order ID format: ${id}` },
          { status: 400 }
        );
      }
    }
    
    let result;
    
    switch (operation.toLowerCase()) {
      case 'update_status':
        if (!updateData?.status || !Object.values(OrderStatus).includes(updateData.status)) {
          return NextResponse.json(
            { success: false, error: 'Valid status is required for update_status operation' },
            { status: 400 }
          );
        }
        
        result = await Order.updateMany(
          { _id: { $in: orderIds } },
          { $set: { status: updateData.status } }
        );
        
        return NextResponse.json({
          success: true,
          message: `Updated ${result.modifiedCount} orders to status: ${updateData.status}`,
          data: {
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount
          }
        });
        
      case 'delete':
        // Check if any orders are shipped or delivered (cannot be deleted)
        const ordersToDelete = await Order.find({
          _id: { $in: orderIds },
          status: { $in: [OrderStatus.SHIPPED, OrderStatus.DELIVERED] }
        });
        
        if (ordersToDelete.length > 0) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Cannot delete shipped or delivered orders',
              conflictingOrders: ordersToDelete.map(order => order._id)
            },
            { status: 400 }
          );
        }
        
        result = await Order.deleteMany({ _id: { $in: orderIds } });
        
        return NextResponse.json({
          success: true,
          message: `Deleted ${result.deletedCount} orders`,
          data: {
            deletedCount: result.deletedCount
          }
        });
        
      case 'update_payment_method':
        if (!updateData?.method || !['card', 'upi'].includes(updateData.method)) {
          return NextResponse.json(
            { success: false, error: 'Valid payment method (card/upi) is required' },
            { status: 400 }
          );
        }
        
        result = await Order.updateMany(
          { _id: { $in: orderIds } },
          { $set: { method: updateData.method } }
        );
        
        return NextResponse.json({
          success: true,
          message: `Updated ${result.modifiedCount} orders to payment method: ${updateData.method}`,
          data: {
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount
          }
        });
        
      case 'assign_delivery':
        if (!updateData?.delivery || !mongoose.Types.ObjectId.isValid(updateData.delivery)) {
          return NextResponse.json(
            { success: false, error: 'Valid delivery ID is required' },
            { status: 400 }
          );
        }
        
        result = await Order.updateMany(
          { _id: { $in: orderIds } },
          { $set: { delivery: updateData.delivery } }
        );
        
        return NextResponse.json({
          success: true,
          message: `Assigned delivery to ${result.modifiedCount} orders`,
          data: {
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount
          }
        });
        
      default:
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid operation. Supported operations: update_status, delete, update_payment_method, assign_delivery' 
          },
          { status: 400 }
        );
    }
    
  } catch (error: any) {
    console.error('Error performing bulk operation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to perform bulk operation', details: error.message },
      { status: 500 }
    );
  }
}

// GET /api/orders/bulk - Get multiple orders by IDs
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids');
    
    if (!idsParam) {
      return NextResponse.json(
        { success: false, error: 'Order IDs parameter is required' },
        { status: 400 }
      );
    }
    
    const orderIds = idsParam.split(',');
    
    // Validate all order IDs
    for (const id of orderIds) {
      if (!mongoose.Types.ObjectId.isValid(id.trim())) {
        return NextResponse.json(
          { success: false, error: `Invalid order ID format: ${id}` },
          { status: 400 }
        );
      }
    }
    
    // Fetch orders
    const orders = await Order.find({
      _id: { $in: orderIds.map(id => id.trim()) }
    })
      .populate('user', 'firstName lastName email phone')
      .populate('items.product', 'name price image category')
      .populate('delivery', 'address status estimatedDelivery')
      .lean();
    
    return NextResponse.json({
      success: true,
      data: orders,
      found: orders.length,
      requested: orderIds.length
    });
    
  } catch (error: any) {
    console.error('Error fetching bulk orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders', details: error.message },
      { status: 500 }
    );
  }
}
