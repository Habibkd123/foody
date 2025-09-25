import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/app/models/Order';
import { OrderStatus } from '@/app/models/User';
import mongoose from 'mongoose';

// GET /api/orders/[id] - Fetch a single order by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { id } = params;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid order ID format' },
        { status: 400 }
      );
    }
    
    // Find order with population
    const order = await Order.findById(id)
      .populate('user', 'firstName lastName email phone addresses')
      .populate('items.product', 'name price image category description stock')
      .populate('delivery', 'address status estimatedDelivery trackingNumber')
      .lean();
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: order
    });
    
  } catch (error: any) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/orders/[id] - Update an existing order
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { id } = params;
    const body = await request.json();
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid order ID format' },
        { status: 400 }
      );
    }
    
    // Check if order exists
    const existingOrder = await Order.findById(id);
    if (!existingOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Prepare update data
    const updateData: any = {};
    
    // Validate and update allowed fields
    if (body.status && Object.values(OrderStatus).includes(body.status)) {
      updateData.status = body.status;
    }
    
    if (body.items && Array.isArray(body.items)) {
      // Validate items structure
      for (const item of body.items) {
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
      updateData.items = body.items;
    }
    
    if (body.total && typeof body.total === 'number' && body.total > 0) {
      updateData.total = body.total;
    }
    
    if (body.paymentId && typeof body.paymentId === 'string') {
      updateData.paymentId = body.paymentId;
    }
    
    if (body.delivery && mongoose.Types.ObjectId.isValid(body.delivery)) {
      updateData.delivery = body.delivery;
    }
    
    if (body.method && ['card', 'upi'].includes(body.method)) {
      updateData.method = body.method;
    }
    
    // Update the order
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('user', 'firstName lastName email phone addresses')
      .populate('items.product', 'name price image category description stock')
      .populate('delivery', 'address status estimatedDelivery trackingNumber');
    
    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: 'Order updated successfully'
    });
    
  } catch (error: any) {
    console.error('Error updating order:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to update order', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/orders/[id] - Delete an order
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { id } = params;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid order ID format' },
        { status: 400 }
      );
    }
    
    // Check if order exists
    const existingOrder = await Order.findById(id);
    if (!existingOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Check if order can be deleted (business logic)
    if (existingOrder.status === OrderStatus.SHIPPED || existingOrder.status === OrderStatus.DELIVERED) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete shipped or delivered orders' },
        { status: 400 }
      );
    }
    
    // Delete the order
    await Order.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully',
      deletedOrderId: id
    });
    
  } catch (error: any) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete order', details: error.message },
      { status: 500 }
    );
  }
}
