import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/User';

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

  return { ok: true as const, userId, user };
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await getRestaurantUser();
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const isOpen = typeof body?.isOpen === 'boolean' ? body.isOpen : undefined;
    if (typeof isOpen !== 'boolean') {
      return NextResponse.json({ success: false, error: 'isOpen must be boolean' }, { status: 400 });
    }

    const updated: any = await User.findByIdAndUpdate(
      auth.userId,
      { $set: { 'restaurant.isOpen': isOpen } },
      { new: true }
    ).select('restaurant');

    return NextResponse.json({ success: true, data: { isOpen: updated?.restaurant?.isOpen ?? isOpen } });
  } catch (error: any) {
    console.error('Failed to update restaurant status:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update restaurant status' },
      { status: 500 }
    );
  }
}
