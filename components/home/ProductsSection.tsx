"use client"

import React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Search, Star, Heart, Plus, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface ProductItem {
  _id: string
  name: string
  price: number
  originalPrice?: number
  images: string[]
  rating?: number
  reviews?: { _id: string }[]
  discount?: number
}

interface Props {
  title: string
  filteredProducts: ProductItem[]
  searchTerm: string
  setSearchTerm: (v: string) => void
  wishListsData: { _id: string }[] | null | undefined
  onAddToCart: (p: ProductItem) => void
  onToggleWishlist: (p: ProductItem) => void
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
    <section id="products" className="py-14 md:py-18 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                className="pl-10 rounded-xl shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="hidden sm:flex items-center gap-2 rounded-xl">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div>
        </motion.div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => {
            const isWishlisted = wishListsData?.some((i) => i._id === product._id)

            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Card className="group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800">

                  {/* IMAGE */}
                  <div className="relative h-44 w-full overflow-hidden rounded-t-2xl">
                    <Image
                      src={product.images?.[0] || "/placeholder.png"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-all duration-500"
                    />

                    {/* DISCOUNT BADGE */}
                    {product.discount ? (
                      <Badge className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full shadow-md">
                        {product.discount}% OFF
                      </Badge>
                    ) : null}

                    {/* WISHLIST BUTTON */}
                    <Button
                      size="icon"
                      onClick={() => onToggleWishlist(product)}
                      className="absolute top-3 right-3 rounded-full bg-white/80 dark:bg-gray-700/70 backdrop-blur-md hover:bg-white shadow-lg"
                    >
                      <Heart
                        className={`w-5 h-5 transition-all ${isWishlisted ? "text-red-500 fill-red-500" : "text-gray-500"
                          }`}
                      />
                    </Button>
                  </div>

                  {/* CONTENT */}
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2">
                      {product.name}
                    </h3>

                    {/* RATING */}
                    <div className="flex items-center gap-1 my-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm">{product.rating || 0}</span>
                      <span className="text-xs text-gray-500">
                        ({product.reviews?.length || 0})
                      </span>
                    </div>

                    {/* PRICE + ADD */}
                    <div className="flex justify-between items-center mt-2">
                      <div className="space-x-2">
                        <span className="text-lg font-bold text-primary">
                          ₹{product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>

                      <Button
                        size="sm"
                        className="rounded-xl bg-primary hover:opacity-90 text-white"
                        onClick={() => onAddToCart(product)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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
