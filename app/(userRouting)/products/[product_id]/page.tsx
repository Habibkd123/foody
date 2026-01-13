"use client";
import React, { useCallback, useState, useEffect, useMemo, useRef } from "react";
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
import { useProductsContext } from "@/context/AllProductContext";
import Link from "next/link";
import ProductCardGrid from "@/components/ProductGrid";
import { useWishListContext } from "@/context/WishListsContext";
import AddCardList from "@/components/AddCards";
import { CartItem, Product } from "@/types/global";
import { Button } from "@/components/ui/button";
import { useAuthStorage } from '@/hooks/useAuth';
import AppHeader from "@/components/ui/AppHeader";

const ProductPage = () => {
  const { product_id } = useParams();
  const { user } = useAuthStorage()
  // ALL HOOKS MUST BE DECLARED AT THE TOP - BEFORE ANY CONDITIONAL LOGIC
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviewFilter, setReviewFilter] = useState('all');
  const [remoteReviews, setRemoteReviews] = useState<any[]>([]);
  const [reviewForm, setReviewForm] = useState<{ rating: number; comment: string }>({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [replyOpenId, setReplyOpenId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>("");
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(2); // Configurable zoom level
  const imageContainerRef = useRef<HTMLDivElement>(null);


  const [isWishlisted, setIsWishlisted] = useState(false);
  const [viewedRecently, setViewedRecently] = useState(true);
  const [cartAnimation, setCartAnimation] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // Hook calls
  const { product, loading, error } = useProduct(product_id ? product_id.toString() : '');
  const { wishListsData, setWistListsData, getUserWishList } = useWishListContext();
  const { dispatch, state } = useOrder();
  const { addToCart, removeFromCart, updateQuantity } = useCartOrder();
  useEffect(() => {
    if (user?._id) {
      getUserWishList(user?._id);
      setIsWishlisted(wishListsData && wishListsData.some((item) => item._id === product_id));
    }
  }, [user?._id, product_id]);



  useEffect(() => {
    if (user?._id) {
      fetch(`/api/recommendations/user/${user?._id}`)
        .then(res => res.json())
        .then(json => setRecommendations(json?.data || []))
        .catch(() => setRecommendations([]));
    }
  }, [user?._id]);

  // Load reviews from API when product is available
  useEffect(() => {
    const load = async () => {
      try {
        if (!product_id) return;
        const res = await fetch(`/api/products/${product_id}/reviews`, { cache: 'no-store' });
        const data = await res.json();
        if (res.ok && data.success) {
          setRemoteReviews(Array.isArray(data.data) ? data.data : []);
        }
      } catch { }
    };

    load();
  }, [product_id]);

  useEffect(() => {
    if (!product_id || !Array.isArray(product?.relatedProducts)) {
      setRelatedProducts([]);
      return;
    }
    setRelatedProducts(product.relatedProducts);
  }, [product_id, product?.relatedProducts]);



  const handleAddToCartFromGrid = async (item: Product) => {
    if (!user?._id) return;
    const cartItem1: any = {
      id: item._id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.images?.[0],
    };
    try {
      await addToCart(user?._id, cartItem1);
    } catch { }
  };

  // useCallback hooks
  const isInCart = useCallback((product: Product) => {
    return state.items.some((item: any) => item.id === product_id);
  }, [state.items]);

  const getCartQuantity = useCallback((product: Product) => {
    const cartItem = state.items.find((item: any) => item.id === product_id);
    return cartItem ? cartItem.quantity : 0;
  }, [state.items]);

  const handleReviewAction = async (reviewId: string, action: 'helpful' | 'notHelpful') => {
    try {
      const res = await fetch(`/api/products/${product_id}/reviews`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, action, user: user?._id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRemoteReviews(Array.isArray(data.data) ? data.data : []);
      }
    } catch {}
  };

  const handleToggleReply = (id: string) => {
    setReplyOpenId(prev => (prev === id ? null : id));
    setReplyText('');
  };

  const handleSubmitReply = async (reviewId: string) => {
    if (user?.role !== 'restaurant') return;
    const text = replyText.trim();
    if (!text) return;
    try {
      const res = await fetch(`/api/restaurant/reviews/${reviewId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: text }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRemoteReviews(Array.isArray(data.data) ? data.data : []);
        setReplyOpenId(null);
        setReplyText('');
      }
    } catch {}
  };

  // NOW we can do conditional returns AFTER all hooks are declared
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
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

  const toggleWishlist = (item: any) => {
    const exists = wishListsData.find((fav: any) => fav.id === item.id);
    if (exists) {
      setWistListsData(wishListsData.filter((fav: any) => fav.id !== item.id));
      setIsWishlisted(false);
    } else {
      setWistListsData([...wishListsData, item]);
      const wishlistIcon = document.querySelector(`[data-wishlist-${item.id}]`);
      if (wishlistIcon) {
        wishlistIcon.classList.add('animate-pulse');
        setTimeout(() => wishlistIcon.classList.remove('animate-pulse'), 600);
      }
      setIsWishlisted(true);
    }
  };

  const handleAddToCart = async () => {
    console.log("useruseruser", product)
    if (!user?._id) {
      alert('Please login to add to cart');
    }
    if (!product) {
      alert('Please select a product to add to cart');
    }

    if (!product || !user?._id) return;

    setAdding(true);
    try {
      const cartItem1: any = {
        id: product_id || product?.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.images[0],
      };

      await addToCart(user?._id, cartItem1);
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
        url: `/products/${product_id}`,
      });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/products/${product_id}`);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total: any, item: any) => total + item.price * item.quantity, 0);
  };

  const savings = product?.originalPrice - product?.price;
  const savingsPercent = Math.round((savings / product?.originalPrice) * 100);

  const sourceReviews = (remoteReviews && remoteReviews.length > 0) ? remoteReviews : (product?.reviews || []);

  const filteredReviews = reviewFilter === 'all'
    ? sourceReviews
    : sourceReviews.filter((review: any) => review?.rating === parseInt(reviewFilter));

  const reviewsToShow = showAllReviews ? filteredReviews : filteredReviews?.slice(0, 3);

  const getRatingDistribution = () => {
    const distribution: { [key: string]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    sourceReviews.forEach((review: { rating?: any }) => {
      const rating = review?.rating;
      if (rating && distribution.hasOwnProperty(rating)) {
        distribution[rating]++;
      }
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  const handleSubmitReview = async () => {
    if (!product_id || submittingReview) return;

    setSubmittingReview(true);

    try {
      const res = await fetch(`/api/products/${product_id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: user?._id,
          rating: Number(reviewForm.rating),
          comment: reviewForm.comment,
          images: reviewImages,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setReviewForm({ rating: 5, comment: '' });
        setReviewImages([]);

        // ✅ Use product_id again here
        const r = await fetch(`/api/products/${product_id}/reviews`, { cache: 'no-store' });
        const dj = await r.json();

        if (r.ok && dj.success) {
          setRemoteReviews(Array.isArray(dj.data) ? dj.data : []);
        }
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleReviewImagesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('images', file));
    setUploadingImages(true);
    try {
      const res = await fetch('/api/auth/products/uploads', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.imagesAdded)) {
        setReviewImages((prev) => [...prev, ...data.imagesAdded].slice(0, 6));
      }
    } catch { }
    finally {
      setUploadingImages(false);
      // reset input so same files can be reselected if needed
      e.currentTarget.value = '';
    }
  };
  const zoomStyles = {
    magnifierContainer: {
      position: 'relative',
      overflow: 'hidden',
      cursor: 'zoom-in',
      // Use viewport-based height for better responsiveness on small screens,
      // while keeping a sensible max height for larger displays.
      height: 'min(70vw, 500px)',
      borderRadius: '0.75rem',
    } as React.CSSProperties,

    magnifierImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.1s ease-out',
    } as React.CSSProperties,

    magnifierGlass: {
      position: 'absolute',
      pointerEvents: 'none',
      width: '150px',
      height: '150px',
      border: '2px solid #ffffff',
      borderRadius: '50%',
      boxShadow: '0 0 10px rgba(0,0,0,0.2)',
      zIndex: 1000,
    } as React.CSSProperties
  };
  return (
    <div>
      <AppHeader
        logoSrc="/logoGro.png"
        title="Gro-Delivery"
        onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        actions={[
          {
            key: "wishlist",
            href: "/wishlist",
            icon: <Heart className="w-6 h-6 text-foreground" />,
            badgeCount: wishListsData ? wishListsData.length : 0,
          },
          {
            key: "cart",
            icon: (
              <div className={`transition-transform duration-300 ${cartAnimation ? "scale-110" : "scale-100"}`}>
                <AddCardList
                  cartItems={cartItems}
                  removeFromCart={removeFromCart}
                  updateQuantity={(itemId: any, newQuantity: any) => {
                    if (newQuantity === 0) {
                      removeFromCart(user?._id, itemId);
                    } else {
                      const change = newQuantity - getCartQuantity({ id: itemId } as Product);
                      updateQuantity(user?._id, itemId?.toString(), change);
                    }
                  }}
                  getTotalPrice={getTotalPrice}
                  setCartItems={setCartItems}
                  cartOpen={cartOpen}
                  setCartOpen={setCartOpen}
                />
              </div>
            ),
          },
          {
            key: "menu",
            icon: (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-foreground hover:bg-secondary transition-all duration-300"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <div className="relative">
                  <Menu className={`h-6 w-6 transition-all duration-300 ${mobileMenuOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"}`} />
                  <X className={`h-6 w-6 absolute top-0 left-0 transition-all duration-300 ${mobileMenuOpen ? "rotate-0 opacity-100" : "rotate-90 opacity-0"}`} />
                </div>
              </Button>
            ),
          },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Images */}
          <div className="space-y-4">
            <div
              ref={imageContainerRef}
              style={zoomStyles.magnifierContainer}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => {
                setIsZoomed(false);
                setMousePosition({ x: 0, y: 0 });
              }}
              onMouseMove={(e) => {
                if (!imageContainerRef.current) return;

                const bounds = imageContainerRef.current.getBoundingClientRect();
                const x = ((e.clientX - bounds.left) / bounds.width) * 100;
                const y = ((e.clientY - bounds.top) / bounds.height) * 100;

                // Calculate magnifier glass position
                const magnifierSize = 150;
                const magnifierX = e.clientX - bounds.left - magnifierSize / 2;
                const magnifierY = e.clientY - bounds.top - magnifierSize / 2;

                setMousePosition({
                  x: Math.min(Math.max(0, x), 100),
                  y: Math.min(Math.max(0, y), 100)
                });

                // Update magnifier glass position
                if (isZoomed) {
                  const glass = document.querySelector('.magnifier-glass') as HTMLElement;
                  if (glass) {
                    glass.style.left = `${magnifierX}px`;
                    glass.style.top = `${magnifierY}px`;
                    glass.style.backgroundImage = `url(${product?.images[selectedImage]})`;
                    glass.style.backgroundPosition = `${x}% ${y}%`;
                    glass.style.backgroundSize = `${zoomLevel * 100}%`;
                  }
                }
              }}
              onClick={() => setZoomLevel(zoomLevel === 2 ? 3 : 2)} // Toggle zoom level
            >
              <img
                src={product?.images[selectedImage]}
                alt={product?.name}
                style={{
                  ...zoomStyles.magnifierImage,
                  transform: isZoomed ? `scale(${zoomLevel})` : 'scale(1)',
                  transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
                }}
              />

              {isZoomed && (
                <div
                  className="magnifier-glass"
                  style={{
                    ...zoomStyles.magnifierGlass,
                    backgroundRepeat: 'no-repeat',
                  }}
                />
              )}

              {/* Zoom level indicator */}
              {isZoomed && (
                <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  {zoomLevel}x Zoom
                </div>
              )}

              {/* Zoom instructions */}
              {!isZoomed && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 hover:opacity-100 transition-opacity">
                  <div className="text-center">
                    <p className="text-lg font-semibold">Hover to zoom</p>
                    <p className="text-sm">Click to toggle zoom level</p>
                  </div>
                </div>
              )}

              {/* Product badges */}
              {product?.discount > 0 && (
                <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-md">
                  {product.discount}% OFF
                </div>
              )}
              {viewedRecently && (
                <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-md">
                  Recently Viewed
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto">
              {product?.images.map((img: string, i: number) => (
                <div
                  key={i}
                  className="relative group cursor-pointer"
                  onClick={() => setSelectedImage(i)}
                >
                  <img
                    src={img}
                    alt=""
                    className={`w-16 h-16 object-cover rounded transition-all ${selectedImage === i
                      ? 'border-2 border-border ring-2 ring-primary'
                      : 'border-2 border-gray-200 filter brightness-90'
                      }`}
                  />
                  <div className={`absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all rounded ${selectedImage === i ? 'bg-black/10' : ''
                    }`} />
                </div>
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
              <div className={`flex items-center ${product?.inStock ? 'text-green-600' : 'text-destructive'}`}>
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
                  {product?.deliveryInfo?.freeDelivery ? 'Free Delivery' : 'Paid Delivery'}
                </span>
                <span className="ml-2 text-gray-600">in {product?.deliveryInfo?.estimatedDays}</span>
              </div>
              {product?.deliveryInfo?.expressAvailable && (
                <div className="flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                  <span className="text-sm">Express delivery available ({product?.deliveryInfo?.expressDays})</span>
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
                    ? "bg-primary text-white hover:bg-primary transform hover:scale-105"
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
                  onClick={() => toggleWishlist(product)}
                  className={`flex-1 py-3 rounded-xl border-2 font-semibold flex items-center justify-center transition-all ${isWishlisted
                    ? "bg-secondary border-border text-primary"
                    : "bg-white border-gray-300 text-gray-700 hover:border-border"
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
          <nav className="flex space-x-6 overflow-x-auto whitespace-nowrap">
            {['description', 'specifications', 'nutrition', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab?.slice(1)}
                {tab === 'reviews' && ` (${sourceReviews.length})`}
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
            <div className="space-y-8">

              {/* Write Review Box */}
              <div className="border rounded-xl p-5 shadow-soft bg-white">
                <h4 className="font-semibold mb-4 text-lg">Write a Review</h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                  {/* Rating */}
                  <div>
                    <label className="block text-sm mb-1 font-medium">Rating</label>
                    <select
                      value={reviewForm.rating}
                      onChange={(e) =>
                        setReviewForm({ ...reviewForm, rating: Number(e.target.value) })
                      }
                      className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary"
                    >
                      {[5, 4, 3, 2, 1].map((r) => (
                        <option key={r} value={r}>
                          {r} Stars
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Comment + Image Upload */}
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-1 font-medium">Comment</label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) =>
                        setReviewForm({ ...reviewForm, comment: e.target.value })
                      }
                      className="border rounded-lg px-3 py-2 w-full min-h-[90px] focus:ring-2 focus:ring-primary"
                      placeholder="Share your experience..."
                    />

                    {/* Upload */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-2">
                        Add Images <span className="text-gray-500">(max 6)</span>
                      </label>

                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-primary transition"
                        onClick={() => document.getElementById("reviewImageInput")?.click()}
                      >
                        <p className="text-gray-500 text-sm text-center">Click or Drag & Drop Images</p>
                      </div>

                      <input
                        id="reviewImageInput"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleReviewImagesSelect}
                        className="hidden"
                      />

                      {uploadingImages && (
                        <p className="text-xs text-gray-500 mt-2">Uploading...</p>
                      )}

                      {/* Image Preview Grid */}
                      {reviewImages.length > 0 && (
                        <div className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-3">
                          {reviewImages.map((url, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={url}
                                className="w-full h-20 object-cover rounded-lg border"
                                alt="preview"
                              />
                              <button
                                onClick={() =>
                                  setReviewImages(reviewImages.filter((_, i) => i !== idx))
                                }
                                className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full text-xs px-1 hidden group-hover:block"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmitReview}
                  disabled={submittingReview}
                  className="mt-4 bg-primary hover:bg-primary text-white px-5 py-2 rounded-lg font-medium disabled:opacity-60"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>

              {/* Reviews Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Customer Reviews</h3>

                <select
                  value={reviewFilter}
                  onChange={(e) => setReviewFilter(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Reviews</option>
                  {[5, 4, 3, 2, 1].map((star) => (
                    <option key={star} value={star}>
                      {star} Stars
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Distribution */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="grid md:grid-cols-2 gap-6">

                  {/* Average Rating */}
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-800">{product?.rating}</div>
                    <div className="flex justify-center my-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < Math.floor(product?.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                            }`}
                        />
                      ))}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {sourceReviews.length} total reviews
                    </div>
                  </div>

                  {/* Bars */}
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-3">
                        <span className="w-8 text-sm">{rating}★</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{
                              width: `${(ratingDistribution[rating] / sourceReviews.length) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="w-6 text-sm text-gray-700">
                          {ratingDistribution[rating]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                {reviewsToShow.map((review: any) => (
                  <div key={review._id} className="border-b pb-5">

                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {review?.user?.firstName || "User"}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                                }`}
                            />
                          ))}
                          <span className="text-xs text-gray-500">
                            {new Date(review?.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Comment */}
                    <p className="text-gray-700 mb-3">{review.comment}</p>

                    {/* Review Images */}
                    {review?.images?.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                        {review.images.map((img: any, i: any) => (
                          <img
                            key={i}
                            src={img}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <button onClick={() => handleReviewAction(review._id, 'helpful')} className="hover:text-success flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        Helpful ({review.helpful || 0})
                      </button>
                      <button onClick={() => handleReviewAction(review._id, 'notHelpful')} className="hover:text-destructive flex items-center gap-1">
                        <ThumbsDown className="w-4 h-4" />
                        Not Helpful ({(review as any)?.notHelpful || 0})
                      </button>
                      {user?.role === 'restaurant' && (
                        <button onClick={() => handleToggleReply(review._id)} className="hover:text-blue-600 flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          Reply
                        </button>
                      )}
                    </div>

                    {Array.isArray((review as any)?.replies) && (review as any).replies.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {(review as any).replies.map((r: any, idx: number) => (
                          <div key={idx} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                            <div className="text-xs text-gray-600">
                              {r?.user?.firstName ? `${r.user.firstName}${r.user.lastName ? ' ' + r.user.lastName : ''}` : 'Restaurant'}
                              {r?.createdAt ? ` • ${new Date(r.createdAt).toLocaleDateString()}` : ''}
                            </div>
                            <div className="text-sm text-gray-800">{String(r?.comment || '')}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {user?.role === 'restaurant' && replyOpenId === review._id && (
                      <div className="mt-3 flex items-center gap-2">
                        <input
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply..."
                          className="flex-1 border rounded px-3 py-2 text-sm"
                        />
                        <button
                          onClick={() => handleSubmitReply(review._id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
                        >
                          Send
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Show More */}
              {filteredReviews.length > 3 && (
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="w-full py-2 border border-border text-primary rounded-lg mt-4 hover:bg-gray-50 font-medium"
                >
                  {showAllReviews
                    ? "Show Less Reviews"
                    : `Show All ${filteredReviews.length} Reviews`}
                </button>
              )}
            </div>

          )}

          {/* Related Products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-4">Related Products</h3>
              <ProductCardGrid
                productLists={relatedProducts}
                onAddToCart={handleAddToCartFromGrid}
                isInCart={isInCart}
                getCartQuantity={getCartQuantity}
                showQuantityControls={false}
              />
            </div>
          )}

          {/* FAQ Section */}
          <div className="mt-12 space-y-4">
            <h3 className="text-2xl font-bold">Frequently Asked Questions</h3>
            {[{
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
                <summary className="font-semibold cursor-pointer hover:text-primary">
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
              className={`p-3 rounded-xl border-2 ${isWishlisted ? "bg-secondary border-border" : "border-gray-300"
                }`}
            >
              <Heart className={`w-6 h-6 ${isWishlisted ? "text-primary fill-current" : "text-gray-600"}`} />
            </button>
            <button
              onClick={handleAddToCart}
              disabled={adding || !product.inStock}
              className="flex-1 bg-primary text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center disabled:bg-gray-400"
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
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 bg-primary text-white p-3 rounded-full shadow-soft hover:bg-primary transition-colors z-40"
      >
        <ChevronUp className="w-6 h-6" />
      </button>

    </div>

  );
};

export default ProductPage;