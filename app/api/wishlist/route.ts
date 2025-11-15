import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Wishlist from '@/app/models/WishList';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get all wishlists (optional: you can add query by user_id)
    const wishlists = await Wishlist.find()
      .populate('user_id')
      .populate('products');
    
    return NextResponse.json(wishlists, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching wishlists', error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const wishlist = await Wishlist.create(body);
    
    return NextResponse.json(wishlist, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating wishlist', error },
      { status: 400 }
    );
  }
}
