import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/User';
import Product from '@/app/models/Product';
import Category from '@/app/models/Category';
import InventoryItem from '@/app/models/InventoryItem';

async function getOrCreateCategoryByName(name: 'Veg' | 'Non-Veg') {
  const existing: any = await Category.findOne({ name }).select('_id name');
  if (existing) return existing;
  return await Category.create({ name });
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
      return NextResponse.json({ success: false, error: 'Invalid food id' }, { status: 400 });
    }

    const product: any = await Product.findOne({ _id: id, restaurantId: auth.userId });
    if (!product) {
      return NextResponse.json({ success: false, error: 'Food not found' }, { status: 404 });
    }

    const body = await req.json();

    if (typeof body?.availability === 'boolean') {
      product.inStock = body.availability;
    }

    if (typeof body?.name === 'string' && body.name.trim().length > 0) {
      product.name = body.name.trim();
    }

    if (body?.price !== undefined) {
      const price = typeof body.price === 'number' ? body.price : Number(body.price);
      if (!Number.isFinite(price) || price < 0) {
        return NextResponse.json({ success: false, error: 'Valid price is required' }, { status: 400 });
      }
      product.price = price;
    }

    if (body?.category) {
      if (body.category !== 'Veg' && body.category !== 'Non-Veg') {
        return NextResponse.json({ success: false, error: 'Valid category is required' }, { status: 400 });
      }
      const categoryDoc: any = await getOrCreateCategoryByName(body.category);
      product.category = categoryDoc._id;
    }

    if (typeof body?.imageUrl === 'string') {
      const v = body.imageUrl.trim();
      product.images = v ? [v] : [];
    }

    if (Array.isArray(body?.recipe)) {
      const nextRecipe: Array<{ item: any; qty: number }> = [];
      for (const r of body.recipe) {
        const itemId = typeof r?.itemId === 'string' ? r.itemId : (typeof r?.item === 'string' ? r.item : '');
        const qty = Number(r?.qty);
        if (!itemId || !mongoose.Types.ObjectId.isValid(itemId)) {
          return NextResponse.json({ success: false, error: 'Invalid recipe item' }, { status: 400 });
        }
        if (!Number.isFinite(qty) || qty < 0) {
          return NextResponse.json({ success: false, error: 'Invalid recipe qty' }, { status: 400 });
        }
        const exists = await InventoryItem.findOne({ _id: itemId, restaurantId: auth.userId, isActive: true }).select('_id');
        if (!exists) {
          return NextResponse.json({ success: false, error: 'Recipe item not found in your inventory' }, { status: 400 });
        }
        nextRecipe.push({ item: itemId, qty });
      }
      product.recipe = nextRecipe as any;
    }

    if (Array.isArray(body?.addonGroups)) {
      // Basic sanitation; detailed UI validation will happen on frontend
      product.addonGroups = body.addonGroups.map((g: any) => ({
        name: String(g?.name || '').trim(),
        selectionType: g?.selectionType === 'single' ? 'single' : 'multiple',
        min: Number(g?.min ?? 0),
        max: Number(g?.max ?? 0),
        options: Array.isArray(g?.options)
          ? g.options.map((o: any) => ({
              name: String(o?.name || '').trim(),
              price: Number(o?.price ?? 0),
              inStock: typeof o?.inStock === 'boolean' ? o.inStock : true,
            }))
          : [],
      }));
    }

    if (Array.isArray(body?.variants)) {
      product.variants = body.variants.map((v: any) => ({
        name: String(v?.name || '').trim(),
        selectionType: 'single',
        options: Array.isArray(v?.options)
          ? v.options.map((o: any) => ({
              name: String(o?.name || '').trim(),
              price: Number(o?.price ?? 0),
              inStock: typeof o?.inStock === 'boolean' ? o.inStock : true,
            }))
          : [],
      }));
    }

    if (typeof body?.isCombo === 'boolean') {
      product.isCombo = body.isCombo;
    }

    if (Array.isArray(body?.comboItems)) {
      const nextCombo: Array<{ product: any; quantity: number }> = [];
      for (const ci of body.comboItems) {
        const pid = String(ci?.product || '');
        const qty = Number(ci?.quantity ?? 1);
        if (!pid || !mongoose.Types.ObjectId.isValid(pid)) {
          return NextResponse.json({ success: false, error: 'Invalid combo product id' }, { status: 400 });
        }
        if (!Number.isFinite(qty) || qty <= 0) {
          return NextResponse.json({ success: false, error: 'Invalid combo quantity' }, { status: 400 });
        }
        nextCombo.push({ product: pid, quantity: qty });
      }
      product.comboItems = nextCombo as any;
    }

    // Any edit sends the product back to pending approval
    product.approvalStatus = 'pending';

    await product.save();
    const populated = await Product.findById(product._id).populate('category', 'name').lean();
    const categoryName = (populated as any)?.category?.name || '';
    const category = categoryName === 'Non-Veg' ? 'Non-Veg' : 'Veg';
    const images: string[] = Array.isArray((populated as any)?.images) ? (populated as any).images : [];
    return NextResponse.json({
      success: true,
      data: {
        _id: product._id.toString(),
        name: (populated as any)?.name || product.name,
        price: Number((populated as any)?.price || product.price || 0),
        category,
        imageUrl: images?.[0] || undefined,
        availability: Boolean((populated as any)?.inStock),
        status: ((populated as any)?.approvalStatus || 'pending'),
      },
    });
  } catch (error: any) {
    console.error('Failed to update restaurant food:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update food' },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getRestaurantUser();
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid food id' }, { status: 400 });
    }

    const deleted = await Product.findOneAndDelete({ _id: id, restaurantId: auth.userId });
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Food not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete restaurant food:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete food' },
      { status: 500 }
    );
  }
}

