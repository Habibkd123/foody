import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Order from '@/app/models/Order';
import { buildInvoicePdfBuffer, ensureInvoiceForOrder, getRestaurantIdForOrder } from '@/app/lib/invoice';

export const runtime = 'nodejs';

async function getAuthFromCookies() {
  const cookieStore = await cookies();
  const role = cookieStore.get('user-role')?.value;
  const userId = cookieStore.get('user-id')?.value;

  if (!role || !userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return { ok: false as const, status: 401 as const, error: 'Unauthorized' };
  }

  return { ok: true as const, role, userId };
}

export async function GET(_req: NextRequest,
  { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid order id' }, { status: 400 });
    }

    await connectDB();

    const order: any = await Order.findById(id).select('user status').lean();
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const role = String(auth.role || '').toLowerCase();
    const userId = auth.userId;

    // Authorization
    if (role === 'user') {
      if (String(order.user) !== String(userId)) {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
      }
    } else if (role === 'restaurant') {
      const rid = await getRestaurantIdForOrder(id);
      if (!rid || String(rid) !== String(userId)) {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
      }
    } else if (role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    // Ensure invoice exists if paid
    try {
      await ensureInvoiceForOrder(id, { gstRate: 5 });
    } catch {}

    const pdf = await buildInvoicePdfBuffer(id);
    const body = new Uint8Array(pdf);

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${id}.pdf"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Failed to download invoice' }, { status: 500 });
  }
}

