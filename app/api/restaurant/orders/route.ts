import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/User';
import Order from '@/app/models/Order';
import Product from '@/app/models/Product';

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

export async function GET(request: NextRequest) {
  try {
    const auth = await getRestaurantUser();
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim();
    const status = (searchParams.get('status') || '').trim().toLowerCase();

    const productFilter: any = { restaurantId: auth.userId };
    const restaurantProducts = await Product.find(productFilter).select('_id').lean();
    const productIds = restaurantProducts.map((p: any) => p._id);

    if (productIds.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const filter: any = { 'items.product': { $in: productIds } };
    if (status) filter.status = status;
    if (q) filter.orderId = { $regex: q, $options: 'i' };

    const orders = await Order.find(filter)
      .populate('user', 'firstName lastName email phone')
      .populate('items.product', 'name price images restaurantId')
      .populate('rider', 'firstName lastName phone')
      .sort({ createdAt: -1 })
      .lean();

    const mapped = orders.map((o: any) => {
      const customerName = `${o.user?.firstName || ''} ${o.user?.lastName || ''}`.trim() || 'Customer';
      const riderName = o.rider ? `${o.rider.firstName || ''} ${o.rider.lastName || ''}`.trim() : null;
      const items = (o.items || []).map((it: any) => ({
        name: it?.product?.name || 'Item',
        quantity: it.quantity,
        price: it.price,
      }));

      return {
        _id: o._id.toString(),
        orderId: o.orderId,
        customer: {
          name: customerName,
          email: o.user?.email || '',
          phone: o.user?.phone,
        },
        rider: o.rider ? {
          name: riderName,
          phone: o.rider.phone,
        } : null,
        items,
        total: o.total,
        status: o.status,
        paymentStatus: o.paymentId ? 'paid' : 'pending',
        createdAt: o.createdAt,
        notes: o.notes || '',
      };
    });

    return NextResponse.json({ success: true, data: mapped });
  } catch (error: any) {
    console.error('Failed to fetch restaurant orders:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
