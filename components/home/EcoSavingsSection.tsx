"use client"

import React, { useState, useEffect } from "react"
import { useProductsQuery } from "@/hooks/useProductsQuery"
import { useCartStore } from "@/lib/store/useCartStore"
import { Leaf, Clock, ShoppingCart, Check, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EcoProduct {
  _id: string
  name: string
  price: number
  originalPrice: number
  image: string
  expiryHours: number
  co2Saved: string
}

export default function EcoSavingsSection() {
  const { data: allProducts = [] } = useProductsQuery()
  const { addItem } = useCartStore()
  
  const [ecoProducts, setEcoProducts] = useState<EcoProduct[]>([])
  const [justAddedId, setJustAddedId] = useState<string | null>(null)
  const [timers, setTimers] = useState<Record<string, string>>({})

  // Resolve eco-friendly deals from real products
  useEffect(() => {
    if (allProducts.length > 0) {
      const perishables = allProducts.filter((p: any) => 
        /milk|bread|curd|paneer|yogurt|butter|banana|apple|potato|tomato/i.test(p.name)
      )
      
      const targets = perishables.length >= 3 ? perishables : allProducts.slice(0, 3)
      const formatted = targets.slice(0, 3).map((p: any, idx: number) => {
        const originalPrice = p.originalPrice || p.price
        const ecoPrice = Math.round(originalPrice * 0.2) // 80% off
        return {
          _id: p._id,
          name: `${p.name} (Near Expiry - Eco Save)`,
          price: ecoPrice,
          originalPrice: originalPrice,
          image: p.images?.[0] || "/placeholder-product.png",
          expiryHours: 14 + idx * 6,
          co2Saved: (1.2 + idx * 0.5).toFixed(1)
        }
      })
      setEcoProducts(formatted)
    }
  }, [allProducts])

  // Countdown timers effect
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimers: Record<string, string> = {}
      ecoProducts.forEach(p => {
        // Simple mock countdown simulation
        const totalSecs = p.expiryHours * 3600
        const hrs = Math.floor(totalSecs / 3600)
        const mins = Math.floor((totalSecs % 3600) / 60)
        newTimers[p._id] = `${hrs}h ${mins}m`
      })
      setTimers(newTimers)
    }, 60000)

    // Initial setup
    const newTimers: Record<string, string> = {}
    ecoProducts.forEach(p => {
      newTimers[p._id] = `${p.expiryHours}h 00m`
    })
    setTimers(newTimers)

    return () => clearInterval(interval)
  }, [ecoProducts])

  const handleAddToCart = (product: EcoProduct) => {
    const cartItem: any = {
      id: `${product._id}:eco`,
      productId: product._id,
      configKey: 'eco',
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    }

    addItem(cartItem)
    setJustAddedId(product._id)
    setTimeout(() => setJustAddedId(null), 2000)
  }

  if (ecoProducts.length === 0) return null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            🍃 Eco-Savings Zone
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Save up to 80% on perfectly fresh food near its Best-Before date. Prevent food waste!
          </p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-emerald-100 dark:border-emerald-900">
          <Leaf className="w-4 h-4 text-emerald-600" />
          <span>Zero Food Waste Mission</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ecoProducts.map((p) => (
          <div 
            key={p._id}
            className="group relative overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-850 p-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between"
          >
            {/* Discount Badge */}
            <div className="absolute top-3 left-3 z-10 bg-rose-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-md flex items-center gap-1 animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-current" />
              80% OFF
            </div>

            {/* Product Image */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900 mb-4 border border-gray-50 dark:border-gray-800/50">
              <img 
                src={p.image} 
                alt={p.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              {/* Expiry Countdown Overlaid */}
              <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-white text-[10px] font-bold">
                <Clock className="w-3.5 h-3.5 text-orange-400" />
                <span>Expires in {timers[p._id] || `${p.expiryHours}h`}</span>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-base line-clamp-1" title={p.name}>
                  {p.name}
                </h4>
                {/* CO2 Savings Indicator */}
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 px-2 py-1 rounded-lg mt-1.5">
                  <Leaf className="w-3 h-3 text-emerald-600" />
                  <span>Saves {p.co2Saved}kg CO₂ footprint</span>
                </div>
              </div>

              {/* Pricing & Add to Cart */}
              <div className="flex items-center justify-between gap-4 pt-2 border-t border-dashed">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Eco Price</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-gray-900 dark:text-white">₹{p.price}</span>
                    <span className="text-xs text-gray-400 line-through">₹{p.originalPrice}</span>
                  </div>
                </div>

                <Button
                  onClick={() => handleAddToCart(p)}
                  disabled={justAddedId === p._id}
                  className={`px-4 py-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition-all duration-300 ${
                    justAddedId === p._id
                      ? "bg-green-500 text-white"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/10"
                  }`}
                  type="button"
                >
                  {justAddedId === p._id ? (
                    <>
                      <Check className="w-4 h-4" />
                      Added
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
