// "use client";
// import React, { useState } from 'react';
// import { Search, Heart, ShoppingCart, Menu, X } from 'lucide-react';
// import SidebarFilters from "@/components/SidebarFilters"
// import NavbarFilter from "@/components/NavbarFilter"
// import ProductCardGrid from "@/components/ProductGrid"
// import AnnouncementBar from '@/components/AnnouncementBar';
// import "@/styles/productist.css";
// import SupportChat from '@/components/SupportChat';
// import LocationSelector from '@/components/LocationSelector';
// import { Button } from "@/components/ui/button"
// import AddCardList from '@/components/AddCards';
// import Link from 'next/link';
// import { WishListContext } from '@/context/WishListsContext';
// const ProductGrid = () => {
//   const {wishListsData,setWistListsData} = React.useContext<any>(WishListContext);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//   const [cartItems, setCartItems] = useState<any>([])
//   const [cartOpen, setCartOpen] = useState<boolean>(false)
"use client";

import NavbarFilter from "@/components/NavbarFilter";
import ProductCardGrid from "@/components/ProductGrid";
import SidebarFilters from "@/components/SidebarFilters";

import React, { useState, createContext, useContext, ReactNode } from 'react';
import { Search, Heart, ShoppingCart, Menu, X, Filter, Star } from 'lucide-react';
import { useFilterContext } from "@/context/FilterContext";
import { useWishListContext } from "@/context/WishListsContext";
import AnnouncementBar from "@/components/AnnouncementBar";
import LocationSelector from "@/components/LocationSelector";
import Link from "next/link";
import AddCardList from "@/components/AddCards";
import { Button } from "@/components/ui/button";

// Type Definitions
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  discount: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface Category {
  key: string;
  label: string;
  icon: string;
}

interface PriceRange {
  key: string;
  label: string;
  min: number;
  max: number;
}

//   const toggleWishlist = (item: any) => {
//     const exists = wishListsData.find((fav:any) => fav.id === item.id);
//     if (exists) {
// setWistListsData(JSON.stringify(wishListsData.filter((fav:any) => fav.id !== item.id)))
//     } else {
//       setWistListsData(JSON.stringify([...wishListsData, item]))
//     }
//   };

//   const categories = [
//     'All Categories',
//     'Beverages',
//     'Snacks & Confectionery',
//     'Personal Care',
//     'Health & Wellness',
//     'Home & Kitchen',
//     'Dairy Products',
//     'Frozen Foods',
//     'Baby Care',
//     'Cleaning Supplies'
//   ];

//   const products = [
//     { id: 1, name: 'Premium Green Tea', price: 299, originalPrice: 399, image: 'https://picsum.photos/200', rating: 4.5, reviews: 128, category: 'beverages', discount: 25 },
//     { id: 2, name: 'Organic Honey', price: 450, originalPrice: 550, image: 'https://picsum.photos/200', rating: 4.8, reviews: 89, category: 'health', discount: 18 },
//     { id: 3, name: 'Face Wash Gel', price: 180, originalPrice: 220, image: 'https://picsum.photos/200', rating: 4.2, reviews: 156, category: 'personal-care', discount: 18 },
//     { id: 4, name: 'Chocolate Cookies', price: 120, originalPrice: 150, image: 'https://picsum.photos/200', rating: 4.6, reviews: 203, category: 'snacks', discount: 20 },
//     { id: 5, name: 'Vitamin C Tablets', price: 350, originalPrice: 420, image: 'https://picsum.photos/200', rating: 4.4, reviews: 67, category: 'health', discount: 17 },
//     { id: 6, name: 'Coffee Beans 500g', price: 680, originalPrice: 800, image: 'https://picsum.photos/200', rating: 4.7, reviews: 245, category: 'beverages', discount: 15 },
//     { id: 7, name: 'Hand Sanitizer', price: 89, originalPrice: 110, image: 'https://picsum.photos/200', rating: 4.3, reviews: 178, category: 'personal-care', discount: 19 },
//     { id: 8, name: 'Protein Bars Pack', price: 380, originalPrice: 450, image: 'https://picsum.photos/200', rating: 4.5, reviews: 92, category: 'health', discount: 16 },
//     { id: 9, name: 'Himalayan Salt', price: 140, originalPrice: 180, image: 'https://picsum.photos/200', rating: 4.6, reviews: 134, category: 'home', discount: 22 },
//     { id: 10, name: 'Energy Drink Pack', price: 250, originalPrice: 300, image: 'https://picsum.photos/200', rating: 4.1, reviews: 167, category: 'beverages', discount: 17 },
//     { id: 11, name: 'Almond Butter', price: 520, originalPrice: 620, image: 'https://picsum.photos/200', rating: 4.7, reviews: 76, category: 'health', discount: 16 },
//     { id: 12, name: 'Moisturizer Cream', price: 320, originalPrice: 400, image: 'https://picsum.photos/200', rating: 4.4, reviews: 198, category: 'personal-care', discount: 20 },
//     { id: 13, name: 'Dark Chocolate Bar', price: 180, originalPrice: 220, image: 'https://picsum.photos/200', rating: 4.8, reviews: 289, category: 'snacks', discount: 18 },
//     { id: 14, name: 'Coconut Oil 500ml', price: 280, originalPrice: 340, image: 'https://picsum.photos/200', rating: 4.5, reviews: 143, category: 'home', discount: 18 },
//     { id: 15, name: 'Herbal Shampoo', price: 220, originalPrice: 280, image: 'https://picsum.photos/200', rating: 4.3, reviews: 112, category: 'personal-care', discount: 21 },
//     { id: 16, name: 'Mixed Nuts 250g', price: 450, originalPrice: 520, image: 'https://picsum.photos/200', rating: 4.6, reviews: 187, category: 'snacks', discount: 13 },
//     { id: 17, name: 'Green Coffee Extract', price: 680, originalPrice: 800, image: 'https://picsum.photos/200', rating: 4.2, reviews: 58, category: 'health', discount: 15 },
//     { id: 18, name: 'Dish Soap Liquid', price: 150, originalPrice: 180, image: 'https://picsum.photos/200', rating: 4.4, reviews: 234, category: 'cleaning', discount: 17 },
//     { id: 19, name: 'Oats Breakfast', price: 180, originalPrice: 220, image: 'https://picsum.photos/200', rating: 4.7, reviews: 156, category: 'health', discount: 18 },
//     { id: 20, name: 'Body Lotion', price: 290, originalPrice: 350, image: 'https://picsum.photos/200', rating: 4.5, reviews: 167, category: 'personal-care', discount: 17 },
//     { id: 21, name: 'Fruit Juice 1L', price: 120, originalPrice: 150, image: 'https://picsum.photos/200', rating: 4.3, reviews: 298, category: 'beverages', discount: 20 },
//     { id: 22, name: 'Laundry Detergent', price: 380, originalPrice: 450, image: 'https://picsum.photos/200', rating: 4.6, reviews: 189, category: 'cleaning', discount: 16 },
//     { id: 23, name: 'Quinoa Seeds 500g', price: 420, originalPrice: 500, image: 'https://picsum.photos/200', rating: 4.4, reviews: 87, category: 'health', discount: 16 },
//     { id: 24, name: 'Baby Wipes Pack', price: 180, originalPrice: 220, image: 'https://picsum.photos/200', rating: 4.7, reviews: 267, category: 'baby-care', discount: 18 },
//   ];

//   const filteredProducts = products.filter(product => {
//     const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   const addToCart = (item: any) => {
//     const existingItem = cartItems.find((cartItem: any) => cartItem.id === item.id)
//     if (existingItem) {
//       setCartItems(
//         cartItems.map((cartItem: any) =>
//           cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
//         ),
//       )
//     } else {
//       setCartItems([...cartItems, { ...item, quantity: 1 }])
//     }
//   }


//   const removeFromCart = (itemId: any) => {
//     setCartItems(cartItems.filter((item: any) => item.id !== itemId))
//   }

//   const updateQuantity = (itemId: any, newQuantity: any) => {
//     if (newQuantity === 0) {
//       removeFromCart(itemId)
//     } else {
//       setCartItems(cartItems.map((item: any) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
//     }
//   }

//   const getTotalPrice = () => {
//     return cartItems.reduce((total: any, item: any) => total + item.price * item.quantity, 0)
//   }


//   return (
//     <div className="h-screen overflow-hidden flex flex-col">
//       {/* Navbar */}
//       <div className='sticky top-0 z-50'>
//         <AnnouncementBar />
//       </div>
//       <div className="sticky top-0 z-50">
//         <header className="bg-white shadow-sm border-b  sticky top-0 z-50">
//           <div className="max-w-7xl mx-auto  py-2 border-b-1">
//             <div className="flex items-center justify-between">
//               <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
//                 ShopMart
//               </h1>
//               <div className="flex items-center space-x-4">

//                 <div className="relative z-50">
//                   {/* Search Icon */}
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 w-5 h-5 pointer-events-none" />

//                   {/* Input Box */}
//                   <input
//                     type="text"
//                     placeholder="Search products..."
//                     className="pl-10 pr-[220px] w-full py-2 border border-1 border-orange-400 rounded-lg focus:ring-0 focus:ring-orange-400 focus:outline-none"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                 </div>
//                 <LocationSelector />

//                 <button className="relative p-2 hover:bg-gray-100 rounded-lg" onClick={() => setCartOpen(!cartOpen)}>
//                  <Link href="/wishlist">
//                   <Heart className="w-6 h-6 text-orange-600" />
//                   {wishListsData.length > 0 && (
//                     <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
//                       {wishListsData.length}
//                     </span>
//                   )}
//                   </Link>
//                 </button>


//                 <div className="flex items-center space-x-4">

//                   <AddCardList cartItems={cartItems} removeFromCart={removeFromCart} updateQuantity={updateQuantity} getTotalPrice={getTotalPrice} setCartItems={setCartItems} cartOpen={cartOpen} setCartOpen={setCartOpen} />
//                   {/* Mobile Menu Button */}
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="md:hidden text-gray-700 dark:text-gray-300"
//                     onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//                   >
//                     {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
//                   </Button>
//                 </div>

//                 {/* show here some profile logo */}
//                 <div className='flex items-center cursor-pointer'>

//                   <img className="w-10 h-10 rounded-full" src="https://picsum.photos/200" alt="profile" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>
//         <NavbarFilter />
//       </div>

//       {/* Body: Sidebar + Main */}
//       <div className="flex flex-1 overflow-hidden">
//         {/* Sidebar */}
//         <div className="w-64 bg-white shadow-lg overflow-y-auto sticky top-0 ">
//           <SidebarFilters />
//         </div>

//         {/* Main Content Scrollable */}
//         <div className="flex-1 overflow-y-auto bg-gray-100 px-4">
//           <div className="mt-5">
//             <ProductCardGrid
//               products={filteredProducts}
//               onAddToCart={addToCart}
//               onToggleWishlist={toggleWishlist}

//             />
//           </div>

//           {/* Pagination */}
//           <div className="mt-8 flex justify-center">
//             <nav className="flex items-center space-x-2">
//               <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Previous</button>
//               {[1, 2, 3, 4, 5].map((page) => (
//                 <button
//                   key={page}
//                   className={`px-3 py-2 border rounded-lg ${page === 1
//                     ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white border-transparent'
//                     : 'border-gray-300 hover:bg-gray-50'
//                     }`}
//                 >
//                   {page}
//                 </button>
//               ))}
//               <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Next</button>
//             </nav>
//           </div>
//         </div>

//       </div>
//       <SupportChat />

//     </div>
//   );

// };

// export default ProductGrid;









// Main Product Grid Component
const ProductGrid: React.FC = () => {
  const { filters, updateFilter } = useFilterContext();
  const { wishListsData, setWistListsData } = useWishListContext();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileMenuOpen,setMobileMenuOpen]=useState(false)
  // Sample products data with proper typing
  const products: Product[] = [
 // Masala 
    { id: 17, name: 'Maggi Masala-ae-Magic Sabzi Masala', price: 280, originalPrice: 350, image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/18c2665c-3591-482c-a11a-e35662e756a4.png', rating: 4.6, reviews: 187, category: 'masala', discount: 20 },
    { id: 18, name: 'Everest Tikhalal Red Chilli Powder', price: 54, originalPrice: 54, image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/9dea2d22-108f-4021-aeec-e95b4e271e16.png', rating: 4.6, reviews: 187, category: 'masala', discount: 20 },
    { id: 19, name: 'MCatch Turmeric Powder/Haldi', price: 39, originalPrice: 45, image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/c34b8c71-a7b3-4311-88de-80533ee0fc12.png', rating: 4.6, reviews: 187, category: 'masala', discount: 20 },
    { id: 20, name: 'Catch Coriander Powder/Dhania', price: 65, originalPrice: 80, image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/6df5cd41-6ace-47e9-952c-6a245a4994dc.png', rating: 4.6, reviews: 187, category: 'masala', discount: 20 },
    { id: 21, name: 'Organic Tattva Red Organic Chilli Powder', price: 94, originalPrice: 110, image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/4d2590f5-d68f-435a-af14-d9c09d2753b1.png', rating: 4.6, reviews: 187, category: 'masala', discount: 20 },
    { id: 22, name: 'Tata Sampann Chilli Powder with Natural Oils', price: 280, originalPrice: 350, image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/c3f31b7f-0492-45b8-a14a-ad6dae3ca393.png', rating: 4.6, reviews: 187, category: 'masala', discount: 20 },
    { id: 23, name: 'Everest Sambhar Masala', price: 80, originalPrice: 80, image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/d70dc261-4adb-44e3-8dc2-22b5de6a8a73.png', rating: 4.6, reviews: 187, category: 'masala', discount: 20 },
    { id: 24, name: 'Tata Sampann Coriander Powder with Natural Oils', price: 80, originalPrice: 30, image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/fa7526df-b0e8-418f-a5d2-752237b7b37e.png', rating: 4.6, reviews: 187, category: 'masala', discount: 20 },
    { id: 25, name: 'Catch Cumin Seeds / Jeera Seeds - Pack of 2', price: 105, originalPrice: 136, image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/1e339ae1-aed2-4849-ade1-8741e5a2d56b.png', rating: 4.6, reviews: 187, category: 'masala', discount: 20 },
    { id: 26, name: 'Everest Hing Powder', price: 74, originalPrice: 78, image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/30d4e721-92b4-45bc-ae70-678bb5905750.png', rating: 4.6, reviews: 187, category: 'masala', discount: 20 },
    { id: 27, name: 'Catch Compounded Hing Powder', price: 65, originalPrice: 74, image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=450/da/cms-assets/cms/product/d5a53808-7179-4645-a4e2-fdc94a83554e.png', rating: 4.6, reviews: 187, category: 'masala', discount: 20 },
    // now oil 
    { id: 28, name: 'Natureland Organic Mustard Oil Cold Pressed', price: 238, originalPrice: 375, image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/ba77235a-8b79-4c60-b68f-ccb559878363.png', rating: 4.6, reviews: 187, category: 'masala', discount: 20 },
    { id: 29, name: 'Chambal Refined Soyabean Oil', price: 129, originalPrice: 163, image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/394ff2b1-52e1-430c-8e35-2eab0ad407df.png', rating: 4.6, reviews: 187, category: 'masala', discount: 20 },
    { id: 30, name: 'Fortune Sunlite Refined Sunflower Oil (870 g)', price: 159, originalPrice: 180, image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/08e99bfb-e035-4320-85ac-dd81880237c9.png', rating: 4.6, reviews: 187, category: 'masala', discount: 20 },
    { id: 31, name: 'Organic Tattva Organic Mustard Oil', price: 259, originalPrice: 349, image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/22b11dd9-8ee9-437f-b5ec-53bb847fbceb.png', rating: 4.6, reviews: 187, category: 'masala', discount: 20 },
    { id: 32, name: 'Parampara Soyabean Oil', price: 131, originalPrice: 170, image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/b2c39933-f336-4859-9e25-f78a46894514.png', rating: 4.6, reviews: 187, category: 'masala', discount: 20 },
    { id: 33, name: 'Dhara Filtered Groundnut Oil (0% Trans Fat)', price: 139, originalPrice: 249, image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/a9a4662a-14e1-49df-8b89-21753f4f548e.png', rating: 4.6, reviews: 187, category: 'masala', discount: 20 },
    { id: 34, name: 'Anveshan Wood Cold Pressed Groundnut Oil', price: 457, originalPrice: 440, image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/d84dabb6-cf8a-438f-a647-b8b24181c8d2.png', rating: 4.6, reviews: 187, category: 'masala', discount: 20 },
    { id: 35, name: 'Saffola Active Rice Bran & Soyabean Blended Cooking Oil', price: 187, originalPrice: 148, image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=120,h=120/da/cms-assets/cms/product/b17c14ea-5daa-4354-807d-8516730ce6df.jpg?ts=1732017259', rating: 4.6, reviews: 187, category: 'masala', discount: 20 },
    { id: 36, name: 'Pawan Refined Soyabean Oil', price: 190, originalPrice: 121, image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=120,h=120/da/cms-assets/cms/product/69f0fb5d-f5ae-400f-a497-915c1f417922.jpg?ts=1746269850', rating: 4.6, reviews: 187, category: 'masala', discount: 20 },
    { id: 37, name: 'Fortune Premium Kachi Ghani Pure Mustard Oil', price: 916, originalPrice: 1035, image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=120,h=120/da/cms-assets/cms/product/8d4c1a72-3dc2-4288-8102-ba5e8bc2a923.jpg?ts=1753429118', rating: 4.6, reviews: 187, category: 'masala', discount: 20 },
    { id: 38, name: 'Saffola Gold Blend of Rice Bran & Corn Blended Cooking Oil', price: 159, originalPrice: 180, image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=120,h=120/da/cms-assets/cms/product/cab97845-a7c6-41d6-9bbb-cc014bcb471f.jpg?ts=1732017264', rating: 4.6, reviews: 187, category: 'masala', discount: 20 },
    { id: 39, name: 'Fortune Refined Soyabean Oil', price: 395, originalPrice: 293, image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=120,h=120/app/assets/products/sliding_images/jpeg/33d6a284-d1a9-4a63-900e-5050155d2173.jpg?ts=1727072154', rating: 4.6, reviews: 187, category: 'masala', discount: 20 },
    { id: 40, name: 'Chambal Refined Soyabean Oil', price: 832, originalPrice: 657, image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=120,h=120/da/cms-assets/cms/product/c316617d-37de-4029-9c40-943b63af8faf.jpg?ts=1749549753', rating: 4.6, reviews: 187, category: 'masala', discount: 20 },
  ];

  // Real-time filtering logic with proper typing
  const filteredProducts: Product[] = products.filter((product: Product) => {
    // Search filter
    if (filters.searchTerm && !product.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }

    // Category filter
    if (filters.category !== 'all' && product.category !== filters.category) {
      return false;
    }

    // Price range filter
    if (filters.priceRanges.length > 0) {
      const priceRangeMap: Record<string, { min: number; max: number }> = {
        'under-100': { min: 0, max: 100 },
        '100-300': { min: 100, max: 300 },
        '300-500': { min: 300, max: 500 },
        '500-1000': { min: 500, max: 1000 },
        'above-1000': { min: 1000, max: Infinity }
      };

      const matchesPrice = filters.priceRanges.some((rangeKey: string) => {
        const range = priceRangeMap[rangeKey];
        return product.price >= range.min && product.price <= range.max;
      });

      if (!matchesPrice) return false;
    }

    // Rating filter
    if (filters.ratings.length > 0) {
      const matchesRating = filters.ratings.some((rating: number) => product.rating >= rating);
      if (!matchesRating) return false;
    }

    return true;
  });

  const toggleWishlist = (item: any) => {
    const exists = wishListsData.find((fav: Product) => fav.id === item.id);
    if (exists) {
      setWistListsData(wishListsData.filter((fav: Product) => fav.id !== item.id));
    } else {
      setWistListsData([...wishListsData, item]);
    }
  };

  const addToCart = (item: any) => {
    const existingItem = cartItems.find((cartItem: CartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCartItems(
        cartItems.map((cartItem: CartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId: any) => {
    setCartItems(cartItems.filter((item: any) => item.id !== itemId))
  }

  const updateQuantity = (itemId: any, newQuantity: any) => {
    if (newQuantity === 0) {
      removeFromCart(itemId)
    } else {
      setCartItems(cartItems.map((item: any) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
    }
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total: any, item: any) => total + item.price * item.quantity, 0)
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className='sticky top-0'>
        <AnnouncementBar />
      </div>
      <div className="sticky top-0 z-50">
        <header className="bg-white shadow-sm border-b  sticky top-0 z-[60]">
          <div className="max-w-7xl mx-auto  py-2 border-b-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">

              <img src="./logoGro.png" className="w-12 h-12 rounded-md" alt="logo" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Gro-Delivery
              </h1>
              </div>
              <div className="flex items-center space-x-4">

                <div className="relative z-40">
                  {/* Search Icon */}
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 w-5 h-5 pointer-events-none" />

                  {/* Input Box */}
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="pl-10 pr-[220px] w-full py-2 border border-1 border-orange-400 rounded-lg focus:ring-0 focus:ring-orange-400 focus:outline-none"
                    value={filters.searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateFilter('searchTerm', e.target.value)
                    }
                  />
                </div>
                <div className="z-50">

                <LocationSelector />
                </div>

                <button className="relative p-2 hover:bg-gray-100 rounded-lg" onClick={() => setCartOpen(!cartOpen)}>
                  <Link href="/wishlist">
                    <Heart className="w-6 h-6 text-orange-600" />
                    {wishListsData.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {wishListsData.length}
                      </span>
                    )}
                  </Link>
                </button>


                <div className="flex items-center space-x-4 relative z-[120px]">

                  <AddCardList cartItems={cartItems} removeFromCart={removeFromCart} updateQuantity={updateQuantity} getTotalPrice={getTotalPrice} setCartItems={setCartItems} cartOpen={cartOpen} setCartOpen={setCartOpen} />
                  {/* Mobile Menu Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-gray-700 dark:text-gray-300"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  >
                    {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-" />}
                  </Button>
                </div>

                {/* show here some profile logo */}
                <div className='flex items-center cursor-pointer'>

                  <img className="w-10 h-10 rounded-full" src="https://picsum.photos/200" alt="profile" />
                </div>
              </div>
            </div>
          </div>
        </header>
        <NavbarFilter />
      </div>

      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-1 py-2">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <SidebarFilters />

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Fresh Groceries ({filteredProducts.length} products)
              </h2>
              <div className="text-sm text-gray-600">
                {filters.category !== 'all' && (
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full mr-2">
                    Category: {filters.category}
                  </span>
                )}
                {filters.priceRanges.length > 0 && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full mr-2">
                    Price filters applied
                  </span>
                )}
                {filters.ratings.length > 0 && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    Rating filters applied
                  </span>
                )}
              </div>
            </div>

            <ProductCardGrid
              products={filteredProducts}
              onAddToCart={addToCart}
              onToggleWishlist={toggleWishlist}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;