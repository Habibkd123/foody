import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import AuthSession from '@/app/models/AuthSession';
import ActivityLog from '@/app/models/ActivityLog';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user-id')?.value || '';
    const role = cookieStore.get('user-role')?.value || '';
    const sid = cookieStore.get('sid')?.value || '';

    if (sid) {
      try {
        await connectDB();
        await AuthSession.findOneAndUpdate(
          { sessionId: sid, revokedAt: { $exists: false } },
          { $set: { revokedAt: new Date(), revokedReason: 'logout' } }
        );
        await ActivityLog.create({ userId: userId || undefined, role, action: 'logout', sessionId: sid });
      } catch {}
    }

    const res = NextResponse.json({ success: true });

    const cookieNames = ['token', 'user', 'user-role', 'user-auth', 'user-id', 'sid'];
    for (const name of cookieNames) {
      res.cookies.set({
        name,
        value: '',
        httpOnly: name === 'token' || name === 'sid' || name === 'user-role' || name === 'user-auth' || name === 'user-id',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 0,
      });
    }

    return res;
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Logout failed' }, { status: 500 });
  }
}
