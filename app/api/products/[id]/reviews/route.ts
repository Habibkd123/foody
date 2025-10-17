import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/app/models/Review';
import Product from '@/app/models/Product';
import mongoose from 'mongoose';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;
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

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;
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
