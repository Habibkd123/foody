'use client';
import React, { use, useEffect, useState } from 'react';
import Image from 'next/image';
import { Search, ShoppingCart, Heart, Star, Filter, Grid, List, Trash2, Plus, Minus, X, Menu, MapPin } from 'lucide-react';
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import AddressModal from './AddressModal';
import AddAddressModal from './AddAddressModal';
import CartSummary from './CartSummary';
import Link from 'next/link';
import { useAddress } from '@/context/AddressContext';
import { useCartOrder, useOrder } from '@/context/OrderContext';
import { useRouter } from 'next/navigation';
import { useAuthStorage } from '@/hooks/useAuth';
const AddCardList = ({ cartItems, setCartItems, cartOpen, setCartOpen, type, updateQuantity, getTotalPrice, removeFromCart }: any) => {
  const [addressOpen, setAddressOpen] = React.useState(false);
  const { loadCart } = useCartOrder();
  const { state, dispatch } = useOrder();
  const { address, items, distance } = state
  const router = useRouter()
  const { user } = useAuthStorage()  // const {  distance } = useAddress();
  const { defaultAddress: defaultAddr, setCurrentLocation } = useAddress();
   console.log('state', user);
  useEffect(() => {
    const fun = async () => {
      try {
        let data = await loadCart(user?._id)
        console.log('state', data);
      }
      catch (error) {
        console.log(error)
      }

    }
    fun()
  }, [user])
  const handleCheckout = async () => {
    if (!address && !defaultAddr) {
      try {
        await setCurrentLocation();
      } catch {}
    }
    router.push('/checkout')
  }
  return (
    <>
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        {type !== "wishlist" &&
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-gray-700 dark:text-gray-300 z-[90px]">
              <ShoppingCart className="h-5 w-5" />
              {items.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-orange-500">
                  {items.reduce((sum: any, item: any) => sum + item.quantity, 0)}
                </Badge>
              )}
            </Button>
          </SheetTrigger>}
        <SheetContent className="w-full sm:max-w-lg overflow-auto">
          <SheetHeader>
            <SheetTitle>Your Cart</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4 overflow-auto ">
            {items.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Your cart is empty</p>
            ) : (
              <>
                <CartSummary updateQuantity={updateQuantity} cartItems={items} removeFromCart={removeFromCart} />
                <div className="border-t pt-4">




                  {/* Delivery Address */}
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gray-300 rounded-full p-1">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div>
                          {(() => {
                            const displayAddress = address || defaultAddr;
                            if (!displayAddress) return null;
                            const title = displayAddress.label || 'Selected Address';
                            const nameLine = [displayAddress.name, displayAddress.label]
                              .filter(Boolean)
                              .join(', ');
                            const distText = typeof distance === 'number' && isFinite(distance)
                              ? `${distance.toFixed(2)} km`
                              : '';
                            return (
                              <>
                                <h4 className="font-semibold text-sm">Delivering to {title}</h4>
                                {nameLine && (
                                  <p className="text-xs text-gray-600">{nameLine}</p>
                                )}
                                {distText && (
                                  <p className="text-xs text-gray-600">{distText}</p>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {!address && !defaultAddr && (
                          <Button onClick={() => setCurrentLocation()} variant="link" className="text-blue-600 text-xs p-0">
                            Use current location
                          </Button>
                        )}
                        <Button onClick={() => setAddressOpen(true)} variant="link" className="text-green-600 text-xs p-0">
                          {address ? 'Change' : 'Add'} address
                        </Button>
                      </div>
                    </div>
                  </div>
                  {/* <GoogleMaps/> */}
                  {/* <div className='p-1'>

                    <Input placeholder="Enter promo code" className="mb-4 " />
                  </div> */}
                  {/* <Link href="/checkout"> */}
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 " onClick={handleCheckout}>Proceed to Checkout</Button>
                  {/* </Link> */}
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
      {addressOpen && (
        <AddressModal addressOpen={addressOpen} setAddressOpen={setAddressOpen} />
      )}

    </>

  );
};

export default AddCardList;
