import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/app/models/Order';
import { getCache, setCache } from '@/app/lib/cache';

function isAdmin(req: NextRequest) {
  const s = req.headers.get('x-admin-secret');
  return !!process.env.ADMIN_SECRET && s === process.env.ADMIN_SECRET;
}

export async function GET(req: NextRequest) {
  try {
    if (!isAdmin(req)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const cacheKey = `analytics:sales:${new URL(req.url).searchParams.toString()}`;
    const cached = getCache<any>(cacheKey);
    if (cached) {
      return NextResponse.json(cached, { headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' } });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || '7d';

    const now = new Date();
    const days = range === '30d' ? 30 : 7;
    const start = new Date(now);
    start.setDate(start.getDate() - (days - 1));
    start.setHours(0, 0, 0, 0);

    const data = await Order.aggregate([
      { $match: { createdAt: { $gte: start } } },
      {
        $group: {
          _id: { $dateToString: { date: '$createdAt', format: '%Y-%m-%d' } },
          orders: { $sum: 1 },
          total: { $sum: '$total' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const payload = { success: true, data: data.map((d: any) => ({ date: d._id, orders: d.orders, total: d.total })) };
    setCache(cacheKey, payload, 60);
    return NextResponse.json(payload, { headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' } });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Failed to load sales analytics' }, { status: 500 });
  }
}
