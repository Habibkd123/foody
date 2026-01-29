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
import { useUserStore } from '@/lib/store/useUserStore';
import { useWishlistQuery } from '@/hooks/useWishlistQuery';
import Link from 'next/link';
import "./../components/cards.css"
import { Product } from '@/types/global';
import ProductSkeletonGrid from '@/components/product/ProductSkeletonGrid';
import ProductEmptyState from '@/components/product/ProductEmptyState';
import ProductCard from '@/components/product/ProductCard';

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
    const { user } = useUserStore();
    const { data: wishListsData = [], addToWishlist, removeFromWishlist } = useWishlistQuery(user?._id);
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const [addingToCart, setAddingToCart] = useState<string | null>(null);
    const [justAdded, setJustAdded] = useState<string | null>(null);
    const imageRefs = useRef<{ [key: string]: HTMLImageElement | null }>({});
    const userId = user?._id;


    const handleAddToCart = async (product: Product) => {
        if (product._id == undefined) return
        const quantity = quantities[product._id] || 1;
        setAddingToCart(product._id);
        product.quantity = quantity;
        try {
            await onAddToCart?.(product);
            setJustAdded(product._id);

            setQuantities((prev) => ({ ...prev, [product._id ?? String(product.id)]: 1 }));
            setTimeout(() => setJustAdded(null), 2000);
        } catch (error) {
            console.error("Failed to add to cart:", error);
        } finally {
            setAddingToCart(null);
        }
    };

    // Toggle Wishlist
    const handleToggleWishlist = async (product: Product) => {
        if (!userId || !product._id) return;
        const isWishlisted = wishListsData.some((item) => (item._id || item.id) === (product._id || product.id));
        try {
            if (isWishlisted) {
                await removeFromWishlist({ userId, productId: product._id });
            } else {
                await addToWishlist({ userId, productId: product._id });
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
        return <ProductSkeletonGrid />;
    }

    if (productLists?.length === 0) {
        return <ProductEmptyState />;
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
            {Array.isArray(productLists) && productLists?.map((product, index) => {
                const isWishlisted = wishListsData && wishListsData.some((item: any) => item._id === product._id);
                const inCart = isInCart(product);
                const cartQuantity = getCartQuantity?.(product) || 0;
                const currentQuantity = quantities[product._id ?? String(product.id)] || 1;
                const savings = calculateSavings(product);
                const isHovered = hoveredCard === (product._id?.toString() ?? String(product.id));
                const isAdding = addingToCart === (product._id?.toString() ?? String(product.id));
                const wasJustAdded = justAdded === (product._id?.toString() ?? String(product.id));

                return (
                    <ProductCard
                        key={product._id}
                        product={product}
                        index={index}
                        isWishlisted={isWishlisted}
                        inCart={inCart}
                        cartQuantity={cartQuantity}
                        currentQuantity={currentQuantity}
                        savings={savings}
                        isHovered={isHovered}
                        isAdding={isAdding}
                        wasJustAdded={wasJustAdded}
                        onMouseEnter={() => setHoveredCard(product._id?.toString() ?? String(product.id))}
                        onMouseLeave={() => setHoveredCard(null)}
                        showQuickActions={showQuickActions}
                        showQuantityControls={showQuantityControls}
                        handleToggleWishlist={() => handleToggleWishlist(product)}
                        handleShare={() => handleShare(product)}
                        handleAddToCart={() => handleAddToCart(product)}
                        updateQuantity={(change) => updateQuantity(product._id?.toString() ?? String(product.id), change)}
                    />
                );
            })}

        </div>
    );
};

export default ProductCardGrid;

