import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Setting from '@/app/models/Setting';

// GET: fetch current settings (active payment gateway)
export async function GET() {
  await connectDB();
  const setting = await Setting.findOne().lean();
  return NextResponse.json({ success: true, data: setting || { paymentGateway: 'stripe' } });
}

// POST: update settings { paymentGateway: 'stripe' | 'razorpay' }
export async function POST(req: NextRequest) {
  await connectDB();
  const { paymentGateway } = await req.json();
  if (!['stripe', 'razorpay'].includes(paymentGateway)) {
    return NextResponse.json({ success: false, error: 'Invalid gateway' }, { status: 400 });
  }
  const updated = await Setting.findOneAndUpdate(
    {},
    { paymentGateway },
    { new: true, upsert: true }
  ).lean();
  return NextResponse.json({ success: true, data: updated });
}
