"use client"

import { useState, useEffect } from "react"
import { Product } from "@/types/global"
import { TrendingUp, Star, Heart, ShoppingCart, Eye, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useProductsContext } from "@/context/AllProductContext"
import { useRouter } from "next/navigation"

interface TrendingProductsProps {
  onAddToCart: (product: Product) => void
  onToggleWishlist: (product: Product) => void
}

export default function TrendingProducts({ onAddToCart, onToggleWishlist }: TrendingProductsProps) {
  const { productsData } = useProductsContext()
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
let router = useRouter()
  useEffect(() => {
    // Simulate trending products based on rating and sales
    const trending = productsData
      .filter(product => product.rating && product.rating >= 4.0)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 10)
    
    setTrendingProducts(trending)
  }, [productsData])

  const categories = [
    { id: 'all', name: 'All Trending', color: 'bg-primary' },
    { id: 'grocery', name: 'Grocery', color: 'bg-green-500' },
    { id: 'bakery', name: 'Bakery', color: 'bg-primary' },
    { id: 'masala', name: 'Spices', color: 'bg-primary' },
  ]

  const filteredProducts = selectedCategory === 'all' 
    ? trendingProducts 
    : trendingProducts.filter(product => product.category === selectedCategory)

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="h-8 w-8 text-primary animate-bounce" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
              Trending Now
            </h2>
            <TrendingUp className="h-8 w-8 text-primary animate-bounce" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Most popular products this week
          </p>

          {/* Category Tabs */}
          <div className="flex justify-center flex-wrap gap-3 mb-8">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`rounded-full px-6 py-2 transition-all duration-300 ${
                  selectedCategory === category.id
                    ? `${category.color} text-white hover:shadow-soft-lg transform scale-105`
                    : 'hover:bg-secondary hover:border-border'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Carousel */}
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {filteredProducts.map((product, index) => (
              <div 
                key={product._id} 
                className="flex-none w-72 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card className="h-full hover:shadow-soft-lg transition-all duration-300 overflow-hidden border-border hover:scale-105">
                  <CardContent className="p-0">
                    {/* Product Image with trending badge */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-10"></div>
                      <img
                        src={product.images?.[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Trending Badge */}
                      <div className="absolute top-3 left-3 z-20">
                        <Badge className="bg-primary hover:bg-primary text-white px-3 py-1 animate-pulse">
                          🔥 Trending
                        </Badge>
                      </div>
                      
                      {/* Rating Badge */}
                      <div className="absolute top-3 right-3 z-20">
                        <div className="bg-white/90 dark:bg-gray-800/90 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {product.rating}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="absolute bottom-3 right-3 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <Button
                          size="icon"
                          className="bg-white/90 hover:bg-white text-gray-700 shadow-soft w-8 h-8"
                          onClick={() => onToggleWishlist(product)}
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          className="bg-white/90 hover:bg-white text-gray-700 shadow-soft w-8 h-8"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{product.rating || 0}</span>
                          <span className="text-xs text-gray-500">
                            ({product.reviews?.length || 0})
                          </span>
                        </div>
                        
                        {/* Stock indicator */}
                        <Badge variant="secondary" className="text-xs">
                          In Stock
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-primary">₹{product.price}</span>
                          {product.originalPrice > product.price && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{product.originalPrice}
                            </span>
                          )}
                        </div>
                        
                        {product.discount && product.discount > 0 && (
                          <Badge className="bg-secondary text-foreground">
                            {product.discount}% OFF
                          </Badge>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <Button 
                        className="w-full bg-primary hover:bg-primary text-white font-semibold group"
                        onClick={() => onAddToCart(product)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button 
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-30"
            onClick={() => {
              const container = document.querySelector('.scrollbar-hide')
              if (container) container.scrollBy({ left: -300, behavior: 'smooth' })
            }}
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
          </button>
          <button 
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-30"
            onClick={() => {
              const container = document.querySelector('.scrollbar-hide')
              if (container) container.scrollBy({ left: 300, behavior: 'smooth' })
            }}
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <Button 
            onClick={() => router.push('/productlist')}
            variant="outline" 
            className="border-border text-primary hover:bg-secondary hover:border-border group"
          >
            View All Trending Products
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  )
}
