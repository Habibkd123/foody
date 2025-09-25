"use client";
import React, { useState, useRef, useCallback } from 'react';
import {
    Heart,
    ShoppingCart,
    Star,
    Eye,
    Share2,
    Zap,
    CheckCircle,
    Plus,
    Minus,
    ShoppingBag,
    Bookmark,
    TrendingUp
} from 'lucide-react';
import { useWishListContext, WishListContext } from '@/context/WishListsContext';
import Link from 'next/link';
import { Product } from '../types/global';
import "./../components/cards.css"
import { useAuthStorage } from '@/hooks/useAuth';

interface ProductCardGridProps {
    productLists: Product[];
    onAddToCart?: (product: Product, quantity?: number) => void;
    onToggleWishlist?: (product: Product) => void;
    onQuickView?: (product: Product) => void;
    onShare?: (product: Product) => void;
    isInCart: any;
    getCartQuantity?: (product: Product) => number;
    updateQuantity?: (productId: string, change: number) => void;
    isLoading?: boolean;
    showQuickActions?: boolean;
    showQuantityControls?: boolean;
    animationDelay?: boolean;
}

/* ------------------ Enhanced Responsive Product Card Grid ------------------ */
const ProductCardGrid: React.FC<ProductCardGridProps> = ({
    productLists,
    onAddToCart,
    updateQuantity = () => { },
    onToggleWishlist,
    onQuickView,
    onShare,
    isInCart,
    getCartQuantity,
    isLoading,
    showQuickActions = true,
    showQuantityControls = true,
    animationDelay = true
}) => {
    const { wishListsData, addWishList, removeWishList } = useWishListContext();
    const { user } = useAuthStorage()
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const [addingToCart, setAddingToCart] = useState<string | null>(null);
    const [justAdded, setJustAdded] = useState<string | null>(null);
    const imageRefs = useRef<{ [key: string]: HTMLImageElement | null }>({});
    let userId = user?._id;
 

    const handleAddToCart = async (product: Product) => {
        const quantity = quantities[product._id] || 1;
        setAddingToCart(product._id);
        product.quantity = quantity;
        try {
            await onAddToCart?.(product);
            setJustAdded(product._id);
            setQuantities((prev) => ({ ...prev, [product._id]: 1 }));
            setTimeout(() => setJustAdded(null), 2000);
        } catch (error) {
            console.error("Failed to add to cart:", error);
        } finally {
            setAddingToCart(null);
        }
    };

    // Toggle Wishlist
    const handleToggleWishlist = async (product: Product) => {
        const isWishlisted = wishListsData.some((item) => item._id === product._id);
        try {
            if (isWishlisted) {
                await removeWishList(userId, product._id);
            } else {
                await addWishList(userId, product._id);
            }
        } catch (error) {
            console.error("Error toggling wishlist:", error);
        }
    };

    // Share
    const handleShare = async (product: Product) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: `Check out this amazing product: ${product.name}`,
                    url: `/products/${product._id}`
                });
            } catch {
                console.log("Share cancelled or failed");
            }
        } else {
            navigator.clipboard.writeText(
                `${window.location.origin}/products/${product._id}`
            );
            onShare?.(product);
        }
    };

    // Calculate savings
    const calculateSavings = (product: Product) => {
        return product.originalPrice - product.price;
    };

    // Loading skeleton
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                {[...Array(10)].map((_, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden animate-pulse">
                        <div className="aspect-square bg-gray-200"></div>
                        <div className="p-2 sm:p-3 md:p-4 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-8 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (productLists?.length === 0) {
        return (
            <div className="col-span-full flex flex-col items-center justify-center py-12 sm:py-16">
                <div className="text-4xl sm:text-6xl mb-4 animate-bounce">🔍</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                <p className="text-sm sm:text-base text-gray-500 text-center px-4">Try adjusting your filters or search terms</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {productLists?.map((product, index) => {
                const isWishlisted = wishListsData.some((item: any) => item._id === product._id);
                const inCart = isInCart(product);
                const cartQuantity = getCartQuantity?.(product) || 0;
                const currentQuantity = quantities[product._id] || 1;
                const savings = calculateSavings(product);
                const isHovered = hoveredCard === product._id?.toString();
                const isAdding = addingToCart === product._id?.toString();
                const wasJustAdded = justAdded === product._id?.toString();

                return (
                    <div
                        key={product._id}
                        className={`bg-white relative border border-gray-200 rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group transform hover:-translate-y-2 hover:scale-[1.02] ${animationDelay ? 'animate-fade-in-up' : ''
                            }`}
                        style={{
                            animationDelay: animationDelay ? `${index * 100}ms` : '0ms'
                        }}
                        onMouseEnter={() => setHoveredCard(product._id?.toString())}
                        onMouseLeave={() => setHoveredCard(null)}
                    >
                        {/* Image Container with Enhanced Hover Effects */}
                        <Link href={`/products/${product._id}`} className="block relative overflow-hidden">
                            <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-2 sm:p-3 rounded-t-xl relative overflow-hidden">
                                <img
                                    ref={(el: HTMLImageElement | null) => {
                                        if (el) imageRefs.current[product._id] = el;
                                    }}
                                    src={product.images[0]}
                                    alt={product.name}
                                    className={`w-full h-full object-cover rounded-lg transition-all duration-700 ${isHovered ? 'scale-110 rotate-1' : 'scale-100 rotate-0'
                                        }`}
                                    loading="lazy"
                                />

                                {/* Shimmer effect on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 ${isHovered ? 'animate-shimmer opacity-20' : ''
                                    }`}></div>
                            </div>

                            {/* Enhanced badges */}
                            {product.discount > 0 && (
                                <div className="absolute top-0 left-0 z-20">
                                    <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-br-xl shadow-lg transform transition-all duration-300 hover:scale-105">
                                        <span className="flex items-center">
                                            <Zap className="w-3 h-3 mr-1" />
                                            {product.discount}% OFF
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Trending badge for highly rated products */}
                            {product.rating >= 4.5 && (
                                <div className="absolute top-0 right-0 z-20">
                                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-bl-xl shadow-lg">
                                        <TrendingUp className="w-3 h-3" />
                                    </div>
                                </div>
                            )}
                        </Link>

                        {/* Quick Action Buttons */}
                        {showQuickActions && (
                            <div className={`absolute top-2 right-2 flex flex-col space-y-2 z-30 transform transition-all duration-300 ${isHovered ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                                }`}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleWishlist(product);

                                    }}
                                    className={`p-2 bg-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${isWishlisted ? "bg-red-50 border-red-200" : "border-gray-200"
                                        }`}
                                >
                                    <Heart
                                        className={`w-4 h-4 transition-all duration-300 ${isWishlisted
                                                ? "text-red-500 fill-current scale-110"
                                                : "text-gray-400 hover:text-red-500"
                                            }`}
                                    />
                                </button>
                                {/* Quick View Button */}
                                <button
                                    onClick={(e: React.MouseEvent) => {
                                        e.stopPropagation();
                                        onQuickView?.(product);
                                    }}
                                    className="p-2 bg-white rounded-full shadow-lg border border-gray-200 transition-all duration-300 transform hover:scale-110 hover:bg-blue-50"
                                >
                                    <Eye className="w-4 h-4 text-gray-400 hover:text-blue-500 transition-colors duration-300" />
                                </button>

                                {/* Share Button */}
                                <button
                                    onClick={(e: React.MouseEvent) => {
                                        e.stopPropagation();
                                        handleShare(product);
                                    }}
                                    className="p-2 bg-white rounded-full shadow-lg border border-gray-200 transition-all duration-300 transform hover:scale-110 hover:bg-green-50"
                                >
                                    <Share2 className="w-4 h-4 text-gray-400 hover:text-green-500 transition-colors duration-300" />
                                </button>
                            </div>
                        )}

                        {/* Enhanced Content */}
                        <div className="p-3 sm:p-4 md:p-5">
                            <Link href={`/products/${product._id}`}>
                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors duration-300 text-sm sm:text-base leading-tight">
                                    {product.name}
                                </h3>
                            </Link>

                            {/* Enhanced Rating with animation */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-200 ${i < Math.floor(product.rating)
                                                    ? 'text-yellow-400 fill-current scale-100'
                                                    : 'text-gray-300 scale-90'
                                                    } ${isHovered && i < Math.floor(product.rating) ? 'animate-pulse' : ''}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="ml-2 text-xs text-gray-600 font-medium">
                                        {product.rating}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-500">
                                    {product.reviews ? `${product.reviews.length} reviews` : 'No reviews'}
                                </span>
                            </div>

                            {/* Enhanced Price Display */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-lg sm:text-xl font-bold text-gray-900">
                                            ₹{product?.price?.toLocaleString()}
                                        </span>
                                        <span className="text-sm text-gray-500 line-through">
                                            ₹{product?.originalPrice?.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                {!isNaN(savings) && (
                                    <div className="text-xs text-green-600 font-medium mt-1">
                                        You save ₹{savings.toLocaleString()}
                                    </div>
                                )}
                            </div>

                            {/* Quantity Controls */}
                            {showQuantityControls && !inCart && (
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-gray-700">Quantity:</span>
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <button
                                            onClick={() => updateQuantity(product._id?.toString(), -1)}
                                            className="p-1 hover:bg-gray-100 transition-colors duration-200"
                                            disabled={currentQuantity <= 1}
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                                            {currentQuantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(product._id?.toString(), 1)}
                                            className="p-1 hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Enhanced Add to Cart Button */}
                            <button
                                onClick={() => handleAddToCart(product)}
                                disabled={isAdding}
                                className={`w-full py-2.5 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-sm relative overflow-hidden ${wasJustAdded
                                    ? 'bg-green-500 text-white'
                                    : inCart
                                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                                        : 'bg-gradient-to-r from-orange-400 to-red-500 text-white hover:from-orange-500 hover:to-red-600 shadow-lg hover:shadow-xl'
                                    } ${isAdding ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                {isAdding ? (
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Adding...
                                    </div>
                                ) : wasJustAdded ? (
                                    <div className="flex items-center">
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Added!
                                    </div>
                                ) : inCart ? (
                                    <div className="flex items-center">
                                        <ShoppingBag className="w-4 h-4 mr-2" />
                                        In Cart ({cartQuantity})
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                        <span className="hidden sm:inline">Add to Cart</span>
                                        <span className="sm:hidden">Add</span>
                                        {currentQuantity > 1 && (
                                            <span className="ml-1">({currentQuantity})</span>
                                        )}
                                    </div>
                                )}

                                {/* Ripple effect */}
                                <div className={`absolute inset-0 bg-white opacity-0 ${isHovered ? 'animate-ping opacity-20' : ''
                                    }`}></div>
                            </button>

                            {/* Additional Info on Hover */}
                            <div className={`mt-2 text-xs text-gray-500 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                                }`}>
                                <div className="flex justify-between items-center">
                                    <span>Free delivery available</span>
                                    <span className="text-green-600">✓ In stock</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

        </div>
    );
};

export default ProductCardGrid;

