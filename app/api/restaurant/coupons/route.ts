import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/User';
import Coupon from '@/app/models/Coupon';

async function getRestaurantUser() {
  const cookieStore = await cookies();
  const role = cookieStore.get('user-role')?.value;
  const userId = cookieStore.get('user-id')?.value;

  if (!role || role !== 'restaurant' || !userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return { ok: false as const, status: 401 as const, error: 'Unauthorized' };
  }

  await connectDB();
  const user: any = await User.findById(userId).select('role restaurant');
  if (!user || user.role !== 'restaurant') {
    return { ok: false as const, status: 401 as const, error: 'Unauthorized' };
  }

  if (!user.restaurant || user.restaurant.status !== 'approved') {
    return { ok: false as const, status: 403 as const, error: 'Restaurant not approved' };
  }

  return { ok: true as const, userId };
}

export async function GET(request: NextRequest) {
  try {
    const auth = await getRestaurantUser();
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim();
    const active = (searchParams.get('active') || '').trim();

    const filter: any = { restaurantId: auth.userId };
    if (q) filter.code = { $regex: q, $options: 'i' };
    if (active === 'true') filter.active = true;
    if (active === 'false') filter.active = false;

    const coupons = await Coupon.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: coupons });
  } catch (error: any) {
    console.error('Failed to fetch restaurant coupons:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getRestaurantUser();
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await request.json();

    const code = typeof body?.code === 'string' ? body.code.trim().toUpperCase() : '';
    const type = body?.type === 'percent' || body?.type === 'flat' ? body.type : null;
    const value = Number(body?.value);
    const minTotal = body?.minTotal === undefined ? undefined : Number(body?.minTotal);
    const maxDiscount = body?.maxDiscount === undefined ? undefined : Number(body?.maxDiscount);
    const startsAt = body?.startsAt ? new Date(body.startsAt) : undefined;
    const endsAt = body?.endsAt ? new Date(body.endsAt) : undefined;
    const perUserLimit = body?.perUserLimit === undefined ? undefined : Number(body?.perUserLimit);
    const usageLimit = body?.usageLimit === undefined ? undefined : Number(body?.usageLimit);
    const active = typeof body?.active === 'boolean' ? body.active : true;

    if (!code) {
      return NextResponse.json({ success: false, error: 'code is required' }, { status: 400 });
    }
    if (!type) {
      return NextResponse.json({ success: false, error: 'type must be percent or flat' }, { status: 400 });
    }
    if (!Number.isFinite(value) || value <= 0) {
      return NextResponse.json({ success: false, error: 'value must be a positive number' }, { status: 400 });
    }
    if (type === 'percent' && value > 100) {
      return NextResponse.json({ success: false, error: 'percent value must be <= 100' }, { status: 400 });
    }
    if (minTotal !== undefined && (!Number.isFinite(minTotal) || minTotal < 0)) {
      return NextResponse.json({ success: false, error: 'minTotal must be a non-negative number' }, { status: 400 });
    }
    if (maxDiscount !== undefined && (!Number.isFinite(maxDiscount) || maxDiscount < 0)) {
      return NextResponse.json({ success: false, error: 'maxDiscount must be a non-negative number' }, { status: 400 });
    }
    if (perUserLimit !== undefined && (!Number.isFinite(perUserLimit) || perUserLimit < 1)) {
      return NextResponse.json({ success: false, error: 'perUserLimit must be >= 1' }, { status: 400 });
    }
    if (usageLimit !== undefined && (!Number.isFinite(usageLimit) || usageLimit < 1)) {
      return NextResponse.json({ success: false, error: 'usageLimit must be >= 1' }, { status: 400 });
    }
    if (startsAt && Number.isNaN(startsAt.getTime())) {
      return NextResponse.json({ success: false, error: 'startsAt is invalid' }, { status: 400 });
    }
    if (endsAt && Number.isNaN(endsAt.getTime())) {
      return NextResponse.json({ success: false, error: 'endsAt is invalid' }, { status: 400 });
    }

    const created = await Coupon.create({
      restaurantId: auth.userId,
      code,
      type,
      value,
      minTotal,
      maxDiscount,
      startsAt,
      endsAt,
      usageLimit,
      perUserLimit,
      active,
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    if (error?.code === 11000) {
      return NextResponse.json({ success: false, error: 'Coupon code already exists' }, { status: 409 });
    }
    console.error('Failed to create restaurant coupon:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create coupon' },
      { status: 500 }
    );
  }
}
