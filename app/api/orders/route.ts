import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/app/models/Order';
import { OrderStatus } from '@/app/models/User';
import mongoose from 'mongoose';
import Delivery from '@/app/models/Delivery';
import Cart from '@/app/models/Cart';
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
    hour: Number(map.hour),
    weekday: new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', weekday: 'short' }).format(date),
  };
}

function inTimeWindow(hm: string, start: string, end: string) {
  // hm/start/end are "HH:MM". Handle overnight windows.
  const toMin = (v: string) => {
    const [h, m] = v.split(':').map(Number);
    return h * 60 + m;
  };
  const x = toMin(hm);
  const s = toMin(start);
  const e = toMin(end);
  if (Number.isNaN(x) || Number.isNaN(s) || Number.isNaN(e)) return false;
  if (s <= e) return x >= s && x < e;
  return x >= s || x < e; // overnight
}

function applyAdjustment(base: number, adj?: Adjustment) {
  if (!adj) return base;
  const v = Number(adj.value || 0);
  if (!Number.isFinite(v) || v === 0) return base;
  if (adj.type === 'fixed') return Math.max(0, base + v);
  // percent
  return Math.max(0, base + (base * v) / 100);
}

function pickDynamicAdjustment(dynamicPricing: any, now: Date) {
  if (!dynamicPricing?.enabled) return { applied: null as null | 'festival' | 'weekend' | 'peak', adjustment: undefined as any };
  const { ymd, hm, weekday } = getKolkataParts(now);

  // Festival (highest priority)
  const festival = Array.isArray(dynamicPricing?.festivalDays)
    ? dynamicPricing.festivalDays.find((d: any) => String(d?.date || '') === ymd)
    : null;
  if (festival) {
    return { applied: 'festival' as const, adjustment: { type: festival.type, value: Number(festival.value || 0) } };
  }

  // Weekend
  const isWeekend = weekday === 'Sat' || weekday === 'Sun';
  if (isWeekend && dynamicPricing?.weekend) {
    return {
      applied: 'weekend' as const,
      adjustment: { type: dynamicPricing.weekend.type, value: Number(dynamicPricing.weekend.value || 0) },
    };
  }

  // Peak hours
  const peaks = Array.isArray(dynamicPricing?.peakHours) ? dynamicPricing.peakHours : [];
  const peak = peaks.find((p: any) => p?.start && p?.end && inTimeWindow(hm, String(p.start), String(p.end)));
  if (peak) {
    return { applied: 'peak' as const, adjustment: { type: peak.type, value: Number(peak.value || 0) } };
  }

  return { applied: null, adjustment: undefined };
}

function computeCustomizationsDelta(product: any, reqItem: any) {
  let delta = 0;

  // Variant (single)
  if (reqItem?.variant && product?.variants) {
    const vName = String(reqItem.variant?.name || '').trim();
    const optName = String(reqItem.variant?.option || '').trim();
    const variant = Array.isArray(product.variants) ? product.variants.find((v: any) => String(v?.name) === vName) : null;
    const opt = variant && Array.isArray(variant.options)
      ? variant.options.find((o: any) => String(o?.name) === optName)
      : null;
    if (opt && opt.inStock !== false) {
      delta += Number(opt.price || 0);
    }
  }

  // Addons (multiple)
  if (Array.isArray(reqItem?.addons) && Array.isArray(product?.addonGroups)) {
    for (const a of reqItem.addons) {
      const gName = String(a?.group || '').trim();
      const optName = String(a?.option || '').trim();
      const group = product.addonGroups.find((g: any) => String(g?.name) === gName);
      const opt = group && Array.isArray(group.options) ? group.options.find((o: any) => String(o?.name) === optName) : null;
      if (opt && opt.inStock !== false) {
        delta += Number(opt.price || 0);
      }
    }
  }

  return delta;
}

// GET /api/orders - Fetch all orders with pagination, filtering, and population
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build filter object
    const filter: any = {};
    if (status && Object.values(OrderStatus).includes(status as OrderStatus)) {
      filter.status = status;
    }
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      filter.user = userId;
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Fetch orders with population
    const orders = await Order.find(filter)
      .populate('user', 'firstName lastName email phone')
      .populate('items.product', 'name price image category')
      .populate('delivery', 'address status estimatedDelivery')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / limit);

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    console.log('[Orders POST] Enter handler');
    await connectDB();
    console.log('[Orders POST] Connected to DB');

    const body = await request.json();
    console.log('[Orders POST] Parsed body');
    const { user, items, total, paymentId, delivery, method, orderId, notes, couponCode, tip, deliveryCharge, handlingCharge, donation, deliveryLocation } = body;
    console.log('[Orders POST] Extracted fields', {
      hasUser: !!user,
      itemsCount: Array.isArray(items) ? items.length : 'not-array',
      total,
      hasPaymentId: !!paymentId,
      hasDelivery: !!delivery,
      method,
      orderId,
    });

    // Validation
    if (!user || !mongoose.Types.ObjectId.isValid(user)) {
      console.warn('[Orders POST] Invalid user', { user });
      return NextResponse.json(
        { success: false, error: 'Valid user ID is required' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.warn('[Orders POST] Invalid items array', { itemsType: typeof items, length: Array.isArray(items) ? items.length : undefined });
      return NextResponse.json(
        { success: false, error: 'Items array is required and cannot be empty' },
        { status: 400 }
      );
    }

    if (!total || typeof total !== 'number' || total <= 0) {
      console.warn('[Orders POST] Invalid total', { total, type: typeof total });
      return NextResponse.json(
        { success: false, error: 'Valid total amount is required' },
        { status: 400 }
      );
    }

    if (!paymentId || typeof paymentId !== 'string') {
      console.warn('[Orders POST] Missing/invalid paymentId', { paymentId });
      return NextResponse.json(
        { success: false, error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    if (!orderId || typeof orderId !== 'string') {
      console.warn('[Orders POST] Missing/invalid orderId', { orderId });
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Validate items structure
    for (const item of items) {
      const idx = items.indexOf(item);
      console.log('[Orders POST] Validating item', { idx, product: item?.product, quantity: item?.quantity, price: item?.price });
      if (!item.product || !mongoose.Types.ObjectId.isValid(item.product)) {
        console.warn('[Orders POST] Invalid product in item', { idx, product: item?.product });
        return NextResponse.json(
          { success: false, error: 'Each item must have a valid product ID' },
          { status: 400 }
        );
      }
      if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
        console.warn('[Orders POST] Invalid quantity in item', { idx, quantity: item?.quantity });
        return NextResponse.json(
          { success: false, error: 'Each item must have a valid quantity' },
          { status: 400 }
        );
      }
      if (!item.price || typeof item.price !== 'number' || item.price <= 0) {
        console.warn('[Orders POST] Invalid price in item', { idx, price: item?.price });
        return NextResponse.json(
          { success: false, error: 'Each item must have a valid price' },
          { status: 400 }
        );
      }
    }

    // Auto accept/reject based on restaurant settings (single-restaurant assumption: uses items[0].product)
    let initialStatus = OrderStatus.PENDING;
    let restaurantSettings: any = null;
    try {
      const primaryProductId = items?.[0]?.product;
      if (primaryProductId && mongoose.Types.ObjectId.isValid(primaryProductId)) {
        const product: any = await Product.findById(primaryProductId).select('restaurantId').lean();
        const restaurantId = product?.restaurantId?.toString?.();
        if (restaurantId && mongoose.Types.ObjectId.isValid(restaurantId)) {
          const restaurantUser: any = await User.findById(restaurantId).select('restaurant').lean();
          restaurantSettings = restaurantUser?.restaurant || null;

          // Offline mode enforcement (pause orders)
          try {
            const off = getOfflineModeState(restaurantUser?.restaurant, new Date());
            if (off.shouldAutoResume) {
              await User.findByIdAndUpdate(restaurantId, { $set: { 'restaurant.offlineMode.paused': false } });
            } else if (off.paused) {
              return NextResponse.json(
                { success: false, error: 'Restaurant is temporarily offline. Please try later.' },
                { status: 400 }
              );
            }
          } catch { }

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
          } catch { }

          const effective = getEffectiveRestaurantOpen(restaurantUser?.restaurant, new Date());
          const isOpen = effective.isOpen;
          const autoAccept = Boolean(restaurantUser?.restaurant?.autoAcceptOrders);
          const autoRejectWhenClosed = Boolean(restaurantUser?.restaurant?.autoRejectWhenClosed);

          if (!isOpen && autoRejectWhenClosed) {
            initialStatus = OrderStatus.CANCELED;
          } else if (autoAccept) {
            initialStatus = OrderStatus.PROCESSING;
          }
        }
      }
    } catch (e) {
      console.warn('[Orders POST] Auto accept/reject evaluation failed', e);
    }

    // Dynamic pricing (server-side enforcement)
    // Recompute per-item price from Product.price + customizations and override total.
    try {
      const adjustmentPick = pickDynamicAdjustment(restaurantSettings?.dynamicPricing, new Date());

      // Fetch products once
      const productDocs = await Product.find({ _id: { $in: items.map((i: any) => i.product) } })
        .select('_id price restaurantId addonGroups variants')
        .lean();
      const productMap = new Map(productDocs.map((p: any) => [p._id.toString(), p]));

      const computedItems = items.map((it: any) => {
        const pdoc: any = productMap.get(String(it.product));
        const base = pdoc ? Number(pdoc.price || 0) : Number(it.price || 0);
        const delta = pdoc ? computeCustomizationsDelta(pdoc, it) : 0;
        const eff = applyAdjustment(base + delta, adjustmentPick.adjustment);
        const finalPrice = Math.round(eff * 100) / 100;
        return {
          product: it.product,
          quantity: it.quantity,
          price: finalPrice,
          variant: it.variant,
          addons: it.addons,
        };
      });

      const computedSubtotal = computedItems.reduce((sum: number, it: any) => sum + Number(it.price || 0) * Number(it.quantity || 0), 0);
      items.splice(0, items.length, ...computedItems);

      let nextCouponCode = typeof couponCode === 'string' ? couponCode.trim().toUpperCase() : '';
      let nextDiscountAmount = 0;

      try {
        if (nextCouponCode) {
          const primaryProductId = items?.[0]?.product;
          const product: any = primaryProductId && mongoose.Types.ObjectId.isValid(primaryProductId)
            ? await Product.findById(primaryProductId).select('restaurantId').lean()
            : null;
          const restaurantId = product?.restaurantId?.toString?.();

          if (restaurantId && mongoose.Types.ObjectId.isValid(restaurantId)) {
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

      const finalTotal = Math.max(0, computedSubtotal - nextDiscountAmount) + fixedCharges;

      (body as any).itemsSubtotal = Math.round(computedSubtotal * 100) / 100;
      (body as any).couponCode = nextCouponCode;
      (body as any).discountAmount = Math.round(nextDiscountAmount * 100) / 100;
      // override total passed by client
      (body as any).total = Math.round(finalTotal * 100) / 100;
    } catch (e) {
      console.warn('[Orders POST] Dynamic pricing calculation failed', e);
    }

    // Create order data
    const orderData: any = {
      user,
      items,
      itemsSubtotal: (body as any).itemsSubtotal,
      couponCode: (body as any).couponCode,
      discountAmount: (body as any).discountAmount,
      total: (body as any).total,
      paymentId,
      orderId,
      method: method || 'card',
      status: initialStatus,
      notes: typeof notes === 'string' ? notes : '',
    };

    console.log('[Orders POST] Built orderData', {
      user: orderData.user?.toString?.() || orderData.user,
      itemsCount: orderData.items?.length,
      total: orderData.total,
      orderId: orderData.orderId,
      method: orderData.method,
      hasDelivery: !!orderData.delivery,
    });

    if (delivery && mongoose.Types.ObjectId.isValid(delivery)) {
      orderData.delivery = delivery;
      console.log('[Orders POST] Using provided delivery id', { delivery: delivery?.toString?.() || delivery });
    }

    // Create the order
    console.log('[Orders POST] Creating Order...');
    const newOrder = await Order.create(orderData);
    console.log('[Orders POST] Order created', { orderMongoId: newOrder?._id?.toString?.(), orderId: newOrder?.orderId });

    // Increment coupon redemption count for per-user limits
    try {
      const ccode = typeof orderData?.couponCode === 'string' ? orderData.couponCode.trim().toUpperCase() : '';
      const primaryProductId = items?.[0]?.product;
      if (ccode && primaryProductId && mongoose.Types.ObjectId.isValid(primaryProductId)) {
        const product: any = await Product.findById(primaryProductId).select('restaurantId').lean();
        const restaurantId = product?.restaurantId?.toString?.();
        if (restaurantId && mongoose.Types.ObjectId.isValid(restaurantId)) {
          const coupon: any = await Coupon.findOne({ restaurantId, code: ccode }).select('_id').lean();
          if (coupon && mongoose.Types.ObjectId.isValid(user)) {
            await CouponRedemption.findOneAndUpdate(
              { coupon: coupon._id, user },
              { $inc: { count: 1 } },
              { upsert: true, new: true }
            );
          }
        }
      }
    } catch (e) {
      console.warn('[Orders POST] Failed to increment coupon redemption', e);
    }

    // If delivery ID was not provided, create a Delivery now and link it to the order
    if (!orderData.delivery) {
      console.log('[Orders POST] No delivery provided; creating Delivery...');
      const primaryProductId = items?.[0]?.product;
      if (!primaryProductId || !mongoose.Types.ObjectId.isValid(primaryProductId)) {
        throw new Error('Cannot create delivery: missing or invalid primary product ID from items[0].product');
      }

      try {
        const createdDelivery = await Delivery.create({
          order: newOrder._id,
          product: primaryProductId,
          address: (body.address || body.shippingAddress || '').toString?.() || String(body.address || body.shippingAddress || ''),
        });
        console.log('[Orders POST] Delivery created', { deliveryId: createdDelivery?._id?.toString?.(), orderMongoId: newOrder?._id?.toString?.() });
        await Order.findByIdAndUpdate(newOrder._id, { delivery: createdDelivery._id });
        console.log('[Orders POST] Linked delivery to order');
        // Reflect in local variable for accurate population
        orderData.delivery = createdDelivery._id;
      } catch (deliveryErr) {
        console.error('Delivery creation/linking failed for order', newOrder?._id?.toString?.(), deliveryErr);
      }
    }

    // After creating the order, mark user's cart as purchased and disable TTL
    try {
      if (user && mongoose.Types.ObjectId.isValid(user)) {
        await Cart.findOneAndUpdate(
          { user: user },
          { $set: { status: 'purchased', expiresAt: null, items: [] } },
          { new: true }
        );
      }
    } catch (cartUpdateErr) {
      console.error('[Orders POST] Failed to update cart status after purchase', cartUpdateErr);
    }

    // Populate the created order before returning
    console.log('[Orders POST] Populating order for response...');
    const populatedOrder = await Order.findById(newOrder._id)
      .populate('user', 'firstName lastName email phone')
      .populate('items.product', 'name price image category')
      .populate('delivery', 'address status estimatedDelivery');
    console.log('[Orders POST] Populated order ready');

    // Emit socket event for real-time updates
    if (global.io) {
      console.log('[Orders POST] Emitting newOrder socket event');
      global.io.emit('newOrder', populatedOrder);
    }

    return NextResponse.json(
      { success: true, data: populatedOrder },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('[Orders POST] Error creating order:', error?.stack || error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Order with this ID already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create order', details: error.message },
      { status: 500 }
    );
  }
}


//