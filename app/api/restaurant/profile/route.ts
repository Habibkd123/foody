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
  const user: any = await User.findById(userId).select('role restaurant firstName lastName email phone image');
  if (!user || user.role !== 'restaurant') {
    return { ok: false as const, status: 401 as const, error: 'Unauthorized' };
  }

  return { ok: true as const, userId, user };
}

export async function GET() {
  try {
    const auth = await getRestaurantUser();
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const u: any = auth.user;

    return NextResponse.json({
      success: true,
      data: {
        _id: u._id.toString(),
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        phone: u.phone,
        image: u.image,
        restaurant: u.restaurant,
      },
    });
  } catch (error: any) {
    console.error('Failed to fetch restaurant profile:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch restaurant profile' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await getRestaurantUser();
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await req.json();

    const allowedRestaurantFields = ['name', 'ownerName', 'address', 'openingTime', 'closingTime', 'isOpen', 'autoAcceptOrders', 'autoRejectWhenClosed', 'offlineMode', 'location', 'deliveryRadiusKm', 'timingAutomation', 'cancellationPenalty', 'dynamicPricing'] as const;
    const restaurantUpdate: any = {};

    for (const key of allowedRestaurantFields) {
      if (Object.prototype.hasOwnProperty.call(body?.restaurant || {}, key)) {
        restaurantUpdate[`restaurant.${key}`] = (body.restaurant as any)[key];
      }
    }

    const allowedUserFields = ['phone', 'image'] as const;
    const userUpdate: any = {};
    for (const key of allowedUserFields) {
      if (Object.prototype.hasOwnProperty.call(body || {}, key)) {
        userUpdate[key] = (body as any)[key];
      }
    }

    const update = { ...restaurantUpdate, ...userUpdate };

    const updated: any = await User.findByIdAndUpdate(
      auth.userId,
      { $set: update },
      { new: true }
    ).select('firstName lastName email phone image restaurant');

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Failed to update restaurant profile:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update restaurant profile' },
      { status: 500 }
    );
  }
}
