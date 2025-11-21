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
    const cacheKey = `analytics:peak-hours:${url.searchParams.toString()}`;
    const cached = getCache<any>(cacheKey);
    if (cached) {
      return NextResponse.json(cached, { headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' } });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '14', 10) || 14;

    const start = new Date();
    start.setDate(start.getDate() - days);

    const data = await Order.aggregate([
      { $match: { createdAt: { $gte: start } } },
      { $addFields: { hour: { $hour: '$createdAt' } } },
      { $group: { _id: '$hour', orders: { $sum: 1 }, revenue: { $sum: '$total' } } },
      { $sort: { _id: 1 } },
    ]);

    const result = Array.from({ length: 24 }, (_, h) => ({ hour: h, orders: 0, revenue: 0 }));
    for (const row of data as any[]) {
      const idx = Number(row._id);
      if (!Number.isNaN(idx) && idx >= 0 && idx < 24) {
        result[idx].orders = row.orders;
        result[idx].revenue = row.revenue;
      }
    }

    const payload = { success: true, data: result };
    setCache(cacheKey, payload, 60);
    return NextResponse.json(payload, { headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' } });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Failed to load peak hours' }, { status: 500 });
  }
}
