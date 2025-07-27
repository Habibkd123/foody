// // import React from 'react';
// // import { Heart, ShoppingCart, Star } from 'lucide-react';
// // import { useWishListContext, WishListContext } from '@/context/WishListsContext';
// // import Link from 'next/link';

// // /* ------------------ Reusable Grid ------------------ */
// // interface Product {
// //     id: number;
// //     name: string;
// //     price: number;
// //     originalPrice: number;
// //     discount: number;
// //     rating: number;
// //     reviews: number;
// //     image: string;
// // }
// // interface ProductCardGridProps {
// //   products: Product[];
// //   onAddToCart?: (product: Product) => void;
// //   onToggleWishlist?: (product: Product) => void;
// // }


// // const ProductCardGrid: React.FC<ProductCardGridProps>  = ({
// //   products, 
// //   onAddToCart, 
// //   onToggleWishlist
// // }: {
// //     products?: Product[];
// //     onAddToCart?: (product: Product) => void;
// //     onToggleWishlist?: (product: Product) => void;
// // }) => {
// //     const { wishListsData } = useWishListContext();

// //     if (products?.length === 0) {
// //         return (
// //             <div className="col-span-full flex flex-col items-center justify-center py-16">
// //                 <div className="text-6xl mb-4">🔍</div>
// //                 <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
// //                 <p className="text-gray-500">Try adjusting your filters or search terms</p>
// //             </div>
// //         );
// //     }

// //     console.log("data",wishListsData)
// //     return (
// //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
// //             {products?.map((product) => (
// //                 <div
// //                     key={product.id}
// //                     className="bg-white relative border-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group"
// //                 >
// //                     {/* Image + Discount + Wishlist (Inside Link) */}
// //                     <Link href={`/products/${product.id}`} className="block relative">
// //                         <div className="aspect-square bg-gray-100 flex items-center justify-center py-2 rounded-md">
// //                             <img
// //                                 src={product.image}
// //                                 alt={product.name}
// //                                 className="w-120 h-120 object-cover"
// //                             />
// //                         </div>

// //                         {/* Discount badge */}
// //                         <div className="absolute top-0 left-0">
// //                             <div className="bg-[#6e5503] text-white text-xs font-bold px-3 py-1 rounded-br-lg custom-corner">
// //                                 {product.discount}% OFF
// //                             </div>
// //                         </div>
// //                     </Link>

// //                     <button
// //                         onClick={(e: React.MouseEvent) => {
// //                             e.stopPropagation();
// //                             onToggleWishlist?.(product);
// //                         }}
// //                         className="absolute top-2 right-2 p-2  bg-white z-50 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
// //                     >
// //                         <Heart
// //                             className={`w-5 h-5 ${wishListsData.some((item: any) => item.id === product.id)
// //                                     ? 'text-red-500 fill-current'
// //                                     : 'text-gray-400'
// //                                 } hover:text-red-500`}
// //                         />
// //                     </button>

// //                     {/* Content */}
// //                     <div className="p-4">
// //                         <Link href={`/products/${product.id}`}>
// //                             <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:underline">
// //                                 {product.name}
// //                             </h3>
// //                         </Link>

// //                         {/* Rating */}
// //                         <div className="flex items-center mb-2">
// //                             <div className="flex items-center">
// //                                 {[...Array(5)].map((_, i) => (
// //                                     <Star
// //                                         key={i}
// //                                         className={`w-4 h-4 ${i < Math.floor(product.rating)
// //                                             ? 'text-yellow-400 fill-current'
// //                                             : 'text-gray-300'
// //                                             }`}
// //                                     />
// //                                 ))}
// //                             </div>
// //                             <span className="ml-2 text-sm text-gray-600">
// //                                 ({product.reviews})
// //                             </span>
// //                         </div>

// //                         {/* Price */}
// //                         <div className="flex items-center justify-between mb-3">
// //                             <div>
// //                                 <span className="text-lg font-bold text-gray-900">
// //                                     ₹{product.price}
// //                                 </span>
// //                                 <span className="ml-2 text-sm text-gray-500 line-through">
// //                                     ₹{product.originalPrice}
// //                                 </span>
// //                             </div>
// //                         </div>

// //                         {/* Add to Cart */}
// //                         <button
// //                             onClick={() => onAddToCart?.(product)}
// //                             className="w-full bg-gradient-to-r from-orange-400 to-red-500 text-white py-2 px-4 rounded-lg font-medium hover:from-orange-500 hover:to-red-600 transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
// //                         >
// //                             <ShoppingCart className="w-4 h-4 mr-2" />
// //                             Add to Cart
// //                         </button>
// //                     </div>
// //                 </div>
// //             ))}
// //         </div>

// //     );
// // };

// // export default ProductCardGrid;



// 'use client';
// import React, { useState } from 'react';
// import Image from 'next/image';
// import { Search, ShoppingCart, Heart, Star, Filter, Grid, List, Trash2, Plus, Minus, X, Menu, MapPin } from 'lucide-react';
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
// import { Button } from "@/components/ui/button"
// import AddressModal from './AddressModal';
// import AddAddressModal from './AddAddressModal';
// import Link from 'next/link';

// const AddCardList = ({ cartItems, setCartItems, cartOpen, setCartOpen, updateQuantity, getTotalPrice, removeFromCart }: any) => {
//   const [addressOpen, setAddressOpen] = React.useState(false);
  
//   return (
//     <>
//       <Sheet open={cartOpen} onOpenChange={setCartOpen}>
//         <SheetTrigger asChild>
//           <Button variant="ghost" size="icon" className="relative text-gray-700 dark:text-gray-300 z-[90px]">
//             <ShoppingCart className="h-5 w-5" />
//             {cartItems.length > 0 && (
//               <Badge className="absolute -top-2 -right-2 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-xs bg-orange-500">
//                 {cartItems.reduce((sum: any, item: any) => sum + item.quantity, 0)}
//               </Badge>
//             )}
//           </Button>
//         </SheetTrigger>
        
//         <SheetContent className="w-full sm:max-w-lg overflow-auto p-0">
//           <div className="p-4 sm:p-6">
//             <SheetHeader className="mb-4">
//               <SheetTitle className="text-lg sm:text-xl">Your Cart</SheetTitle>
//             </SheetHeader>
            
//             <div className="space-y-4 overflow-auto max-h-[calc(100vh-200px)]">
//               {cartItems.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-16">
//                   <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
//                   <p className="text-center text-gray-500 text-lg">Your cart is empty</p>
//                   <p className="text-center text-gray-400 text-sm mt-2">Add some products to get started</p>
//                 </div>
//               ) : (
//                 <>
//                   {/* Delivery Info - Responsive */}
//                   <div className='flex items-center space-x-3 p-3 border shadow-sm border-b gap-3 sm:gap-6 bg-orange-100 dark:bg-gray-800 rounded-lg'>
//                     <div className='bg-orange-500 flex-shrink-0'>
//                       <img
//                         src="https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=180/assets/eta-icons/15-mins-filled.png"
//                         className='h-10 w-10 sm:h-12 sm:w-12'
//                         alt="delivery"
//                       />
//                     </div>
//                     <div className='flex-1 text-black'>
//                       <h3 className='font-bold text-sm sm:text-base'>Delivery in 8 minutes</h3>
//                       <h6 className='font-serif text-xs sm:text-sm'>Shipment of {cartItems.length} item{cartItems.length > 1 ? 's' : ''}</h6>
//                     </div>
//                   </div>

//                   {/* Cart Items - Responsive */}
//                   <div className="space-y-3">
//                     {cartItems.map((item: any) => (
//                       <div
//                         key={item.id}
//                         className="flex items-center space-x-3 p-3 bg-orange-100 dark:bg-gray-800 rounded-lg"
//                       >
//                         <img
//                           src={item.image || "/placeholder.svg"}
//                           alt={item.name}
//                           className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover flex-shrink-0"
//                         />
//                         <div className="flex-1 min-w-0">
//                           <h4 className="font-medium text-sm sm:text-base truncate">{item.name}</h4>
//                           <p className="text-orange-500 font-semibold text-sm sm:text-base">₹{item.price}</p>
//                         </div>
                        
//                         {/* Quantity Controls - Responsive */}
//                         <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
//                           <Button
//                             size="icon"
//                             variant="outline"
//                             className="h-7 w-7 sm:h-8 sm:w-8 bg-transparent"
//                             onClick={() => updateQuantity(item.id, item.quantity - 1)}
//                           >
//                             <Minus className="h-3 w-3" />
//                           </Button>
//                           <span className="w-6 sm:w-8 text-center text-sm font-medium">{item.quantity}</span>
//                           <Button
//                             size="icon"
//                             variant="outline"
//                             className="h-7 w-7 sm:h-8 sm:w-8 bg-transparent"
//                             onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                           >
//                             <Plus className="h-3 w-3" />
//                           </Button>
//                           <Button
//                             size="icon"
//                             variant="ghost"
//                             className="h-7 w-7 sm:h-8 sm:w-8 text-red-500 ml-1"
//                             onClick={() => removeFromCart(item.id)}
//                           >
//                             <Trash2 className="h-3 w-3" />
//                           </Button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Bill Summary - Responsive */}
//                   <div className="space-y-2 mt-4 p-3 bg-gray-50 rounded-lg">
//                     <div className="flex justify-between text-sm sm:text-base">
//                       <span>Items total</span>
//                       <span className="font-medium">₹{getTotalPrice()}</span>
//                     </div>
//                     <div className="flex justify-between text-sm sm:text-base">
//                       <span>Delivery charge</span>
//                       <span className="font-medium">₹25</span>
//                     </div>
//                     <div className="flex justify-between text-sm sm:text-base">
//                       <span>Handling charge</span>
//                       <span className="font-medium">₹2</span>
//                     </div>
//                     <div className="border-t pt-2 mt-2">
//                       <div className="flex justify-between items-center">
//                         <span className="font-semibold text-base sm:text-lg">Grand total:</span>
//                         <span className="font-bold text-lg sm:text-xl text-orange-600">₹{getTotalPrice() + 27}</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Donation Section - Responsive */}
//                   <div className="bg-yellow-50 p-3 rounded-lg">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-3 flex-1">
//                         <div className="bg-yellow-400 rounded-full p-1 flex-shrink-0">
//                           <img 
//                             src="https://cdn.grofers.com/assets/ui/icons/feeding_india_icon_v6.png" 
//                             className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" 
//                             alt="donation"
//                           />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <h4 className="font-semibold text-sm sm:text-base">Feeding India donation</h4>
//                           <p className="text-xs sm:text-sm text-gray-600 truncate">Working towards a malnutrition free India...</p>
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-2 flex-shrink-0">
//                         <span className="text-sm font-semibold">₹1</span>
//                         <input type="checkbox" className="rounded w-4 h-4" />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Tip Section - Responsive */}
//                   <div className="mb-4">
//                     <h4 className="font-semibold mb-2 text-sm sm:text-base">Tip your delivery partner</h4>
//                     <p className="text-xs sm:text-sm text-gray-600 mb-3">Your kindness means a lot! 100% of your tip will go directly to your delivery partner.</p>
                    
//                     {/* Tip buttons - responsive grid */}
//                     <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-2">
//                       {[
//                         { emoji: '😊', amount: 20 },
//                         { emoji: '😍', amount: 30 },
//                         { emoji: '🤩', amount: 50 },
//                         { emoji: '🤩', amount: 80 },
//                         { emoji: '✨', amount: 'Custom' }
//                       ].map((tip, index) => (
//                         <Button
//                           key={index}
//                           variant="outline"
//                           size="sm"
//                           className="flex flex-col items-center space-y-1 text-xs h-auto py-2"
//                         >
//                           <span className="text-base">{tip.emoji}</span>
//                           <span>₹{tip.amount}</span>
//                         </Button>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Cancellation Policy - Collapsible on mobile */}
//                   <div className="mb-4">
//                     <h4 className="font-semibold text-sm mb-2">Cancellation Policy</h4>
//                     <p className="text-xs text-gray-600">
//                       Orders cannot be cancelled once packed for delivery. In case of unexpected delays, a refund will be provided, if applicable.
//                     </p>
//                   </div>

//                   {/* Delivery Address - Responsive */}
//                   <div className="bg-gray-50 p-3 rounded-lg mb-4">
//                     <div className="flex items-start justify-between">
//                       <div className="flex items-start space-x-3 flex-1">
//                         <div className="bg-gray-300 rounded-full p-1 mt-1 flex-shrink-0">
//                           <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <h4 className="font-semibold text-sm">Delivering to Home</h4>
//                           <p className="text-xs text-gray-600 break-words">Habib kd, 123 Main St, City, Country, Zip...</p>
//                         </div>
//                       </div>
//                       <Button 
//                         onClick={() => setAddressOpen(true)} 
//                         variant="link" 
//                         className="text-green-600 text-xs p-0 flex-shrink-0"
//                       >
//                         Change
//                       </Button>
//                     </div>
//                   </div>

//                   {/* Promo Code */}
//                   <div className='p-1'>
//                     <Input 
//                       placeholder="Enter promo code" 
//                       className="mb-4 text-sm" 
//                     />
//                   </div>

//                   {/* Checkout Button */}
//                   <Link href="/checkout">
//                     <Button className="w-full bg-orange-500 hover:bg-orange-600 text-base sm:text-lg py-3 sm:py-4">
//                       Proceed to Checkout
//                     </Button>
//                   </Link>
//                 </>
//               )}
//             </div>
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



import React from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useWishListContext, WishListContext } from '@/context/WishListsContext';
import Link from 'next/link';

/* ------------------ Interfaces ------------------ */
interface Product {
    id: number;
    name: string;
    price: number;
    originalPrice: number;
    discount: number;
    rating: number;
    reviews: number;
    image: string;
}

interface ProductCardGridProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
}

/* ------------------ Responsive Product Card Grid ------------------ */
const ProductCardGrid: React.FC<ProductCardGridProps> = ({
  products, 
  onAddToCart, 
  onToggleWishlist
}) => {
    const { wishListsData } = useWishListContext();

    if (products?.length === 0) {
        return (
            <div className="col-span-full flex flex-col items-center justify-center py-12 sm:py-16">
                <div className="text-4xl sm:text-6xl mb-4">🔍</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                <p className="text-sm sm:text-base text-gray-500 text-center px-4">Try adjusting your filters or search terms</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {products?.map((product) => (
                <div
                    key={product.id}
                    className="bg-white relative border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
                >
                    {/* Image Container + Discount + Wishlist */}
                    <Link href={`/products/${product.id}`} className="block relative">
                        <div className="aspect-square bg-gray-100 flex items-center justify-center p-2 sm:p-3 rounded-t-lg">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover rounded"
                            />
                        </div>

                        {/* Discount badge - Responsive */}
                        <div className="absolute top-0 left-0">
                            <div className="bg-[#6e5503] text-white text-xs font-bold px-2 py-1 sm:px-3 sm:py-1 rounded-br-lg custom-corner">
                                {product.discount}% OFF
                            </div>
                        </div>
                    </Link>

                    {/* Wishlist Button - Responsive */}
                    <button
                        onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            onToggleWishlist?.(product);
                        }}
                        className="absolute top-1 right-1 sm:top-2 sm:right-2 p-1.5 sm:p-2 bg-white z-30 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                    >
                        <Heart
                            className={`w-4 h-4 sm:w-5 sm:h-5 ${wishListsData.some((item: any) => item.id === product.id)
                                    ? 'text-red-500 fill-current'
                                    : 'text-gray-400'
                                } hover:text-red-500`}
                        />
                    </button>

                    {/* Content - Responsive padding */}
                    <div className="p-2 sm:p-3 md:p-4">
                        <Link href={`/products/${product.id}`}>
                            <h3 className="font-medium text-gray-900 mb-1 sm:mb-2 line-clamp-2 hover:underline text-xs sm:text-sm md:text-base leading-tight">
                                {product.name}
                            </h3>
                        </Link>

                        {/* Rating - Responsive */}
                        <div className="flex items-center mb-1 sm:mb-2">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.floor(product.rating)
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-600">
                                ({product.reviews})
                            </span>
                        </div>

                        {/* Price - Responsive */}
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <div>
                                <span className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
                                    ₹{product.price}
                                </span>
                                <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-500 line-through">
                                    ₹{product.originalPrice}
                                </span>
                            </div>
                        </div>

                        {/* Add to Cart Button - Responsive */}
                        <button
                            onClick={() => onAddToCart?.(product)}
                            className="w-full bg-gradient-to-r from-orange-400 to-red-500 text-white py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg font-medium hover:from-orange-500 hover:to-red-600 transition-all duration-200 transform hover:scale-105 flex items-center justify-center text-xs sm:text-sm"
                        >
                            <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Add to Cart</span>
                            <span className="sm:hidden">Add</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductCardGrid;