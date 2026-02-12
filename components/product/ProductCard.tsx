"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Check, Plus, Star } from "lucide-react";
import Image from "next/image";
import { Product } from "@/types/global";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
    product: Product;
    index: number;
    isWishlisted: boolean;
    inCart: boolean;
    cartQuantity: number;
    currentQuantity: number;
    savings: number;
    isHovered: boolean;
    isAdding: boolean;
    wasJustAdded: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    showQuickActions: boolean;
    showQuantityControls: boolean;
    handleToggleWishlist: () => void;
    handleShare: () => void;
    handleAddToCart: () => void;
    updateQuantity: (change: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    index,
    isWishlisted,
    inCart,
    cartQuantity,
    isAdding,
    wasJustAdded,
    onMouseEnter,
    onMouseLeave,
    handleToggleWishlist,
    handleAddToCart,
}) => {
    const discount = product.originalPrice && product.originalPrice > product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="group relative bg-white dark:bg-card  border border-border/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden"
        >
            {/* Image Section */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 dark:bg-gray-900/50">
                <Link href={`/products/${product._id}`} className="block w-full h-full relative">
                    <Image
                        src={product.images[0] || "/placeholder-product.png"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>

                {/* Wishlist Button (Top Right) */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleToggleWishlist();
                    }}
                    className={`absolute top-2 right-2 md:top-3 md:right-3 p-1.5 md:p-2 rounded-full shadow-sm transition-all duration-200 z-10 ${isWishlisted
                        ? "bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-white/90 text-gray-400 hover:text-red-500 hover:scale-110 dark:bg-black/50"
                        }`}
                >
                    <Heart className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isWishlisted ? "fill-current" : ""}`} />
                </button>

                {/* Discount Badge (Top Left) */}
                {discount > 0 && (
                    <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-red-500 text-white text-[9px] md:text-[10px] uppercase font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-md shadow-sm z-10">
                        {discount}% OFF
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-2.5 md:p-4 flex flex-col flex-1 gap-2 md:gap-3">
                <div className="flex-1 space-y-1">
                    <Link href={`/products/${product._id}`} className="block group-hover:text-primary transition-colors">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-lg line-clamp-2 md:line-clamp-1 leading-snug" title={product.name}>
                            {product.name}
                        </h3>
                    </Link>
                    <div className="flex items-center flex-wrap gap-2 text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center text-yellow-500">
                            <Star className="w-3 h-3 md:w-3.5 md:h-3.5 fill-current" />
                            <span className="ml-1 font-medium text-gray-900 dark:text-gray-100">{product.rating ? product.rating.toFixed(1) : "New"}</span>
                        </div>
                        <span className="hidden md:inline">•</span>
                        <span className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-[9px] md:text-xs">20m</span>
                    </div>
                </div>

                {/* Footer: Price & Add Button */}
                <div className="mt-auto flex items-center justify-between pt-2 md:pt-3 border-t border-gray-100 dark:border-gray-800 gap-2">
                    <div className="flex flex-col min-w-0">
                        <span className="text-[10px] text-gray-400 uppercase font-medium hidden md:block">Price</span>
                        <div className="flex items-baseline gap-1 md:gap-2 flex-wrap">
                            <span className="text-sm md:text-lg font-bold text-gray-900 dark:text-white truncate">
                                ₹{product.price.toLocaleString()}
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-[10px] md:text-xs text-gray-400 line-through truncate">
                                    ₹{product.originalPrice.toLocaleString()}
                                </span>
                            )}
                        </div>
                    </div>

                    <Button
                        variant={inCart ? "default" : "outline"}
                        size="sm"
                        className={`h-8 md:h-10 px-3 md:px-4 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all duration-300 shrink-0 ${inCart
                            ? "bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20"
                            : "border-gray-200 hover:border-primary hover:text-primary hover:bg-orange-50 dark:border-gray-700 dark:hover:bg-primary/10"
                            } ${isAdding ? "opacity-70 cursor-wait" : ""}`}
                        onClick={(e) => {
                            e.preventDefault();
                            if (!isAdding) handleAddToCart();
                        }}
                        disabled={isAdding}
                    >
                        {isAdding ? (
                            <span className="animate-spin w-3 h-3 md:w-4 md:h-4 border-2 border-current border-t-transparent rounded-full" />
                        ) : wasJustAdded ? (
                            <span className="flex items-center gap-1"><Check className="w-3 h-3 md:w-4 md:h-4" /> <span className="hidden sm:inline">Added</span></span>
                        ) : inCart ? (
                            <span className="flex items-center gap-1"><ShoppingCart className="w-3 h-3 md:w-4 md:h-4" /> {cartQuantity}</span>
                        ) : (
                            <span className="flex items-center gap-1 font-bold">Add <Plus className="w-3 h-3 md:w-4 md:h-4" /></span>
                        )}
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
