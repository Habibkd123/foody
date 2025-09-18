import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Banner from '@/app/models/Banner';

connectDB(); // connect once when module loads

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    const type = searchParams.get('type');
    const query: Record<string, any> = {};
    if (active === 'true') query.active = true;
    if (type) query.type = type;
    const banners = await Banner.find(query).sort({ createdAt: -1 });
    console.log("Banner data:", banners);
    return NextResponse.json(banners);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Banner data:", body);
    const banner = await Banner.create(body);
    console.log("Banner created:", banner);
    return NextResponse.json(banner);
  } catch (err) {
    console.log("Banner created:", err);
    return NextResponse.json({ error: 'Failed to create banner' }, { status: 400 });
  }
}
