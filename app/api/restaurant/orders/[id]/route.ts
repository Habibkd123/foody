import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import User, { OrderStatus } from '@/app/models/User';
import Order from '@/app/models/Order';
import Product from '@/app/models/Product';
import InventoryItem from '@/app/models/InventoryItem';
import { computeCancellationPenaltyAmount, shouldApplyCancellationPenalty } from '@/app/lib/cancellation-penalty';

function canTransition(from: string, to: string) {
  const f = from.toLowerCase();
  const t = to.toLowerCase();

  // terminal states
  if (f === 'delivered' || f === 'canceled') return false;
  if (t === f) return true;

  const allowed: Record<string, string[]> = {
    pending: ['paid', 'processing', 'canceled'],
    paid: ['processing', 'canceled'],
    processing: ['shipped', 'canceled'],
    shipped: ['delivered'],
  };

  return (allowed[f] || []).includes(t);
}

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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getRestaurantUser();
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid order id' }, { status: 400 });
    }

    const body = await req.json();
    const nextStatus = typeof body?.status === 'string' ? body.status.toLowerCase() : '';
    if (!nextStatus || !Object.values(OrderStatus).includes(nextStatus as any)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }

    const order: any = await Order.findById(id).populate('items.product', 'restaurantId recipe');
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const belongsToRestaurant = (order.items || []).some((it: any) => {
      const rid = it?.product?.restaurantId;
      return rid && rid.toString() === auth.userId;
    });

    if (!belongsToRestaurant) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const currentStatus = String(order.status || '').toLowerCase();
    if (!canTransition(currentStatus, nextStatus)) {
      return NextResponse.json(
        { success: false, error: `Invalid status transition: ${currentStatus} -> ${nextStatus}` },
        { status: 400 }
      );
    }

    // Cancellation penalty: applies when cancelling after cooking started (processing/shipped based on policy)
    if (nextStatus === 'canceled' && currentStatus !== 'canceled') {
      try {
        const restaurantUser: any = await User.findById(auth.userId).select('restaurant.cancellationPenalty').lean();
        const policy = restaurantUser?.restaurant?.cancellationPenalty;
        if (shouldApplyCancellationPenalty(currentStatus, policy)) {
          const amount = computeCancellationPenaltyAmount(Number(order.total || 0), policy);
          if (amount > 0) {
            (order as any).cancellationPenaltyAmount = amount;
            (order as any).cancellationPenaltyReason = 'Canceled after cooking started';
            (order as any).canceledAt = new Date();
          }
        } else {
          (order as any).canceledAt = new Date();
        }
      } catch (e) {
        (order as any).canceledAt = new Date();
      }
    }

    // Inventory deduction happens when moving into processing
    if (nextStatus === 'processing' && currentStatus !== 'processing') {
      // Build total required raw items
      const requiredByItemId: Record<string, number> = {};
      const productsInOrder: any[] = [];

      for (const it of order.items || []) {
        const p = it?.product;
        if (!p) continue;
        productsInOrder.push(p);
        const qtyOrdered = Number(it?.quantity || 0);
        const recipe = Array.isArray(p?.recipe) ? p.recipe : [];

        for (const r of recipe) {
          const itemId = (r?.item || '').toString();
          const perUnit = Number(r?.qty || 0);
          if (!itemId || !Number.isFinite(perUnit) || perUnit <= 0) continue;
          const needed = perUnit * qtyOrdered;
          requiredByItemId[itemId] = (requiredByItemId[itemId] || 0) + needed;
        }
      }

      const requiredItemIds = Object.keys(requiredByItemId);
      if (requiredItemIds.length > 0) {
        const invItems = await InventoryItem.find({
          _id: { $in: requiredItemIds },
          restaurantId: auth.userId,
          isActive: true,
        }).select('_id quantity');

        const invMap = new Map(invItems.map((x: any) => [x._id.toString(), Number(x.quantity || 0)]));
        const insufficientItemIds = requiredItemIds.filter((iid) => (invMap.get(iid) ?? 0) < requiredByItemId[iid]);

        if (insufficientItemIds.length > 0) {
          // Auto mark any products that require insufficient items as out of stock
          const affectedProductIds: string[] = [];
          for (const p of productsInOrder) {
            const recipe = Array.isArray(p?.recipe) ? p.recipe : [];
            const usesInsufficient = recipe.some((r: any) => insufficientItemIds.includes((r?.item || '').toString()));
            if (usesInsufficient) {
              affectedProductIds.push(p._id.toString());
            }
          }

          if (affectedProductIds.length > 0) {
            await Product.updateMany(
              { _id: { $in: affectedProductIds }, restaurantId: auth.userId },
              { $set: { inStock: false } }
            );
          }

          return NextResponse.json(
            { success: false, error: 'Insufficient inventory to start processing this order' },
            { status: 400 }
          );
        }

        // Deduct inventory
        for (const itemId of requiredItemIds) {
          await InventoryItem.updateOne(
            { _id: itemId, restaurantId: auth.userId },
            { $inc: { quantity: -requiredByItemId[itemId] } }
          );
        }
      }
    }

    order.status = nextStatus;
    await order.save();

    return NextResponse.json({ success: true, data: { _id: order._id.toString(), status: order.status } });
  } catch (error: any) {
    console.error('Failed to update order status:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update order' },
      { status: 500 }
    );
  }
}

