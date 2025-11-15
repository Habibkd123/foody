import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Notification from '@/app/models/Notification';
import UserNotification from '@/app/models/UserNotification';
import { getAuthUser } from '@/lib/auth-utils';

// GET: return active notifications merged with user state (read/dismissed)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { isAuthenticated, userId } = await getAuthUser(request);
    if (!isAuthenticated || !userId) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location') || 'home';

    const now = new Date();
    const notifications = await Notification.find({
      status: 'active',
      displayLocation: location,
      $or: [
        { startDate: { $lte: now }, endDate: { $gte: now } },
        { startDate: { $exists: false }, endDate: { $exists: false } }
      ]
    }).sort({ priority: -1, createdAt: -1 }).limit(20);

    const notifIds = notifications.map((n: any) => n._id.toString());
    const userStates = await UserNotification.find({ userId, notificationId: { $in: notifIds } });
    const stateMap = new Map(userStates.map((s: any) => [s.notificationId, s]));

    const data = notifications.map((n: any) => {
      const s = stateMap.get(n._id.toString());
      return {
        ...n.toObject(),
        userState: {
          read: s?.read || false,
          dismissed: s?.dismissed || false,
          readAt: s?.readAt || null,
          dismissedAt: s?.dismissedAt || null,
        }
      };
    });

    return NextResponse.json({ success: true, data, count: data.length });
  } catch (error: any) {
    console.error('Error fetching user notifications:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: update user state (read/dismiss)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { isAuthenticated, userId } = await getAuthUser(request);
    if (!isAuthenticated || !userId) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { notificationId, action } = body as { notificationId: string; action: 'read' | 'dismiss' | 'undismiss' };
    if (!notificationId || !action) {
      return NextResponse.json({ success: false, error: 'notificationId and action are required' }, { status: 400 });
    }

    const update: any = {};
    if (action === 'read') {
      update.read = true;
      update.readAt = new Date();
    } else if (action === 'dismiss') {
      update.dismissed = true;
      update.dismissedAt = new Date();
    } else if (action === 'undismiss') {
      update.dismissed = false;
      update.dismissedAt = null;
    }

    const doc = await UserNotification.findOneAndUpdate(
      { userId, notificationId },
      { $set: update },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, data: doc });
  } catch (error: any) {
    console.error('Error updating user notification state:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
