import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/app/models/Order';
import mongoose from 'mongoose';

// POST /api/orders/bill - Generate bill/invoice for an order
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { orderId } = body;

    // Validate orderId
    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json(
        { success: false, error: 'Valid order ID is required' },
        { status: 400 }
      );
    }

    // Find order with population
    const order = await Order.findById(orderId)
      .populate('user', 'firstName lastName email phone addresses')
      .populate('items.product', 'name price image category description')
      .populate('delivery', 'address status estimatedDelivery trackingNumber');

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Generate bill/invoice data
    const billData = {
      orderId: order.orderId,
      billNumber: `BILL-${order.orderId}`,
      billDate: new Date().toISOString(),
      customer: {
        name: `${order.user.firstName} ${order.user.lastName}`,
        email: order.user.email,
        phone: order.user.phone,
        address: order.delivery?.address || 'N/A'
      },
      items: order.items.map((item: any) => ({
        name: item.product.name,
        category: item.product.category,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.quantity * item.price
      })),
      subtotal: order.total,
      tax: 0, // You can calculate tax here if needed
      deliveryCharge: 0, // You can add delivery charges if needed
      total: order.total,
      paymentMethod: order.method,
      paymentId: order.paymentId,
      status: order.status,
      delivery: order.delivery ? {
        address: order.delivery.address,
        status: order.delivery.status,
        estimatedDelivery: order.delivery.estimatedDelivery,
        trackingNumber: order.delivery.trackingNumber
      } : null
    };

    return NextResponse.json({
      success: true,
      data: billData,
      message: 'Bill generated successfully'
    });

  } catch (error: any) {
    console.error('Error generating bill:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate bill', details: error.message },
      { status: 500 }
    );
  }
}
