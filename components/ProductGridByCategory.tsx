"use client";
import React, { useState, useRef, useCallback, useMemo } from 'react';
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
    TrendingUp,
    Filter,
    Grid,
    List
} from 'lucide-react';
import { useWishListContext, WishListContext } from '@/context/WishListsContext';
import Link from 'next/link';
import { Product } from '../types/global';
import "./../components/cards.css"

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
    // New category-related props
    selectedCategory?: string;
    onCategoryChange?: (category: string) => void;
    showCategoryFilter?: boolean;
    groupByCategory?: boolean;
}

/* ------------------ Enhanced Responsive Product Card Grid with Category Filtering ------------------ */
const ProductGridByCategory: React.FC<ProductCardGridProps> = ({
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
    animationDelay = true,
    selectedCategory = 'all',
    onCategoryChange,
    showCategoryFilter = true,
    groupByCategory = false
}) => {
    const { wishListsData } = useWishListContext();
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const [addingToCart, setAddingToCart] = useState<string | null>(null);
    const [justAdded, setJustAdded] = useState<string | null>(null);
    const imageRefs = useRef<{ [key: string]: HTMLImageElement | null }>({});

    // Get unique categories from products
    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(productLists.map(product => product.category))];
        return ['all', ...uniqueCategories];
    }, [productLists]);

    // Filter products by category
    const filteredProducts = useMemo(() => {
        if (selectedCategory === 'all') {
            return productLists;
        }
        return productLists.filter(product => product.category === selectedCategory);
    }, [productLists, selectedCategory]);

    // Group products by category if needed
    const groupedProducts = useMemo(() => {
        if (!groupByCategory) return { all: filteredProducts };
        
        return filteredProducts.reduce((acc, product) => {
            const category = product.category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(product);
            return acc;
        }, {} as { [key: string]: Product[] });
    }, [filteredProducts, groupByCategory]);

    // Enhanced add to cart with animation
    const handleAddToCart = async (product: Product) => {
        const quantity = quantities[product.id] || 1;
        setAddingToCart(product.id.toString());

        try {
            await onAddToCart?.(product, quantity);
            setJustAdded(product.id.toString());

            // Reset quantity after adding
            setQuantities(prev => ({ ...prev, [product.id]: 1 }));

            // Clear success state
            setTimeout(() => setJustAdded(null), 2000);
        } catch (error) {
            console.error('Failed to add to cart:', error);
        } finally {
            setAddingToCart(null);
        }
    };

    // Share functionality
    const handleShare = async (product: Product) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: `Check out this amazing product: ${product.name}`,
                    url: `/products/${product.id}`
                });
            } catch (error) {
                console.log('Share cancelled or failed');
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(`${window.location.origin}/products/${product.id}`);
            onShare?.(product);
        }
    };

    // Calculate savings
    const calculateSavings = (product: Product) => {
        return product.originalPrice - product.price;
    };

    // Category Filter Component
    const CategoryFilter = () => (
        <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Filter className="w-5 h-5 mr-2" />
                    Filter by Category
                </h3>
                <span className="text-sm text-gray-500">
                    {filteredProducts.length} products
                </span>
            </div>
            
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                    const productCount = category === 'all' 
                        ? productLists.length 
                        : productLists.filter(p => p.category === category).length;
                    
                    return (
                        <button
                            key={category}
                            onClick={() => onCategoryChange?.(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                                selectedCategory === category
                                    ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {category === 'all' ? 'All Categories' : category}
                            <span className="ml-2 text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                                {productCount}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );

    // Product Card Component
    const ProductCard = ({ product, index }: { product: Product; index: number }) => {
        const isWishlisted = wishListsData&&wishListsData.some((item: any) => item.id === product.id);
        const inCart = isInCart(product);
        const cartQuantity = getCartQuantity?.(product) || 0;
        const currentQuantity = quantities[product.id] || 1;
        const savings = calculateSavings(product);
        const isHovered = hoveredCard === product.id.toString();
        const isAdding = addingToCart === product.id.toString();
        const wasJustAdded = justAdded === product.id.toString();

        return (
            <div
                key={product.id}
                className={`bg-white relative border border-gray-200 rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group transform hover:-translate-y-2 hover:scale-[1.02] ${animationDelay ? 'animate-fade-in-up' : ''
                    }`}
                style={{
                    animationDelay: animationDelay ? `${index * 100}ms` : '0ms'
                }}
                onMouseEnter={() => setHoveredCard(product.id.toString())}
                onMouseLeave={() => setHoveredCard(null)}
            >
                {/* Image Container with Enhanced Hover Effects */}
                <Link href={`/products/${product.id}`} className="block relative overflow-hidden">
                    <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-2 sm:p-3 rounded-t-xl relative overflow-hidden">
                        <img
                            ref={(el: HTMLImageElement | null) => {
                                if (el) imageRefs.current[product.id] = el;
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
                    <div className="absolute top-0 left-0 z-20">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-br-xl shadow-lg transform transition-all duration-300 hover:scale-105">
                            <span className="flex items-center">
                                <Zap className="w-3 h-3 mr-1" />
                                {product.discount}% OFF
                            </span>
                        </div>
                    </div>

                    {/* Category badge */}
                    <div className="absolute bottom-2 left-2 z-20">
                        <div className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                            {product.category}
                        </div>
                    </div>

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
                        {/* Wishlist Button */}
                        <button
                            onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                onToggleWishlist?.(product);
                            }}
                            className={`p-2 bg-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${isWishlisted ? 'bg-red-50 border-red-200' : 'border-gray-200'
                                }`}
                        >
                            <Heart
                                className={`w-4 h-4 transition-all duration-300 ${isWishlisted ? 'text-red-500 fill-current scale-110' : 'text-gray-400 hover:text-red-500'
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
                    <Link href={`/products/${product.id}`}>
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
                                    ₹{product.price.toLocaleString()}
                                </span>
                                <span className="text-sm text-gray-500 line-through">
                                    ₹{product.originalPrice.toLocaleString()}
                                </span>
                            </div>
                        </div>
                        <div className="text-xs text-green-600 font-medium mt-1">
                            You save ₹{savings.toLocaleString()}
                        </div>
                    </div>

                    {/* Quantity Controls */}
                    {showQuantityControls && !inCart && (
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-700">Quantity:</span>
                            <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                    onClick={() => updateQuantity(product.id.toString(), -1)}
                                    className="p-1 hover:bg-gray-100 transition-colors duration-200"
                                    disabled={currentQuantity <= 1}
                                >
                                    <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                                    {currentQuantity}
                                </span>
                                <button
                                    onClick={() => updateQuantity(product.id.toString(), 1)}
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
    };

    // Loading skeleton
    if (isLoading) {
        return (
            <div className="space-y-6">
                {showCategoryFilter && (
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="flex space-x-2">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-10 bg-gray-200 rounded-full w-24"></div>
                            ))}
                        </div>
                    </div>
                )}
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
            </div>
        );
    }

    if (filteredProducts?.length === 0) {
        return (
            <div className="space-y-6">
                {showCategoryFilter && <CategoryFilter />}
                <div className="col-span-full flex flex-col items-center justify-center py-12 sm:py-16">
                    <div className="text-4xl sm:text-6xl mb-4 animate-bounce">🔍</div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                        No products found in "{selectedCategory}" category
                    </h3>
                    <p className="text-sm sm:text-base text-gray-500 text-center px-4">
                        Try selecting a different category or check back later
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Category Filter */}
            {showCategoryFilter && <CategoryFilter />}

            {/* Products Display */}
            {groupByCategory ? (
                // Grouped by category display
                <div className="space-y-8">
                    {Object.entries(groupedProducts).map(([category, products]) => (
                        <div key={category}>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 capitalize">
                                    {category}
                                </h2>
                                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                    {products.length} products
                                </span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                                {products.map((product, index) => (
                                    <ProductCard key={product.id} product={product} index={index} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // Regular grid display
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                    {filteredProducts.map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductGridByCategory;