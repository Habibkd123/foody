// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '@/lib/mongodb';
// import Product from '@/app/models/Product';
// import { updateProductSchema } from '@/utils/validations';
// import {
//   handleError,
//   validateObjectId,
//   formatProductResponse,
//   createSuccessResponse,
//   createErrorResponse
// } from '@/utils/ProductResponse';
// import { ApiResponse } from '@/types/product';
// import Review from '@/app/models/Review';
// import Delivery from '@/app/models/Delivery';
// // GET - Fetch product by ID
// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectDB();

//     const { id } = params;
//     const { searchParams } = new URL(request.url);

//     // Optional: limit for related products
//     const relatedLimit = parseInt(searchParams.get('relatedLimit') || '4', 10);

//     // Optional: fields selection
//     const fields = searchParams.get('fields')?.split(',').join(' ') || '';

//     if (!validateObjectId(id)) {
//       return createErrorResponse(
//         'Invalid product ID format',
//         'The provided ID is not a valid MongoDB ObjectId',
//         400
//       );
//     }

//     // Fetch product, optionally select fields
//     const product: any = await Product.findById(id)
//       .populate({path: "category", select: "name  _id"})
//       .select(fields)
//       .lean()

//     if (!product) {
//       return createErrorResponse(
//         'Product not found',
//         'No product found with the provided ID',
//         404
//       );
//     }

//     // Example: Add stock status
//     product.inStock = product.quantity && product.quantity > 0;

//     // Example: Increment views
//     await Product.findByIdAndUpdate(id, { $inc: { views: 1 } });

//     // Fetch related products with limit
//     const relatedProducts = await Product.find({
//       category: product.category._id,
//       _id: { $ne: id }
//     })
//       .limit(relatedLimit)
//       .lean();

//     product.relatedProducts = relatedProducts.map(formatProductResponse);

//     // Example: Fetch reviews if you have a Review model
//     const reviews = await Review.find({ product: id }).lean();
//     product.reviews = reviews;

//     // delery Info
//     if (product.delivery) {
//       const delivery = await Delivery.findById(product.delivery).lean();
//       if (delivery) {
//         product.delivery = delivery;
//       }
//     }
//     // finally format the product response
//     const formattedProduct = {
//       id: product._id.toString(),
//       name: product.name,
//       price: product.price,
//       originalPrice: product.originalPrice,
//       images: product.images || [],
//       totalReviews: product.reviews ? product.reviews.length : 0,
//       category: product?.category ? {
//         id: product.category._id.toString(),
//         name: product.category.name
//       } : {},
//       discount: 47,
//       description: product.description,
//       rating: product.rating,
//       inStock: product.inStock,
//       longDescription: product.longDescription,
//       features: product.features,
//       specifications: (() => {
//         if (!product.specifications) return {};
//         // If it's already an object, return it directly
//         if (typeof product.specifications === 'object' && !Array.isArray(product.specifications) && !(product.specifications instanceof Map)) {
//           return product.specifications;
//         }
//         // If it's an array or Map, try to convert to object
//         try {
//           return Object.fromEntries(product.specifications);
//         } catch (error) {
//           console.error('Error converting specifications to object:', error);
//           return {};
//         }
//       })(),
//       nutritionalInfo: product.nutritionalInfo,
//       stockCount: product.stock,
//       brand: product.brand,
//       sku: product.sku || "BN-BFR-1KG-001",
//       weight: product.weight || "1kg",
//       dimensions: product.dimensions || "25cm x 15cm x 8cm",
//       // tags: ["biofortified", "healthy", "nutritious", "medium-grain", "premium"],
//       deliveryInfo: product.delivery || {
//         freeDelivery: true,
//         estimatedDays: "2-3 days",
//         expressAvailable: true,
//         expressDays: "Same day"
//       },
//       warranty: product.warranty || "Quality guarantee - 100% satisfaction or money back",
//       reviews: product.reviews || [
//         {
//           id: 1,
//           userName: "Sunita Devi",
//           rating: 5,
//           comment: "Excellent quality rice! The grains are perfectly sized and cook beautifully. My family loves the taste and I feel good knowing it's nutritious too. Definitely worth the price.",
//           date: "3 days ago",
//           verified: true,
//           helpful: 15,
//           images: ["https://picsum.photos/100/100?random=r1"]
//         },
//         {
//           id: 2,
//           userName: "Rajesh Kumar",
//           rating: 4,
//           comment: "Good quality biofortified rice. Cooks well and tastes great. Delivery was quick. Only minor complaint is the packaging could be better.",
//           date: "1 week ago",
//           verified: true,
//           helpful: 8,
//           images: []
//         },
//         {
//           id: 3,
//           userName: "Priya Sharma",
//           rating: 5,
//           comment: "Amazing product! As a nutritionist, I appreciate the added vitamins and minerals. Perfect for growing children and health-conscious families.",
//           date: "2 weeks ago",
//           verified: true,
//           helpful: 22,
//           images: ["https://picsum.photos/100/100?random=r2", "https://picsum.photos/100/100?random=r3"]
//         },
//         {
//           id: 4,
//           userName: "Amit Patel",
//           rating: 4,
//           comment: "Value for money. Good taste and quality. Been using for a month now and satisfied with the purchase.",
//           date: "3 weeks ago",
//           verified: false,
//           helpful: 5,
//           images: []
//         },
//         {
//           id: 5,
//           userName: "Meera Joshi",
//           rating: 5,
//           comment: "Highly recommend! The rice has a wonderful aroma and the grains don't stick together. Perfect for biryanis and daily meals.",
//           date: "1 month ago",
//           verified: true,
//           helpful: 12,
//           images: ["https://picsum.photos/100/100?random=r4"]
//         }
//       ],
//       relatedProducts: product.relatedProducts || [
//         {
//           id: 17,
//           name: "Organic Brown Rice",
//           price: 180,
//           originalPrice: 220,
//           image: "https://picsum.photos/200/200?random=rel1",
//           rating: 4.3,
//           discount: 18
//         },
//         {
//           id: 18,
//           name: "Premium Basmati Rice",
//           price: 320,
//           originalPrice: 400,
//           image: "https://picsum.photos/200/200?random=rel2",
//           rating: 4.7,
//           discount: 20
//         },
//         {
//           id: 19,
//           name: "Quinoa Mix Rice",
//           price: 450,
//           originalPrice: 550,
//           image: "https://picsum.photos/200/200?random=rel3",
//           rating: 4.5,
//           discount: 18
//         }
//       ]

//     }

//     return createSuccessResponse(formattedProduct,'Product fetched successfully',200);
//   } catch (error) {
//     return handleError(error);
//   }
// }

// // PUT - Update product by ID
// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectDB();

//     const { id } = params;

//     if (!validateObjectId(id)) {
//       return createErrorResponse(
//         'Invalid product ID format',
//         'The provided ID is not a valid MongoDB ObjectId',
//         400
//       );
//     }

//     const body = await request.json();

//     // Check if body is empty
//     if (!body || Object.keys(body).length === 0) {
//       return createErrorResponse(
//         'No data provided',
//         'Request body cannot be empty for update operation',
//         400
//       );
//     }

//     const validatedData = updateProductSchema.parse(body);

//     // If updating name, check for duplicates
//     if (validatedData.name) {
//       const existingProduct = await Product.findOne({
//         name: validatedData.name,
//         _id: { $ne: id }
//       });
//       if (existingProduct) {
//         return createErrorResponse(
//           'Product name already exists',
//           'A product with this name already exists',
//           409
//         );
//       }
//     }

//     const product = await Product.findByIdAndUpdate(
//       id,
//       validatedData,
//       { new: true, runValidators: true }
//     ).populate('category', 'name');

//     if (!product) {
//       return createErrorResponse(
//         'Product not found',
//         'No product found with the provided ID',
//         404
//       );
//     }

//     const formattedProduct = formatProductResponse(product);

//     return createSuccessResponse(
//       formattedProduct,
//       'Product updated successfully'
//     );

//   } catch (error) {
//     return handleError(error);
//   }
// }

// // DELETE - Delete product by ID
// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectDB();

//     const { id } = params;

//     if (!validateObjectId(id)) {
//       return createErrorResponse(
//         'Invalid product ID format',
//         'The provided ID is not a valid MongoDB ObjectId',
//         400
//       );
//     }

//     const product = await Product.findByIdAndDelete(id);

//     if (!product) {
//       return createErrorResponse(
//         'Product not found',
//         'No product found with the provided ID',
//         404
//       );
//     }

//     return NextResponse.json<ApiResponse<null>>({
//       success: true,
//       message: `Product "${product.name}" deleted successfully`,
//     });

//   } catch (error) {
//     return handleError(error);
//   }
// }



import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/app/models/Product';
import Review from '@/app/models/Review';
import Delivery from '@/app/models/Delivery';
import { updateProductSchema } from '@/utils/validations';
import {
  handleError,
  validateObjectId,
  formatProductResponse,
  createSuccessResponse,
  createErrorResponse
} from '@/utils/ProductResponse';
import { ApiResponse } from '@/types/product';

// -------------------------------------------------------
// GET PRODUCT BY ID
// -------------------------------------------------------
export async function GET(request: NextRequest, context: any) {
  try {
    await connectDB();

    const { id } = context.params;

    const { searchParams } = new URL(request.url);

    const relatedLimit = parseInt(searchParams.get('relatedLimit') || '4', 10);
    const fields = searchParams.get('fields')?.split(',').join(' ') || '';

    if (!validateObjectId(id)) {
      return createErrorResponse(
        'Invalid product ID format',
        'The provided ID is not a valid MongoDB ObjectId',
        400
      );
    }

    const product: any = await Product.findById(id)
      .populate({ path: 'category', select: 'name _id' })
      .select(fields)
      .lean();

    if (!product) {
      return createErrorResponse(
        'Product not found',
        'No product found with the provided ID',
        404
      );
    }

    product.inStock = product.quantity && product.quantity > 0;

    await Product.findByIdAndUpdate(id, { $inc: { views: 1 } });

    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: id }
    })
      .limit(relatedLimit)
      .lean();

    product.relatedProducts = relatedProducts.map(formatProductResponse);

    const reviews = await Review.find({ product: id }).lean();
    product.reviews = reviews;

    if (product.delivery) {
      const delivery = await Delivery.findById(product.delivery).lean();
      if (delivery) product.delivery = delivery;
    }

    // 🎯 FINAL FORMATTED PRODUCT
    const formattedProduct = {
      id: product._id.toString(),
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      images: product.images || [],
      totalReviews: product.reviews?.length || 0,

      category: product.category
        ? {
          id: product.category._id.toString(),
          name: product.category.name
        }
        : {},

      discount: product.discount || 47,
      description: product.description,
      rating: product.rating,
      inStock: product.inStock,
      longDescription: product.longDescription,
      features: product.features,

      specifications: (() => {
        if (!product.specifications) return {};
        if (
          typeof product.specifications === 'object' &&
          !Array.isArray(product.specifications)
        ) {
          return product.specifications;
        }
        try {
          return Object.fromEntries(product.specifications);
        } catch {
          return {};
        }
      })(),

      nutritionalInfo: product.nutritionalInfo,
      stockCount: product.stock,
      brand: product.brand,
      sku: product.sku || 'BN-BFR-1KG-001',
      weight: product.weight || '1kg',
      dimensions: product.dimensions || '25cm x 15cm x 8cm',

      deliveryInfo: product.delivery || {
        freeDelivery: true,
        estimatedDays: '2-3 days',
        expressAvailable: true,
        expressDays: 'Same day'
      },

      warranty:
        product.warranty ||
        'Quality guarantee - 100% satisfaction or money back',

      reviews: product.reviews || [],
      relatedProducts: product.relatedProducts || []
    };

    return createSuccessResponse(
      formattedProduct,
      'Product fetched successfully',
      200
    );
  } catch (error) {
    return handleError(error);
  }
}

// -------------------------------------------------------
// UPDATE PRODUCT
// -------------------------------------------------------
export async function PUT(request: NextRequest, context: any) {
  try {
    await connectDB();

    const { id } = context.params;

    if (!validateObjectId(id)) {
      return createErrorResponse(
        'Invalid product ID format',
        'The provided ID is not a valid MongoDB ObjectId',
        400
      );
    }

    const body = await request.json();

    if (!body || Object.keys(body).length === 0) {
      return createErrorResponse(
        'No data provided',
        'Request body cannot be empty for update operation',
        400
      );
    }

    const validatedData = updateProductSchema.parse(body);

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

    const product = await Product.findByIdAndUpdate(id, validatedData, {
      new: true,
      runValidators: true
    }).populate('category', 'name');

    if (!product) {
      return createErrorResponse(
        'Product not found',
        'No product found with the provided ID',
        404
      );
    }

    return createSuccessResponse(
      formatProductResponse(product),
      'Product updated successfully',
      200
    );
  } catch (error) {
    return handleError(error);
  }
}

// -------------------------------------------------------
// DELETE PRODUCT
// -------------------------------------------------------
export async function DELETE(request: NextRequest, context: any) {
  try {
    await connectDB();

    const { id } = context.params;

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
      message: `Product "${product.name}" deleted successfully`
    });
  } catch (error) {
    return handleError(error);
  }
}

