'use client';
import React, { useEffect, useState } from 'react';
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
import { useAddressQuery } from '@/hooks/useAddressQuery';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/store/useUserStore';
import { useCartStore } from '@/lib/store/useCartStore';
import { Address } from '@/types/global';

const AddCardList = ({ cartItems: propsCartItems, setCartItems, cartOpen, setCartOpen, type, updateQuantity: propsUpdateQuantity, getTotalPrice, removeFromCart: propsRemoveFromCart }: any) => {
  const [addressOpen, setAddressOpen] = React.useState(false);
  const { items, address, distance, setAddress: storeSetAddress } = useCartStore();
  const router = useRouter()
  const { user } = useUserStore()
  const { addresses = [] } = useAddressQuery(user?._id);
  const defaultAddr = addresses.find((a: any) => a.isDefault) || addresses[0];

  const handleUseLocation = async () => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) return;
    try {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const current: any = {
            userId: user?._id || '',
            name: 'Current Location',
            phone: 0,
            city: 'Current',
            state: '',
            label: 'Current',
            lat: latitude,
            lng: longitude,
            street: '',
            area: '',
            landmark: '',
            zipCode: '',
            flatNumber: '',
            floor: '',
          };
          storeSetAddress(current);
        },
        (err) => {
          console.warn('Geolocation error:', err);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } catch (e) {
      console.warn('Failed to set current location');
    }
  };

  const handleCheckout = async () => {
    if (!address && !defaultAddr) {
      try {
        await handleUseLocation();
      } catch { }
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
        <SheetContent className="w-full max-w-full sm:max-w-lg overflow-y-auto px-4 py-6">
          <SheetHeader>
            <SheetTitle className="text-base sm:text-lg font-bold">Your Cart</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {items.length === 0 ? (
              <p className="text-center text-gray-500 py-8 text-sm sm:text-base">Your cart is empty</p>
            ) : (
              <>
                <div className="max-h-[50vh] overflow-y-auto pr-2">
                  <CartSummary
                    cartItems={items}
                  />
                </div>

                <div className="border-t pt-4 space-y-4">
                  {/* Delivery Address */}
                  <div className="bg-gray-50 p-3 rounded-lg space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start space-x-3">
                        <div className="bg-gray-300 rounded-full p-2">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div className="text-xs sm:text-sm">
                          {(() => {
                            const displayAddress = address || defaultAddr;
                            if (!displayAddress) return "No address selected.";
                            const title = displayAddress.label || 'Selected Address';
                            const nameLine = [displayAddress.name, displayAddress.label].filter(Boolean).join(', ');
                            const distText = typeof distance === 'number'
                              ? `${distance.toFixed(2)} km`
                              : '';
                            return (
                              <>
                                <h4 className="font-semibold text-sm">Delivering to {title}</h4>
                                {nameLine && <p>{nameLine}</p>}
                                {distText && <p>{distText}</p>}
                              </>
                            );
                          })()}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {!address && !defaultAddr && (
                          <Button
                            onClick={() => handleUseLocation()}
                            variant="outline"
                            className="text-xs px-2 py-1"
                          >
                            Use Location
                          </Button>
                        )}
                        <Button
                          onClick={() => setAddressOpen(true)}
                          variant="outline"
                          className="text-xs px-2 py-1"
                        >
                          {address ? "Change" : "Add"} Address
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600 text-sm sm:text-base py-3 rounded-lg"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>
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
