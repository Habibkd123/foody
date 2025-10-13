import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/app/models/Order';
import mongoose from 'mongoose';

// PUT /api/orders/[id]/notes - Update order notes
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { notes } = body;
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid order ID format' },
        { status: 400 }
      );
    }

    // Validate notes
    if (typeof notes !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Notes must be a string' },
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
    console.log("notes",existingOrder)
    // Update the order notes
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { notes  },
      { new: true, runValidators: true,upsert:true }
    )
      .populate('user', 'firstName lastName email phone addresses')
      .populate('items.product',)
      .populate('delivery', 'address status estimatedDelivery trackingNumber');
      console.log("notes",updatedOrder)

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: 'Notes updated successfully'
    });

  } catch (error: any) {
    console.error('Error updating order notes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update notes', details: error.message },
      { status: 500 }
    );
  }
}
