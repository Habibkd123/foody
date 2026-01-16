import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { setOTP } from '@/app/api/auth/otpStore';

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
  });
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { email, name = 'there' } = await req.json();
    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    const otp = generateOTP();
    setOTP(email, otp);

    const transporter = createTransporter();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    try {
      await transporter.sendMail({
        from: `Gro-Delivery Auth <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Gro-Delivery verification code',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;background:#fff">
            <h2 style="margin:0 0 8px">Verify your email</h2>
            <p style="margin:0 0 16px;color:#444">Hi ${name}, use the code below to verify your email for Gro-Delivery.</p>
            <div style="font-size:32px;letter-spacing:6px;font-weight:700;background:#f7f7f7;padding:16px 24px;border-radius:8px;text-align:center">${otp}</div>
            <p style="color:#666;margin-top:16px">This code expires in 5 minutes. If you didn’t request this, you can ignore this email.</p>
            <p style="margin-top:24px"><a href="${appUrl}/login" style="color:#f97316;text-decoration:none">Return to app</a></p>
          </div>
        `,
      });
      return NextResponse.json({ success: true, message: 'OTP sent' });
    } catch (emailError: any) {
      console.error('Failed to send email via nodemailer:', emailError);
      // Fallback for development/testing when email server is not configured
      console.log('---------------------------------------------------');
      console.log('⚠️ EMAIL SERVICE FAILED - USING DEV FALLBACK');
      console.log(`📧 TO: ${email}`);
      console.log(`🔑 OTP: ${otp}`);
      console.log('---------------------------------------------------');
      return NextResponse.json({ success: true, message: 'OTP sent (Dev Mode: Check Server Logs)' });
    }
  } catch (e: any) {
    console.error('send-otp error', e);
    return NextResponse.json({ success: false, message: e.message || 'Failed to send OTP' }, { status: 500 });
  }
}
