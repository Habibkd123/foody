import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AuthSession from '@/app/models/AuthSession';
import ActivityLog from '@/app/models/ActivityLog';
import { getAuthUser } from '@/lib/auth-utils';

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if (!auth.isAuthenticated || !auth.userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const sessions = await AuthSession.find({ userId: auth.userId, revokedAt: { $exists: false } })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: sessions });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Failed to fetch sessions' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if (!auth.isAuthenticated || !auth.userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const sessionId = typeof body?.sessionId === 'string' ? body.sessionId.trim() : '';
    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'sessionId is required' }, { status: 400 });
    }

    await connectDB();

    const updated = await AuthSession.findOneAndUpdate(
      { sessionId, userId: auth.userId, revokedAt: { $exists: false } },
      { $set: { revokedAt: new Date(), revokedReason: 'user_revoked' } },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
    }

    try {
      await ActivityLog.create({
        userId: auth.userId,
        role: auth.role,
        action: 'session_revoked',
        sessionId,
        meta: { by: 'user' },
      });
    } catch {}

    return NextResponse.json({ success: true, data: updated });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Failed to revoke session' }, { status: 500 });
  }
}
