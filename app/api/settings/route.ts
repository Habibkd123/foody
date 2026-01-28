import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Setting from '@/app/models/Setting';

// GET: fetch current settings
export async function GET() {
  await connectDB();
  const setting = await Setting.findOne().lean();
  return NextResponse.json({ success: true, data: setting || { paymentGateway: 'stripe', reminders: [] } });
}

// POST: update settings
export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const { paymentGateway, reminders } = body;

  const updateDoc: any = {};
  if (paymentGateway) {
    if (!['stripe', 'razorpay'].includes(paymentGateway)) {
      return NextResponse.json({ success: false, error: 'Invalid gateway' }, { status: 400 });
    }
    updateDoc.paymentGateway = paymentGateway;
  }

  if (reminders) {
    updateDoc.reminders = reminders;
  }

  const updated = await Setting.findOneAndUpdate(
    {},
    updateDoc,
    { new: true, upsert: true }
  ).lean();
  return NextResponse.json({ success: true, data: updated });
}
