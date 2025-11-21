import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Coupon, { ICoupon } from '@/app/models/Coupon';
import CouponRedemption from '@/app/models/CouponRedemption';
import mongoose from 'mongoose';
import { computeCouponDiscount, isCouponActiveNow } from '@/app/lib/coupons';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { code, cartTotal, userId } = body || {};

    if (!code || typeof cartTotal !== 'number') {
      return NextResponse.json({ success: false, error: 'code and cartTotal required' }, { status: 400 });
    }

    const coupon = await Coupon.findOne({ code: String(code).toUpperCase() })
      .select('code type value minTotal maxDiscount startsAt endsAt usageLimit perUserLimit active')
      .lean<ICoupon & { _id: mongoose.Types.ObjectId }>();
    if (!coupon) return NextResponse.json({ success: false, error: 'Invalid coupon' }, { status: 404 });

    if (!isCouponActiveNow(coupon)) {
      return NextResponse.json({ success: false, error: 'Coupon not active' }, { status: 400 });
    }

    // Check global usage limit if tracked elsewhere (not incremented here)
    // Per-user limit via CouponRedemption
    if (coupon.perUserLimit && userId && mongoose.Types.ObjectId.isValid(userId)) {
      const red = await CouponRedemption.findOne({ coupon: (coupon as any)._id, user: userId }).lean<{ count: number } | null>();
      const used = red?.count || 0;
      if (used >= coupon.perUserLimit) {
        return NextResponse.json({ success: false, error: 'Per-user limit reached' }, { status: 400 });
      }
    }

    if (coupon.minTotal && cartTotal < coupon.minTotal) {
      return NextResponse.json({ success: false, error: `Minimum order total is ${coupon.minTotal}` }, { status: 400 });
    }

    const discount = computeCouponDiscount(coupon as ICoupon, cartTotal);
    return NextResponse.json({ success: true, data: { code: coupon.code, discount } });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Failed to validate coupon' }, { status: 500 });
  }
}
