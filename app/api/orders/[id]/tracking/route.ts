import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/app/models/Order';
import Delivery from '@/app/models/Delivery';
import mongoose from 'mongoose';

// PUT /api/orders/[id]/tracking - Update tracking number for an order
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { trackingNumber } = body;
console.log("data",id)
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid order ID format' },
        { status: 400 }
      );
    }

    // Validate tracking number
    if (!trackingNumber || typeof trackingNumber !== 'string' || trackingNumber.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Valid tracking number is required' },
        { status: 400 }
      );
    }

    // Find the order
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Find and update the delivery
    const updatedDelivery = await Delivery.findOneAndUpdate(
      { order: id },
      { trackingNumber: trackingNumber.trim() },
      { new: true, runValidators: true }
    );

    if (!updatedDelivery) {
      return NextResponse.json(
        { success: false, error: 'Delivery record not found for this order' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        trackingNumber: updatedDelivery.trackingNumber,
        orderId: id
      },
      message: 'Tracking number updated successfully'
    });

  } catch (error: any) {
    console.error('Error updating tracking number:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update tracking number', details: error.message },
      { status: 500 }
    );
  }
}

