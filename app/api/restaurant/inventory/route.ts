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

export async function GET(req: NextRequest) {
  try {
    const auth = await getRestaurantUser();
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim().toLowerCase();

    const filter: any = { restaurantId: auth.userId, isActive: true };
    if (q) filter.name = { $regex: q, $options: 'i' };

    const items = await InventoryItem.find(filter).sort({ name: 1 }).lean();
    return NextResponse.json({ success: true, data: items });
  } catch (error: any) {
    console.error('Failed to fetch inventory:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getRestaurantUser();
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const unit = typeof body?.unit === 'string' ? body.unit.trim() : 'unit';
    const quantity = Number(body?.quantity ?? 0);
    const lowStockThreshold = Number(body?.lowStockThreshold ?? 5);

    if (!name) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }
    if (!Number.isFinite(quantity) || quantity < 0) {
      return NextResponse.json({ success: false, error: 'Quantity must be >= 0' }, { status: 400 });
    }
    if (!Number.isFinite(lowStockThreshold) || lowStockThreshold < 0) {
      return NextResponse.json({ success: false, error: 'Low stock threshold must be >= 0' }, { status: 400 });
    }

    const created = await InventoryItem.create({
      restaurantId: auth.userId,
      name,
      unit,
      quantity,
      lowStockThreshold,
      isActive: true,
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    // handle unique name per restaurant
    if (error?.code === 11000) {
      return NextResponse.json({ success: false, error: 'Inventory item with this name already exists' }, { status: 409 });
    }
    console.error('Failed to create inventory item:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to create item' }, { status: 500 });
  }
}
