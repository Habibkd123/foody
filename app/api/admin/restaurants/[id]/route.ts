import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/User';

async function getAdminUser() {
  const cookieStore = await cookies();
  const role = cookieStore.get('user-role')?.value;
  const userId = cookieStore.get('user-id')?.value;

  if (!role || role !== 'admin' || !userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return { ok: false as const, status: 401 as const, error: 'Unauthorized' };
  }

  await connectDB();
  const user: any = await User.findById(userId).select('role');
  if (!user || user.role !== 'admin') {
    return { ok: false as const, status: 401 as const, error: 'Unauthorized' };
  }

  return { ok: true as const };
}

export async function PATCH(req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAdminUser();
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid restaurant id' }, { status: 400 });
    }

    const body = await req.json();
    const status = typeof body?.status === 'string' ? body.status.toLowerCase() : '';
    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }

    await connectDB();
    const updated: any = await User.findByIdAndUpdate(
      id,
      { $set: { 'restaurant.status': status } },
      { new: true }
    ).select('role restaurant');

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Restaurant not found' }, { status: 404 });
    }

    if (updated.role !== 'restaurant') {
      return NextResponse.json({ success: false, error: 'User is not a restaurant' }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: { _id: id, status } });
  } catch (error: any) {
    console.error('Failed to update restaurant approval status:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update restaurant status' },
      { status: 500 }
    );
  }
}

