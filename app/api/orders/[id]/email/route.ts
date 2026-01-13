import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/app/models/Order';
import mongoose from 'mongoose';

// POST /api/orders/[id]/email - Send email notification for order
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { type = 'order_update' } = body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid order ID format' },
        { status: 400 }
      );
    }

    // Find order with population
    const order = await Order.findById(id)
      .populate('user', 'firstName lastName email phone')
      .populate('items.product', 'name price')
      .populate('delivery', 'address status estimatedDelivery trackingNumber');

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Here you would integrate with your email service (SendGrid, AWS SES, etc.)
    // For now, we'll simulate email sending

    const emailData = {
      to: order.user.email,
      subject: `Order Update - ${order.orderId}`,
      orderId: order.orderId,
      status: order.status,
      customerName: `${order.user.firstName} ${order.user.lastName}`,
      type
    };

    // Simulate email sending
    console.log('Email would be sent:', emailData);

    // In a real implementation, you would:
    // 1. Use an email service like SendGrid, AWS SES, or Nodemailer
    // 2. Generate email templates based on the type
    // 3. Send the email

    return NextResponse.json({
      success: true,
      data: {
        emailSent: true,
        recipient: order.user.email,
        type
      },
      message: 'Email notification sent successfully'
    });

  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email', details: error.message },
      { status: 500 }
    );
  }
}

