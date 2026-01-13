"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Star, CheckCircle } from "lucide-react";
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
      className={`bg-white relative border border-gray-200 rounded-xl shadow-sm transition-all duration-300 overflow-hidden group`}
      style={{
        animationDelay: `${index * 80}ms`,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Image Container with Enhanced Hover Effects */}
      <Link
        href={`/products/${product._id}`}
        className="block relative overflow-hidden"
      >
        <div className="aspect-square bg-gray-50 flex items-center justify-center  rounded-t-xl relative overflow-hidden">
         <img
  src={product.images[0]}
  alt={product.name}
  className="w-full h-full object-cover rounded-t-xl"
  loading="lazy"
  sizes="(min-width:1536px) 20vw, (min-width:1280px) 25vw, (min-width:1024px) 33vw, 50vw"
/>

        </div>
      </Link>

      {/* Quick Action Buttons */}
      {showQuickActions && (
        <div className="absolute top-2 right-2 z-30">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleWishlist();
            }}
            className={`p-1.5 bg-white rounded-full shadow-sm border text-xs transition-colors ${
              isWishlisted
                ? "border-red-400 text-red-500"
                : "border-gray-200 text-gray-400 hover:text-red-500"
            }`}
          >
            <Heart
              className={`w-4 h-4 ${
                isWishlisted ? "fill-current" : ""
              }`}
            />
          </button>
        </div>
      )}

      {/* Content */}
      <div className="p-2 sm:p-4">
        <Link href={`/products/${product._id}`}>
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm sm:text-base leading-snug">
            {product.name}
          </h3>
        </Link>

      {product.rating>0&&
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-gray-600 font-medium">
            {product.rating?.toFixed(1) ?? "-"}
          </span>
        </div>}

        {/* Price */}
        <div className="mb-4 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-bold text-gray-900">
              ₹{product?.price?.toLocaleString()}
            </span>
            {product?.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
           

          </div>
             {/* Quantity Controls */}
            {showQuantityControls && !inCart && (
              <div className="flex items-center mb-2 sm:mb-3 text-[11px] sm:text-xs">
                <span className="text-xs sm:text-sm font-medium text-gray-700">Qty: {currentQuantity}</span>
              </div>
            )}
        </div>

      
        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`w-full py-2 px-3 sm:py-2.5 sm:px-4 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-colors ${
            wasJustAdded
              ? "bg-green-500 text-white"
              : inCart
              ? "bg-blue-100 text-blue-700"
              : "bg-orange-500 text-white hover:bg-orange-600"
          } ${isAdding ? "opacity-80 cursor-not-allowed" : "cursor-pointer"}`}
        >
          {isAdding ? (
            <span>Adding...</span>
          ) : wasJustAdded ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Added</span>
            </>
          ) : inCart ? (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span>In Cart ({cartQuantity})</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </>
          )}
        </button>

        {/* Extra info on hover */}
        {/* <div className="mt-2 text-[11px] text-gray-500">
          <span>Delivery in 15-30 min · In stock</span>
        </div> */}
      </div>
    </div>
  );
};

export default ProductCard;
