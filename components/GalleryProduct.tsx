// Image Gallery Component
"use client";
import React, { useState } from 'react';
import {
  Heart,
  ShoppingCart,
  Star,
  Plus,
  Minus,
  Share2,
  Truck,
  Shield,
  RefreshCw,
  ArrowLeft,
  Check,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useWishListContext } from '@/context/WishListsContext';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useOrder } from '@/context/OrderContext';
import { useProductsContext } from '@/context/AllProductContext';
import { Product } from '@/types/global';

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
}

interface CartItem extends Product {
  quantity: number;
}

const ImageGallery: React.FC<{ images: string[]; productName: string }> = ({ images, productName }) => {
  const [currentImage, setCurrentImage] = useState<number>(0);

  const nextImage = (): void => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = (): void => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group">
        <img
          src={images[currentImage]}
          alt={productName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentImage ? 'bg-white' : 'bg-white/50'
                }`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${index === currentImage
                ? 'border-orange-500 shadow-lg'
                : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <img
                src={image}
                alt={`${productName} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Reviews Component
const ReviewsSection: React.FC<{ reviews: Review[]; rating: number; totalReviews: number }> = ({
  reviews,
  rating,
  totalReviews
}) => {
  const [showAllReviews, setShowAllReviews] = useState<boolean>(false);
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  const RatingStars: React.FC<{ rating: number; size?: number }> = ({ rating, size = 16 }) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={`${i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
            }`}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
        <div className="flex items-center space-x-2">
          <RatingStars rating={rating} size={20} />
          <span className="font-semibold text-lg">{rating}</span>
          <span className="text-gray-500">({totalReviews} reviews)</span>
        </div>
      </div>

      <div className="space-y-4">
        {displayedReviews.map((review) => (
          <div key={review.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {review.userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{review.userName}</p>
                  <div className="flex items-center space-x-2">
                    <RatingStars rating={review.rating} />
                    {review.verified && (
                      <span className="text-xs text-green-600 flex items-center">
                        <Check size={12} className="mr-1" />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-sm text-gray-500">{review.date}</span>
            </div>
            <p className="text-gray-700 mb-2">{review.comment}</p>
            <button className="text-sm text-gray-500 hover:text-gray-700">
              Helpful ({review.helpful})
            </button>
          </div>
        ))}
      </div>

      {reviews.length > 3 && (
        <button
          onClick={() => setShowAllReviews(!showAllReviews)}
          className="text-orange-600 hover:text-orange-700 font-medium"
        >
          {showAllReviews ? 'Show Less' : `Show All ${reviews.length} Reviews`}
        </button>
      )}
    </div>
  );
};

// Main Product Details Component
const ProductDetailsPage: React.FC = () => {
  const { wishListsData, setWistListsData } = useWishListContext();
  const { productsData, setProductsData } = useProductsContext();
  const { product_id }: any = useParams();
  const { addToCart } = useCart();
  const { state, dispatch } = useOrder();
  const router = useRouter();

  const handleGo = () => {
    router.push('/productlist');
  };

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedTab, setSelectedTab] = useState<'description' | 'specifications' | 'reviews'>('description');
  
  // Find the product by ID
  const product = productsData.find((item: Product) => item.id == product_id);

  // If product is not found, show loading or error message
  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <button
            onClick={handleGo}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const isInWishlist = wishListsData.some((item: any) => item.id === product.id);

  const handleQuantityChange = (change: number): void => {
    const maxQty = product.stockCount ?? Number.POSITIVE_INFINITY;
    setQuantity((prev) => Math.max(1, Math.min(prev + change, maxQty)));
  };

  const toggleWishlist = (): void => {
    if (isInWishlist) {
      setWistListsData(prev => prev.filter(item => item.id !== product.id));
    } else {
      setWistListsData(prev => [...prev, product]);
    }
  };

  const handleAddToCart = (): void => {
    addToCart(product, quantity);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200" onClick={handleGo}>
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-2xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              🛒
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Images */}
          <div className="space-y-6">
            <ImageGallery images={product.images} productName={product.name} />
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Product Header */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-gray-500">{product.brand}</span>
                <span className="text-sm text-gray-300">•</span>
                <span className="text-sm text-gray-500">SKU: {product.sku}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-lg">{product.rating}</span>
                <span className="text-gray-500">({product.totalReviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                {product.originalPrice !== product.price && (
                  <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                )}
                {product.discount > 0 && (
                  <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {product.discount}% OFF
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2 mb-6">
                {product.inStock ? (
                  <>
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-green-600 font-medium">In Stock ({product.stockCount} available)</span>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5 text-red-500" />
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  </>
                )}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border-2 border-gray-200 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-3 font-semibold min-w-[60px] text-center">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={product.stockCount !== undefined ? quantity >= product.stockCount : false}
                  className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center shadow-lg disabled:cursor-not-allowed disabled:transform-none"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </button>
              <button
                onClick={toggleWishlist}
                className={`p-4 border-2 rounded-xl transition-all duration-200 hover:scale-105 ${isInWishlist
                  ? 'border-red-500 bg-red-50 text-red-500'
                  : 'border-gray-300 hover:border-red-500 hover:bg-red-50 hover:text-red-500'
                  }`}
              >
                <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-current' : ''}`} />
              </button>
              <button className="p-4 border-2 border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 hover:scale-105">
                <Share2 className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Key Features</h3>
              <div className="grid grid-cols-1 gap-3">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm text-center">
                <Truck className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="font-medium text-gray-900">Free Delivery</p>
                <p className="text-sm text-gray-500">On orders above ₹500</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm text-center">
                <RefreshCw className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="font-medium text-gray-900">Easy Returns</p>
                <p className="text-sm text-gray-500">7-day return policy</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm text-center">
                <Shield className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="font-medium text-gray-900">Quality Assured</p>
                <p className="text-sm text-gray-500">100% authentic products</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex">
              {[
                { key: 'description', label: 'Description' },
                { key: 'specifications', label: 'Specifications' },
                { key: 'reviews', label: 'Reviews' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key as typeof selectedTab)}
                  className={`px-8 py-4 font-medium transition-all duration-200 ${selectedTab === tab.key
                    ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {selectedTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
              </div>
            )}

            {selectedTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                    <span className="font-medium text-gray-900">{key}</span>
                    <span className="text-gray-700">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {selectedTab === 'reviews' && (
              <ReviewsSection
                reviews={product.reviews ?? []}
                rating={product.rating}
                totalReviews={product.totalReviews}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;