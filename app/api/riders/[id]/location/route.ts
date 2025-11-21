import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Rider from '@/app/models/Rider';

function isAdmin(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret');
  return !!process.env.ADMIN_SECRET && secret === process.env.ADMIN_SECRET;
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const { lat, lng } = body || {};
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return NextResponse.json({ success: false, error: 'lat and lng required' }, { status: 400 });
    }

    const rider = await Rider.findById(id);
    if (!rider) return NextResponse.json({ success: false, error: 'Rider not found' }, { status: 404 });

    // Optional: require admin to update someone else's location. If not provided, still accept (for rider app integration later)
    if (!isAdmin(req)) {
      // In production, enforce auth for rider app. For now, allow to proceed.
    }

    rider.location = { lat, lng, at: new Date() } as any;
    await rider.save();

    // Emit realtime driver location to clients by orderId if active
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const io = (global as any).io as { emit: (event: string, payload: any) => void } | undefined;
      if (io && rider.activeOrder) {
        io.emit('driver-location', {
          orderId: rider.activeOrder.toString(),
          riderId: rider._id.toString(),
          lat,
          lng,
          at: new Date().toISOString(),
        });
      }
    } catch {}

    return NextResponse.json({ success: true, data: { riderId: rider._id, location: rider.location } });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Failed to update location' }, { status: 500 });
  }
}
