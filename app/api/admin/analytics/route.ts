import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/app/models/Order';
import Product from '@/app/models/Product';
import User from '@/app/models/User';

function parseRange(searchParams: URLSearchParams) {
  const range = (searchParams.get('range') || '30d').toLowerCase();
  const now = new Date();
  let start: Date | null = null;
  let end: Date | null = null;
  if (range === '7d') {
    start = new Date(now);
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    end = new Date(now);
    end.setHours(23, 59, 59, 999);
  } else if (range === '30d') {
    start = new Date(now);
    start.setDate(start.getDate() - 29);
    start.setHours(0, 0, 0, 0);
    end = new Date(now);
    end.setHours(23, 59, 59, 999);
  } else if (range === 'custom') {
    const s = searchParams.get('start');
    const e = searchParams.get('end');
    if (s) start = new Date(s);
    if (e) end = new Date(e);
  } else if (range === 'month') {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  } else if (range === 'week') {
    const day = now.getDay();
    const diff = (day === 0 ? 6 : day - 1); // Monday start
    start = new Date(now);
    start.setDate(start.getDate() - diff);
    start.setHours(0, 0, 0, 0);
    end = new Date(now);
    end.setHours(23, 59, 59, 999);
  }
  return { start, end };
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const { start, end } = parseRange(searchParams);

    const match: any = {};
    if (start) match.createdAt = { ...(match.createdAt || {}), $gte: start };
    if (end) match.createdAt = { ...(match.createdAt || {}), $lte: end };
    const status = searchParams.get('status');
    const method = searchParams.get('method');
    if (status && status.toLowerCase() !== 'all') match.status = status;
    if (method && method.toLowerCase() !== 'all') match.method = method;

    const dayFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };

    const [kpis] = await Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
          items: { $sum: { $sum: '$items.quantity' } },
        },
      },
    ]);

    const trend = await Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: dayFormat,
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
          buyers: { $addToSet: '$user' },
        },
      },
      { $project: { _id: 1, revenue: 1, orders: 1, buyersCount: { $size: '$buyers' } } },
      { $sort: { _id: 1 } },
    ]);

    const topProducts = await Order.aggregate([
      { $match: match },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          qty: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: Product.collection.name,
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
          name: { $ifNull: ['$product.name', 'Unknown'] },
          qty: 1,
          revenue: 1,
        },
      },
    ]);

    const topBuyers = await Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$user',
          orders: { $sum: 1 },
          revenue: { $sum: '$total' },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: User.collection.name,
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          name: { $ifNull: ['$user.firstName', 'User'] },
          email: '$user.email',
          orders: 1,
          revenue: 1,
        },
      },
    ]);

    const totals = {
      revenue: kpis?.revenue || 0,
      orders: kpis?.orders || 0,
      items: kpis?.items || 0,
      aov: kpis?.orders ? (kpis.revenue / kpis.orders) : 0,
    };

    const res = NextResponse.json({ success: true, data: { totals, trend, topProducts, topBuyers } });
    res.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=600');
    return res;
  } catch (e) {
    console.error('Analytics error', e);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
