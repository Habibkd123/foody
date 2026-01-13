import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/app/models/Order';
import mongoose from 'mongoose';

// POST /api/orders/refund - Process refund for an order
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { orderId, refundAmount, refundReason } = body;

    // Validate inputs
    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json(
        { success: false, error: 'Valid order ID is required' },
        { status: 400 }
      );
    }

    if (!refundAmount || typeof refundAmount !== 'number' || refundAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid refund amount is required' },
        { status: 400 }
      );
    }

    if (!refundReason || typeof refundReason !== 'string' || refundReason.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Refund reason is required' },
        { status: 400 }
      );
    }

    // Find order
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if refund is possible
    const status = String((order as any).status || '').toLowerCase();
    if (status === 'refunded') {
      return NextResponse.json(
        { success: false, error: 'Refund already processed for this order' },
        { status: 400 }
      );
    }

    const penalty = Number((order as any).cancellationPenaltyAmount || 0);
    const maxRefund = Math.max(0, Number(order.total || 0) - (Number.isFinite(penalty) ? penalty : 0));
    if (refundAmount > maxRefund) {
      return NextResponse.json(
        { success: false, error: `Refund amount cannot exceed ₹${maxRefund}` },
        { status: 400 }
      );
    }

    // Here you would typically integrate with your payment provider (Stripe, PayPal, etc.)
    // For now, we'll simulate the refund process

    // Update order with refund information
    const refundData = {
      refundAmount,
      refundReason,
      refundDate: new Date(),
      refundStatus: 'processed',
      refundId: `REF-${Date.now()}`,
    };

    (order as any).refundAmount = refundData.refundAmount;
    (order as any).refundReason = refundData.refundReason;
    (order as any).refundDate = refundData.refundDate;
    (order as any).refundStatus = refundData.refundStatus;
    (order as any).refundId = refundData.refundId;
    await order.save();

    return NextResponse.json({
      success: true,
      data: {
        refundId: refundData.refundId,
        refundAmount,
        refundReason,
        refundDate: refundData.refundDate,
        orderId: order.orderId,
        status: refundData.refundStatus
      },
      message: 'Refund processed successfully'
    });

  } catch (error: any) {
    console.error('Error processing refund:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process refund', details: error.message },
      { status: 500 }
    );
  }
}
