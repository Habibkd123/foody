import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/app/models/Review';
import Product from '@/app/models/Product';
import mongoose from 'mongoose';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid product id' }, { status: 400 });
    }

    const reviews = await Review.find({ product: id })
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: reviews });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid product id' }, { status: 400 });
    }

    const body = await req.json();
    const { user, rating, comment, images } = body || {};
    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const review = await Review.create({
      user: user && mongoose.Types.ObjectId.isValid(user) ? user : undefined,
      product: id,
      rating,
      comment,
      images: Array.isArray(images) ? images.slice(0, 6) : undefined,
      verified: false,
    });

    const productDoc: any = await Product.findById(id).select('rating totalReviews');
    if (productDoc) {
      const prevCount = productDoc.totalReviews || 0;
      const prevAvg = productDoc.rating || 0;
      const newCount = prevCount + 1;
      const newAvg = ((prevAvg * prevCount) + rating) / newCount;
      productDoc.rating = Number(newAvg.toFixed(2));
      productDoc.totalReviews = newCount;
      await productDoc.save();
    }

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to create review' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid product id' }, { status: 400 });
    }

    const body = await req.json();
    const { reviewId, action, comment, user } = body || {};
    if (!reviewId || !mongoose.Types.ObjectId.isValid(reviewId)) {
      return NextResponse.json({ success: false, error: 'Invalid review id' }, { status: 400 });
    }

    const review = await Review.findOne({ _id: reviewId, product: id });
    if (!review) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    if (action === 'helpful') {
      review.helpful = (review.helpful || 0) + 1;
      await review.save();
    } else if (action === 'notHelpful') {
      // @ts-ignore - may be missing on legacy docs
      review.notHelpful = (review as any).notHelpful ? (review as any).notHelpful + 1 : 1;
      await review.save();
    } else if (action === 'reply') {
      if (!comment || typeof comment !== 'string' || comment.trim().length === 0) {
        return NextResponse.json({ success: false, error: 'Reply comment required' }, { status: 400 });
      }
      const reply: any = { comment: comment.trim(), createdAt: new Date() };
      if (user && mongoose.Types.ObjectId.isValid(user)) reply.user = user;
      // @ts-ignore replies may be undefined in legacy docs
      if (!review.replies) (review as any).replies = [];
      (review as any).replies.push(reply);
      await review.save();
    } else {
      return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    }

    const reviews = await Review.find({ product: id })
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: reviews });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to update review' }, { status: 500 });
  }
}
