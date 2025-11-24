"use client"

import { useState, useEffect } from "react"
import { Clock, Zap, TrendingUp, Star, ShoppingCart, Heart, ArrowRight } from "lucide-react"
import { Product } from "@/types/global"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface FlashSaleProps {
  products: Product[]
  onAddToCart: (product: Product) => void
  onToggleWishlist: (product: Product) => void
}

export default function FlashSales({ products, onAddToCart, onToggleWishlist }: FlashSaleProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 45,
    seconds: 30
  })

  const flashSaleProducts = products
    .filter(product => product.discount && product.discount > 15)
    .slice(0, 8)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const totalSeconds = prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1
        
        if (totalSeconds <= 0) {
          clearInterval(timer)
          return { hours: 0, minutes: 0, seconds: 0 }
        }
        
        return {
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (flashSaleProducts.length === 0) return null

  return (
    <section className="py-12 bg-secondary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.5) 35px, rgba(255,255,255,.5) 70px)`
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header with Countdown */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="h-8 w-8 text-primary animate-pulse" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
              Flash Sale
            </h2>
            <Zap className="h-8 w-8 text-primary animate-pulse" />
          </div>
          
          {/* Countdown Timer */}
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow-soft">
              <span className="text-3xl font-bold text-primary">{String(timeLeft.hours).padStart(2, '0')}</span>
              <p className="text-xs text-gray-600 dark:text-gray-400">Hours</p>
            </div>
            <span className="text-2xl font-bold text-primary">:</span>
            <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow-soft">
              <span className="text-3xl font-bold text-primary">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <p className="text-xs text-gray-600 dark:text-gray-400">Minutes</p>
            </div>
            <span className="text-2xl font-bold text-primary">:</span>
            <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow-soft">
              <span className="text-3xl font-bold text-primary">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <p className="text-xs text-gray-600 dark:text-gray-400">Seconds</p>
            </div>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400">
            Limited time offers on selected items
          </p>
        </div>

        {/* Flash Sale Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {flashSaleProducts.map((product, index) => (
            <Card 
              key={product._id ?? String(product.id)} 
              className="group hover:shadow-soft-lg transition-all duration-300 overflow-hidden border-border hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-0">
                {/* Product Image with urgency badge */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                  <img
                    src={product.images?.[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Flash Sale Badge */}
                  <div className="absolute top-3 left-3 z-20">
                    <Badge className="bg-primary hover:bg-primary text-white px-3 py-1 animate-pulse">
                      {product.discount}% OFF
                    </Badge>
                  </div>
                  
                  {/* Urgency Indicator */}
                  <div className="absolute top-3 right-3 z-20">
                    <div className="bg-primary text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Limited
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute bottom-3 right-3 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="icon"
                      className="bg-white/90 hover:bg-white text-gray-700 shadow-soft w-8 h-8"
                      onClick={() => onToggleWishlist(product)}
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm ml-1">{product.rating || 4.5}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      ({product.reviews?.length || 0} sold)
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-primary">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                    
                    {/* Stock Progress Bar */}
                    <div className="flex-1 mx-3">
                      <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-primary h-full animate-pulse"
                          style={{ width: `${Math.random() * 30 + 20}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Selling fast</p>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-primary hover:bg-primary text-white font-semibold"
                    onClick={() => onAddToCart(product)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Grab Deal
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            className="border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600 group"
          >
            View All Flash Deals
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  )
}
