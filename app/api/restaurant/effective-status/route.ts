import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/User';
import { getEffectiveRestaurantOpen } from '@/app/lib/restaurant-timing';

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

  return { ok: true as const, userId, user };
}

export async function GET() {
  try {
    const auth = await getRestaurantUser();
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const restaurant = auth.user?.restaurant || null;
    const manualIsOpen = restaurant?.isOpen !== false;
    const effective = getEffectiveRestaurantOpen(restaurant, new Date());

    return NextResponse.json({
      success: true,
      data: {
        manualIsOpen,
        effectiveIsOpen: effective.isOpen,
        reason: effective.reason,
        timingAutomation: {
          enabled: Boolean(restaurant?.timingAutomation?.enabled),
          mode: restaurant?.timingAutomation?.mode || 'auto',
        },
      },
    });
  } catch (error: any) {
    console.error('Failed to compute restaurant effective status:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to compute restaurant effective status' },
      { status: 500 }
    );
  }
}
