"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, LayoutGrid, ShoppingCart, User } from "lucide-react"
import { useCartStore } from "@/lib/store/useCartStore"
import { cn } from "@/lib/utils"
// import { AddCardList } from "@/components/AddCards"; --> Circular dependency potential, careful.
// Easier to just use a trigger that opens the cart, or navigate to cart. 
// User has 'AddCardList' component which is a sheet trigger + content.
// We can replicate the trigger.
import AddCardList from "@/components/AddCards"

export default function MobileBottomNav() {
    const pathname = usePathname()
    const { items } = useCartStore()
    const [cartOpen, setCartOpen] = useState(false)
    const cartCount = items.reduce((sum: number, item: any) => sum + item.quantity, 0)

    // Only show on mobile
    // Hides on md and up
    if (typeof window !== "undefined" && window.innerWidth >= 768) return null

    // Route matching helper
    const isActive = (path: string) => pathname === path || pathname?.startsWith(path + "/")

    const navItems = [
        {
            label: "Home",
            href: "/home",
            icon: Home,
            active: isActive("/home") || pathname === "/",
        },
        {
            label: "Products",
            href: "/productlist",
            icon: LayoutGrid,
            active: isActive("/productlist") || isActive("/products"),
        },
        // Search? Maybe just rely on Products page search for now as user said "jitne need hai"
        // {
        //   label: "Search",
        //   href: "/search", 
        //   icon: Search,
        // },
        {
            // Custom item for Cart
            key: "cart",
            label: "Cart",
            icon: ShoppingCart,
            active: false, // Cart is a modal usually
        },
        {
            label: "Profile",
            href: "/profile",
            icon: User,
            active: isActive("/profile"),
        },
    ]

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[50] bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] pb-safe-area-inset-bottom">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => {
                    if (item.key === 'cart') {
                        return (
                            <div key="cart" className="flex flex-col items-center justify-center w-full h-full relative">
                                {/* Invisible Trigger Area - AddCardList handles the button usually. 
                     We need to wrap AddCardList cleanly or trigger it.
                     The existing AddCardList comp returns a button trigger.
                     Let's check AddCardList props.
                 */}
                                <div className="flex flex-col items-center">
                                    <AddCardList
                                        cartOpen={cartOpen}
                                        setCartOpen={setCartOpen}
                                    // passing minimal props, AddCardList handles logic
                                    />
                                    <span className="text-[10px] font-medium text-gray-500 mt-1">Cart</span>
                                </div>
                                {/* We might need to hide the badge in AddCardList or here if double badge */}
                            </div>
                        )
                    }

                    const Icon = item.icon
                    return (
                        <Link
                            key={item.href}
                            href={item.href!}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1 active:scale-95 transition-transform",
                                item.active ? "text-primary" : "text-gray-500 hover:text-gray-900"
                            )}
                        >
                            <Icon className={cn("w-6 h-6", item.active && "fill-current")} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
