import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import Order from '@/app/models/Order';
import mongoose from 'mongoose';
import Product from '@/app/models/Product';
import User from '@/app/models/User';
import Coupon from '@/app/models/Coupon';
import CouponRedemption from '@/app/models/CouponRedemption';
import { computeCouponDiscount, isCouponActiveNow } from '@/app/lib/coupons';
import { getEffectiveRestaurantOpen } from '@/app/lib/restaurant-timing';
import { haversineKm, parseLatLng } from '@/app/lib/delivery-radius';
import { getOfflineModeState } from '@/app/lib/offline-mode';

type Adjustment = { type: 'percent' | 'fixed'; value: number };

function getKolkataParts(date: Date) {
  const dtf = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = dtf.formatToParts(date);
  const map: any = {};
  for (const p of parts) {
    if (p.type !== 'literal') map[p.type] = p.value;
  }
  return {
    ymd: `${map.year}-${map.month}-${map.day}`,
    hm: `${map.hour}:${map.minute}`,
    weekday: new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', weekday: 'short' }).format(date),
  };
}

function inTimeWindow(hm: string, start: string, end: string) {
  const toMin = (v: string) => {
    const [h, m] = v.split(':').map(Number);
    return h * 60 + m;
  };
  const x = toMin(hm);
  const s = toMin(start);
  const e = toMin(end);
  if (Number.isNaN(x) || Number.isNaN(s) || Number.isNaN(e)) return false;
  if (s <= e) return x >= s && x < e;
  return x >= s || x < e;
}

function applyAdjustment(base: number, adj?: Adjustment) {
  if (!adj) return base;
  const v = Number(adj.value || 0);
  if (!Number.isFinite(v) || v === 0) return base;
  if (adj.type === 'fixed') return Math.max(0, base + v);
  return Math.max(0, base + (base * v) / 100);
}

function pickDynamicAdjustment(dynamicPricing: any, now: Date) {
  if (!dynamicPricing?.enabled) return { applied: null as null | 'festival' | 'weekend' | 'peak', adjustment: undefined as any };
  const { ymd, hm, weekday } = getKolkataParts(now);

  const festival = Array.isArray(dynamicPricing?.festivalDays)
    ? dynamicPricing.festivalDays.find((d: any) => String(d?.date || '') === ymd)
    : null;
  if (festival) {
    return { applied: 'festival' as const, adjustment: { type: festival.type, value: Number(festival.value || 0) } };
  }

  const isWeekend = weekday === 'Sat' || weekday === 'Sun';
  if (isWeekend && dynamicPricing?.weekend) {
    return {
      applied: 'weekend' as const,
      adjustment: { type: dynamicPricing.weekend.type, value: Number(dynamicPricing.weekend.value || 0) },
    };
  }

  const peaks = Array.isArray(dynamicPricing?.peakHours) ? dynamicPricing.peakHours : [];
  const peak = peaks.find((p: any) => p?.start && p?.end && inTimeWindow(hm, String(p.start), String(p.end)));
  if (peak) {
    return { applied: 'peak' as const, adjustment: { type: peak.type, value: Number(peak.value || 0) } };
  }

  return { applied: null, adjustment: undefined };
}

function computeCustomizationsDelta(product: any, reqItem: any) {
  let delta = 0;
  if (reqItem?.variant && Array.isArray(product?.variants)) {
    const vName = String(reqItem.variant?.name || '').trim();
    const optName = String(reqItem.variant?.option || '').trim();
    const variant = product.variants.find((v: any) => String(v?.name) === vName);
    const opt = variant && Array.isArray(variant.options) ? variant.options.find((o: any) => String(o?.name) === optName) : null;
    if (opt && opt.inStock !== false) delta += Number(opt.price || 0);
  }

  if (Array.isArray(reqItem?.addons) && Array.isArray(product?.addonGroups)) {
    for (const a of reqItem.addons) {
      const gName = String(a?.group || '').trim();
      const optName = String(a?.option || '').trim();
      const group = product.addonGroups.find((g: any) => String(g?.name) === gName);
      const opt = group && Array.isArray(group.options) ? group.options.find((o: any) => String(o?.name) === optName) : null;
      if (opt && opt.inStock !== false) delta += Number(opt.price || 0);
    }
  }
  return delta;
}

export async function POST(req: NextRequest) {
  const key_secret = process.env.RAZORPAY_KEY_SECRET as string;
  if (!key_secret) {
    return NextResponse.json({ success: false, error: 'Missing Razorpay env vars' }, { status: 500 });
  }

  const body = await req.json();
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, user, items, total, method = 'razorpay', address, orderId, notes, couponCode, tip, deliveryCharge, handlingCharge, donation, deliveryLocation } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ success: false, error: 'Missing payment verification data' }, { status: 400 });
  }

  const generated = crypto
    .createHmac('sha256', key_secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generated !== razorpay_signature) {
    return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
  }

  try {
    await connectDB();

    // Basic validations (mirror /api/orders/route.ts expectations as much as possible)
    if (!user || !mongoose.Types.ObjectId.isValid(user)) {
      return NextResponse.json({ success: false, error: 'Valid user ID is required' }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Items array is required and cannot be empty' }, { status: 400 });
    }
    if (!total || typeof total !== 'number' || total <= 0) {
      return NextResponse.json({ success: false, error: 'Valid total amount is required' }, { status: 400 });
    }

    // Server-side pricing enforcement (do NOT trust client totals/prices)
    const primaryProductId = items?.[0]?.product;
    if (!primaryProductId || !mongoose.Types.ObjectId.isValid(primaryProductId)) {
      return NextResponse.json({ success: false, error: 'Invalid product in items' }, { status: 400 });
    }

    const primaryProduct: any = await Product.findById(primaryProductId).select('restaurantId').lean();
    const restaurantId = primaryProduct?.restaurantId?.toString?.();
    const restaurantUser: any = restaurantId && mongoose.Types.ObjectId.isValid(restaurantId)
      ? await User.findById(restaurantId).select('restaurant').lean()
      : null;

    // Offline mode enforcement (pause orders)
    try {
      const off = getOfflineModeState(restaurantUser?.restaurant, new Date());
      if (off.shouldAutoResume && restaurantId && mongoose.Types.ObjectId.isValid(restaurantId)) {
        await User.findByIdAndUpdate(restaurantId, { $set: { 'restaurant.offlineMode.paused': false } });
      } else if (off.paused) {
        return NextResponse.json(
          { success: false, error: 'Restaurant is temporarily offline. Please try later.' },
          { status: 400 }
        );
      }
    } catch {}

    // Delivery radius enforcement (if configured)
    try {
      const radiusKm = Number(restaurantUser?.restaurant?.deliveryRadiusKm || 0);
      const rLoc = parseLatLng(restaurantUser?.restaurant?.location);
      const dLoc = parseLatLng(deliveryLocation);
      if (radiusKm > 0 && rLoc && dLoc) {
        const distKm = haversineKm(rLoc, dLoc);
        if (distKm > radiusKm) {
          return NextResponse.json(
            { success: false, error: `Out of delivery range. Max ${radiusKm} km` },
            { status: 400 }
          );
        }
      }
    } catch {}

    const effective = getEffectiveRestaurantOpen(restaurantUser?.restaurant, new Date());
    const isOpen = effective.isOpen;
    const autoAccept = Boolean(restaurantUser?.restaurant?.autoAcceptOrders);
    const autoRejectWhenClosed = Boolean(restaurantUser?.restaurant?.autoRejectWhenClosed);
    const status = !isOpen && autoRejectWhenClosed ? 'canceled' : (autoAccept ? 'processing' : 'pending');

    const pick = pickDynamicAdjustment(restaurantUser?.restaurant?.dynamicPricing, new Date());

    const productDocs = await Product.find({ _id: { $in: items.map((i: any) => i.product) } })
      .select('_id price addonGroups variants')
      .lean();
    const productMap = new Map(productDocs.map((p: any) => [p._id.toString(), p]));

    const computedItems = items.map((i: any) => {
      const pdoc: any = productMap.get(String(i.product));
      const base = pdoc ? Number(pdoc.price || 0) : Number(i.price || 0);
      const delta = pdoc ? computeCustomizationsDelta(pdoc, i) : 0;
      const eff = applyAdjustment(base + delta, pick.adjustment);
      const finalPrice = Math.round(eff * 100) / 100;
      return { product: i.product, quantity: i.quantity, price: finalPrice, variant: i.variant, addons: i.addons };
    });
    const computedSubtotal = computedItems.reduce((sum: number, it: any) => sum + Number(it.price || 0) * Number(it.quantity || 0), 0);

    let nextCouponCode = typeof couponCode === 'string' ? couponCode.trim().toUpperCase() : '';
    let nextDiscountAmount = 0;

    try {
      if (nextCouponCode && restaurantId && mongoose.Types.ObjectId.isValid(restaurantId)) {
        const coupon: any = await Coupon.findOne({ restaurantId, code: nextCouponCode }).lean();
        if (coupon && isCouponActiveNow(coupon)) {
          const perUserLimit = Number(coupon?.perUserLimit || 0);
          if (perUserLimit > 0 && mongoose.Types.ObjectId.isValid(user)) {
            const red = await CouponRedemption.findOne({ coupon: coupon._id, user }).lean<{ count: number } | null>();
            const used = red?.count || 0;
            if (used >= perUserLimit) {
              nextCouponCode = '';
            }
          }
          if (nextCouponCode) {
            nextDiscountAmount = computeCouponDiscount(coupon, Math.round(computedSubtotal * 100) / 100);
          }
        } else {
          nextCouponCode = '';
        }
      }
    } catch (e) {
      nextCouponCode = '';
      nextDiscountAmount = 0;
    }

    const safeTip = Number(tip || 0);
    const safeDelivery = Number(deliveryCharge || 0);
    const safeHandling = Number(handlingCharge || 0);
    const safeDonation = Number(donation || 0);

    const fixedCharges =
      (Number.isFinite(safeTip) ? safeTip : 0) +
      (Number.isFinite(safeDelivery) ? safeDelivery : 0) +
      (Number.isFinite(safeHandling) ? safeHandling : 0) +
      (Number.isFinite(safeDonation) ? safeDonation : 0);

    const computedTotal = Math.max(0, computedSubtotal - nextDiscountAmount) + fixedCharges;

    const orderPayload: any = {
      user,
      items: computedItems,
      itemsSubtotal: Math.round(computedSubtotal * 100) / 100,
      couponCode: nextCouponCode,
      discountAmount: Math.round(nextDiscountAmount * 100) / 100,
      total: Math.round(computedTotal * 100) / 100,
      paymentId: razorpay_payment_id,
      orderId: orderId || razorpay_order_id,
      method,
      status,
      address,
      notes: typeof notes === 'string' ? notes : '',
    };

    const created = await Order.create(orderPayload);

    // Increment coupon redemption count for per-user limits
    try {
      const ccode = typeof nextCouponCode === 'string' ? nextCouponCode.trim().toUpperCase() : '';
      if (ccode && restaurantId && mongoose.Types.ObjectId.isValid(restaurantId) && mongoose.Types.ObjectId.isValid(user)) {
        const coupon: any = await Coupon.findOne({ restaurantId, code: ccode }).select('_id').lean();
        if (coupon) {
          await CouponRedemption.findOneAndUpdate(
            { coupon: coupon._id, user },
            { $inc: { count: 1 } },
            { upsert: true, new: true }
          );
        }
      }
    } catch (e) {
      // ignore
    }

    return NextResponse.json({ success: true, data: { orderId: created.orderId, paymentId: created.paymentId } });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Failed to record order' }, { status: 500 });
  }
}
