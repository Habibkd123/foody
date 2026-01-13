import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Order from '@/app/models/Order';
import Dispute from '@/app/models/Dispute';
import { getRestaurantIdForOrder } from '@/app/lib/invoice';

async function getAuthFromCookies() {
  const cookieStore = await cookies();
  const role = cookieStore.get('user-role')?.value;
  const userId = cookieStore.get('user-id')?.value;

  if (!role || !userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return { ok: false as const, status: 401 as const, error: 'Unauthorized' };
  }

  return { ok: true as const, role: String(role).toLowerCase(), userId };
}

function normalizeEvidenceUrls(input: any): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((x) => (typeof x === 'string' ? x.trim() : ''))
    .filter(Boolean)
    .slice(0, 6);
}

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = (searchParams.get('status') || '').trim().toLowerCase();

    const filter: any = {};
    if (status) filter.status = status;

    if (auth.role === 'user') {
      filter.user = auth.userId;
    } else if (auth.role === 'restaurant') {
      filter.restaurantId = auth.userId;
    } else if (auth.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const disputes = await Dispute.find(filter)
      .sort({ createdAt: -1 })
      .populate('order', 'orderId total status createdAt')
      .lean();

    return NextResponse.json({ success: true, data: disputes });
  } catch (error: any) {
    console.error('Failed to fetch disputes:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to fetch disputes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    if (auth.role !== 'user') {
      return NextResponse.json({ success: false, error: 'Only customers can raise disputes' }, { status: 403 });
    }

    const body = await req.json();
    const orderId = body?.orderId;
    const reason = typeof body?.reason === 'string' ? body.reason.trim() : '';
    const description = typeof body?.description === 'string' ? body.description.trim() : '';
    const evidenceUrls = normalizeEvidenceUrls(body?.evidenceUrls);

    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json({ success: false, error: 'Valid orderId is required' }, { status: 400 });
    }
    if (!reason) {
      return NextResponse.json({ success: false, error: 'Reason is required' }, { status: 400 });
    }
    if (!description) {
      return NextResponse.json({ success: false, error: 'Description is required' }, { status: 400 });
    }

    await connectDB();

    const order: any = await Order.findById(orderId).select('user items').lean();
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    if (String(order.user) !== String(auth.userId)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const restaurantId = await getRestaurantIdForOrder(orderId);
    console.log("dtaa",restaurantId)
    if (!restaurantId ) {
      return NextResponse.json({ success: false, error: 'Invalid restaurant for order' }, { status: 400 });
    }

    const existing: any = await Dispute.findOne({ order: orderId, status: { $in: ['open', 'awaiting_restaurant', 'awaiting_customer', 'under_review'] } }).lean();
    if (existing) {
      return NextResponse.json({ success: false, error: 'A dispute is already open for this order' }, { status: 400 });
    }

    const evidence = evidenceUrls.map((url) => ({
      url,
      uploadedByRole: 'user' as const,
      uploadedBy: new mongoose.Types.ObjectId(auth.userId),
      uploadedAt: new Date(),
    }));

    const created = await Dispute.create({
      order: new mongoose.Types.ObjectId(orderId),
      user: new mongoose.Types.ObjectId(auth.userId),
      restaurantId: new mongoose.Types.ObjectId(restaurantId),
      status: 'awaiting_restaurant',
      reason,
      description,
      evidence,
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create dispute:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to create dispute' }, { status: 500 });
  }
}
