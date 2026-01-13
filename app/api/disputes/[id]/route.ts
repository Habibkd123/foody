import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Dispute from '@/app/models/Dispute';
import { getRestaurantIdForOrder } from '@/app/lib/invoice';

async function getAuthFromCookies() {
  const cookieStore = await cookies();
  const role = cookieStore.get('user-role')?.value;
  const userId = cookieStore.get('user-id')?.value;

  if (!role || !userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return { ok: false as const, status: 401 as const, error: 'Unauthorized' };
  }

  return { ok: true as const, role: String(role).toLowerCase(), userId };
}

function isOpenStatus(status: string) {
  return ['open', 'awaiting_restaurant', 'awaiting_customer', 'under_review'].includes(String(status || '').toLowerCase());
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
      return NextResponse.json({ success: false, error: 'Invalid dispute id' }, { status: 400 });
    }

    await connectDB();
    const dispute: any = await Dispute.findById(id)
      .populate('order', 'orderId total status createdAt')
      .lean();
    if (!dispute) {
      return NextResponse.json({ success: false, error: 'Dispute not found' }, { status: 404 });
    }

    const role = auth.role;
    const userId = auth.userId;

    if (role === 'user') {
      if (String(dispute.user) !== String(userId)) {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
      }
    } else if (role === 'restaurant') {
      if (String(dispute.restaurantId) !== String(userId)) {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
      }
    } else if (role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: dispute });
  } catch (error: any) {
    console.error('Failed to fetch dispute:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to fetch dispute' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid dispute id' }, { status: 400 });
    }

    const body = await req.json();
    const action = typeof body?.action === 'string' ? body.action.trim().toLowerCase() : '';

    await connectDB();

    const dispute: any = await Dispute.findById(id);
    if (!dispute) {
      return NextResponse.json({ success: false, error: 'Dispute not found' }, { status: 404 });
    }

    const role = auth.role;
    const userId = auth.userId;

    // Role ownership checks
    if (role === 'user') {
      if (String(dispute.user) !== String(userId)) {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
      }
    } else if (role === 'restaurant') {
      if (String(dispute.restaurantId) !== String(userId)) {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
      }
    } else if (role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    // Guard: must be open unless admin decides to reopen etc.
    const curStatus = String(dispute.status || '').toLowerCase();
    if (!isOpenStatus(curStatus) && role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Dispute is closed' }, { status: 400 });
    }

    if (role === 'restaurant') {
      if (action !== 'respond') {
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
      }

      // Re-validate restaurantId from order (defense-in-depth)
      try {
        const rid = await getRestaurantIdForOrder(String(dispute.order));
        if (!rid || String(rid) !== String(userId)) {
          return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }
      } catch {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
      }

      const message = typeof body?.message === 'string' ? body.message.trim() : '';
      const evidenceUrls = Array.isArray(body?.evidenceUrls)
        ? body.evidenceUrls.map((x: any) => (typeof x === 'string' ? x.trim() : '')).filter(Boolean).slice(0, 6)
        : [];

      dispute.restaurantResponse = {
        message,
        evidence: evidenceUrls.map((url: string) => ({
          url,
          uploadedByRole: 'restaurant',
          uploadedBy: new mongoose.Types.ObjectId(userId),
          uploadedAt: new Date(),
        })),
        respondedAt: new Date(),
      };
      dispute.status = 'under_review';
      await dispute.save();
      return NextResponse.json({ success: true, data: dispute });
    }

    if (role === 'user') {
      if (action !== 'add_evidence') {
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
      }
      const evidenceUrls = Array.isArray(body?.evidenceUrls)
        ? body.evidenceUrls.map((x: any) => (typeof x === 'string' ? x.trim() : '')).filter(Boolean).slice(0, 6)
        : [];

      if (evidenceUrls.length === 0) {
        return NextResponse.json({ success: false, error: 'No evidence provided' }, { status: 400 });
      }

      dispute.evidence = [...(dispute.evidence || []), ...evidenceUrls.map((url: string) => ({
        url,
        uploadedByRole: 'user',
        uploadedBy: new mongoose.Types.ObjectId(userId),
        uploadedAt: new Date(),
      }))].slice(0, 12);

      // ping back to restaurant if needed
      if (curStatus === 'awaiting_customer') {
        dispute.status = 'awaiting_restaurant';
      }

      await dispute.save();
      return NextResponse.json({ success: true, data: dispute });
    }

    // Admin actions
    if (role === 'admin') {
      if (!['set_status', 'resolve', 'reject'].includes(action)) {
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
      }

      const decisionNote = typeof body?.decisionNote === 'string' ? body.decisionNote.trim() : '';
      const refundAmount = body?.refundRecommendation?.amount;
      const refundReason = typeof body?.refundRecommendation?.reason === 'string' ? body.refundRecommendation.reason.trim() : '';

      if (action === 'set_status') {
        const next = typeof body?.status === 'string' ? body.status.trim().toLowerCase() : '';
        if (!['under_review', 'awaiting_restaurant', 'awaiting_customer', 'resolved', 'rejected', 'open'].includes(next)) {
          return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
        }
        dispute.status = next;
      }
      if (action === 'resolve') {
        dispute.status = 'resolved';
      }
      if (action === 'reject') {
        dispute.status = 'rejected';
      }

      dispute.adminMediation = {
        status: ['resolved', 'rejected'].includes(String(dispute.status)) ? dispute.status : 'under_review',
        decisionNote,
        refundRecommendation: {
          amount: typeof refundAmount === 'number' ? refundAmount : undefined,
          reason: refundReason,
        },
        decidedAt: new Date(),
        decidedBy: new mongoose.Types.ObjectId(userId),
      };

      await dispute.save();

      // Optional hook: if admin wants to mark order refunded separately, keep that workflow elsewhere.
      // This endpoint only records dispute decision.
      return NextResponse.json({ success: true, data: dispute });
    }

    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  } catch (error: any) {
    console.error('Failed to update dispute:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to update dispute' }, { status: 500 });
  }
}
