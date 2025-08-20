import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/app/models/Product';
import { updateProductSchema } from '@/utils/validations';
import {
  handleError,
  validateObjectId,
  formatProductResponse,
  createSuccessResponse,
  createErrorResponse
} from '@/utils/ProductResponse';
import { ApiResponse } from '@/types/product';
import Review from '@/app/models/Review';
import Delivery from '@/app/models/Delivery';
// GET - Fetch product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;
    const { searchParams } = new URL(request.url);

    // Optional: limit for related products
    const relatedLimit = parseInt(searchParams.get('relatedLimit') || '4', 10);

    // Optional: fields selection
    const fields = searchParams.get('fields')?.split(',').join(' ') || '';

    if (!validateObjectId(id)) {
      return createErrorResponse(
        'Invalid product ID format',
        'The provided ID is not a valid MongoDB ObjectId',
        400
      );
    }

    // Fetch product, optionally select fields
    const product: any = await Product.findById(id)
      .populate({path: "category", select: "name  _id"})
      .select(fields)
      .lean()

    if (!product) {
      return createErrorResponse(
        'Product not found',
        'No product found with the provided ID',
        404
      );
    }

    // Example: Add stock status
    product.inStock = product.quantity && product.quantity > 0;

    // Example: Increment views
    await Product.findByIdAndUpdate(id, { $inc: { views: 1 } });

    // Fetch related products with limit
    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: id }
    })
      .limit(relatedLimit)
      .lean();

    product.relatedProducts = relatedProducts.map(formatProductResponse);

    // Example: Fetch reviews if you have a Review model
    const reviews = await Review.find({ product: id }).lean();
    product.reviews = reviews;

    // delery Info
    if (product.delivery) {
      const delivery = await Delivery.findById(product.delivery).lean();
      if (delivery) {
        product.delivery = delivery;
      }
    }
    // finally format the product response
    const formattedProduct = {
      id: product._id.toString(),
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      images: product.images || [],
      totalReviews: product.reviews ? product.reviews.length : 0,
      category: product.category ? {
        id: product.category._id.toString(),
        name: product.category.name
      } : null,
      discount: 47,
      description: product.description || "No description available",
      rating: product.rating || 0,
      inStock: product.inStock,
      longDescription: product.longDescription || "Experience the perfect combination of nutrition and taste with our biofortified rice. Each grain is carefully selected and processed to retain maximum nutritional value while ensuring superior taste and texture. This rice is enriched with iron, zinc, and vitamin A, making it an excellent choice for health-conscious families.",
      features: product.features || [
        "Biofortified with essential nutrients (Iron, Zinc, Vitamin A)",
        "Medium grain rice with perfect texture",
        "Premium quality, hand-selected grains",
        "Rich aroma and authentic taste",
        "Easy to cook and digest",
        "Naturally gluten-free",
        "Source of complex carbohydrates",
        "Suitable for all age groups"
      ],
      specifications: product.specifications || {
        Weight: "1kg",
        Brand: "Better Nutrition",
        Type: "Biofortified Rice",
        "Grain Type": "Medium Grain",
        "Shelf Life": "12 months from date of packaging",
        Storage: "Cool & dry place, away from direct sunlight",
        "Nutritional Benefits": "Enriched with Iron (15mg/100g), Zinc (8mg/100g), Vitamin A (120mcg/100g)",
        Origin: "Premium farms in Punjab, India",
        "Processing Type": "Traditional milling with modern fortification",
        "Cooking Time": "15-20 minutes",
        "Water Ratio": "1:2 (Rice:Water)",
        Certification: "FSSAI Approved, ISO 22000:2018"
      },
      nutritionalInfo: product.nutritionalInfo || {
        "Energy": "345 kcal",
        "Protein": "6.8g",
        "Carbohydrates": "78g",
        "Fat": "0.7g",
        "Fiber": "1.3g",
        "Iron": "15mg",
        "Zinc": "8mg",
        "Vitamin A": "120mcg"
      },
      stockCount: product.stock || 0,
      brand: product.brand || "Better Nutrition",
      sku: product.sku || "BN-BFR-1KG-001",
      weight: product.weight || "1kg",
      dimensions: product.dimensions || "25cm x 15cm x 8cm",
      // tags: ["biofortified", "healthy", "nutritious", "medium-grain", "premium"],
      deliveryInfo: product.delivery || {
        freeDelivery: true,
        estimatedDays: "2-3 days",
        expressAvailable: true,
        expressDays: "Same day"
      },
      warranty: product.warranty || "Quality guarantee - 100% satisfaction or money back",
      reviews: product.reviews || [
        {
          id: 1,
          userName: "Sunita Devi",
          rating: 5,
          comment: "Excellent quality rice! The grains are perfectly sized and cook beautifully. My family loves the taste and I feel good knowing it's nutritious too. Definitely worth the price.",
          date: "3 days ago",
          verified: true,
          helpful: 15,
          images: ["https://picsum.photos/100/100?random=r1"]
        },
        {
          id: 2,
          userName: "Rajesh Kumar",
          rating: 4,
          comment: "Good quality biofortified rice. Cooks well and tastes great. Delivery was quick. Only minor complaint is the packaging could be better.",
          date: "1 week ago",
          verified: true,
          helpful: 8,
          images: []
        },
        {
          id: 3,
          userName: "Priya Sharma",
          rating: 5,
          comment: "Amazing product! As a nutritionist, I appreciate the added vitamins and minerals. Perfect for growing children and health-conscious families.",
          date: "2 weeks ago",
          verified: true,
          helpful: 22,
          images: ["https://picsum.photos/100/100?random=r2", "https://picsum.photos/100/100?random=r3"]
        },
        {
          id: 4,
          userName: "Amit Patel",
          rating: 4,
          comment: "Value for money. Good taste and quality. Been using for a month now and satisfied with the purchase.",
          date: "3 weeks ago",
          verified: false,
          helpful: 5,
          images: []
        },
        {
          id: 5,
          userName: "Meera Joshi",
          rating: 5,
          comment: "Highly recommend! The rice has a wonderful aroma and the grains don't stick together. Perfect for biryanis and daily meals.",
          date: "1 month ago",
          verified: true,
          helpful: 12,
          images: ["https://picsum.photos/100/100?random=r4"]
        }
      ],
      relatedProducts: product.relatedProducts || [
        {
          id: 17,
          name: "Organic Brown Rice",
          price: 180,
          originalPrice: 220,
          image: "https://picsum.photos/200/200?random=rel1",
          rating: 4.3,
          discount: 18
        },
        {
          id: 18,
          name: "Premium Basmati Rice",
          price: 320,
          originalPrice: 400,
          image: "https://picsum.photos/200/200?random=rel2",
          rating: 4.7,
          discount: 20
        },
        {
          id: 19,
          name: "Quinoa Mix Rice",
          price: 450,
          originalPrice: 550,
          image: "https://picsum.photos/200/200?random=rel3",
          rating: 4.5,
          discount: 18
        }
      ]

    }

    return createSuccessResponse(formattedProduct,'Product fetched successfully',200);
  } catch (error) {
    return handleError(error);
  }
}

// PUT - Update product by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    if (!validateObjectId(id)) {
      return createErrorResponse(
        'Invalid product ID format',
        'The provided ID is not a valid MongoDB ObjectId',
        400
      );
    }

    const body = await request.json();

    // Check if body is empty
    if (!body || Object.keys(body).length === 0) {
      return createErrorResponse(
        'No data provided',
        'Request body cannot be empty for update operation',
        400
      );
    }

    const validatedData = updateProductSchema.parse(body);

    // If updating name, check for duplicates
    if (validatedData.name) {
      const existingProduct = await Product.findOne({
        name: validatedData.name,
        _id: { $ne: id }
      });
      if (existingProduct) {
        return createErrorResponse(
          'Product name already exists',
          'A product with this name already exists',
          409
        );
      }
    }

    const product = await Product.findByIdAndUpdate(
      id,
      validatedData,
      { new: true, runValidators: true }
    ).populate('category', 'name');

    if (!product) {
      return createErrorResponse(
        'Product not found',
        'No product found with the provided ID',
        404
      );
    }

    const formattedProduct = formatProductResponse(product);

    return createSuccessResponse(
      formattedProduct,
      'Product updated successfully'
    );

  } catch (error) {
    return handleError(error);
  }
}

// DELETE - Delete product by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    if (!validateObjectId(id)) {
      return createErrorResponse(
        'Invalid product ID format',
        'The provided ID is not a valid MongoDB ObjectId',
        400
      );
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return createErrorResponse(
        'Product not found',
        'No product found with the provided ID',
        404
      );
    }

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: `Product "${product.name}" deleted successfully`,
    });

  } catch (error) {
    return handleError(error);
  }
}