"use client";

import React from "react";
import Link from "next/link";
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
  TrendingUp,
} from "lucide-react";
import { Product } from "@/types/global";

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
  handleShare,
  handleAddToCart,
  updateQuantity,
}) => {
  return (
    <div
      className={`bg-white relative border border-gray-200 rounded-xl shadow-sm md:hover:shadow-xl transition-all duration-500 overflow-hidden group touch-manipulation transform md:hover:-translate-y-2 md:hover:scale-[1.02] animate-fade-in-up`}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Image Container with Enhanced Hover Effects */}
      <Link
        href={`/products/${product._id}`}
        className="block relative overflow-hidden"
      >
        <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-2 sm:p-2 rounded-t-xl relative overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className={`w-full h-full object-cover rounded-lg transition-all duration-700 ${
              isHovered ? "md:scale-110 md:rotate-1" : "scale-100 rotate-0"
            }`}
            loading="lazy"
            sizes="(min-width:1536px) 20vw, (min-width:1280px) 25vw, (min-width:1024px) 33vw, 50vw"
          />

          {/* Shimmer effect on hover */}
          <div
            className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 ${
              isHovered ? "animate-shimmer opacity-20" : ""
            }`}
          />
        </div>

        {/* Discount badge */}
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

        {/* Trending badge */}
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
        <div className={`absolute top-2 right-2 flex flex-col space-y-2 z-30 transition-all duration-300 opacity-100 translate-x-0 md:transform ${
          isHovered ? "md:translate-x-0 md:opacity-100" : "md:translate-x-8 md:opacity-0"
        }`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleWishlist();
            }}
            className={`p-2 bg-white rounded-full shadow-lg transition-all duration-300 transform md:hover:scale-110 ${
              isWishlisted ? "bg-red-50 border-red-200" : "border-gray-200"
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-all duration-300 ${
                isWishlisted
                  ? "text-red-500 fill-current scale-110"
                  : "text-gray-400 hover:text-red-500"
              }`}
            />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              // Quick view handled by parent if needed
            }}
            className="p-2 bg-white rounded-full shadow-lg border border-gray-200 transition-all duration-300 transform md:hover:scale-110 md:hover:bg-blue-50"
          >
            <Eye className="w-4 h-4 text-gray-400 hover:text-blue-500 transition-colors duration-300" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
            className="p-2 bg-white rounded-full shadow-lg border border-gray-200 transition-all duration-300 transform md:hover:scale-110 md:hover:bg-green-50"
          >
            <Share2 className="w-4 h-4 text-gray-400 hover:text-green-500 transition-colors duration-300" />
          </button>
        </div>
      )}

      {/* Content */}
      <div className="p-3 sm:p-4 md:p-5">
        <Link href={`/products/${product._id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors duration-300 text-sm sm:text-base leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-200 ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-current scale-100"
                      : "text-gray-300 scale-90"
                  } ${isHovered && i < Math.floor(product.rating) ? "animate-pulse" : ""}`}
                />
              ))}
            </div>
            <span className="ml-2 text-xs text-gray-600 font-medium">
              {product.rating}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {product.reviews ? `${product.reviews.length} reviews` : "No reviews"}
          </span>
        </div>

        {/* Price */}
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
                onClick={() => updateQuantity(-1)}
                className="p-1 hover:bg-gray-100 transition-colors duration-200"
                disabled={currentQuantity <= 1}
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                {currentQuantity}
              </span>
              <button
                onClick={() => updateQuantity(1)}
                className="p-1 hover:bg-gray-100 transition-colors duration-200"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`w-full py-2.5 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-sm relative overflow-hidden ${
            wasJustAdded
              ? "bg-green-500 text-white"
              : inCart
              ? "bg-blue-100 text-blue-700 border-2 border-blue-200"
              : "bg-gradient-to-r from-orange-400 to-red-500 text-white hover:from-orange-500 hover:to-red-600 shadow-lg hover:shadow-xl"
          } ${isAdding ? "cursor-not-allowed" : "cursor-pointer"}`}
        >
          {isAdding ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
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
              {currentQuantity > 1 && <span className="ml-1">({currentQuantity})</span>}
            </div>
          )}

          <div
            className={`absolute inset-0 bg-white opacity-0 ${
              isHovered ? "animate-ping opacity-20" : ""
            }`}
          />
        </button>

        {/* Extra info on hover */}
        <div
          className={`mt-2 text-xs text-gray-500 transition-all duration-300 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <div className="flex justify-between items-center">
            <span>Free delivery available</span>
            <span className="text-green-600">✓ In stock</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
