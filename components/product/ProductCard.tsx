"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Star, CheckCircle, Eye, ArrowUpRight, Plus } from "lucide-react";
import { Product } from "@/types/global";
import { motion, AnimatePresence } from "framer-motion";

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
  currentQuantity,
  savings,
  isHovered,
  isAdding,
  wasJustAdded,
  onMouseEnter,
  onMouseLeave,
  showQuickActions,
  showQuantityControls,
  handleToggleWishlist,
  handleAddToCart,
}) => {
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="group relative bg-white dark:bg-card border border-gray-100 dark:border-white/5 rounded-2xl md:rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
    >
      {/* Badges & Actions */}
      <div className="absolute top-3 left-3 right-3 z-30 flex justify-between items-start pointer-events-none">
        {discount > 0 ? (
          <div className="px-2.5 py-1 rounded-full bg-primary text-white text-[10px] font-black tracking-tight shadow-lg shadow-primary/20 pointer-events-auto lowercase">
            SALE {discount}%
          </div>
        ) : (
          <div />
        )}

        {showQuickActions && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleToggleWishlist();
            }}
            className={`p-2 rounded-full backdrop-blur-md shadow-lg pointer-events-auto transition-colors ${isWishlisted
              ? "bg-red-500 text-white"
              : "bg-white/80 dark:bg-black/50 text-gray-400 hover:text-red-500"
              }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
          </motion.button>
        )}
      </div>

      {/* Image Container */}
      <Link href={`/products/${product._id}`} className="block relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-800/50">
        <img
          src={product.images[0] || "/placeholder-product.png"}
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Quick View Overlay (Desktop) */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center gap-3">
          <div className="p-3 rounded-full bg-white text-gray-900 shadow-xl hover:scale-110 transition-transform">
            <Eye className="w-5 h-5" />
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-3 md:p-5">
        <div className="flex justify-between items-start gap-2 mb-2">
          <Link href={`/products/${product._id}`} className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 text-sm md:text-base group-hover:text-primary transition-colors h-[2.5rem] md:h-[3rem]">
              {product.name}
            </h3>
          </Link>
          <div className="p-1 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <ArrowUpRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex text-yellow-500">
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="text-xs font-black text-gray-900 dark:text-white">
            {product.rating > 0 ? product.rating.toFixed(1) : "4.8"}
          </span>
          <span className="text-[10px] text-gray-400 font-medium">
            ({product.totalReviews || "120"}+)
          </span>
        </div>

        {/* Price Row */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-black text-gray-900 dark:text-white">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through -mt-1">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.button
              key={wasJustAdded ? "added" : inCart ? "incart" : "add"}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileHover={!isAdding ? { scale: 1.05 } : {}}
              whileTap={!isAdding ? { scale: 0.95 } : {}}
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart();
              }}
              disabled={isAdding}
              className={`relative h-10 md:h-12 px-4 md:px-6 rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-wider shadow-lg transition-all ${wasJustAdded
                ? "bg-green-500 text-white shadow-green-500/20"
                : inCart
                  ? "bg-primary text-white shadow-primary/20"
                  : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-black dark:hover:bg-gray-200"
                } ${isAdding ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div className="flex items-center gap-2">
                {isAdding ? (
                  <span className="animate-pulse">...</span>
                ) : wasJustAdded ? (
                  <CheckCircle className="w-4 h-4" />
                ) : inCart ? (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>{cartQuantity}</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Add</span>
                  </>
                )}
              </div>
            </motion.button>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
