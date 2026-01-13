import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/User';
import Product from '@/app/models/Product';

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

  return { ok: true as const, userId };
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

    const filter: any = { restaurantId: { $exists: true, $ne: null } };
    if (q) filter.name = { $regex: q, $options: 'i' };
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      filter.approvalStatus = status;
    }

    const foods = await Product.find(filter)
      .populate('restaurantId', 'firstName lastName restaurant')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .lean();

    const mapped = foods.map((p: any) => {
      const r = p.restaurantId;
      const restaurantName = r?.restaurant?.name || `${r?.firstName || ''} ${r?.lastName || ''}`.trim() || 'Restaurant';
      const owner = r?.restaurant?.ownerName || `${r?.firstName || ''} ${r?.lastName || ''}`.trim() || 'Owner';

      return {
        _id: p._id.toString(),
        name: p.name,
        description: p.description || '',
        restaurant: {
          _id: r?._id?.toString?.() || '',
          name: restaurantName,
          owner,
        },
        category: p.category?.name || 'Food',
        price: p.price,
        images: Array.isArray(p.images) ? p.images : [],
        ingredients: [],
        nutritionalInfo: { calories: 0, protein: 0, carbs: 0, fat: 0 },
        dietary: [],
        status: (p.approvalStatus || 'pending'),
        rating: p.rating || 0,
        preparationTime: '',
        createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
      };
    });

    return NextResponse.json({ success: true, data: mapped });
  } catch (error: any) {
    console.error('Failed to fetch food approvals:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch food approvals' },
      { status: 500 }
    );
  }
}
