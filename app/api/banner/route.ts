import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Banner from '@/app/models/Banner';

connectDB(); // connect once when module loads

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    const query = active === 'true' ? { active: true } : {};
    const banners = await Banner.find(query).sort({ createdAt: -1 });
    return NextResponse.json(banners);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const banner = await Banner.create(body);
    return NextResponse.json(banner);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create banner' }, { status: 400 });
  }
}
