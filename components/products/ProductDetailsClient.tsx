"use client";
import React, { useCallback, useState, useEffect, useRef } from "react";
import {
    Heart, ShoppingCart, Star, Share2, Zap, CheckCircle, Plus, Minus, TrendingUp,
    Truck, Shield, RotateCcw, Award, Menu, X, Clock
} from "lucide-react";
import ProductCardGrid from "@/components/ProductGrid";
import { useSingleProductQuery } from "@/hooks/useSingleProductQuery";
import { useParams } from "next/navigation";
import { useCartStore } from "@/lib/store/useCartStore";
import Link from "next/link";
import { useWishlistQuery } from "@/hooks/useWishlistQuery";
import AddCardList from "@/components/AddCards";
import { CartItem, Product } from "@/types/global";
import { Button } from "@/components/ui/button";
import { useUserStore } from '@/lib/store/useUserStore';
import AppHeader from "@/components/ui/AppHeader";
import Image from "next/image"; // Added next/image for optimization

const ProductDetailsClient = () => {
    const { product_id } = useParams();
    const { user } = useUserStore();
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
    const [session_id, setSessionId] = useState<string | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

    // Hook calls
    // Hook calls
    const prodIdStr = product_id ? product_id.toString() : '';
    const { data: product, isLoading: loading, error } = useSingleProductQuery(prodIdStr);
    const { data: wishListsData = [], addToWishlist, removeFromWishlist } = useWishlistQuery(user?._id);

    const {
        addItem: storeAddItem,
        removeItem: storeRemoveItem,
        updateQuantity: storeUpdateQty,
        items: cartLines
    } = useCartStore();
    useEffect(() => {
        if (user?._id && product_id) {
            setIsWishlisted(wishListsData.some((item) => item._id === product_id));
        }
    }, [user?._id, product_id, wishListsData]);

    // Recently Viewed Logic
    useEffect(() => {
        if (product) {
            const recent = JSON.parse(localStorage.getItem('recent_views') || '[]');
            const filtered = recent.filter((p: any) => p._id !== product._id);
            const updated = [product, ...filtered].slice(0, 10);
            localStorage.setItem('recent_views', JSON.stringify(updated));
        }
    }, [product]);



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
        storeAddItem(cartItem1);
    };

    // useCallback hooks
    const isInCart = useCallback((prod: Product) => {
        return cartLines.some((item: any) => item.id === product_id);
    }, [cartLines, product_id]);

    const getCartQuantity = useCallback((prod: Product) => {
        const cartItem = cartLines.find((item: any) => item.id === product_id);
        return cartItem ? cartItem.quantity : 0;
    }, [cartLines, product_id]);

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
        } catch { }
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
        } catch { }
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
                    <div className="text-gray-600">{error instanceof Error ? error.message : String(error)}</div>
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

    const toggleWishlist = async (item: any) => {
        const isWishlistedAlready = wishListsData.some((fav: any) => fav._id === item._id);
        try {
            if (isWishlistedAlready) {
                await removeFromWishlist({ userId: user?._id || '', productId: item._id });
                setIsWishlisted(false);
            } else {
                await addToWishlist({ userId: user?._id || '', productId: item._id });
                setIsWishlisted(true);
            }
        } catch (err) {
            console.error("Error toggling wishlist:", err);
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

            storeAddItem(cartItem1);
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
        <div key={product_id ? String(product_id) : 'product-page'} className="fixed inset-0 z-[100] bg-white overflow-y-auto">
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
                                    removeFromCart={storeRemoveItem}
                                    updateQuantity={(itemId: any, newQuantity: any) => {
                                        storeUpdateQty(itemId, newQuantity);
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                <nav className="flex text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        <li className="inline-flex items-center">
                            <Link href="/home" className="hover:text-primary transition-colors">Home</Link>
                        </li>
                        <Plus className="w-3 h-3 mx-1 rotate-45" />
                        <li>
                            <Link href="/products" className="hover:text-primary transition-colors capitalize">{product?.category || 'Products'}</Link>
                        </li>
                        <Plus className="w-3 h-3 mx-1 rotate-45" />
                        <li className="font-bold text-gray-900 truncate max-w-[150px] sm:max-w-xs">{product?.name}</li>
                    </ol>
                </nav>

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
                            <Image
                                src={product?.images[selectedImage] || '/placeholder.png'}
                                alt={product?.name || "Product Image"}
                                fill
                                className="object-cover"
                                style={{
                                    transform: isZoomed ? `scale(${zoomLevel})` : 'scale(1)',
                                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                                    transition: 'transform 0.1s ease-out',
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
                                    className="relative group cursor-pointer w-16 h-16"
                                    onClick={() => setSelectedImage(i)}
                                >
                                    <Image
                                        src={img}
                                        alt=""
                                        fill
                                        className={`object-cover rounded transition-all ${selectedImage === i
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

                        {/* Urgency/Social Proof Banner */}
                        <div className="flex items-center gap-3 py-2 px-3 bg-red-50 border border-red-100 rounded-lg animate-pulse">
                            <span className="flex h-2 w-2 rounded-full bg-red-600"></span>
                            <p className="text-xs font-bold text-red-700 uppercase tracking-wider">
                                Limited Stock: Only {product?.stockCount || 5} units left!
                            </p>
                            <span className="text-[10px] text-red-600 ml-auto font-medium">12 people viewing this</span>
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
                                    <div key={key} className="flex justify-between items-center py-2 border-b">
                                        <span className="font-medium text-gray-600 capitalize">{key}</span>
                                        <span className="text-gray-900">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === 'reviews' && (
                        <div className="space-y-8">
                            {/* Review Summary Header */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Rating Stats - Left */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold">Customer Reviews</h3>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-5xl font-bold text-gray-900">{product?.rating}</div>
                                        <div>
                                            <div className="flex text-yellow-500 mb-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-5 h-5 ${i < Math.floor(product?.rating) ? 'fill-current' : 'text-gray-300'}`} />
                                                ))}
                                            </div>
                                            <p className="text-gray-500">{product?.totalReviews} ratings</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Reviews List */}
                            <div className="space-y-6">
                                {reviewsToShow.map((review: any) => (
                                    <div key={review.id || review._id} className="border-b pb-6 last:border-0">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold">
                                                    {review.userName?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{review.userName}</p>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="flex text-yellow-400">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                                                            ))}
                                                        </div>
                                                        {review.verified && (
                                                            <span className="text-xs text-green-600 flex items-center">
                                                                <CheckCircle className="w-3 h-3 mr-1" /> Verified
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-sm text-gray-500">{review.date}</span>
                                        </div>
                                        <p className="text-gray-700 mb-4">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

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

                {/* Product Comparison Section */}
                <ProductComparison currentProduct={product} />

                {/* FAQ Section */}
                <div className="mt-12 space-y-4">
                    <h3 className="text-2xl font-bold">Frequently Asked Questions</h3>
                    {[{
                        question: "How should I store this rice?",
                        answer: "Store in a cool, dry place away from direct sunlight. Use an airtight container after opening to maintain freshness and prevent pest infestation."
                    },
                    {
                        question: "Is this rice suitable for diabetics?",
                        answer: "Consult your doctor, though it's lower GI."
                    },
                    {
                        question: "What is the cooking ratio?",
                        answer: "Use 1:2 ratio of rice to water."
                    }
                    ].map((faq, index) => (
                        <details key={index} className="border rounded-lg p-4 group">
                            <summary className="font-semibold cursor-pointer hover:text-primary flex justify-between items-center list-none">
                                {faq.question}
                                <span className="group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="mt-2 text-gray-700 border-t pt-2">{faq.answer}</p>
                        </details>
                    ))}
                </div>

                {/* Frequently Bought Together (Simulated) */}
                <FrequentlyBoughtTogether currentProduct={product} onAddToCart={handleAddToCartFromGrid} />

                {/* Recently Viewed Feature */}
                <RecentlyViewedProducts currentId={product_id as string} />
            </div>
        </div>
    );
};

const FrequentlyBoughtTogether = ({ currentProduct, onAddToCart }: { currentProduct: any, onAddToCart: any }) => {
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        fetch(`/api/categories/productcategory`)
            .then(res => res.json())
            .then(json => {
                if (json.success && Array.isArray(json.data)) {
                    const all = json.data.flatMap((c: any) => c.products || []);
                    const filtered = all.filter((p: any) => p._id !== currentProduct?._id && p._id !== undefined).slice(0, 2);
                    setItems(filtered);
                }
            })
            .catch(() => setItems([]));
    }, [currentProduct?._id]);

    if (items.length === 0) return null;

    const totalBundlePrice = (currentProduct?.price || 0) + items.reduce((acc, curr) => acc + (curr.price || 0), 0);

    return (
        <div className="mt-12 p-6 rounded-2xl border bg-gradient-to-br from-orange-50 to-white border-orange-100 shadow-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-orange-800">
                <Zap className="w-5 h-5 fill-current" />
                Frequently Bought Together
            </h3>
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-3">
                        <img src={currentProduct?.images?.[0]} className="w-16 h-16 rounded-lg object-cover border-2 border-orange-200" alt="" />
                        <Plus className="w-5 h-5 text-gray-400" />
                        {items.map((item, idx) => (
                            <React.Fragment key={item._id}>
                                <img src={item.images?.[0]} className="w-16 h-16 rounded-lg object-cover border border-gray-200" alt="" />
                                {idx < items.length - 1 && <Plus className="w-5 h-5 text-gray-400" />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm min-w-[200px]">
                    <div className="text-sm text-gray-600 mb-1">Bundle Price</div>
                    <div className="text-2xl font-bold text-gray-900 mb-3">₹{totalBundlePrice}</div>
                    <Button
                        className="w-full bg-orange-500 hover:bg-orange-600 font-bold"
                        onClick={() => {
                            onAddToCart(currentProduct);
                            items.forEach(i => onAddToCart(i));
                        }}
                    >
                        Add Bundle to Cart
                    </Button>
                </div>
            </div>
        </div>
    );
};

const RecentlyViewedProducts = ({ currentId }: { currentId: string }) => {
    const [recentProducts, setRecentProducts] = useState<any[]>([]);

    useEffect(() => {
        const recent = JSON.parse(localStorage.getItem("recent_views") || "[]");
        setRecentProducts(recent.filter((p: any) => p._id !== currentId).slice(0, 4));
    }, [currentId]);

    if (recentProducts.length === 0) return null;

    return (
        <div className="mt-16 bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Recently Viewed
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recentProducts.map((p) => (
                    <Link
                        key={p._id}
                        href={`/products/${p._id}`}
                        className="group bg-white rounded-xl p-3 border border-transparent hover:border-primary transition-all shadow-sm overflow-hidden"
                    >
                        <div className="aspect-square rounded-lg overflow-hidden mb-3">
                            <img
                                src={p.images?.[0]}
                                alt={p.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                        <h4 className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                            {p.name}
                        </h4>
                        <p className="text-primary font-bold text-sm">₹{p.price}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

const ProductComparison = ({ currentProduct }: { currentProduct: any }) => {
    const [competitor, setCompetitor] = useState<any>(null);

    useEffect(() => {
        fetch(`/api/categories/productcategory`)
            .then(res => res.json())
            .then(json => {
                if (json.success && Array.isArray(json.data)) {
                    const all = json.data.flatMap((c: any) => c.products || []);
                    const other = all.find((p: any) => p._id !== currentProduct?._id);
                    setCompetitor(other);
                }
            });
    }, [currentProduct?._id]);

    if (!competitor) return null;

    return (
        <div className="mt-16 overflow-hidden rounded-2xl border border-gray-200 shadow-sm bg-white">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-bold">Why choose this Product?</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 text-sm">
                            <th className="px-6 py-4 font-bold border-b">Features</th>
                            <th className="px-6 py-4 font-bold border-b text-primary text-xs sm:text-sm">{currentProduct.name}</th>
                            <th className="px-6 py-4 font-bold border-b text-gray-500 font-medium  text-xs sm:text-sm">Top Alternative</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        <tr>
                            <td className="px-6 py-4 border-b font-medium">Price</td>
                            <td className="px-6 py-4 border-b font-bold text-gray-900">₹{currentProduct.price}</td>
                            <td className="px-6 py-4 border-b text-gray-600">₹{competitor.price}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 border-b font-medium">Rating</td>
                            <td className="px-6 py-4 border-b flex items-center gap-1 font-bold">
                                {currentProduct.rating} <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            </td>
                            <td className="px-6 py-4 border-b text-gray-600 italic">Lower</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 border-b font-medium">Delivery</td>
                            <td className="px-6 py-4 border-b text-green-600 font-bold">{currentProduct.deliveryInfo?.freeDelivery ? 'Free' : 'Fast'}</td>
                            <td className="px-6 py-4 border-b text-gray-600">Standard</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductDetailsClient;
