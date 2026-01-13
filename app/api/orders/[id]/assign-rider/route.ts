import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/app/models/Order';
import Rider from '@/app/models/Rider';

function assertAdmin(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret');
  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return false;
  }
  return true;
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!assertAdmin(req)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const { riderId } = body || {};
    if (!riderId) return NextResponse.json({ success: false, error: 'riderId required' }, { status: 400 });

    const order = await Order.findById(id);
    if (!order) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });

    const rider = await Rider.findById(riderId);
    if (!rider) return NextResponse.json({ success: false, error: 'Rider not found' }, { status: 404 });

    order.rider = rider._id as any;
    await order.save();

    rider.activeOrder = order._id as any;
    rider.status = 'on_delivery';
    await rider.save();

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const io = (global as any).io as { emit: (event: string, payload: any) => void } | undefined;
      if (io) {
        io.emit('rider-assigned', { orderId: id, riderId: rider._id.toString(), at: new Date().toISOString() });
      }
    } catch {}

    return NextResponse.json({ success: true, data: { orderId: id, riderId: rider._id } });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Failed to assign rider' }, { status: 500 });
  }
}

