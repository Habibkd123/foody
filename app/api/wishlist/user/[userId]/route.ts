// app/api/wishlist/user/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Wishlist from '@/app/models/WishList';
import Product from '@/app/models/Product'; // Ensure Product model exists

// GET: fetch wishlist
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();
    const { userId } = params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const wishlist = await Wishlist.findOne({ user_id: userId })
      .populate('products');

    return NextResponse.json({ success: true, data: wishlist || [] });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json({ error: 'Error fetching wishlist' }, { status: 500 });
  }
}

// POST: add product to wishlist
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();
    const { userId } = params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const { productId } = await request.json();

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    let wishlist = await Wishlist.findOne({ user_id: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user_id: userId, products: [productId] });
    } else {
      // prevent duplicates
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
      }
    }

    await wishlist.save();
    await wishlist.populate('products');

    return NextResponse.json({ success: true, data: wishlist });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json({ error: 'Error adding to wishlist' }, { status: 500 });
  }
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();
    const { userId } = params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const { productId } = await request.json();

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const wishlist = await Wishlist.findOne({ user_id: userId });

    if (!wishlist) {
      return NextResponse.json({ error: 'Wishlist not found' }, { status: 404 });
    }

    // remove product if exists
    wishlist.products = wishlist.products.filter(
      (id:any) => id.toString() !== productId
    );

    await wishlist.save();
    await wishlist.populate('products');

    return NextResponse.json({ success: true, data: wishlist });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return NextResponse.json(
      { error: 'Error removing from wishlist' },
      { status: 500 }
    );
  }
}