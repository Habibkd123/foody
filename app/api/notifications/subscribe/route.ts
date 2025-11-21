import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PushSubscription from '@/app/models/PushSubscription';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { user, subscription } = body || {};
    if (!subscription?.endpoint) {
      return NextResponse.json({ success: false, error: 'Missing subscription.endpoint' }, { status: 400 });
    }

    const payload: any = {
      endpoint: subscription.endpoint,
      p256dh: subscription.keys?.p256dh,
      auth: subscription.keys?.auth,
    };
    if (user && mongoose.Types.ObjectId.isValid(user)) payload.user = user;

    const doc = await PushSubscription.findOneAndUpdate(
      { endpoint: payload.endpoint },
      { $set: payload },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: doc });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Failed to save subscription' }, { status: 500 });
  }
}
