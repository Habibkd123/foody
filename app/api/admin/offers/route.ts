import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Offer from '@/app/models/Offer';
import Product from '@/app/models/Product';

function requireAdminSecret(req: NextRequest) {
  const header = req.headers.get('x-admin-secret');
  const envSecret = process.env.ADMIN_SECRET;
  if (!envSecret) return true; // allow if not configured
  return header === envSecret;
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (id) {
      const offer = await Offer.findById(id).lean();
      if (!offer) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
      return NextResponse.json({ success: true, data: offer });
    }

    const page = Number(searchParams.get('page') || '1');
    const limit = Number(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const q: any = {};
    if (searchParams.get('active')) q.active = searchParams.get('active') === 'true';

    const [offers, total] = await Promise.all([
      Offer.find(q).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Offer.countDocuments(q)
    ]);

    return NextResponse.json({ success: true, data: { offers, total, page, pages: Math.ceil(total/limit) } });
  } catch (e: any) {
    console.error('GET /admin/offers', e);
    return NextResponse.json({ success: false, message: e.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!requireAdminSecret(req)) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const body = await req.json();
    const offer = await Offer.create(body);
    return NextResponse.json({ success: true, data: offer }, { status: 201 });
  } catch (e: any) {
    console.error('POST /admin/offers', e);
    return NextResponse.json({ success: false, message: e.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!requireAdminSecret(req)) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const body = await req.json();
    const { id, ...data } = body || {};
    if (!id) return NextResponse.json({ success: false, message: 'id required' }, { status: 400 });
    const updated = await Offer.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json({ success: true, data: updated });
  } catch (e: any) {
    console.error('PUT /admin/offers', e);
    return NextResponse.json({ success: false, message: e.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!requireAdminSecret(req)) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: 'id required' }, { status: 400 });
    await Offer.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('DELETE /admin/offers', e);
    return NextResponse.json({ success: false, message: e.message || 'Server error' }, { status: 500 });
  }
}
