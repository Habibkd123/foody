import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/app/models/Category';
import Product from '@/app/models/Product';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const includeSubcategories = searchParams.get('includeSub') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100'); // Default to large if not specified
    const skip = (page - 1) * limit;

    // Fetch only parent categories if needed, or all based on requirement
    // Usually for home page sections, we want main categories
    const categories = await Category.find({ parent: null })
      .skip(skip)
      .limit(limit)
      .lean();

    if (!categories.length) {
      return NextResponse.json(
        { success: false, message: 'No categories found' },
        { status: 404 }
      );
    }

    const categoryIds = categories.map(cat => cat._id);

    // Fetch products for these categories
    let products = await Product.aggregate([
      { $match: { category: { $in: categoryIds } } },
      {
        $addFields: {
          inStock: { $cond: [{ $gt: ["$stock", 0] }, true, false] }
        }
      },
      { $sort: { createdAt: -1 } },
      { $limit: 20 } // Limit products per category for summary view
    ]);

    // If includeSubcategories = true, load subcategory products too
    if (includeSubcategories) {
      const subcategories = await Category.find({ parent: { $in: categoryIds } }).lean();
      const subcategoryIds = subcategories.map(sc => sc._id);

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
    const categoryWithProducts = categories.map((cat: any) => ({
      ...cat,
      products: products.filter((p: any) => p.category?.toString() === cat._id.toString())
    }));

    return NextResponse.json({
      success: true,
      data: categoryWithProducts,
      pagination: {
        page,
        limit,
        count: categories.length
      }
    });

  } catch (error: any) {
    console.error('Error fetching categories with products:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

