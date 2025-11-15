// app/api/wishlist/user/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/app/models/Order';
import User from '@/app/models/User'; // ✅ Correct import

// GET: fetch wishlist
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ user_id: string }> }
) {
  try {
    await connectDB();
    const { user_id } = await params;


    const userData = await User.findById(user_id);
    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userOrder = await Order.find({ user: user_id })
    .populate({
      path: 'items.product',
      populate: {
        path: 'category', // category field inside Product model
        model: 'Category'
      }
    }).populate("user");
  
    return NextResponse.json({ success: true, data: userOrder || [] });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Error fetching user' }, { status: 500 });
  }
}
