"use client";
import React, { useCallback, useState } from "react";
import {
  Heart, ShoppingCart, Star, Share2, Zap, CheckCircle, Plus, Minus, TrendingUp,
  Truck, Shield, RotateCcw, Award, ThumbsUp, ThumbsDown, MessageCircle,
  ChevronDown, ChevronUp, Filter, SortAsc, Eye, Users, Clock, MapPin, Search,
  Bell,
  Menu,
  X
} from "lucide-react";
import { useProduct } from "@/hooks/useProduct";
import { useParams } from "next/navigation";
import { useCartOrder, useOrder } from "@/context/OrderContext";
import Link from "next/link";
import { useWishListContext } from "@/context/WishListsContext";
import AddCardList from "@/components/AddCards";
import { CartItem, Product } from "@/types/global";
import { Button } from "@/components/ui/button";

const ProductPage = () => {
  const { product_id } = useParams();
  
  // ALL HOOKS MUST BE DECLARED AT THE TOP - BEFORE ANY CONDITIONAL LOGIC
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviewFilter, setReviewFilter] = useState('all');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showNutrition, setShowNutrition] = useState(false);
  const [viewedRecently, setViewedRecently] = useState(true);
  const [cartAnimation, setCartAnimation] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hook calls
  const { product, loading, error } = useProduct(product_id ? product_id.toString() : '');
  const { wishListsData, setWistListsData } = useWishListContext();
  const { dispatch, state } = useOrder();
  const { addToCart, removeFromCart, updateQuantity } = useCartOrder();

  // useCallback hooks
  const isInCart = useCallback((product: Product) => {
    return state.items.some((item: any) => item.id === product._id);
  }, [state.items]);

  const getCartQuantity = useCallback((product: Product) => {
    const cartItem = state.items.find((item: any) => item.id === product._id);
    return cartItem ? cartItem.quantity : 0;
  }, [state.items]);

  // NOW we can do conditional returns AFTER all hooks are declared
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="text-center py-12">
          <div className="text-red-500 text-xl mb-4">Error loading product</div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="text-center py-12">
          <div className="text-gray-500 text-xl">Product not found</div>
        </div>
      </div>
    );
  }

  // Helper functions and event handlers
  const user = typeof window !== 'undefined' 
    ? JSON.parse(window.localStorage.getItem("G-user") || "{}")
    : {};

  const toggleWishlist = (item: any) => {
    const exists = wishListsData.find((fav: any) => fav.id === item.id);
    if (exists) {
      setWistListsData(wishListsData.filter((fav: any) => fav.id !== item.id));
    } else {
      setWistListsData([...wishListsData, item]);
      const wishlistIcon = document.querySelector(`[data-wishlist-${item.id}]`);
      if (wishlistIcon) {
        wishlistIcon.classList.add('animate-pulse');
        setTimeout(() => wishlistIcon.classList.remove('animate-pulse'), 600);
      }
    }
  };

  const handleAddToCart = async () => {
    if (!product || !user?.id) return;

    setAdding(true);
    try {
      const cartItem1: any = {
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.images[0],
      };

      await addToCart(user.id, cartItem1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setAdding(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product.name,
        text: product.description,
        url: `/products/${product._id}`,
      });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/products/${product._id}`);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total: any, item: any) => total + item.price * item.quantity, 0);
  };

  const savings = product?.originalPrice - product?.price;
  const savingsPercent = Math.round((savings / product?.originalPrice) * 100);

  const filteredReviews = reviewFilter === 'all'
    ? product?.reviews
    : product?.reviews.filter((review: any) => review?.rating === parseInt(reviewFilter));

  const reviewsToShow = showAllReviews ? filteredReviews : filteredReviews?.slice(0, 3);

  const getRatingDistribution = () => {
    const distribution: { [key: string]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    product?.reviews.forEach((review: { rating?: string }) => {
      const rating = review?.rating;
      if (rating && distribution.hasOwnProperty(rating)) {
        distribution[rating]++;
      }
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="sticky top-0 z-50 backdrop-blur-md bg-white/90 shadow-lg border-b border-orange-100">
      <header className="transition-all duration-300">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 border-b-1">
          <div className="flex items-center justify-between">
            {/* Enhanced Logo with hover animation */}
            <div className="flex items-center gap-2 flex-shrink-0 group">
              <img
                src="../logoGro.png"
                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                alt="logo"
              />
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent hover:from-orange-500 hover:via-red-600 hover:to-pink-600 transition-all duration-300">
                Gro-Delivery
              </h1>
            </div>

            {/* Enhanced Right side icons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Enhanced Wishlist */}
              <button className="relative p-2 hover:bg-orange-100 rounded-lg transition-all duration-300 hover:scale-110 group">
                <Link href="/wishlist">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 group-hover:text-red-500 transition-colors duration-300" />
                  {wishListsData.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full animate-bounce">
                      {wishListsData.length}
                    </span>
                  )}
                </Link>
              </button>

              {/* Enhanced Cart */}
              <div className="flex items-center space-x-2 relative z-[120px]">
                <div className={`transition-transform duration-300 ${cartAnimation ? 'scale-110' : 'scale-100'}`}>
                  <AddCardList
                    cartItems={cartItems}
                    removeFromCart={removeFromCart}
                    updateQuantity={(itemId: any, newQuantity: any) => {
                      if (newQuantity === 0) {
                        removeFromCart(user?.id, itemId);
                      } else {
                        const change = newQuantity - getCartQuantity({ id: itemId } as Product);
                        updateQuantity(user?.id, itemId?.toString(), change);
                      }
                    }}
                    getTotalPrice={getTotalPrice}
                    setCartItems={setCartItems}
                    cartOpen={cartOpen}
                    setCartOpen={setCartOpen}
                  />
                </div>

                {/* Enhanced Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-gray-700 hover:bg-orange-100 transition-all duration-300"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <div className="relative">
                    <Menu className={`h-5 w-5 transition-all duration-300 ${mobileMenuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`} />
                    <X className={`h-5 w-5 absolute top-0 left-0 transition-all duration-300 ${mobileMenuOpen ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'}`} />
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto p-4">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative group">
              <img
                src={product?.images[selectedImage]}
                alt={product?.name}
                className="rounded-xl w-full h-96 object-cover"
              />
              {product?.discount > 0 && <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                {product?.discount}% OFF
              </div>}
              {viewedRecently && (
                <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  Recently viewed
                </div>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {product?.images.map((img: any, i: any) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${selectedImage === i ? 'border-orange-500' : 'border-gray-200'
                    }`}
                  onClick={() => setSelectedImage(i)}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product?.name}</h1>
              <p className="text-gray-600 mb-2">by {product?.brand} • SKU: {product?.sku}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product?.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                  />
                ))}
                <span className="ml-2 text-lg font-semibold">{product?.rating}</span>
              </div>
              <span className="text-gray-600">({product?.totalReviews} reviews)</span>
              <div className="flex items-center text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm">Trending</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-3xl font-bold text-gray-900">₹{product?.price}</span>
                <span className="text-xl text-gray-500 line-through">₹{product?.originalPrice}</span>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {savingsPercent}% OFF
                </span>
              </div>
              <div className="text-green-600 font-semibold">You save ₹{savings}</div>
              <div className="text-sm text-gray-600 mt-1">Inclusive of all taxes</div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-4">
              <div className={`flex items-center ${product?.inStock ? 'text-green-600' : 'text-red-600'}`}>
                <CheckCircle className="w-4 h-4 mr-1" />
                <span className="font-semibold">
                  {product?.inStock ? `In Stock (${product?.stockCount} available)` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <div className="flex items-center">
                <Truck className="w-5 h-5 mr-2 text-blue-600" />
                <span className="font-semibold">
                  {product?.deliveryInfo.freeDelivery ? 'Free Delivery' : 'Paid Delivery'}
                </span>
                <span className="ml-2 text-gray-600">in {product?.deliveryInfo.estimatedDays}</span>
              </div>
              {product?.deliveryInfo.expressAvailable && (
                <div className="flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                  <span className="text-sm">Express delivery available ({product?.deliveryInfo.expressDays})</span>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="font-semibold">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 border-x">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(10, q + 1))}
                  className="p-2 hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-sm text-gray-600">Max 10 per order</span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={adding || !product?.inStock}
                className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center text-lg transition-all duration-300 ${justAdded
                  ? "bg-green-500 text-white"
                  : product?.inStock
                    ? "bg-gradient-to-r from-orange-400 to-red-500 text-white hover:from-orange-500 hover:to-red-600 transform hover:scale-105"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                {adding ? (
                  <span className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Adding to Cart...
                  </span>
                ) : justAdded ? (
                  <span className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Added to Cart!
                  </span>
                ) : (
                  <span className="flex items-center">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                    {quantity > 1 && <span className="ml-2">({quantity} items)</span>}
                  </span>
                )}
              </button>

              <div className="flex space-x-3">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`flex-1 py-3 rounded-xl border-2 font-semibold flex items-center justify-center transition-all ${isWishlisted
                    ? "bg-red-50 border-red-300 text-red-600"
                    : "bg-white border-gray-300 text-gray-700 hover:border-red-300"
                    }`}
                >
                  <Heart className={`w-5 h-5 mr-2 ${isWishlisted ? "fill-current" : ""}`} />
                  {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                </button>
                <button
                  onClick={handleShare}
                  className="px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-700 hover:border-blue-300 transition-all"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Key Features:</h3>
              <div className="grid grid-cols-1 gap-2">
                {product?.features?.slice(0, 4).map((feature: any, i: any) => (
                  <div key={i} className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 pt-4 border-t">
              <div className="flex items-center text-gray-600">
                <Shield className="w-5 h-5 mr-2" />
                <span className="text-sm">Quality Guarantee</span>
              </div>
              <div className="flex items-center text-gray-600">
                <RotateCcw className="w-5 h-5 mr-2" />
                <span className="text-sm">Easy Returns</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Award className="w-5 h-5 mr-2" />
                <span className="text-sm">Certified Product</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="border-b mb-6">
          <nav className="flex space-x-8">
            {['description', 'specifications', 'nutrition', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab?.slice(1)}
                {tab === 'reviews' && ` (${product?.reviews.length})`}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {activeTab === 'description' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Product Description</h3>
              <p className="text-gray-700 leading-relaxed">{product?.longDescription}</p>
              <div>
                <h4 className="font-semibold mb-2">All Features:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {product?.features.map((feature: any, i: any) => (
                    <div key={i} className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Product Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product?.specifications || {}).map(([key, value]: any) => (
                  <div key={key} className="bg-gray-50 p-3 rounded">
                    <div className="font-semibold text-gray-800">{key}</div>
                    <div className="text-gray-600">{value || "-"}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Nutritional Information (per 100g)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(product?.nutritionalInfo || {}).map(([key, value]: any) => (
                  <div key={key} className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="font-bold text-green-800 text-lg">{value}</div>
                    <div className="text-green-600 text-sm">{key}</div>
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Health Benefits</h4>
                <ul className="text-blue-700 space-y-1">
                  <li>• High in Iron - Helps prevent anemia</li>
                  <li>• Rich in Zinc - Boosts immune system</li>
                  <li>• Contains Vitamin A - Good for eye health</li>
                  <li>• Complex carbohydrates for sustained energy</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Customer Reviews</h3>
                <div className="flex items-center space-x-4">
                  <select
                    value={reviewFilter}
                    onChange={(e) => setReviewFilter(e.target.value)}
                    className="border rounded px-3 py-1"
                  >
                    <option value="all">All Reviews</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
              </div>

              {/* Rating Overview */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-800">{product?.rating}</div>
                    <div className="flex justify-center my-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-5 h-5 ${i < Math.floor(product?.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                      ))}
                    </div>
                    <div className="text-gray-600">{product?.totalReviews} total reviews</div>
                  </div>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center">
                        <span className="w-8 text-sm">{rating}★</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{
                              width: `${(ratingDistribution[rating] / product?.reviews.length) * 100}%`
                            }}
                          ></div>
                        </div>
                        <span className="w-8 text-sm text-gray-600">{ratingDistribution[rating]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviewsToShow.map((review: any) => (
                  <div key={review.id} className="border-b pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{review.userName}</span>
                          {review.verified && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                          ))}
                          <span className="ml-2 text-sm text-gray-500">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{review.comment}</p>
                    {review.images.length > 0 && (
                      <div className="flex space-x-2 mb-2">
                        {review.images.map((img: any, i: any) => (
                          <img key={i} src={img} alt="" className="w-16 h-16 object-cover rounded" />
                        ))}
                      </div>
                    )}
                    <div className="flex items-center space-x-4 text-sm">
                      <button className="flex items-center text-gray-600 hover:text-green-600">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        Helpful ({review.helpful})
                      </button>
                      <button className="flex items-center text-gray-600 hover:text-red-600">
                        <ThumbsDown className="w-4 h-4 mr-1" />
                        Not Helpful
                      </button>
                      <button className="flex items-center text-gray-600 hover:text-blue-600">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Reply
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredReviews.length > 3 && (
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="w-full py-2 text-orange-600 border border-orange-300 rounded hover:bg-orange-50"
                >
                  {showAllReviews ? 'Show Less Reviews' : `Show All ${filteredReviews.length} Reviews`}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Related Products */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">You might also like</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {product?.relatedProducts && product?.relatedProducts.map((relatedProduct: any) => (
              <div key={relatedProduct?.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                <img
                  src={relatedProduct.image}
                  alt={relatedProduct.name}
                  className="w-full h-48 object-cover rounded mb-3"
                />
                <h4 className="font-semibold mb-2 line-clamp-2">{relatedProduct.name}</h4>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(relatedProduct.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">{relatedProduct.rating}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-lg">₹{relatedProduct.price}</span>
                    <span className="text-gray-500 line-through ml-2">₹{relatedProduct.originalPrice}</span>
                  </div>
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                    {relatedProduct.discount}% OFF
                  </span>
                </div>
                <button className="w-full mt-3 bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-colors">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 space-y-4">
          <h3 className="text-2xl font-bold">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {[
              {
                question: "What makes this rice biofortified?",
                answer: "This rice is enhanced with essential nutrients like Iron, Zinc, and Vitamin A through advanced agricultural techniques, making it more nutritious than regular rice."
              },
              {
                question: "How should I store this rice?",
                answer: "Store in a cool, dry place away from direct sunlight. Use an airtight container after opening to maintain freshness and prevent pest infestation."
              },
              {
                question: "Is this rice suitable for diabetics?",
                answer: "While this rice has a lower glycemic index than white rice due to its biofortification, we recommend consulting with your healthcare provider for dietary advice."
              },
              {
                question: "What is the cooking ratio for this rice?",
                answer: "Use a 1:2 ratio (1 cup rice to 2 cups water). Cook for 15-20 minutes on medium heat until water is absorbed."
              }
            ].map((faq, index) => (
              <details key={index} className="border rounded-lg p-4">
                <summary className="font-semibold cursor-pointer hover:text-orange-600">
                  {faq.question}
                </summary>
                <p className="mt-2 text-gray-700">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Bottom Action Bar (Mobile Sticky) */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 md:hidden z-50">
          <div className="flex space-x-3">
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`p-3 rounded-xl border-2 ${isWishlisted ? "bg-red-50 border-red-300" : "border-gray-300"
                }`}
            >
              <Heart className={`w-6 h-6 ${isWishlisted ? "text-red-500 fill-current" : "text-gray-600"}`} />
            </button>
            <button
              onClick={handleAddToCart}
              disabled={adding || !product.inStock}
              className="flex-1 bg-gradient-to-r from-orange-400 to-red-500 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center disabled:bg-gray-400"
            >
              {adding ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-center mb-6">Why Shop With Us?</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Truck className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold mb-1">Free Delivery</h4>
              <p className="text-sm text-gray-600">On orders above ₹500</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-1">Quality Assured</h4>
              <p className="text-sm text-gray-600">100% authentic products</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-1">Customer Support</h4>
              <p className="text-sm text-gray-600">24/7 assistance</p>
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 right-4 md:bottom-6 md:right-6 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors z-40"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ProductPage;