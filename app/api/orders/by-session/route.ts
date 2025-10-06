// Example API route: /api/orders/by-session?sessionId=...
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/app/models/Order';

export async function GET(request: NextRequest) {
  await connectDB();
  const sessionId = request.nextUrl.searchParams.get('sessionId');
  if (!sessionId) {
    return NextResponse.json({ success: false, error: "Missing sessionId" }, { status: 400 });
  }
  const order = await Order.findOne({ paymentId: sessionId }).lean();
  if (!order) {
    return NextResponse.json({ success: false, error: "Order not found." }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: order });
}
