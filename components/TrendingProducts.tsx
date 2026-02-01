"use client"

import { useState } from "react"
import { Product } from "@/types/global"
import { TrendingUp, Star, Heart, ShoppingCart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useProductsQuery } from "@/hooks/useProductsQuery"
import { useRouter } from "next/navigation"
import Image from "next/image"

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface TrendingProductsProps {
  onAddToCart: (product: Product) => void
  onToggleWishlist: (product: Product) => void
}

export default function TrendingProducts({ onAddToCart, onToggleWishlist }: TrendingProductsProps) {
  const { data: productsData = [] } = useProductsQuery()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const router = useRouter()

  const trendingProducts = productsData
    .filter(product => product.rating && product.rating >= 4.0)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 10)

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
    <section className="py-2">
      <div className=" ">
        {/* Header */}
        <div className="text-center mb-8 px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="h-8 w-8 text-primary animate-bounce" />
            <h2 className=" sm:text-md md:text-4xl font-bold bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
              Trending Now
            </h2>
            <TrendingUp className=" sm:h-6  md:h-8  sm:w-6  md:w-8 text-primary animate-bounce" />
          </div>
          <p className="sm:text-xs md:text-base text-gray-600 dark:text-gray-400 mb-6">
            Most popular products this week
          </p>

          {/* Category Tabs */}
          <div className="flex overflow-x-auto pb-2 gap-3 mb-8 sm:justify-center justify-start px-4 sm:px-0 w-full scrollbar-hide">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`rounded-full px-6 py-2 transition-all duration-300 whitespace-nowrap flex-shrink-0 ${selectedCategory === category.id
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
        <div className="trending-products-slider relative sm:px-4">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={10}
            slidesPerView={2}
            navigation={{
              prevEl: '.trending-prev',
              nextEl: '.trending-next',
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 24 },
              768: { slidesPerView: 3, spaceBetween: 24 },
              1024: { slidesPerView: 4, spaceBetween: 24 },
              1280: { slidesPerView: 4, spaceBetween: 24 },
            }}
            className="pb-12"
          >
            {filteredProducts.map((product, index) => (
              <SwiperSlide key={product._id ?? `slide-${index}`}>
                <div className="h-full py-2">
                  <div className="h-full group hover:shadow-soft-lg transition-all duration-300 overflow-hidden border-border hover:scale-[1.02] bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-800">
                    <CardContent className="p-0">
                      {/* Product Image with trending badge */}
                      <div className="relative h-36 sm:h-56 w-full overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-10"></div>
                        <Image
                          src={product.images?.[0] || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />

                        {/* Trending Badge */}
                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20">
                          <Badge className="bg-primary hover:bg-primary text-white border-0 text-[10px] md:text-xs px-1.5 md:px-3 py-0.5 md:py-1 animate-pulse">
                            🔥 Trending
                          </Badge>
                        </div>



                        {/* Quick Actions */}
                        <div className="absolute bottom-3 right-3 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <Button
                            size="icon"
                            className="bg-white/90 hover:bg-white text-gray-700 shadow-soft w-8 h-8 rounded-full"
                            onClick={() => onToggleWishlist(product)}
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            className="bg-white/90 hover:bg-white text-gray-700 shadow-soft w-8 h-8 rounded-full"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="p-2 md:p-4">
                        <h3 className="font-semibold text-sm md:text-lg mb-1 md:mb-2 line-clamp-1 group-hover:text-primary transition-colors cursor-pointer" onClick={() => router.push(`/products/${product._id}`)}>
                          {product.name}
                        </h3>

                        <div className="flex items-center justify-between mb-2 md:mb-3">
                          <div className="flex items-center gap-1 md:gap-2">
                            <Star className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs md:text-sm font-medium">{product.rating || 0}</span>
                            <span className="text-[10px] md:text-xs text-gray-500">
                              ({product.reviews?.length || 0})
                            </span>
                          </div>

                          {/* Stock indicator */}
                          <Badge variant="secondary" className="text-[10px] md:text-xs hidden sm:inline-flex">
                            In Stock
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between mb-3 md:mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-lg md:text-2xl font-bold text-primary">₹{product.price}</span>
                            {product.originalPrice > product.price && (
                              <span className="text-xs md:text-sm text-gray-500 line-through">
                                ₹{product.originalPrice}
                              </span>
                            )}
                          </div>

                          {product.discount && product.discount > 0 && (
                            <Badge className="bg-secondary text-foreground text-[10px] md:text-xs">
                              {product.discount}% OFF
                            </Badge>
                          )}
                        </div>

                        {/* Add to Cart Button */}
                        <Button
                          className="w-full bg-primary hover:bg-primary text-white font-semibold group rounded-lg md:rounded-xl h-8 md:h-10 text-xs md:text-sm"
                          onClick={() => onAddToCart(product)}
                        >
                          <ShoppingCart className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 group-hover:animate-bounce" />
                          Add to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button className="trending-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-900 shadow-lg border border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white transition-all pointer-events-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="trending-next absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-900 shadow-lg border border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white transition-all pointer-events-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* View All Button */}
        <div className="text-center mt-6">
          <Button
            onClick={() => router.push('/productlist')}
            variant="outline"
            className="border-border text-primary hover:bg-secondary hover:border-border group"
          >
            View All Trending Products
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Button>
        </div>
      </div>

      <style jsx global>{`
        .trending-products-slider .swiper-pagination-bullet-active {
          background: #f97316 !important; /* Orange-500 or similar primary color */
          width: 24px !important;
          border-radius: 4px !important;
          opacity: 1;
        }
        .trending-products-slider .swiper-pagination-bullet {
          opacity: 0.5;
        }
      `}</style>
    </section>
  )
}
