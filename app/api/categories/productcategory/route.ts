import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Category from '@/app/models/Category';
import Product from '@/app/models/Product';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const includeSubcategories = searchParams.get('includeSub') === 'true';

    // Fetch all categories
    const categories = await Category.find().lean();

    if (!categories.length) {
      return NextResponse.json(
        { success: false, message: 'No categories found' },
        { status: 404 }
      );
    }

    // Prepare category IDs map for easy lookup
    const categoryIds = categories.map(cat => cat._id);

    // Fetch products for all categories
    let products = await Product.aggregate([
      { $match: { category: { $in: categoryIds } } },
      {
        $addFields: {
          inStock: { $cond: [{ $gt: ["$stock", 0] }, true, false] }
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    // If includeSubcategories = true, load subcategory products too
    if (includeSubcategories) {
      const subcategoryIds = (
        await Category.find({ parent: { $in: categoryIds } }).select('_id')
      ).map(sc => sc._id);

      if (subcategoryIds.length) {
        const subProducts = await Product.aggregate([
          { $match: { category: { $in: subcategoryIds } } },
          {
            $addFields: {
              inStock: { $cond: [{ $gt: ["$stock", 0] }, true, false] }
            }
          }
        ]);
        products = [...products, ...subProducts];
      }
    }

    // Group products under their category
    const categoryWithProducts = categories.map((cat:any) => ({
      ...cat,
      products: products.filter((p:any) => p.category?.toString() === cat._id.toString())
    }));

    return NextResponse.json({
      success: true,
      data: categoryWithProducts
    });

  } catch (error:any) {
    console.error('Error fetching categories with products:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}
