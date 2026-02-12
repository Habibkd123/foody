"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, LayoutGrid, ShoppingCart, User, Heart } from "lucide-react"
import { useCartStore } from "@/lib/store/useCartStore"
import { cn } from "@/lib/utils"
import AddCardList from "@/components/AddCards"

export default function MobileBottomNav() {
    const pathname = usePathname()
    const { items } = useCartStore()
    const [cartOpen, setCartOpen] = useState(false)

    // Helper to check active route
    const isActive = (path: string) => {
        if (path === "/" && pathname !== "/") return false
        return pathname === path || pathname?.startsWith(path + "/")
    }

    const navItems = [
        {
            label: "Home",
            href: "/",
            icon: Home,
            active: pathname === "/" || pathname === "/home",
        },
        {
            label: "Menu",
            href: "/productlist",
            icon: LayoutGrid,
            active: isActive("/productlist"),
        },
        {
            key: "cart",
            label: "Cart",
            icon: ShoppingCart,
            active: false,
        },
        {
            label: "Wishlist",
            href: "/wishlist",
            icon: Heart,
            active: isActive("/wishlist"),
        },
        {
            label: "Profile",
            href: "/profile",
            icon: User,
            active: isActive("/profile"),
        },
    ]

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden pb-[env(safe-area-inset-bottom)]">
            {/* Glassmorphism Container with a subtle gradient border at top */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-white/95 backdrop-blur-xl border-t border-gray-200/60 shadow-[0_-5px_20px_rgba(0,0,0,0.08)]" />

            <div className="relative flex items-center justify-between h-16 w-full px-2">
                {navItems.map((item, index) => {
                    // Cart Button (Middle)
                    if (item.key === 'cart') {
                        return (
                            <div key="cart" className="relative -top-5 flex flex-col items-center justify-end w-1/5 pointer-events-none">
                                <div className="pointer-events-auto">
                                    <div className="bg-gradient-to-tr from-orange-500 to-red-500 rounded-full p-1.5 shadow-xl shadow-orange-500/40 ring-4 ring-white dark:ring-gray-900 transform transition-transform active:scale-95 hover:scale-105 duration-300">
                                        <button
                                            className="flex items-center justify-center w-12 h-12 rounded-full text-white"
                                            onClick={() => setCartOpen(true)}
                                            aria-label="Open Cart"
                                        >
                                            <ShoppingCart className="w-6 h-6 fill-white" />
                                            {items.length > 0 && (
                                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                                                    {items.reduce((a: any, b: any) => a + b.quantity, 0)}
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Hidden Sheet Trigger Logic */}
                                <div className="hidden">
                                    <AddCardList
                                        cartOpen={cartOpen}
                                        setCartOpen={setCartOpen}
                                    />
                                </div>
                            </div>
                        )
                    }

                    const Icon = item.icon
                    const isActiveItem = item.active

                    return (
                        <Link
                            key={item.href || index}
                            href={item.href!}
                            className={cn(
                                "flex flex-col items-center justify-center w-1/5 h-full transition-all duration-300 z-10 bg-transparent group active:scale-95",
                                isActiveItem ? "text-orange-600" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            <div className={cn(
                                "p-1 rounded-xl transition-all duration-300 mb-0.5",
                                isActiveItem && "bg-orange-50 scale-110 shadow-sm"
                            )}>
                                <Icon className={cn("w-5 h-5", isActiveItem && "fill-current")} strokeWidth={isActiveItem ? 2.5 : 2} />
                            </div>
                            <span className={cn(
                                "text-[10px] font-medium transition-colors",
                                isActiveItem ? "text-orange-600 font-bold" : "text-gray-500 font-medium"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
