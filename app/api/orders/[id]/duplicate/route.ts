import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/app/models/Order';
import mongoose from 'mongoose';

// POST /api/orders/[id]/duplicate - Duplicate an existing order
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid order ID format' },
        { status: 400 }
      );
    }

    // Find the original order
    const originalOrder = await Order.findById(id);
    if (!originalOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Create duplicate order data
    const duplicateData = {
      user: originalOrder.user,
      items: originalOrder.items,
      total: originalOrder.total,
      paymentId: null, // Will need new payment
      orderId: `DUP-${Date.now()}`, // Generate new order ID
      method: originalOrder.method,
      status: 'pending', // Reset to pending
      delivery: null, // Will need new delivery if applicable
      tax: originalOrder.tax,
      shipping: originalOrder.shipping,
      discount: originalOrder.discount,
      notes: `Duplicated from order ${originalOrder.orderId}`
    };

    // Create the duplicate order
    const duplicateOrder = await Order.create(duplicateData);

    // Populate the created order
    const populatedOrder = await Order.findById(duplicateOrder._id)
      .populate('user', 'firstName lastName email phone addresses')
      .populate('items.product', 'name price image category')
      .populate('delivery', 'address status estimatedDelivery trackingNumber');

    return NextResponse.json({
      success: true,
      data: {
        newOrderId: duplicateOrder._id,
        newOrderNumber: duplicateOrder.orderId,
        originalOrderId: id
      },
      message: 'Order duplicated successfully'
    });

  } catch (error: any) {
    console.error('Error duplicating order:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Duplicate order ID generated, please try again' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to duplicate order', details: error.message },
      { status: 500 }
    );
  }
}

