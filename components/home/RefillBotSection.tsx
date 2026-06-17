"use client"

import React, { useState, useEffect } from "react"
import { useOrdersQuery } from "@/hooks/useOrdersQuery"
import { useUserStore } from "@/lib/store/useUserStore"
import { useCartStore } from "@/lib/store/useCartStore"
import { useProductsQuery } from "@/hooks/useProductsQuery"
import { RefreshCw, Sparkles, Check, ShoppingCart, Info, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PredictedItem {
  id: string
  name: string
  price: number
  image: string
  lastOrderedDaysAgo: number
  predictedUsagePct: number // e.g. 90% empty
  status: "critical" | "warning" | "stable"
}

export default function RefillBotSection() {
  const { user } = useUserStore()
  const { data: orders = [] } = useOrdersQuery(user?._id)
  const { data: allProducts = [] } = useProductsQuery()
  const { addItem } = useCartStore()

  const [simulated, setSimulated] = useState(false)
  const [predictions, setPredictions] = useState<PredictedItem[]>([])
  const [justAddedId, setJustAddedId] = useState<string | null>(null)

  // Generate refill predictions based on real order history or simulated details
  useEffect(() => {
    if (orders.length > 0 && allProducts.length > 0 && !simulated) {
      // Analyze actual orders
      const itemCounts: Record<string, { count: number; lastDate: Date }> = {}
      
      orders.forEach((order: any) => {
        const orderDate = new Date(order.createdAt)
        if (order.items) {
          order.items.forEach((item: any) => {
            const prodId = item.product?._id || item.product
            if (prodId) {
              if (!itemCounts[prodId]) {
                itemCounts[prodId] = { count: 0, lastDate: orderDate }
              }
              itemCounts[prodId].count += 1
              if (orderDate > itemCounts[prodId].lastDate) {
                itemCounts[prodId].lastDate = orderDate
              }
            }
          })
        }
      })

      // Map analyzed items to predictions
      const now = new Date()
      const analyzed: PredictedItem[] = []

      Object.entries(itemCounts).forEach(([prodId, details]) => {
        const product = allProducts.find((p: any) => p._id === prodId)
        if (product) {
          const daysAgo = Math.floor((now.getTime() - details.lastDate.getTime()) / (1000 * 3600 * 24))
          // Essentials like Milk/Veggies are consumed quickly (e.g. within 5 days)
          const isEssential = /milk|bread|egg|butter|paneer|potato|veg/i.test(product.name)
          const cycleDays = isEssential ? 5 : 15
          
          if (daysAgo >= cycleDays - 1) {
            const usagePct = Math.min(100, Math.round((daysAgo / cycleDays) * 100))
            analyzed.push({
              id: product._id || "",
              name: product.name,
              price: product.price,
              image: product.images?.[0] || "/placeholder-product.png",
              lastOrderedDaysAgo: daysAgo,
              predictedUsagePct: usagePct,
              status: usagePct >= 95 ? "critical" : usagePct >= 80 ? "warning" : "stable"
            })
          }
        }
      })

      setPredictions(analyzed.slice(0, 3))
    } else if (simulated || (orders.length === 0 && allProducts.length > 0)) {
      // Show simulated predictions so the user can test the feature
      const simulatedData: PredictedItem[] = [
        {
          id: "sim-milk",
          name: "Amul Taaza Fresh Milk (1L)",
          price: 64,
          image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&auto=format&fit=crop&q=80",
          lastOrderedDaysAgo: 5,
          predictedUsagePct: 100,
          status: "critical"
        },
        {
          id: "sim-bread",
          name: "Sourdough Whole Wheat Bread",
          price: 45,
          image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=300&auto=format&fit=crop&q=80",
          lastOrderedDaysAgo: 6,
          predictedUsagePct: 92,
          status: "warning"
        },
        {
          id: "sim-eggs",
          name: "Organic Farm Eggs (Pack of 6)",
          price: 85,
          image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=300&auto=format&fit=crop&q=80",
          lastOrderedDaysAgo: 8,
          predictedUsagePct: 88,
          status: "warning"
        }
      ]
      setPredictions(simulatedData)
    }
  }, [orders, allProducts, simulated])

  const handleRefill = (item: PredictedItem) => {
    // Check if the item is a real catalog item or simulated
    const realProd = allProducts.find((p: any) => p._id === item.id)
    const cartItem: any = {
      id: `${item.id}:base`,
      productId: item.id,
      configKey: 'base',
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    }

    addItem(cartItem)
    setJustAddedId(item.id)
    setTimeout(() => setJustAddedId(null), 2000)
  }

  // Hide component if no predictions and user hasn't clicked simulate
  if (predictions.length === 0 && orders.length === 0 && !simulated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="flex items-center gap-4">
            <div className="bg-orange-100 dark:bg-orange-950 p-3 rounded-2xl text-orange-600">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                Predictive AI Refill Bot 🤖
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                No purchase history yet. Let AI predict when your essentials are running low!
              </p>
            </div>
          </div>
          <Button 
            onClick={() => setSimulated(true)}
            className="bg-primary hover:bg-primary/95 text-white font-bold px-6 py-4 rounded-xl flex items-center gap-2 whitespace-nowrap self-start md:self-auto"
            type="button"
          >
            <RefreshCw className="w-4 h-4" />
            Simulate Refill Bot
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            🤖 AI Refill Assistant
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Smart reminders computed from your purchase frequencies.
          </p>
        </div>
        {simulated && (
          <Button 
            onClick={() => setSimulated(false)}
            variant="ghost"
            className="text-xs text-primary font-bold hover:underline"
            type="button"
          >
            Reset to Real Data
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {predictions.map((item) => {
          const isCritical = item.status === "critical"
          return (
            <div 
              key={item.id}
              className={`relative overflow-hidden rounded-2xl border bg-white dark:bg-gray-850 p-4 flex flex-col justify-between transition-all duration-300 shadow-sm ${
                isCritical 
                  ? "border-red-200/60 dark:border-red-950/40 bg-red-50/10" 
                  : "border-amber-200/60 dark:border-amber-950/40 bg-amber-50/10"
              }`}
            >
              {/* Top Banner Alert */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md flex items-center gap-1 ${
                  isCritical 
                    ? "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400" 
                    : "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                }`}>
                  <AlertTriangle className="w-3 h-3" />
                  {isCritical ? "Refill Critical" : "Running Low"}
                </span>
                <span className="text-[10px] text-gray-400 font-bold">
                  Ordered {item.lastOrderedDaysAgo} days ago
                </span>
              </div>

              {/* Product Info */}
              <div className="flex gap-3 mb-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate" title={item.name}>
                    {item.name}
                  </h4>
                  <p className="text-xs text-primary font-black mt-0.5">₹{item.price}</p>
                  
                  {/* Gauge bar */}
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-[9px] text-gray-400 font-bold">
                      <span>Usage Level</span>
                      <span>{item.predictedUsagePct}% depleted</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isCritical ? "bg-red-500" : "bg-amber-500"}`}
                        style={{ width: `${item.predictedUsagePct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <Button
                onClick={() => handleRefill(item)}
                disabled={justAddedId === item.id}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  justAddedId === item.id 
                    ? "bg-green-500 text-white" 
                    : isCritical 
                      ? "bg-red-600 hover:bg-red-700 text-white" 
                      : "bg-amber-500 hover:bg-amber-600 text-white"
                }`}
                type="button"
              >
                {justAddedId === item.id ? (
                  <>
                    <Check className="w-4 h-4" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    Quick Refill
                  </>
                )}
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
