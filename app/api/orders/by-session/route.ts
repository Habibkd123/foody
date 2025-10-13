import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/app/models/Order';

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const sessionId = body.sessionId;

  if (!sessionId) return NextResponse.json({ success: false, error: "Missing sessionId" }, { status: 400 });

  const order = await Order.findOne({ paymentId: sessionId }).lean();
  if (!order) return NextResponse.json({ success: false, error: "Order not found." }, { status: 404 });

  return NextResponse.json({ success: true, data: order });
}

