import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
  const { amount, currency = 'INR', receipt } = await req.json();
  if (!amount || amount <= 0) return NextResponse.json({ success: false, error: 'Invalid amount' }, { status: 400 });

  const key_id = process.env.RAZORPAY_KEY_ID as string;
  const key_secret = process.env.RAZORPAY_KEY_SECRET as string;
  if (!key_id || !key_secret) {
    return NextResponse.json({ success: false, error: 'Missing Razorpay env vars' }, { status: 500 });
  }

  const instance = new Razorpay({ key_id, key_secret });

  try {
    const order = await instance.orders.create({
      amount: Math.round(amount * 100), // INR to paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    });
    return NextResponse.json({ success: true, order });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Failed to create Razorpay order' }, { status: 500 });
  }
}
