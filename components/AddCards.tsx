'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Search, ShoppingCart, Heart, Star, Filter, Grid, List, Trash2, Plus, Minus, X, Menu, MapPin } from 'lucide-react';
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import AddressModal from './AddressModal';
import AddAddressModal from './AddAddressModal';
import Link from 'next/link';
const AddCardList = ({ cartItems, setCartItems, cartOpen, setCartOpen, updateQuantity, getTotalPrice, removeFromCart }: any) => {
  const [addressOpen, setAddressOpen] = React.useState(false);
  return (
    <>
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative text-gray-700 dark:text-gray-300 z-[90px]">
            <ShoppingCart className="h-5 w-5" />
            {cartItems.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-orange-500">
                {cartItems.reduce((sum: any, item: any) => sum + item.quantity, 0)}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg overflow-auto">
          <SheetHeader>
            <SheetTitle>Your Cart</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4 overflow-auto ">
            {cartItems.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Your cart is empty</p>
            ) : (
              <>
                <div className='flex items-center space-x-3 p-3 border shadow-sm border-b  gap-6 bg-orange-100 dark:bg-gray-800 rounded-lg '>
                  <div className='bg-orange-500 space-y-2'>
                    <img
                      style={{ height: 45, width: 45 }}
                      src="https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=180/assets/eta-icons/15-mins-filled.png"
                      className='h-20 w-20'
                    />
                  </div>
                  <div className='flex-1 text-black '>
                    <h3 className='font-bold '>Delivery in 8 minutes</h3>
                    <h6 className='font-serif'>Shipment of 1 item</h6>
                  </div>
                  <div className="flex items-center space-x-2"></div>
                </div>

                {cartItems.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 p-3 bg-orange-100 dark:bg-gray-800 rounded-lg mt-2 "
                  >
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-orange-500 font-semibold">₹{item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 bg-transparent"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 bg-transparent"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-500"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="space-y-2 mt-2">
                  <div className="flex justify-between">
                    <span>Items total</span>
                    <span>₹{getTotalPrice()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery charge</span>
                    <span>₹25</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Handling charge</span>
                    <span>₹2</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Grand total: ₹{getTotalPrice() + 27}</span>
                  </div>

                  {/* Donation Section */}
                  <div className="bg-yellow-50 p-3 rounded-lg mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-yellow-400 rounded p-1">
                          <img src="https://cdn.grofers.com/assets/ui/icons/feeding_india_icon_v6.png" style={{ height: 45, width: 45, borderRadius: 200 }} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">Feeding India donation</h4>
                          <p className="text-xs text-gray-600">Working towards a malnutrition free India. Feeding India...read more</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold">₹1</span>
                        <input type="checkbox" className="rounded" />
                      </div>
                    </div>
                  </div>

                  {/* Tip Section */}
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Tip your delivery partner</h4>
                    <p className="text-xs text-gray-600 mb-3">Your kindness means a lot! 100% of your tip will go directly to your delivery partner.</p>
                    <div className="flex space-x-2 mb-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1 text-xs"
                      >
                        <span>😊</span>
                        <span>₹20</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1 text-xs"
                      >
                        <span>😍</span>
                        <span>₹30</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1 text-xs"
                      >
                        <span>🤩</span>
                        <span>₹50</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1 text-xs"
                      >
                        <span>🤩</span>
                        <span>₹80</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1 text-xs"
                      >
                        <span>✨</span>
                        <span>Custom</span>
                      </Button>
                    </div>
                  </div>

                  {/* Cancellation Policy */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2">Cancellation Policy</h4>
                    <p className="text-xs text-gray-600">
                      Orders cannot be cancelled once packed for delivery. In case of unexpected delays, a refund will be provided, if applicable.
                    </p>
                  </div>

                  {/* Delivery Address */}
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gray-300 rounded-full p-1">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">Delivering to Home</h4>
                          <p className="text-xs text-gray-600">Habib kd, 123 Main St, City, Country, Zip...</p>
                        </div>
                      </div>
                      <Button onClick={() => setAddressOpen(true)} variant="link" className="text-green-600 text-xs p-0">
                        Change
                      </Button>
                    </div>
                  </div>
                  <div className='p-1'>

                    <Input placeholder="Enter promo code" className="mb-4 " />
                  </div>
                  <Link href="/checkout">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 " >Proceed to Checkout</Button>
                  </Link>
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
