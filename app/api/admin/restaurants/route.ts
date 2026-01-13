import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import User, { UserRole } from '@/app/models/User';

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

export async function GET(request: NextRequest) {
  try {
    const auth = await getAdminUser();
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim();
    const status = (searchParams.get('status') || '').trim().toLowerCase();

    const filter: any = { role: UserRole.RESTAURANT };
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      filter['restaurant.status'] = status;
    }

    const restaurants = await User.find(filter)
      .select('firstName lastName email phone restaurant createdAt')
      .sort({ createdAt: -1 })
      .lean();

    const mapped = restaurants
      .filter((u: any) => {
        if (!q) return true;
        const name = (u.restaurant?.name || '').toLowerCase();
        const owner = (u.restaurant?.ownerName || `${u.firstName || ''} ${u.lastName || ''}`.trim()).toLowerCase();
        const email = (u.email || '').toLowerCase();
        return name.includes(q.toLowerCase()) || owner.includes(q.toLowerCase()) || email.includes(q.toLowerCase());
      })
      .map((u: any) => {
        const ownerName = u.restaurant?.ownerName || `${u.firstName || ''} ${u.lastName || ''}`.trim();
        return {
          _id: u._id.toString(),
          name: u.restaurant?.name || ownerName || 'Restaurant',
          owner: {
            name: ownerName || 'Owner',
            email: u.email || '',
            phone: u.phone || '',
          },
          address: u.restaurant?.address || '',
          cuisine: [],
          rating: 0,
          status: u.restaurant?.status || 'pending',
          documents: {
            license: '',
            fssai: '',
            gst: '',
          },
          createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : new Date().toISOString(),
          description: '',
          deliveryRadius: 0,
          averageDeliveryTime: `${u.restaurant?.openingTime || ''}${u.restaurant?.closingTime ? ` - ${u.restaurant.closingTime}` : ''}`.trim(),
        };
      });

    return NextResponse.json({ success: true, data: mapped });
  } catch (error: any) {
    console.error('Failed to fetch restaurants for approval:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch restaurants' },
      { status: 500 }
    );
  }
}
