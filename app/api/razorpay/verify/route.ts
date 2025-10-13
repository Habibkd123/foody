import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import Order from '@/app/models/Order';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  const key_secret = process.env.RAZORPAY_KEY_SECRET as string;
  if (!key_secret) {
    return NextResponse.json({ success: false, error: 'Missing Razorpay env vars' }, { status: 500 });
  }

  const body = await req.json();
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, user, items, total, method = 'razorpay', address, orderId } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ success: false, error: 'Missing payment verification data' }, { status: 400 });
  }

  const generated = crypto
    .createHmac('sha256', key_secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generated !== razorpay_signature) {
    return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
  }

  try {
    await connectDB();

    // Basic validations (mirror /api/orders/route.ts expectations as much as possible)
    if (!user || !mongoose.Types.ObjectId.isValid(user)) {
      return NextResponse.json({ success: false, error: 'Valid user ID is required' }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Items array is required and cannot be empty' }, { status: 400 });
    }
    if (!total || typeof total !== 'number' || total <= 0) {
      return NextResponse.json({ success: false, error: 'Valid total amount is required' }, { status: 400 });
    }

    // Construct order payload directly (server trusts amounts from DB pricing on other flows; here we accept client-provided prices but we could re-fetch if needed)
    const orderPayload: any = {
      user,
      items: items.map((i: any) => ({ product: i.product, quantity: i.quantity, price: i.price })),
      total,
      paymentId: razorpay_payment_id,
      orderId: orderId || razorpay_order_id,
      method,
      status: 'PENDING',
      address,
    };

    const created = await Order.create(orderPayload);

    return NextResponse.json({ success: true, data: { orderId: created.orderId, paymentId: created.paymentId } });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Failed to record order' }, { status: 500 });
  }
}
