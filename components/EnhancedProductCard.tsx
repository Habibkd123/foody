"use client"

import { useState } from "react"
import { Product } from "@/types/global"
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Eye, 
  Plus, 
  Minus, 
  Truck,
  Shield,
  Clock,
  Sparkles,
  TrendingUp,
  Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface EnhancedProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  onToggleWishlist: (product: Product) => void
  onQuickView?: (product: Product) => void
  isInWishlist: boolean
  cartQuantity: number
  showQuickActions?: boolean
  variant?: 'default' | 'compact' | 'featured'
}

export default function EnhancedProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  onQuickView,
  isInWishlist,
  cartQuantity,
  showQuickActions = true,
  variant = 'default'
}: EnhancedProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const discountPercentage = product.originalPrice && product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const getStockStatus = () => {
    const stock = Math.floor(Math.random() * 50) + 10
    if (stock > 30) return { status: 'In Stock', color: 'green', count: stock }
    if (stock > 10) return { status: 'Low Stock', color: 'yellow', count: stock }
    return { status: 'Only Few Left', color: 'red', count: stock }
  }

  const stockStatus = getStockStatus()

  const getCardStyles = () => {
    const baseStyles = "group cursor-pointer transition-all duration-500 overflow-hidden border-0"
    
    switch (variant) {
      case 'compact':
        return `${baseStyles} hover:shadow-lg hover:-translate-y-1`
      case 'featured':
        return `${baseStyles} hover:shadow-2xl hover:-translate-y-2 ring-2 ring-orange-200 hover:ring-orange-400`
      default:
        return `${baseStyles} hover:shadow-xl hover:-translate-y-1 border border-gray-200 dark:border-gray-700`
    }
  }

  const getBadgeStyles = () => {
    if (discountPercentage >= 30) return "bg-red-500 hover:bg-red-600 text-white animate-pulse"
    if (discountPercentage >= 15) return "bg-orange-500 hover:bg-orange-600 text-white"
    if (stockStatus.status === 'Only Few Left') return "bg-red-500 hover:bg-red-600 text-white"
    return "bg-green-500 hover:bg-green-600 text-white"
  }

  const getBadgeText = () => {
    if (discountPercentage >= 15) return `${discountPercentage}% OFF`
    if (stockStatus.status === 'Only Few Left') return stockStatus.status
    return stockStatus.status
  }

  return (
    <Card className={getCardStyles()} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <CardContent className="p-0">
        {/* Product Image Section */}
        <div className="relative overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Product Image */}
          <div className="relative">
            <img
              src={product.images?.[0] || "/placeholder.svg"}
              alt={product.name}
              className={`w-full object-cover transition-all duration-700 ${
                variant === 'compact' ? 'h-40' : variant === 'featured' ? 'h-64' : 'h-48'
              } ${isHovered ? 'scale-110' : 'scale-100'}`}
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
            
            {/* Image Loading Placeholder */}
            {imageLoading && (
              <div className={`absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse ${
                variant === 'compact' ? 'h-40' : variant === 'featured' ? 'h-64' : 'h-48'
              }`}></div>
            )}
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
            <Badge className={`${getBadgeStyles()} px-3 py-1 text-xs font-semibold shadow-lg`}>
              {getBadgeText()}
            </Badge>
            
            {variant === 'featured' && (
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 text-xs font-semibold shadow-lg animate-pulse">
                <Sparkles className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          {showQuickActions && (
            <div className={`absolute top-3 right-3 z-20 flex flex-col gap-2 transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
            }`}>
              <Button
                size="icon"
                className="bg-white/90 hover:bg-white text-gray-700 shadow-md w-8 h-8 backdrop-blur-sm transition-all duration-300 hover:scale-110"
                onClick={() => onToggleWishlist(product)}
              >
                <Heart className={`w-4 h-4 transition-all duration-300 ${
                  isInWishlist ? "fill-red-500 text-red-500" : "hover:text-red-500"
                }`} />
              </Button>
              
              {onQuickView && (
                <Button
                  size="icon"
                  className="bg-white/90 hover:bg-white text-gray-700 shadow-md w-8 h-8 backdrop-blur-sm transition-all duration-300 hover:scale-110"
                  onClick={() => onQuickView(product)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}

          {/* Shipping Badge */}
          <div className="absolute bottom-3 left-3 z-20">
            <div className="bg-white/90 dark:bg-gray-800/90 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 backdrop-blur-sm">
              <Truck className="w-3 h-3 text-green-600" />
              <span className="text-green-700 dark:text-green-400">Free Delivery</span>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4">
          {/* Product Name */}
          <h3 className={`font-semibold mb-2 line-clamp-2 transition-colors duration-300 ${
            variant === 'featured' ? 'text-lg' : 'text-base'
          } text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400`}>
            {product.name}
          </h3>

          {/* Rating and Reviews */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium ml-1">{product.rating || 4.5}</span>
              </div>
              <span className="text-xs text-gray-500">
                ({product.reviews?.length || Math.floor(Math.random() * 100) + 20})
              </span>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-green-600" />
              <span className="text-xs text-green-600">Verified</span>
            </div>
          </div>

          {/* Price Section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className={`font-bold text-orange-600 dark:text-orange-400 ${
                variant === 'featured' ? 'text-2xl' : 'text-xl'
              }`}>
                ₹{product.price}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            {/* Savings */}
            {discountPercentage >= 15 && (
              <div className="text-right">
                <p className="text-xs text-green-600 font-semibold">
                  Save ₹{product.originalPrice - product.price}
                </p>
              </div>
            )}
          </div>

          {/* Features */}
          {variant === 'featured' && (
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                <Clock className="w-3 h-3" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                <Zap className="w-3 h-3" />
                <span>Top Rated</span>
              </div>
            </div>
          )}

          {/* Add to Cart Section */}
          <div className="flex items-center gap-2">
            {cartQuantity > 0 ? (
              <div className="flex items-center gap-2 flex-1">
                <Button
                  size="icon"
                  variant="outline"
                  className="w-8 h-8 hover:bg-orange-50 hover:border-orange-300"
                  onClick={() => {
                    // Handle quantity decrease
                    onAddToCart(product)
                  }}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                
                <div className="flex-1 text-center">
                  <span className="font-semibold text-orange-600">{cartQuantity}</span>
                </div>
                
                <Button
                  size="icon"
                  variant="outline"
                  className="w-8 h-8 hover:bg-orange-50 hover:border-orange-300"
                  onClick={() => {
                    // Handle quantity increase
                    onAddToCart(product)
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button 
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 group"
                onClick={() => onAddToCart(product)}
              >
                <ShoppingCart className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                Add to Cart
              </Button>
            )}
            
            {onQuickView && (
              <Button
                variant="outline"
                size="icon"
                className="w-10 h-10 hover:bg-orange-50 hover:border-orange-300 transition-all duration-300 hover:scale-110"
                onClick={() => onQuickView(product)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Additional Info for Featured */}
          {variant === 'featured' && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span>Trending #1</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Delivery in 2-3 days</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
