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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getRestaurantUser();
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid inventory item id' }, { status: 400 });
    }

    const item: any = await InventoryItem.findOne({ _id: id, restaurantId: auth.userId });
    if (!item) {
      return NextResponse.json({ success: false, error: 'Inventory item not found' }, { status: 404 });
    }

    const body = await req.json();

    if (typeof body?.name === 'string' && body.name.trim()) item.name = body.name.trim();
    if (typeof body?.unit === 'string' && body.unit.trim()) item.unit = body.unit.trim();

    if (body?.quantity !== undefined) {
      const q = Number(body.quantity);
      if (!Number.isFinite(q) || q < 0) {
        return NextResponse.json({ success: false, error: 'Quantity must be >= 0' }, { status: 400 });
      }
      item.quantity = q;
    }

    if (body?.lowStockThreshold !== undefined) {
      const t = Number(body.lowStockThreshold);
      if (!Number.isFinite(t) || t < 0) {
        return NextResponse.json({ success: false, error: 'Low stock threshold must be >= 0' }, { status: 400 });
      }
      item.lowStockThreshold = t;
    }

    if (typeof body?.isActive === 'boolean') item.isActive = body.isActive;

    await item.save();
    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    if (error?.code === 11000) {
      return NextResponse.json({ success: false, error: 'Inventory item with this name already exists' }, { status: 409 });
    }
    console.error('Failed to update inventory item:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getRestaurantUser();
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid inventory item id' }, { status: 400 });
    }

    const deleted = await InventoryItem.findOneAndUpdate(
      { _id: id, restaurantId: auth.userId },
      { $set: { isActive: false } },
      { new: true }
    );

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Inventory item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete inventory item:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to delete item' }, { status: 500 });
  }
}

