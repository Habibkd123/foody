import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import FAQ from '@/app/models/FAQ';

export async function GET(_request: NextRequest) {
  try {
    await connectDB();
    const faqs = await FAQ.find({}).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: faqs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to load FAQs' }, { status: 500 });
  }
}
