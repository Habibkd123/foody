"use client"

import React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Search, Star, Heart, Plus, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Product } from "@/types/global"

interface Props {
  title: string
  filteredProducts: Product[]
  searchTerm: string
  setSearchTerm: (v: string) => void
  wishListsData: Product[] | null | undefined
  onAddToCart: (p: Product) => void
  onToggleWishlist: (p: Product) => void
}

export default function ProductsSection({
  title,
  filteredProducts,
  searchTerm,
  setSearchTerm,
  wishListsData,
  onAddToCart,
  onToggleWishlist,
}: Props) {
  return (
    <section id="products" className="py-8 md:py-12 bg-orange-10 dark:bg-gray-900">
      <div className="container-fluid mx-auto p-1 ">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between sm:gap-1 md:gap-4 mb-6 md:mb-10"
        >
          <h2 className="sm:text-xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            {title}
          </h2>

          {/* <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                className="pl-10 rounded-xl shadow-sm border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="hidden sm:flex items-center gap-2 rounded-xl border-gray-200 dark:border-gray-700">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div> */}
        </motion.div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3   xl:grid-cols-4 gap-0 md:gap-6">
          {filteredProducts.map((product, index) => {
            const isWishlisted = wishListsData?.some((i) => i._id === product._id)

            return (
              <motion.div
                key={product._id || product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                style={{ opacity: 1, transform: "none", marginTop: "5px" }}
              >
                <div className="group   h-full flex flex-col  overflow-hidden transition-all duration-300 bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-800">

                  {/* IMAGE */}
                  <div className="relative h-36 sm:h-44 w-full overflow-hidden bg-gray-50 dark:bg-gray-900/50">
                    <Image
                      src={product.images?.[0] || "/placeholder.png"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-all duration-500"
                    />

                    {/* DISCOUNT BADGE */}
                    {product.discount ? (
                      <div className="absolute top-2 left-2 md:top-3 md:left-3">
                        <Badge className="bg-red-500 hover:bg-red-600 text-white text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 shadow-sm border-0">
                          {product.discount}% OFF
                        </Badge>
                      </div>
                    ) : null}

                    {/* WISHLIST BUTTON */}
                    <button
                      onClick={() => onToggleWishlist(product)}
                      className="absolute top-2 right-2 md:top-3 md:right-3 p-1.5 md:p-2 rounded-full bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm hover:bg-white text-gray-700 dark:text-gray-200 transition-all shadow-sm"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-all ${isWishlisted ? "text-red-500 fill-red-500" : ""
                          }`}
                      />
                    </button>
                  </div>

                  {/* CONTENT */}
                  <CardContent className="p-2 md:p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-sm md:text-lg text-gray-900 dark:text-white line-clamp-2 leading-tight md:leading-normal mb-1">
                        {product.name}
                      </h3>

                      {/* RATING */}
                      <div className="flex items-center gap-1 mb-2 md:mb-3">
                        <Star className="h-3 w-3 md:h-4 md:w-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs md:text-sm font-medium">{product.rating || 4.2}</span>
                        <span className="text-[10px] md:text-xs text-gray-500">
                          ({product.reviews?.length || 12})
                        </span>
                      </div>
                    </div>

                    {/* PRICE + ADD */}
                    <div className="flex justify-between items-end gap-2 mt-auto">
                      <div className="flex flex-col">
                        {product.originalPrice && (
                          <span className="text-[10px] md:text-xs text-gray-400 line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                        <span className="text-sm md:text-lg font-bold text-primary leading-none">
                          ₹{product.price}
                        </span>
                      </div>

                      <Button
                        size="sm"
                        className="h-8 w-8 p-0 sm:w-auto sm:h-9 sm:px-4 rounded-lg md:rounded-xl bg-primary hover:bg-primary/90 text-white shrink-0"
                        onClick={() => onAddToCart(product)}
                      >
                        <Plus className="h-4 w-4 sm:mr-1.5" />
                        <span className="hidden sm:inline font-medium">Add</span>
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* EMPTY STATE */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 dark:text-gray-400 text-lg"
            >
              No products found.
            </motion.p>
          </div>
        )}
      </div>
    </section>
  )
}
