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
    return NextResponse.json({message:"banner found successfully ",banners:banners,status:true});
  } catch (err) {
    return NextResponse.json({ message: 'Failed to fetch banners',status:false }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const banner = await Banner.create(body);
    return NextResponse.json({message:"banner created successfully",banner:banner,status:true});
  } catch (err) {
    return NextResponse.json({ message: 'Failed to create banner',banner:[],status:false }, { status: 400 });
  }
}
