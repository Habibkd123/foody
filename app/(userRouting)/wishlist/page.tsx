// 'use client';

// import React, { useState } from 'react';
// import { Trash2, ShoppingCart, CheckCircle, Heart, Star, Minus, Plus, Search, X, Menu } from 'lucide-react';
// import { WishListContext } from '@/context/WishListsContext';
// import { useOrder } from '@/context/OrderContext';
// import type { CartLine } from '@/types/global';
// import AddressModal from '@/components/AddressModal';
// import AddCardList from '@/components/AddCards';
// import Link from 'next/link';
// import { useFilterContext } from '@/context/FilterContext';
// import { Button } from '@/components/ui/button';
// import { useRouter } from 'next/navigation';
// import LocationSelector from '@/components/LocationSelector';

// type WishlistItem = {
//   id: number;
//   title: string;
//   image: string;
//   price: number;
// };
// interface Product {
//   id: number;
//   name: string;
//   price: number;
//   originalPrice: number;
//   image: string;
//   rating: number;
//   reviews: number;
//   category: string;
//   discount: number;
// }

// interface CartItem extends Product {
//   quantity: number;
// }
// const Wishlist: React.FC = () => {
//   const { wishListsData, setWistListsData } = React.useContext<any>(WishListContext);
//   const { state, dispatch } = useOrder();
//   const router = useRouter()
//   const { filters, updateFilter } = useFilterContext();
//   const [cartOpen, setCartOpen] = useState(false)
//   const [addressOpen, setAddressOpen] = React.useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//   const [cartItems, setCartItems] = useState<CartItem[]>(
//     state.items.map((item) => ({
//       ...item,
//       name: item.name ?? '',
//       originalPrice: item?.originalPrice ?? item.price,
//       discount: item.discount ?? 0,
//       image: item.image ?? '',
//       rating: item.rating ?? 0,
//       reviews: item.reviews ?? 0,
//       category: item.category ?? '',
//     }))
//   );


//   const handleRemove = (id: number) => {
//     setWistListsData(wishListsData.filter((item: WishlistItem) => item.id !== id));
//   };

//   const isInCart = (id: number) => {
//     return state.items.some((item: CartLine) => item.id === id);
//   };


//   const addToCart = (item: any) => {
//     const existingItem = cartItems.find((cartItem: CartItem) => cartItem.id === item.id);
//     if (existingItem) {
//       setCartItems(
//         cartItems.map((cartItem: CartItem) =>
//           cartItem.id === item.id
//             ? { ...cartItem, quantity: cartItem.quantity + 1 }
//             : cartItem
//         )
//       );
//       // let cartLine = { ...item, quantity: existingItem.quantity + 1 }

//       dispatch({ type: "QTY", id: item.id, qty: existingItem.quantity + 1 });
//     } else {
//       setCartItems([...cartItems, { ...item, quantity: 1 }]);
//       let cartLine = { ...item, quantity: 1 }
//       dispatch({ type: "ADD", item: cartLine });
//     }
//   };

//   const removeFromCart = (itemId: any) => {
//     setCartItems(cartItems.filter((item: any) => item.id !== itemId))
//   }
//   const removeFromWishList = (itemId: any) => {
//     setWistListsData(wishListsData.filter((item: any) => item.id !== itemId))
//     // dispatch({ type: "REMOVE", id: itemId });
//   }

//   const updateQuantity = (itemId: any, newQuantity: any) => {
//     if (newQuantity === 0) {
//       removeFromCart(itemId)
//       dispatch({ type: "REMOVE", id: itemId });

//     } else {
//       setCartItems(cartItems.map((item: any) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
//       dispatch({ type: "QTY", id: itemId, qty: newQuantity });
//     }
//   }

//   const getTotalPrice = () => {
//     return cartItems.reduce((total: any, item: any) => total + item.price * item.quantity, 0)
//   }
//   const filteredProducts: Product[] = cartItems.filter((product: Product) => {
//     // Search filter
//     if (filters.searchTerm && !product.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
//       return false;
//     }

//     // Category filter
//     if (filters.category !== 'all' && product.category !== filters.category) {
//       return false;
//     }

//     // Price range filter
//     if (filters.priceRanges.length > 0) {
//       const priceRangeMap: Record<string, { min: number; max: number }> = {
//         'under-100': { min: 0, max: 100 },
//         '100-300': { min: 100, max: 300 },
//         '300-500': { min: 300, max: 500 },
//         '500-1000': { min: 500, max: 1000 },
//         'above-1000': { min: 1000, max: Infinity }
//       };

//       const matchesPrice = filters.priceRanges.some((rangeKey: string) => {
//         const range = priceRangeMap[rangeKey];
//         return product.price >= range.min && product.price <= range.max;
//       });

//       if (!matchesPrice) return false;
//     }

//     // Rating filter
//     if (filters.ratings.length > 0) {
//       const matchesRating = filters.ratings.some((rating: number) => product.rating >= rating);
//       if (!matchesRating) return false;
//     }

//     return true;
//   });



//   return (
//     <div className="p-0">
//       <div className="sticky top-0 z-50">
//         <header className="bg-white shadow-sm border-b">
//           <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 border-b-1">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2 flex-shrink-0">
//                 <img src="./logoGro.png" className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-md" alt="logo" />

//               </div>

//               {/* Search Bar - Hidden on mobile, visible on tablet+ */}
//               <div className="hidden md:flex items-center space-x-4 flex-1 max-w-2xl mx-0" style={{ marginLeft: "140px" }}>
//                 <div className="relative flex-1">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 w-5 h-5 pointer-events-none" />
//                   <input
//                     type="text"
//                     placeholder="Search products..."
//                     className="pl-10 pr-4 w-full py-2 border border-orange-400 rounded-lg focus:ring-0 focus:ring-orange-400 focus:outline-none"
//                     value={filters.searchTerm}
//                     onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                       updateFilter('searchTerm', e.target.value)
//                     }
//                   />
//                 </div>

//               </div>

//               {/* Right side icons */}
//               <div className="flex items-center space-x-2 sm:space-x-4">


//                 {/* Cart */}
//                 <div className="flex items-center space-x-2 relative z-[120px]">
//                   <AddCardList
//                     cartItems={cartItems}
//                     removeFromCart={removeFromCart}
//                     updateQuantity={updateQuantity}
//                     getTotalPrice={getTotalPrice}
//                     setCartItems={setCartItems}
//                     cartOpen={cartOpen}
//                     setCartOpen={setCartOpen}
//                   />

//                   {/* Mobile Menu Button */}
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="md:hidden text-gray-700"
//                     onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//                   >
//                     {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
//                   </Button>
//                 </div>

//                 {/* Profile - Hidden on mobile */}
//                 <div className='hidden sm:flex items-center cursor-pointer' onClick={() => router.push('/profile')}>
//                   <img className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" src="https://picsum.photos/200" alt="profile" />
//                 </div>
//               </div>
//             </div>

//             {/* Mobile Search Bar */}
//             <div className="md:hidden mt-3">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 w-5 h-5 pointer-events-none" />
//                 <input
//                   type="text"
//                   placeholder="Search products..."
//                   className="pl-10 pr-4 w-full py-2 border border-orange-400 rounded-lg focus:ring-0 focus:ring-orange-400 focus:outline-none"
//                   value={filters.searchTerm}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                     updateFilter('searchTerm', e.target.value)
//                   }
//                 />
//               </div>
//               <div className="mt-2">
//                 kkkkkkkkkkk
//                 <LocationSelector />
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Navigation Filter */}
//         {/* <div className="hidden md:block">
//           <NavbarFilter />
//         </div> */}
//       </div>

//       {/* Mobile Menu Overlay */}
//       {mobileMenuOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
//           <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg overflow-y-auto">
//             <div className="p-4">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-lg font-semibold">Menu</h2>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   <X className="h-5 w-5" />
//                 </Button>
//               </div>

//               {/* Profile in mobile menu */}
//               <div className="flex items-center space-x-3 mb-6 p-3 bg-gray-50 rounded-lg" onClick={() => router.push('/profile')}>
//                 <img className="w-10 h-10 rounded-full" src="https://picsum.photos/200" alt="profile" />
//                 <div>
//                   <p className="font-medium">Your Account</p>
//                   <p className="text-sm text-gray-600">Manage your profile</p>
//                 </div>
//               </div>

//               {/* Mobile Navigation */}
//               {/* <NavbarFilter /> */}

//               {/* Mobile Filters */}
//               {/* <div className="mt-6">
//                 <SidebarFilters />
//               </div> */}
//             </div>
//           </div>
//         </div>
//       )}
//       {filteredProducts.length === 0 ? (
//         <p className="text-gray-600 text-center">Your wishlist is empty 😢</p>
//       ) : (
//         <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">

//           {filteredProducts.map((product: Product) => {
//             const added = isInCart(product.id);

//             return (
//               <div
//                 key={product.id}
//                 className="bg-white relative border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
//               >
//                 {/* Image Container + Discount + Wishlist */}
//                 <Link href={`/products/${product.id}`} className="block relative">
//                   <div className="aspect-square bg-gray-100 flex items-center justify-center p-2 sm:p-3 rounded-t-lg">
//                     <img
//                       src={product.image}
//                       alt={product.name}
//                       className="w-full h-full object-cover rounded"
//                     />
//                   </div>

//                   {/* Discount badge - Responsive */}
//                   <div className="absolute top-0 left-0">
//                     <div className="bg-[#6e5503] text-white text-xs font-bold px-2 py-1 sm:px-3 sm:py-1 rounded-br-lg custom-corner">
//                       {product.discount}% OFF
//                     </div>
//                   </div>
//                 </Link>

//                 {/* Wishlist Button - Responsive */}
//                 <button
//                   onClick={(e: React.MouseEvent) => {
//                     e.stopPropagation();
//                     removeFromWishList?.(product);
//                   }}
//                   className="absolute top-1 right-1 sm:top-2 sm:right-2 p-1.5 sm:p-2 bg-white z-30 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
//                 >
//                   <Heart
//                     className={`w-4 h-4 sm:w-5 sm:h-5 ${wishListsData.some((item: any) => item.id === product.id)
//                       ? 'text-red-500 fill-current'
//                       : 'text-gray-400'
//                       } hover:text-red-500`}
//                   />
//                 </button>

//                 {/* Content - Responsive padding */}
//                 <div className="p-2 sm:p-3 md:p-4">
//                   <Link href={`/products/${product.id}`}>
//                     <h3 className="font-medium text-gray-900 mb-1 sm:mb-2 line-clamp-2 hover:underline text-xs sm:text-sm md:text-base leading-tight">
//                       {product.name}
//                     </h3>
//                   </Link>

//                   {/* Rating - Responsive */}
//                   <div className="flex items-center mb-1 sm:mb-2">
//                     <div className="flex items-center">
//                       {[...Array(5)].map((_, i) => (
//                         <Star
//                           key={i}
//                           className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.floor(product.rating)
//                             ? 'text-yellow-400 fill-current'
//                             : 'text-gray-300'
//                             }`}
//                         />
//                       ))}
//                     </div>
//                     <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-600">
//                       ({product.reviews})
//                     </span>
//                   </div>

//                   {/* Price - Responsive */}
//                   <div className='flex items-center justify-between'>
//                     <div className="flex items-center justify-between mb-2 sm:mb-3">
//                       <div>
//                         <span className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
//                           ₹{product.price}
//                         </span>
//                         <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-500 line-through">
//                           ₹{product.originalPrice}
//                         </span>
//                       </div>
//                     </div>
//                     <div>
//                       {isInCart(product.id) && (
//                         <div className="flex items-center justify-between mt-0">
//                           <div className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-red-500 text-white p-2 rounded-md">
//                             {/* Minus Button */}
//                             <button
//                               onClick={() => updateQuantity(product.id, (cartItems.find(item => item.id === product.id)?.quantity || 1) - 1)}
//                               className="px-2 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
//                               disabled={(cartItems.find(item => item.id === product.id)?.quantity || 1) <= 1}
//                             >
//                               <Minus color='black' className="h-3 w-3 text-black" />
//                             </button>

//                             {/* Quantity */}
//                             <span className="min-w-[24px] text-center text-sm">
//                               {cartItems.find(item => item.id === product.id)?.quantity || 1}
//                             </span>

//                             {/* Plus Button */}
//                             <button
//                               onClick={() => updateQuantity(product.id, (cartItems.find(item => item.id === product.id)?.quantity || 1) + 1)}
//                               className="px-2 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
//                             >
//                               <Plus className="h-3 w-3" />
//                             </button>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Add to Cart Button -  Responsive */}
//                   {!isInCart(product.id) && (
//                     <button
//                       onClick={() => addToCart?.(product)}
//                       className="w-full mt-2 bg-gradient-to-r from-orange-400 to-red-500 text-white py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg font-medium hover:from-orange-500 hover:to-red-600 transition-all duration-200 transform hover:scale-105 flex items-center justify-center text-xs sm:text-sm"
//                     >
//                       <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
//                       <span className="hidden sm:inline">Add to Cart</span>
//                       <span className="sm:hidden">Add</span>
//                     </button>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* <AddCardList
//         cartItems={cartItems}
//         type="wishlist"
//         removeFromCart={removeFromCart}
//         updateQuantity={updateQuantity}
//         getTotalPrice={getTotalPrice}
//         setCartItems={setCartItems}
//         cartOpen={cartOpen}
//         setCartOpen={setCartOpen}
//       /> */}

//     </div>
//   );
// };

// export default Wishlist;


'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Trash2,
  ShoppingCart,
  CheckCircle,
  Heart,
  Star,
  Minus,
  Plus,
  Search,
  X,
  Menu,
  Filter,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Share,
  Eye,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { WishListContext } from '@/context/WishListsContext';
import { useOrder } from '@/context/OrderContext';
import type { CartItem, CartLine } from '@/types/global';
import AddressModal from '@/components/AddressModal';
import AddCardList from '@/components/AddCards';
import Link from 'next/link';
import { useFilterContext } from '@/context/FilterContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import LocationSelector from '@/components/LocationSelector';
import { Product, } from '@/types/global';
// Enhanced type definitions
interface WishlistItem {
  id: number;
  title: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category?: string;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  dateAdded?: string;
}




type ViewMode = 'grid' | 'list';
type SortOption = 'name' | 'price' | 'rating' | 'dateAdded' | 'discount';
type SortDirection = 'asc' | 'desc';

const Wishlist: React.FC = () => {
  // Context and hooks
  const { wishListsData, setWistListsData } = React.useContext<any>(WishListContext);
  const { state, dispatch } = useOrder();
  const router = useRouter();
  const { filters, updateFilter } = useFilterContext();

  // State management
  const [cartOpen, setCartOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('dateAdded');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });

  const [cartItems, setCartItems] = useState<CartItem[]>(
    state.items.map((item) => ({
      id: item.id,
      name: item.name ?? '',
      price: item.price,
      originalPrice: item?.originalPrice ?? item.price,
      discount: item.discount ?? 0,
      images: item.images ?? '',
      rating: item.rating ?? 0,
      reviews: item.reviews ?? 0,
      category: item.category ?? '',
      inStock: item.inStock ?? true,
      features: item.features ?? [],
      specifications: item.specifications ?? {},
      brand: item.brand ?? '',
      sku: item.sku ?? '',
      weight: item.weight ?? '',
      dimensions: item.dimensions ?? '',
      quantity: item.quantity,
    } as CartItem))
  );

  // Enhanced wishlist operations
  const handleRemove = useCallback((id: number) => {
    setWistListsData((prev: WishlistItem[]) => prev.filter((item) => item.id !== id));
    setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
  }, [setWistListsData]);

  const handleBulkRemove = useCallback(() => {
    setWistListsData((prev: WishlistItem[]) =>
      prev.filter((item) => !selectedItems.includes(item.id))
    );
    setSelectedItems([]);
  }, [selectedItems, setWistListsData]);

  const handleSelectAll = useCallback(() => {
    if (selectedItems.length === wishListsData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(wishListsData.map((item: WishlistItem) => item.id));
    }
  }, [selectedItems.length, wishListsData]);

  const isInCart = useCallback((id: number) => {
    return state.items.some((item: CartLine) => item.id === id);
  }, [state.items]);

  const addToCart = useCallback((item: Product) => {
    const existingItem = cartItems.find((cartItem: CartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCartItems((prev) =>
        prev.map((cartItem: CartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
      dispatch({ type: "QTY", id: item.id, qty: existingItem.quantity + 1 });
    } else {
      const newCartItem = { ...item, quantity: 1 };
      setCartItems((prev) => [...prev, newCartItem]);
      dispatch({ type: "ADD", item: newCartItem });
    }
  }, [cartItems, dispatch]);

  const addAllToCart = useCallback(() => {
    setIsLoading(true);
    selectedItems.forEach((itemId) => {
      const item = wishListsData.find((w: WishlistItem) => w.id === itemId);
      if (item && !isInCart(itemId)) {
        addToCart(item as Product);
      }
    });
    setTimeout(() => {
      setIsLoading(false);
      setSelectedItems([]);
    }, 1000);
  }, [selectedItems, wishListsData, isInCart, addToCart]);

  const removeFromCart = useCallback((itemId: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    dispatch({ type: "REMOVE", id: itemId });
  }, [dispatch]);

  const updateQuantity = useCallback((itemId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
      );
      dispatch({ type: "QTY", id: itemId, qty: newQuantity });
    }
  }, [removeFromCart, dispatch]);

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  // Enhanced sorting and filtering
  const sortedAndFilteredProducts = useMemo(() => {
    let filtered = [...wishListsData];

    // Apply search filter
    if (filters.searchTerm) {
      filtered = filtered.filter((product: WishlistItem) =>
        product.title.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter((product: WishlistItem) => product.category === filters.category);
    }

    // Apply price range filter
    filtered = filtered.filter((product: WishlistItem) =>
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Apply rating filter
    if (filters.ratings?.length > 0) {
      filtered = filtered.filter((product: WishlistItem) =>
        filters.ratings.some((rating: number) => (product.rating || 0) >= rating)
      );
    }

    // Apply sorting
    filtered.sort((a: WishlistItem, b: WishlistItem) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'rating':
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case 'discount':
          aValue = a.discount || 0;
          bValue = b.discount || 0;
          break;
        case 'dateAdded':
          aValue = new Date(a.dateAdded || 0).getTime();
          bValue = new Date(b.dateAdded || 0).getTime();
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [wishListsData, filters, priceRange, sortBy, sortDirection]);

  // Share wishlist functionality
  const shareWishlist = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: 'My Wishlist',
        text: `Check out my wishlist with ${wishListsData.length} amazing products!`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Wishlist link copied to clipboard!');
    }
  }, [wishListsData.length]);

  return (
    <div className="p-0 min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="sticky top-0 z-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-shrink-0">
                <img
                  src="./logoGro.png"
                  className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-md"
                  alt="logo"
                />
                <div className="hidden sm:block">
                  <h1 className="text-lg font-semibold text-gray-900">My Wishlist</h1>
                  <p className="text-sm text-gray-600">{wishListsData.length} items</p>
                </div>
              </div>

              {/* Enhanced Search Bar */}
              <div className="hidden md:flex items-center space-x-4 flex-1 max-w-2xl mx-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search in your wishlist..."
                    className="pl-10 pr-4 w-full py-2 border border-orange-400 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
                    value={filters.searchTerm}
                    onChange={(e) => updateFilter('searchTerm', e.target.value)}
                  />
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex items-center space-x-2">
                {/* Share Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={shareWishlist}
                  className="text-gray-600 hover:text-orange-600"
                >
                  <Share className="h-5 w-5" />
                </Button>

                {/* View Mode Toggle */}
                <div className="hidden md:flex border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                {/* Cart */}
                <AddCardList
                  cartItems={cartItems}
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                  getTotalPrice={getTotalPrice}
                  setCartItems={setCartItems}
                  cartOpen={cartOpen}
                  setCartOpen={setCartOpen}
                />

                {/* Mobile Menu */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>

                {/* Profile */}
                <div className="hidden sm:flex items-center cursor-pointer" onClick={() => router.push('/profile')}>
                  <img
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                    src="https://picsum.photos/200"
                    alt="profile"
                  />
                </div>
              </div>
            </div>

            {/* Mobile Search */}
            <div className="md:hidden mt-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search in your wishlist..."
                  className="pl-10 pr-4 w-full py-2 border border-orange-400 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  value={filters.searchTerm}
                  onChange={(e) => updateFilter('searchTerm', e.target.value)}
                />
              </div>
              <div className="mt-2">
                <LocationSelector />
              </div>
            </div>
          </div>
        </header>

        {/* Enhanced Controls Bar */}
        <div className="bg-white border-b px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Bulk Actions */}
              {selectedItems.length > 0 && (
                <div className="flex items-center space-x-2 bg-orange-50 px-3 py-2 rounded-lg">
                  <span className="text-sm font-medium">{selectedItems.length} selected</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={addAllToCart}
                    disabled={isLoading}
                    className="text-orange-600 border-orange-600"
                  >
                    {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
                    Add to Cart
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleBulkRemove}
                    className="text-red-600 border-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              )}

              {/* Select All */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                className="text-gray-600"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {selectedItems.length === wishListsData.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              {/* Sort Controls */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="text-sm border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="dateAdded">Date Added</option>
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
                  <option value="discount">Discount</option>
                </select>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  className="h-8 w-8"
                >
                  {sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>

              {/* Filter Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="text-gray-600"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                      className="w-20 px-2 py-1 border rounded text-sm"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                      className="w-20 px-2 py-1 border rounded text-sm"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.category || 'all'}
                    onChange={(e) => updateFilter('category', e.target.value)}
                    className="w-full px-2 py-1 border rounded text-sm"
                  >
                    <option value="all">All Categories</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="home">Home & Garden</option>
                    <option value="books">Books</option>
                  </select>
                </div>

                {/* Stock Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                  <select className="w-full px-2 py-1 border rounded text-sm">
                    <option value="all">All Items</option>
                    <option value="inStock">In Stock</option>
                    <option value="outOfStock">Out of Stock</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {sortedAndFilteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filters.searchTerm ? 'No items found' : 'Your wishlist is empty'}
            </h3>
            <p className="text-gray-600 mb-6">
              {filters.searchTerm
                ? 'Try adjusting your search or filters'
                : 'Start adding products to your wishlist to see them here'
              }
            </p>
            <Button
              onClick={() => router.push('/productList')}
              className="bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600"
            >
              Browse Products
            </Button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
              : "space-y-4"
          }>
            {sortedAndFilteredProducts.map((product: Product) => {
              const isSelected = selectedItems.includes(product.id);
              const inCart = isInCart(product.id);
              const cartItem = cartItems.find(item => item.id === product.id);

              return viewMode === 'grid' ? (
                // Grid View
                <div
                  key={product.id}
                  className={`bg-white border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group relative ${isSelected ? 'ring-2 ring-orange-400' : ''
                    }`}
                >
                  {/* Selection Checkbox */}
                  <div className="absolute top-2 left-2 z-10">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {
                        if (isSelected) {
                          setSelectedItems(prev => prev.filter(id => id !== product.id));
                        } else {
                          setSelectedItems(prev => [...prev, product.id]);
                        }
                      }}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                  </div>

                  {/* Product Image */}
                  <Link href={`/products/${product.id}`} className="block relative">
                    <div className="aspect-square bg-gray-100 flex items-center justify-center p-3">
                      <img
                        src={product.images[0]}
                        alt={product?.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    {product?.discount && product?.discount > 0 ? (<div className="absolute top-0 right-0">
                      <div className="bg-[#6e5503] text-white text-xs font-bold px-2 py-1 sm:px-3 sm:py-1 rounded-bl-lg custom-corner">
                        {product.discount}% OFF
                      </div>
                    </div>):null}
                  </Link>

                  {/* Remove from Wishlist */}
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                  >
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                  </button>

                  {/* Product Info */}
                  <div className="p-3">
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-orange-600 text-sm">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Rating */}
                    {product.rating && (
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < Math.floor(product.rating || 0)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                                }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-xs text-gray-600">
                          ({Array.isArray(product.reviews) ? product.reviews.length : 0})
                        </span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stock Status */}
                    {product.inStock === false && (
                      <div className="flex items-center text-red-600 text-sm mb-2">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Out of Stock
                      </div>
                    )}

                    {/* Cart Controls */}
                    {inCart ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-md">
                          <button
                            onClick={() => updateQuantity(product.id, (cartItem?.quantity || 1) - 1)}
                            className="p-1 rounded bg-white/20 hover:bg-white/30"
                            disabled={(cartItem?.quantity || 1) <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="min-w-[24px] text-center text-sm">
                            {cartItem?.quantity || 1}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, (cartItem?.quantity || 1) + 1)}
                            className="p-1 rounded bg-white/20 hover:bg-white/30"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(product as Product)}
                        disabled={product.inStock === false}
                        className="w-full bg-gradient-to-r from-orange-400 to-red-500 text-white py-2 px-4 rounded-lg font-medium hover:from-orange-500 hover:to-red-600 transition-all duration-200 transform hover:scale-105 flex items-center justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {product.inStock === false ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                // List View
                <div
                  key={product.id}
                  className={`bg-white border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 ${isSelected ? 'ring-2 ring-orange-400' : ''
                    }`}
                >
                  <div className="flex items-center space-x-4">
                    {/* Selection Checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {
                        if (isSelected) {
                          setSelectedItems(prev => prev.filter(id => id !== product.id));
                        } else {
                          setSelectedItems(prev => [...prev, product.id]);
                        }
                      }}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />

                    {/* Product Image */}
                    <Link href={`/products/${product.id}`} className="flex-shrink-0">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${product.id}`}>
                        <h3 className="font-medium text-gray-900 hover:text-orange-600 mb-1">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Rating */}
                      {product.rating && (
                        <div className="flex items-center mb-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(product.rating || 0)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            ({Array.isArray(product.reviews) ? product.reviews.length : 0} reviews)
                          </span>
                        </div>
                      )}

                      {/* Price */}
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                        {product.discount && (
                          <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                            {product.discount}% OFF
                          </span>
                        )}
                      </div>

                      {/* Stock Status */}
                      {product.inStock === false && (
                        <div className="flex items-center text-red-600 text-sm">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Out of Stock
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {/* Quick View */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/products/${product.id}`)}
                        className="text-gray-600 hover:text-orange-600"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {/* Cart Controls */}
                      {inCart ? (
                        <div className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-md">
                          <button
                            onClick={() => updateQuantity(product.id, (cartItem?.quantity || 1) - 1)}
                            className="p-1 rounded bg-white/20 hover:bg-white/30"
                            disabled={(cartItem?.quantity || 1) <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="min-w-[24px] text-center text-sm">
                            {cartItem?.quantity || 1}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, (cartItem?.quantity || 1) + 1)}
                            className="p-1 rounded bg-white/20 hover:bg-white/30"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => addToCart(product as Product)}
                          disabled={product.inStock === false}
                          className="bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 disabled:opacity-50"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {product.inStock === false ? 'Out of Stock' : 'Add to Cart'}
                        </Button>
                      )}

                      {/* Remove from Wishlist */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Menu</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Profile in mobile menu */}
              <div
                className="flex items-center space-x-3 mb-6 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  router.push('/profile');
                  setMobileMenuOpen(false);
                }}
              >
                <img className="w-10 h-10 rounded-full" src="https://picsum.photos/200" alt="profile" />
                <div>
                  <p className="font-medium">Your Account</p>
                  <p className="text-sm text-gray-600">Manage your profile</p>
                </div>
              </div>

              {/* Mobile View Mode Toggle */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">View Mode</label>
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="flex-1 rounded-r-none"
                  >
                    <Grid className="h-4 w-4 mr-2" />
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="flex-1 rounded-l-none"
                  >
                    <List className="h-4 w-4 mr-2" />
                    List
                  </Button>
                </div>
              </div>

              {/* Mobile Sort Options */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="dateAdded">Date Added</option>
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
                  <option value="discount">Discount</option>
                </select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  className="mt-2 w-full"
                >
                  {sortDirection === 'asc' ? <SortAsc className="h-4 w-4 mr-2" /> : <SortDesc className="h-4 w-4 mr-2" />}
                  {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
                </Button>
              </div>

              {/* Mobile Filters */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                      className="flex-1 px-2 py-1 border rounded text-sm"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                      className="flex-1 px-2 py-1 border rounded text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.category || 'all'}
                    onChange={(e) => updateFilter('category', e.target.value)}
                    className="w-full px-2 py-1 border rounded text-sm"
                  >
                    <option value="all">All Categories</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="home">Home & Garden</option>
                    <option value="books">Books</option>
                  </select>
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="mt-6 space-y-2">
                <Button
                  onClick={shareWishlist}
                  variant="outline"
                  className="w-full"
                >
                  <Share className="h-4 w-4 mr-2" />
                  Share Wishlist
                </Button>

                {selectedItems.length > 0 && (
                  <>
                    <Button
                      onClick={addAllToCart}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-orange-400 to-red-500"
                    >
                      {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <ShoppingCart className="h-4 w-4 mr-2" />}
                      Add Selected to Cart ({selectedItems.length})
                    </Button>
                    <Button
                      onClick={handleBulkRemove}
                      variant="outline"
                      className="w-full text-red-600 border-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Selected ({selectedItems.length})
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Address Modal */}
      {addressOpen && (
        <AddressModal
          isOpen={addressOpen}
          onClose={() => setAddressOpen(false)}
        />
      )}

      {/* Success Toast (you can replace this with a proper toast library) */}
      {isLoading && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <div className="flex items-center">
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Adding items to cart...
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;