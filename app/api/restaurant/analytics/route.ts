import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/User';
import Order from '@/app/models/Order';
import Product from '@/app/models/Product';

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function startOfWeek(d: Date) {
  // Monday as start
  const day = d.getDay(); // 0 Sun
  const diff = (day === 0 ? -6 : 1 - day);
  const s = new Date(d);
  s.setDate(d.getDate() + diff);
  return startOfDay(s);
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

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
    const range = (searchParams.get('range') || 'month').toLowerCase();
    const limit = Math.min(Math.max(Number(searchParams.get('limit') || 10), 1), 50);

    const now = new Date();
    const from =
      range === 'day'
        ? startOfDay(now)
        : range === 'week'
          ? startOfWeek(now)
          : startOfMonth(now);

    const restaurantProducts = await Product.find({ restaurantId: auth.userId }).select('_id').lean();
    const productIds = restaurantProducts.map((p: any) => p._id);

    if (productIds.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          range,
          from,
          to: now,
          totals: { orders: 0, revenue: 0, canceledOrders: 0, cancelRate: 0 },
          bestSellers: [],
          peakHours: [],
          canceledByStatus: [],
        },
      });
    }

    const matchBase: any = {
      createdAt: { $gte: from, $lte: now },
      'items.product': { $in: productIds },
    };

    const matchNonCanceled: any = { ...matchBase, status: { $ne: 'canceled' } };
    const matchCanceled: any = { ...matchBase, status: 'canceled' };

    const [
      totalsNonCanceled,
      totalsCanceled,
      bestSellers,
      peakHours,
      canceledByStatus,
    ] = await Promise.all([
      Order.aggregate([
        { $match: matchNonCanceled },
        {
          $group: {
            _id: null,
            orders: { $sum: 1 },
            revenue: { $sum: '$total' },
          },
        },
      ]),
      Order.aggregate([
        { $match: matchCanceled },
        { $group: { _id: null, canceledOrders: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: matchNonCanceled },
        { $unwind: '$items' },
        { $match: { 'items.product': { $in: productIds } } },
        {
          $group: {
            _id: '$items.product',
            quantity: { $sum: '$items.quantity' },
            revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
          },
        },
        { $sort: { quantity: -1 } },
        { $limit: limit },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product',
          },
        },
        { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 0,
            productId: '$_id',
            name: '$product.name',
            quantity: 1,
            revenue: 1,
          },
        },
      ]),
      Order.aggregate([
        { $match: matchNonCanceled },
        {
          $group: {
            _id: { $hour: '$createdAt' },
            orders: { $sum: 1 },
            revenue: { $sum: '$total' },
          },
        },
        { $sort: { orders: -1 } },
        { $limit: 24 },
        {
          $project: {
            _id: 0,
            hour: '$_id',
            orders: 1,
            revenue: 1,
          },
        },
      ]),
      Order.aggregate([
        { $match: matchCanceled },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
        { $project: { _id: 0, status: '$_id', count: 1 } },
      ]),
    ]);

    const orders = totalsNonCanceled?.[0]?.orders || 0;
    const revenue = totalsNonCanceled?.[0]?.revenue || 0;
    const canceledOrders = totalsCanceled?.[0]?.canceledOrders || 0;
    const totalOrders = orders + canceledOrders;
    const cancelRate = totalOrders === 0 ? 0 : Math.round((canceledOrders / totalOrders) * 1000) / 10; // % with 1 decimal

    return NextResponse.json({
      success: true,
      data: {
        range,
        from,
        to: now,
        totals: {
          orders,
          revenue,
          canceledOrders,
          cancelRate,
        },
        bestSellers,
        peakHours,
        canceledByStatus,
      },
    });
  } catch (error: any) {
    console.error('Failed to fetch restaurant analytics:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
