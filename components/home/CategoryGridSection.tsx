"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Plus, Star, Heart } from "lucide-react"
import { motion } from "framer-motion"
import { useAuthStorage } from "@/hooks/useAuth"
import { useCartOrder } from "@/context/OrderContext"
import { useCustomToast } from "@/hooks/useCustomToast"

interface ProductItem {
    _id: string
    name: string
    images: string[]
    price: number
    originalPrice?: number
    rating?: number
}

interface CategorySectionType {
    name: string
    products: ProductItem[]
}

interface CategorySectionProps {
    section: CategorySectionType
}

export const CategorySection = ({ section }: CategorySectionProps) => {
    const products = Array.isArray(section?.products) ? section.products : []
    const [expanded, setExpanded] = useState(false)
    const { user } = useAuthStorage()
    const { addToCart } = useCartOrder()
    const toast = useCustomToast()

    if (products.length === 0) return null

    const visible = expanded ? products : products.slice(0, 6)

    const handleQuickAdd = async (e: React.MouseEvent, item: ProductItem) => {
        e.preventDefault()
        e.stopPropagation()

        if (!user?._id) {
            toast.warning("Login Required", "Please login to add items to cart")
            return
        }

        const cartItem: any = {
            id: item._id,
            productId: item._id,
            name: item.name,
            price: item.price,
            quantity: 1,
            image: item.images[0],
            configKey: "",
        }

        try {
            const response: any = await addToCart(user._id, cartItem)
            if (response && response.success) {
                toast.cartAdded(item.name)
            } else {
                toast.error("Cart Error", (response && response.message) || "Failed to add item")
            }
        } catch (error) {
            toast.error("Cart Error", "Failed to add item to cart")
        }
    }

    return (
        <section className="mb-12 md:mb-16" aria-labelledby={`category-${section?.name || 'section'}`}>
            <div className="flex justify-between items-end mb-6 md:mb-8">
                <div>
                    <h2 id={`category-${section?.name || 'section'}`} className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                        {section?.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="h-1 w-12 bg-primary rounded-full"></span>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">
                            {products.length} Products
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {products.length > 6 && (
                        <>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={() => setExpanded((v) => !v)}
                                className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-secondary text-primary px-5 py-2.5 text-sm font-bold border border-primary/10 hover:bg-primary hover:text-white transition-all"
                            >
                                {expanded ? 'Show Less' : 'Explore All'}
                            </motion.button>
                            <Link
                                href={{ pathname: '/productlist', query: { category: section?.name } }}
                                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 dark:bg-gray-800 text-white px-5 py-2.5 text-sm font-bold hover:bg-black transition-all shadow-lg"
                            >
                                Full List
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {visible.map((item, idx) => (
                    <motion.div
                        key={item._id || idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                        className="group relative bg-white dark:bg-card rounded-2xl p-3 md:p-4 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-white/5"
                    >
                        {/* Wishlist Placeholder */}
                        <button className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                            <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
                        </button>

                        <Link href={`/products/${item._id}`} className="block">
                            <div className="relative overflow-hidden rounded-xl mb-4 bg-gray-50 dark:bg-gray-800/50">
                                <div className="relative w-full aspect-square">
                                    <Image
                                        src={(item?.images && item.images[0]) || '/placeholder-product.png'}
                                        alt={item?.name || 'Product image'}
                                        fill
                                        className="object-contain p-2 group-hover:scale-110 transition-transform duration-700 ease-out"
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
                                    {item.name}
                                </h3>

                                <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400">4.5</span>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex flex-col">
                                        <span className="text-lg font-black text-gray-900 dark:text-white">
                                            ₹{item.price || 0}
                                        </span>
                                        {item.originalPrice && (
                                            <span className="text-xs text-gray-400 line-through">₹{item.originalPrice}</span>
                                        )}
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={(e) => handleQuickAdd(e, item)}
                                        className="p-2.5 rounded-xl bg-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {products.length > 6 && !expanded && (
                <div className="mt-8 flex justify-center sm:hidden">
                    <button
                        type="button"
                        onClick={() => setExpanded(true)}
                        className="w-full py-4 rounded-xl bg-white border border-gray-200 text-sm font-black text-gray-900 shadow-sm"
                    >
                        SEE ALL {products.length} PRODUCTS
                    </button>
                </div>
            )}
        </section>
    )
}

export const CategorySectionSkeleton = () => (
    <div className="mb-12 animate-pulse">
        <div className="flex justify-between items-end mb-8">
            <div className="space-y-3">
                <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                <div className="h-4 w-32 bg-gray-100 dark:bg-gray-800/50 rounded-full" />
            </div>
            <div className="h-10 w-24 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="bg-white dark:bg-card rounded-2xl p-4 border border-gray-100 dark:border-white/5">
                    <div className="w-full aspect-square bg-gray-200 dark:bg-gray-800 rounded-xl mb-4" />
                    <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4 mb-3" />
                    <div className="flex justify-between items-center">
                        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                    </div>
                </div>
            ))}
        </div>
    </div>
)
