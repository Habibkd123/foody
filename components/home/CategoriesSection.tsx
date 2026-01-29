"use client"

import React from "react"
import { Product } from "@/types/global"
import Image from "next/image"

type Category = {
  _id?: string
  id?: string
  name: string
  icon?: string
  image?: string
  isAllCategory?: boolean
}

interface Props {
  categories: Category[]
  products: Product[]
  selectedCategory: string
  setSelectedCategory: (id: string) => void
  loading?: boolean
}

const getCategoryIcon = (name: string) => {
  const s = name.toLowerCase()
  if (s.includes("grocery")) return "🛍️"
  if (s.includes("masala")) return "🌶️"
  if (s.includes("fruit")) return "🍎"
  if (s.includes("vegetable")) return "🥬"
  if (s.includes("dairy")) return "🥛"
  if (s.includes("meat")) return "🍗"
  if (s.includes("snack")) return "🍿"
  if (s.includes("beverage")) return "🥤"
  if (s.includes("rice")) return "🌾"
  return "🏪"
}

const SkeletonCard = () => (
  <div className="min-w-[110px] max-w-[130px] sm:min-w-0 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl p-4 h-[130px]" />
)

export default function CategoriesSection({
  categories,
  products,
  selectedCategory,
  loading = false,
  setSelectedCategory,
}: Props) {
  const isSelected = (id: string) => selectedCategory === id

  return (
    <section id="home" className="relative">
      <div className="container mx-auto px-4 py-10">
        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Shop by Category
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Browse our fresh products by category
          </p>
        </div>

        {/* ================= MOBILE SCROLL VERSION ================= */}
        <div className="block md:hidden relative">
          <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory px-2 py-3">
            {loading
              ? [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
              : categories.map((cat) => {
                const catId = (cat._id || cat.id) as string

                return (
                  <div
                    key={catId}
                    onClick={() => setSelectedCategory(catId)}
                    className={`
                        snap-start min-w-[110px] max-w-[130px] cursor-pointer 
                        p-4 rounded-xl text-center transition-all duration-300
                        ${isSelected(catId)
                        ? "bg-primary text-white scale-[1.02]"
                        : "bg-card dark:bg-gray-900 shadow-sm"
                      }
                      `}
                  >
                    <div className="relative w-14 h-14 mx-auto rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                      {cat.image ? (
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-3xl">{cat.icon || getCategoryIcon(cat.name)}</span>
                      )}
                    </div>

                    <p className="font-semibold mt-2 text-sm">{cat.name}</p>
                  </div>
                )
              })}
          </div>
        </div>

        {/* ================= DESKTOP GRID VERSION ================= */}
        <div className="hidden md:grid grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-5 mt-6">
          {loading
            ? [...Array(12)].map((_, i) => <SkeletonCard key={i} />)
            : categories.map((cat) => {
              const catId = (cat._id || cat.id) as string

              return (
                <div
                  key={catId}
                  onClick={() => setSelectedCategory(catId)}
                  className={`
                      cursor-pointer rounded-xl p-5 text-center transition-all duration-300
                      ${isSelected(catId)
                      ? "bg-primary text-white scale-[1.03]"
                      : "bg-card dark:bg-gray-900 shadow hover:shadow-md hover:scale-[1.04]"
                    }
                    `}
                >
                  <div className="relative w-16 h-16 mx-auto rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                    {cat.image ? (
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-4xl">{cat.icon || getCategoryIcon(cat.name)}</span>
                    )}
                  </div>

                  <h3 className="font-semibold mt-3">{cat.name}</h3>
                </div>
              )
            })}
        </div>
      </div>
    </section>
  )
}
