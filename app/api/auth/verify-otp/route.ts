import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP } from '@/app/api/auth/otpStore';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) {
      return NextResponse.json({ success: false, message: 'Email and OTP are required' }, { status: 400 });
    }

    const ok = verifyOTP(email, otp);
    if (!ok) {
      return NextResponse.json({ success: false, message: 'Invalid or expired OTP' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Email verified' });
  } catch (e) {
    console.error('verify-otp error', e);
    return NextResponse.json({ success: false, message: 'Verification failed' }, { status: 500 });
  }
}
