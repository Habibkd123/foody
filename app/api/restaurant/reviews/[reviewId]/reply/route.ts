import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/User';
import Review from '@/app/models/Review';
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

export async function POST(req: NextRequest, { params }: { params: Promise<{ reviewId: string }> }) {
  try {
    const auth = await getRestaurantUser();
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { reviewId } = await params;
    if (!reviewId || !mongoose.Types.ObjectId.isValid(reviewId)) {
      return NextResponse.json({ success: false, error: 'Invalid review id' }, { status: 400 });
    }

    const body = await req.json();
    const comment = typeof body?.comment === 'string' ? body.comment.trim() : '';
    if (!comment) {
      return NextResponse.json({ success: false, error: 'Reply comment required' }, { status: 400 });
    }

    const review: any = await Review.findById(reviewId);
    if (!review) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    const productId = review?.product?.toString?.();
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ success: false, error: 'Invalid review product' }, { status: 400 });
    }

    const product: any = await Product.findById(productId).select('restaurantId').lean();
    const rid = product?.restaurantId?.toString?.();
    if (!rid || rid !== auth.userId) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    // Upsert a single reply per restaurant (edit if already replied)
    const replies = Array.isArray((review as any).replies) ? (review as any).replies : [];
    const existingIdx = replies.findIndex((r: any) => String(r?.user || '') === auth.userId);
    if (existingIdx >= 0) {
      replies[existingIdx] = { ...replies[existingIdx], comment, createdAt: replies[existingIdx]?.createdAt || new Date() };
    } else {
      replies.push({ user: new mongoose.Types.ObjectId(auth.userId), comment, createdAt: new Date() });
    }
    (review as any).replies = replies;
    await review.save();

    const reviews = await Review.find({ product: productId })
      .populate('user', 'firstName lastName email')
      .populate('replies.user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: reviews });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to reply to review' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ reviewId: string }> }) {
  try {
    const auth = await getRestaurantUser();
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { reviewId } = await params;
    if (!reviewId || !mongoose.Types.ObjectId.isValid(reviewId)) {
      return NextResponse.json({ success: false, error: 'Invalid review id' }, { status: 400 });
    }

    const review: any = await Review.findById(reviewId);
    if (!review) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    const productId = review?.product?.toString?.();
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ success: false, error: 'Invalid review product' }, { status: 400 });
    }

    const product: any = await Product.findById(productId).select('restaurantId').lean();
    const rid = product?.restaurantId?.toString?.();
    if (!rid || rid !== auth.userId) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const replies = Array.isArray((review as any).replies) ? (review as any).replies : [];
    (review as any).replies = replies.filter((r: any) => String(r?.user || '') !== auth.userId);
    await review.save();

    const reviews = await Review.find({ product: productId })
      .populate('user', 'firstName lastName email')
      .populate('replies.user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: reviews });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to delete reply' }, { status: 500 });
  }
}

