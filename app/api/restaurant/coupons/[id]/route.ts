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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getRestaurantUser();
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid coupon id' }, { status: 400 });
    }

    const coupon: any = await Coupon.findOne({ _id: id, restaurantId: auth.userId });
    if (!coupon) {
      return NextResponse.json({ success: false, error: 'Coupon not found' }, { status: 404 });
    }

    const body = await req.json();

    if (typeof body?.code === 'string' && body.code.trim()) {
      coupon.code = body.code.trim().toUpperCase();
    }

    if (body?.type === 'percent' || body?.type === 'flat') {
      coupon.type = body.type;
    }

    if (body?.value !== undefined) {
      const value = Number(body.value);
      if (!Number.isFinite(value) || value <= 0) {
        return NextResponse.json({ success: false, error: 'value must be a positive number' }, { status: 400 });
      }
      if (coupon.type === 'percent' && value > 100) {
        return NextResponse.json({ success: false, error: 'percent value must be <= 100' }, { status: 400 });
      }
      coupon.value = value;
    }

    if (body?.minTotal !== undefined) {
      const minTotal = body.minTotal === null ? undefined : Number(body.minTotal);
      if (minTotal !== undefined && (!Number.isFinite(minTotal) || minTotal < 0)) {
        return NextResponse.json({ success: false, error: 'minTotal must be a non-negative number' }, { status: 400 });
      }
      coupon.minTotal = minTotal;
    }

    if (body?.maxDiscount !== undefined) {
      const maxDiscount = body.maxDiscount === null ? undefined : Number(body.maxDiscount);
      if (maxDiscount !== undefined && (!Number.isFinite(maxDiscount) || maxDiscount < 0)) {
        return NextResponse.json({ success: false, error: 'maxDiscount must be a non-negative number' }, { status: 400 });
      }
      coupon.maxDiscount = maxDiscount;
    }

    if (body?.startsAt !== undefined) {
      if (body.startsAt === null || body.startsAt === '') {
        coupon.startsAt = undefined;
      } else {
        const dt = new Date(body.startsAt);
        if (Number.isNaN(dt.getTime())) {
          return NextResponse.json({ success: false, error: 'startsAt is invalid' }, { status: 400 });
        }
        coupon.startsAt = dt;
      }
    }

    if (body?.endsAt !== undefined) {
      if (body.endsAt === null || body.endsAt === '') {
        coupon.endsAt = undefined;
      } else {
        const dt = new Date(body.endsAt);
        if (Number.isNaN(dt.getTime())) {
          return NextResponse.json({ success: false, error: 'endsAt is invalid' }, { status: 400 });
        }
        coupon.endsAt = dt;
      }
    }

    if (body?.perUserLimit !== undefined) {
      const perUserLimit = body.perUserLimit === null ? undefined : Number(body.perUserLimit);
      if (perUserLimit !== undefined && (!Number.isFinite(perUserLimit) || perUserLimit < 1)) {
        return NextResponse.json({ success: false, error: 'perUserLimit must be >= 1' }, { status: 400 });
      }
      coupon.perUserLimit = perUserLimit;
    }

    if (body?.usageLimit !== undefined) {
      const usageLimit = body.usageLimit === null ? undefined : Number(body.usageLimit);
      if (usageLimit !== undefined && (!Number.isFinite(usageLimit) || usageLimit < 1)) {
        return NextResponse.json({ success: false, error: 'usageLimit must be >= 1' }, { status: 400 });
      }
      coupon.usageLimit = usageLimit;
    }

    if (typeof body?.active === 'boolean') {
      coupon.active = body.active;
    }

    await coupon.save();
    return NextResponse.json({ success: true, data: coupon });
  } catch (error: any) {
    if (error?.code === 11000) {
      return NextResponse.json({ success: false, error: 'Coupon code already exists' }, { status: 409 });
    }
    console.error('Failed to update restaurant coupon:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update coupon' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getRestaurantUser();
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid coupon id' }, { status: 400 });
    }

    const deleted = await Coupon.findOneAndDelete({ _id: id, restaurantId: auth.userId });
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Coupon not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete restaurant coupon:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to delete coupon' }, { status: 500 });
  }
}

