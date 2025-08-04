'use client';
import React, { use, useState } from 'react';
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
import { useOrder } from '@/context/OrderContext';
import { useRouter } from 'next/navigation';
const AddCardList = ({ cartItems, setCartItems, cartOpen, setCartOpen,type, updateQuantity, getTotalPrice, removeFromCart }: any) => {
  const [addressOpen, setAddressOpen] = React.useState(false);
  const { state } = useOrder();
  const { address, items, distance } = state
  const router= useRouter()
  // const {  distance } = useAddress();
  console.log('state', state);
  const handleCheckout =() => {
    if(!address){
      alert("Please enter Address")
      return
    }else{
      router.push('/checkout')
    }

    }
  return (
    <>
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        {type!=="wishlist"&&
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gray-300 rounded-full p-1">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div>
                          {address && (<>  <h4 className="font-semibold text-sm">Delivering to Home</h4>
                            <p className="text-xs text-gray-600">{`${address?.name&&address?.name}, ${address?.area}`}</p>
                            <p className="text-xs text-gray-600">{`${distance?.toFixed(2)}`} km</p>
                          </>)}
                        </div>
                      </div>
                      <Button onClick={() => setAddressOpen(true)} variant="link" className="text-green-600 text-xs p-0">
                        {address ? 'Change' : 'Add'} address
                      </Button>
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
