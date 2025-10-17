import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Feedback from '@/app/models/Feedback';
import Order from '@/app/models/Order';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { user, orderId, rating, comment, contactEmail } = body || {};

    let order: mongoose.Types.ObjectId | undefined;
    if (orderId && typeof orderId === 'string') {
      const orderDoc = await Order.findOne({ orderId }).select('_id');
      if (orderDoc) order = orderDoc._id;
    }

    const doc = await Feedback.create({
      user: user && mongoose.Types.ObjectId.isValid(user) ? user : undefined,
      order,
      rating,
      comment,
      contactEmail,
    });

    return NextResponse.json({ success: true, data: doc }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to submit feedback' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const user = searchParams.get('user');
    const byOrderId = searchParams.get('orderId');

    const filter: any = {};
    if (user && mongoose.Types.ObjectId.isValid(user)) filter.user = user;
    if (byOrderId) {
      const orderDoc = await Order.findOne({ orderId: byOrderId }).select('_id');
      if (orderDoc) filter.order = orderDoc._id;
    }

    const items = await Feedback.find(filter)
      .populate('user', 'firstName lastName email')
      .populate('order', 'orderId total createdAt')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: items });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch feedback' }, { status: 500 });
  }
}
