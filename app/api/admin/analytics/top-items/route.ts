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
    const url = new URL(req.url);
    const cacheKey = `analytics:top-items:${url.searchParams.toString()}`;
    const cached = getCache<any>(cacheKey);
    if (cached) {
      return NextResponse.json(cached, { headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' } });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const limit = Math.max(1, Math.min(parseInt(searchParams.get('limit') || '10', 10) || 10, 50));
    const days = parseInt(searchParams.get('days') || '30', 10) || 30;

    const start = new Date();
    start.setDate(start.getDate() - days);

    const data = await Order.aggregate([
      { $match: { createdAt: { $gte: start } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          quantity: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
        },
      },
      { $sort: { quantity: -1 } },
      { $limit: limit },
    ]);

    const payload = { success: true, data: data.map((d: any) => ({ productId: d._id, quantity: d.quantity, revenue: d.revenue })) };
    setCache(cacheKey, payload, 60);
    return NextResponse.json(payload, { headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' } });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Failed to load top items' }, { status: 500 });
  }
}
