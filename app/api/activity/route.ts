import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ActivityLog from '@/app/models/ActivityLog';
import { getAuthUser } from '@/lib/auth-utils';

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if (!auth.isAuthenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const action = (searchParams.get('action') || '').trim();
    const limit = Math.min(200, Math.max(1, Number(searchParams.get('limit') || 50)));

    const filter: any = {};
    if (action) filter.action = action;

    if (auth.role !== 'admin') {
      filter.userId = auth.userId;
    }

    const logs = await ActivityLog.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
    return NextResponse.json({ success: true, data: logs });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Failed to fetch activity logs' }, { status: 500 });
  }
}
