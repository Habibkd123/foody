import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Order from '@/app/models/Order';
import Product from '@/app/models/Product';
import { getRestaurantIdForOrder } from '@/app/lib/invoice';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const { orderId } = await params;
    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json({ success: false, error: 'Valid orderId required' }, { status: 400 });
    }

    await connectDB();

    const order: any = await Order.findById(orderId)
      .select('items')
      .populate('items.product', 'restaurantId')
      .lean();

    const items: any[] = Array.isArray(order?.items) ? order.items : [];
    const productIds: string[] = items
      .map((it: any) => {
        const p: any = it?.product;
        if (!p) return '';
        if (typeof p === 'string') return p;
        if (p?._id) return String(p._id);
        return '';
      })
      .filter(Boolean);

    const foundProducts: any[] = productIds.length
      ? await Product.find({ _id: { $in: productIds } }).select('restaurantId').lean()
      : [];

    const resolvedRestaurantId = await getRestaurantIdForOrder(orderId);

    return NextResponse.json({
      success: true,
      data: {
        orderId,
        itemCount: items.length,
        productIds,
        foundProducts: foundProducts.map((p: any) => ({ _id: String(p._id), restaurantId: p?.restaurantId ? String(p.restaurantId) : '' })),
        resolvedRestaurantId,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Debug failed' }, { status: 500 });
  }
}
