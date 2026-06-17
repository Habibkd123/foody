// 'use client';
// import React, { useEffect, useState } from 'react';
// import Image from 'next/image';
// import { Search, ShoppingCart, Heart, Star, Filter, Grid, List, Trash2, Plus, Minus, X, Menu, MapPin } from 'lucide-react';
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
// import { Button } from "@/components/ui/button"
// import AddressModal from './AddressModal';
// import AddAddressModal from './AddAddressModal';
// import CartSummary from './CartSummary';
// import Link from 'next/link';
// import { useAddressQuery } from '@/hooks/useAddressQuery';
// import { useRouter } from 'next/navigation';
// import { useUserStore } from '@/lib/store/useUserStore';
// import { useCartStore } from '@/lib/store/useCartStore';
// import { Address } from '@/types/global';

// const AddCardList = ({ cartItems: propsCartItems, setCartItems, cartOpen, setCartOpen, type, updateQuantity: propsUpdateQuantity, getTotalPrice, removeFromCart: propsRemoveFromCart }: any) => {
//   const [addressOpen, setAddressOpen] = React.useState(false);
//   const { items, address, distance, setAddress: storeSetAddress } = useCartStore();
//   const router = useRouter()
//   const { user } = useUserStore()
//   const { addresses = [] } = useAddressQuery(user?._id);
//   const defaultAddr = addresses.find((a: any) => a.isDefault) || addresses[0];

//   const handleUseLocation = async () => {
//     if (typeof window === 'undefined' || !('geolocation' in navigator)) return;
//     try {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           const { latitude, longitude } = pos.coords;
//           const current: any = {
//             userId: user?._id || '',
//             name: 'Current Location',
//             phone: 0,
//             city: 'Current',
//             state: '',
//             label: 'Current',
//             lat: latitude,
//             lng: longitude,
//             street: '',
//             area: '',
//             landmark: '',
//             zipCode: '',
//             flatNumber: '',
//             floor: '',
//           };
//           storeSetAddress(current);
//         },
//         (err) => {
//           console.warn('Geolocation error:', err);
//         },
//         { enableHighAccuracy: true, timeout: 8000 }
//       );
//     } catch (e) {
//       console.warn('Failed to set current location');
//     }
//   };

//   const handleCheckout = async () => {
//     if (!address && !defaultAddr) {
//       try {
//         await handleUseLocation();
//       } catch { }
//     }
//     router.push('/checkout')
//   }
//   return (
//     <>
//       <Sheet open={cartOpen} onOpenChange={setCartOpen}>
//         {type !== "wishlist" &&
//           <SheetTrigger asChild>
//             <Button variant="ghost" size="icon" className="relative text-gray-700 dark:text-gray-300 z-[90px]">
//               <ShoppingCart className="h-5 w-5" />
//               {items.length > 0 && (
//                 <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-orange-500">
//                   {items.reduce((sum: any, item: any) => sum + item.quantity, 0)}
//                 </Badge>
//               )}
//             </Button>
//           </SheetTrigger>}
//         <SheetContent className="w-full max-w-full sm:max-w-lg overflow-y-auto px-4 py-6">
//           <SheetHeader>
//             <SheetTitle className="text-base sm:text-lg font-bold">Your Cart</SheetTitle>
//           </SheetHeader>

//           <div className="mt-6 space-y-4">
//             {items.length === 0 ? (
//               <p className="text-center text-gray-500 py-8 text-sm sm:text-base">Your cart is empty</p>
//             ) : (
//               <>
//                 <div className="max-h-[50vh] overflow-y-auto pr-2">
//                   <CartSummary
//                     cartItems={items}
//                   />
//                 </div>

//                 <div className="border-t pt-4 space-y-4">
//                   {/* Delivery Address */}
//                   <div className="bg-gray-50 p-3 rounded-lg space-y-3">
//                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//                       <div className="flex items-start space-x-3">
//                         <div className="bg-gray-300 rounded-full p-2">
//                           <MapPin className="h-4 w-4" />
//                         </div>
//                         <div className="text-xs sm:text-sm">
//                           {(() => {
//                             const displayAddress = address || defaultAddr;
//                             if (!displayAddress) return "No address selected.";
//                             const title = displayAddress.label || 'Selected Address';
//                             const nameLine = [displayAddress.name, displayAddress.label].filter(Boolean).join(', ');
//                             const distText = typeof distance === 'number'
//                               ? `${distance.toFixed(2)} km`
//                               : '';
//                             return (
//                               <>
//                                 <h4 className="font-semibold text-sm">Delivering to {title}</h4>
//                                 {nameLine && <p>{nameLine}</p>}
//                                 {distText && <p>{distText}</p>}
//                               </>
//                             );
//                           })()}
//                         </div>
//                       </div>

//                       <div className="flex flex-wrap items-center gap-2">
//                         {!address && !defaultAddr && (
//                           <Button
//                             onClick={() => handleUseLocation()}
//                             variant="outline"
//                             className="text-xs px-2 py-1"
//                           >
//                             Use Location
//                           </Button>
//                         )}
//                         <Button
//                           onClick={() => setAddressOpen(true)}
//                           variant="outline"
//                           className="text-xs px-2 py-1"
//                         >
//                           {address ? "Change" : "Add"} Address
//                         </Button>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Checkout Button */}
//                   <Button
//                     className="w-full bg-orange-500 hover:bg-orange-600 text-sm sm:text-base py-3 rounded-lg"
//                     onClick={handleCheckout}
//                   >
//                     Proceed to Checkout
//                   </Button>
//                 </div>
//               </>
//             )}
//           </div>
//         </SheetContent>

//       </Sheet>
//       {addressOpen && (
//         <AddressModal addressOpen={addressOpen} setAddressOpen={setAddressOpen} />
//       )}

//     </>

//   );
// };

// export default AddCardList;


"use client"

import React from "react"
import { ShoppingCart, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import AddressModal from "./AddressModal"
import CartSummary from "./CartSummary"
import { useAddressQuery } from "@/hooks/useAddressQuery"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/lib/store/useUserStore"
import { useCartStore } from "@/lib/store/useCartStore"
import { useProductsQuery } from "@/hooks/useProductsQuery"

const TrendingProductsCartList = ({ onAddToCart }: { onAddToCart: (product: any) => void }) => {
  const { data: productsData = [] } = useProductsQuery()
  
  const trending = React.useMemo(() => {
    return productsData
      .filter(product => product.rating && product.rating >= 4.0)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 4)
  }, [productsData])

  if (trending.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-3 mt-2">
      {trending.map((product) => (
        <div key={product._id} className="border border-gray-100 dark:border-gray-800 rounded-2xl p-2.5 flex flex-col justify-between bg-white dark:bg-gray-850 hover:shadow-md transition duration-300">
          <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900 mb-2">
            <img
              src={product.images?.[0] || "/placeholder-product.png"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h5 className="text-xs font-semibold text-gray-950 dark:text-gray-50 truncate" title={product.name}>
            {product.name}
          </h5>
          <div className="flex items-center justify-between mt-2 gap-2">
            <span className="text-xs font-black text-primary">₹{product.price}</span>
            <Button
              size="sm"
              className="h-7 px-3 rounded-lg bg-primary text-[10px] text-white hover:bg-primary/90 font-bold"
              onClick={() => onAddToCart(product)}
            >
              Add
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

const AddCardList = ({ cartOpen, setCartOpen, type }: any) => {
  const [addressOpen, setAddressOpen] = React.useState(false)
  const { items, address, distance, setAddress: storeSetAddress, addItem: storeAddItem } = useCartStore()
  const router = useRouter()
  const { user } = useUserStore()
  const { addresses = [] } = useAddressQuery(user?._id)

  const defaultAddr = addresses.find((a: any) => a.isDefault) || addresses[0]

  const handleCheckout = () => {
    router.push("/checkout")
  }

  return (
    <>
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        {type !== "wishlist" && (
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {items.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-orange-500">
                  {items.reduce((s: number, i: any) => s + i.quantity, 0)}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
        )}

        {/* MOBILE FIRST SHEET */}
        <SheetContent
          side="right"
          className="
            w-full sm:max-w-lg
            p-0
            flex flex-col
            h-screen
          "
        >
          {/* HEADER */}
          <SheetHeader className="px-4 py-4 border-b">
            <SheetTitle className="text-base font-bold">
              Your Cart ({items.length})
            </SheetTitle>
          </SheetHeader>

          {/* CART ITEMS */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {items.length === 0 ? (
              <div className="flex flex-col h-full justify-between">
                <div className="text-center py-10 flex-1 flex flex-col items-center justify-center">
                  <ShoppingCart className="w-12 h-12 text-gray-350 mb-4 animate-bounce" />
                  <p className="text-gray-500 text-sm font-semibold mb-4">
                    Your cart is empty
                  </p>
                  <Button 
                    onClick={() => setCartOpen(false)} 
                    className="bg-primary hover:bg-primary/95 text-white font-bold px-6 py-2 rounded-xl text-xs"
                  >
                    Browse Products
                  </Button>
                </div>
                
                {/* Mini Trending Products list inside the cart sheet */}
                <div className="border-t pt-4 mt-6">
                  <h4 className="font-bold text-xs text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                    🔥 Trending Today
                  </h4>
                  <TrendingProductsCartList onAddToCart={(prod) => {
                    const cartItem: any = {
                      id: `${prod._id}:base`,
                      productId: prod._id,
                      configKey: 'base',
                      name: prod.name,
                      price: prod.price,
                      quantity: 1,
                      image: prod.images?.[0],
                    };
                    storeAddItem(cartItem);
                  }} />
                </div>
              </div>
            ) : (
              <CartSummary cartItems={items} />
            )}
          </div>

          {/* ADDRESS */}
          {items.length > 0 && (
            <div className="px-4 py-3 border-t bg-gray-50">
              <div className="flex items-start gap-3">
                <div className="bg-gray-200 p-2 rounded-full">
                  <MapPin className="h-4 w-4" />
                </div>

                <div className="flex-1 text-xs">
                  <p className="font-semibold text-sm">
                    Delivering to
                  </p>
                  <p className="text-gray-600 line-clamp-2">
                    {(address || defaultAddr)?.label || "Add address"}
                  </p>
                  {typeof distance === "number" && (
                    <p className="text-gray-500">
                      {distance.toFixed(1)} km away
                    </p>
                  )}
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() => setAddressOpen(true)}
                >
                  Change
                </Button>
              </div>
            </div>
          )}

          {/* STICKY CHECKOUT */}
          {items.length > 0 && (
            <div className="sticky bottom-0 px-4 py-3 bg-white border-t">
              <Button
                onClick={handleCheckout}
                className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-base font-semibold rounded-xl"
              >
                Proceed to Checkout
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {addressOpen && (
        <AddressModal
          addressOpen={addressOpen}
          setAddressOpen={setAddressOpen}
        />
      )}
    </>
  )
}

export default AddCardList
