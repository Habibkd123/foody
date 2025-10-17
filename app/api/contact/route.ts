import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ContactMessage from '@/app/models/ContactMessage';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, subject, message } = body || {};

    if (!email || !message) {
      return NextResponse.json({ success: false, error: 'Email and message are required' }, { status: 400 });
    }

    const doc = await ContactMessage.create({ name, email, subject, message });
    return NextResponse.json({ success: true, data: doc }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to submit message' }, { status: 500 });
  }
}
