import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/User';
import InventoryItem from '@/app/models/InventoryItem';

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

  return { ok: true as const, userId };
}

export async function GET(_req: NextRequest) {
  try {
    const auth = await getRestaurantUser();
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const items = await InventoryItem.find({
      restaurantId: auth.userId,
      isActive: true,
      $expr: { $lte: ['$quantity', '$lowStockThreshold'] },
    })
      .sort({ quantity: 1 })
      .lean();

    return NextResponse.json({ success: true, data: items, count: items.length });
  } catch (error: any) {
    console.error('Failed to fetch low stock:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch low stock' }, { status: 500 });
  }
}
