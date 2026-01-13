import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/User';
import Product from '@/app/models/Product';
import Category from '@/app/models/Category';

type FoodItemResponse = {
  _id: string;
  name: string;
  price: number;
  category: 'Veg' | 'Non-Veg';
  imageUrl?: string;
  availability: boolean;
  status: 'pending' | 'approved' | 'rejected';
};

async function getOrCreateCategoryByName(name: 'Veg' | 'Non-Veg') {
  const existing: any = await Category.findOne({ name }).select('_id name');
  if (existing) return existing;
  return await Category.create({ name });
}

function formatProductAsFoodItem(product: any): FoodItemResponse {
  const categoryName = (product?.category?.name || '').toString();
  const category = categoryName === 'Non-Veg' ? 'Non-Veg' : 'Veg';
  const images: string[] = Array.isArray(product?.images) ? product.images : [];
  return {
    _id: product._id.toString(),
    name: product.name,
    price: Number(product.price || 0),
    category,
    imageUrl: images?.[0] || undefined,
    availability: Boolean(product.inStock),
    status: (product.approvalStatus || 'pending') as any,
  };
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

export async function GET(request: NextRequest) {
  try {
    const auth = await getRestaurantUser();
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim();
    const status = (searchParams.get('status') || '').trim().toLowerCase();

    const filter: any = { restaurantId: auth.userId };
    if (q) filter.name = { $regex: q, $options: 'i' };
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      filter.approvalStatus = status;
    }

    const products = await Product.find(filter)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: products.map(formatProductAsFoodItem) });
  } catch (error: any) {
    console.error('Failed to fetch restaurant foods:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch foods' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getRestaurantUser();
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const price = typeof body?.price === 'number' ? body.price : Number(body?.price);
    const category = body?.category === 'Veg' || body?.category === 'Non-Veg' ? body.category : null;
    const imageUrl = typeof body?.imageUrl === 'string' ? body.imageUrl.trim() : undefined;
    const availability = typeof body?.availability === 'boolean' ? body.availability : true;

    if (!name) {
      return NextResponse.json({ success: false, error: 'Food name is required' }, { status: 400 });
    }
    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json({ success: false, error: 'Valid price is required' }, { status: 400 });
    }
    if (!category) {
      return NextResponse.json({ success: false, error: 'Valid category is required' }, { status: 400 });
    }

    const categoryDoc: any = await getOrCreateCategoryByName(category);

    const created = await Product.create({
      restaurantId: auth.userId,
      approvalStatus: 'pending',
      name,
      description: '',
      images: imageUrl ? [imageUrl] : [],
      price,
      category: categoryDoc._id,
      stock: 999,
      inStock: availability,
      status: 'active',
    });
    const populated = await Product.findById(created._id).populate('category', 'name').lean();
    return NextResponse.json({ success: true, data: populated ? formatProductAsFoodItem(populated) : formatProductAsFoodItem(created) }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create restaurant food:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create food' },
      { status: 500 }
    );
  }
}
