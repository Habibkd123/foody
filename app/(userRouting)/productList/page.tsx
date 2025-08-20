
"use client";

import React, { useState, createContext, useContext, ReactNode, useEffect,useCallback  } from 'react';
import NavbarFilter from "@/components/NavbarFilter";
import ProductCardGrid from "@/components/ProductGrid";
import SidebarFilters from "@/components/SidebarFilters";

import { Search, Heart, ShoppingCart, Menu, X, Filter, Star, ChevronUp, Bell, Settings, User, LogOut } from 'lucide-react';
import { useFilterContext } from "@/context/FilterContext";
import { useWishListContext } from "@/context/WishListsContext";
import AnnouncementBar from "@/components/AnnouncementBar";
import LocationSelector from "@/components/LocationSelector";
import Link from "next/link";
import AddCardList from "@/components/AddCards";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCartOrder, useOrder } from "@/context/OrderContext";
import { ProductsContext, useProductsContext } from "@/context/AllProductContext";
import { Product } from "@/types/global";
import { productData } from "@/lib/Data";
import { useAuthStorage } from '@/hooks/useAuth';

// Type Definitions
interface CartItem extends Product {
  quantity: number;
}

interface CartLine {
  id: number;
  quantity: number;
  [key: string]: any;
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

interface Filter {
  categories: Category[];
  priceRanges: PriceRange[];
}

// Animation variants for smooth transitions
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

const slideIn = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.4 }
};

   // static fallback product
        const fallbackProduct = {
            id: 16,
            name: 'Better Nutrition Biofortified Rice (Medium Grain)',
            price: 213,
            originalPrice: 400,
            images: [
                'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/1c01d181-b2dd-4633-95a2-746fa3f78117.png',
                'https://picsum.photos/600/600?random=17a',
                'https://picsum.photos/600/600?random=17b',
                'https://picsum.photos/600/600?random=17c'
            ],
            rating: 4.6,
            totalReviews: 187,
            category: 'rice',
            discount: 20,
            description:
                'Better Nutrition Biofortified Rice (Medium Grain) is a perfect blend of aromatic spices...',
            features: [
                'Biofortified with essential nutrients',
                'Medium grain rice',
                'Perfect for daily use',
                'Rich in aroma',
                'Easy to cook'
            ],
            specifications: {
                Weight: '1kg',
                Brand: 'Better Nutrition',
                Type: 'Biofortified Rice',
                'Shelf Life': '12 months',
                Storage: 'Cool & Dry Place',
                'Nutritional Benefits': 'Enriched with vitamins and minerals'
            },
            inStock: true,
            stockCount: 75,
            brand: 'Maggi',
            sku: 'MGI-SMM-001',
            weight: '80g',
            dimensions: '12cm x 8cm x 3cm',
            reviews: [
                {
                    id: 1,
                    userName: 'Sunita Devi',
                    rating: 5,
                    comment: 'Excellent masala! Makes vegetables taste amazing.',
                    date: '3 days ago',
                    verified: true,
                    helpful: 15,
                },
                {
                    id: 2,
                    userName: 'Amit Singh',
                    rating: 4,
                    comment: 'Good quality spice mix. Value for money.',
                    date: '1 week ago',
                    verified: true,
                    helpful: 8,
                },
                {
                    id: 3,
                    userName: 'Ramesh Gupta',
                    rating: 5,
                    comment: 'Excellent rice! The perfect blend of taste and nutrition.',
                    date: '2 days ago',
                    verified: true,
                    helpful: 20,
                },
            ],
        };
// Main Product Grid Component
const ProductGrid: React.FC = () => {
  const router = useRouter();
  const { filters, updateFilter } = useFilterContext();
  const { wishListsData, setWistListsData } = useWishListContext();
  const { productsData, setProductsData } = useProductsContext();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const { dispatch, state } = useOrder();
 const { addToCart, loading, error } = useCartOrder();
   const {user}=useAuthStorage()
  // Enhanced UI states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [filterAnimation, setFilterAnimation] = useState(false);
  const [cartAnimation, setCartAnimation] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
const [products,setProducts]=useState<Product[]>([]);
  // Enhanced loading and data management
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setProductsData(productData);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Search suggestions
  useEffect(() => {
    if (filters.searchTerm && filters.searchTerm.length > 1) {
      const suggestions = productData
        .filter(product => 
          product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(filters.searchTerm.toLowerCase())
        )
        .slice(0, 5)
        .map(product => product.name);
      setSearchSuggestions(suggestions);
    } else {
      setSearchSuggestions([]);
    }
  }, [filters.searchTerm]);

  // Enhanced filtering with animation trigger
  const filteredProducts: Product[] = productData.filter((product: Product) => {
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

  // Enhanced wishlist toggle with animation
  const toggleWishlist = (item: any) => {
    const exists = wishListsData.find((fav: any) => fav.id === item.id);
    if (exists) {
      setWistListsData(wishListsData.filter((fav: any) => fav.id !== item.id));
    } else {
      setWistListsData([...wishListsData, item]);
      // Add pulse animation to wishlist icon
      const wishlistIcon = document.querySelector(`[data-wishlist-${item.id}]`);
      if (wishlistIcon) {
        wishlistIcon.classList.add('animate-pulse');
        setTimeout(() => wishlistIcon.classList.remove('animate-pulse'), 600);
      }
    }
  };

  // Enhanced add to cart with animation and better state management
  const handleAddToCart  = useCallback(async(item: Product, quantity: number = 1) => {
    // setCartAnimation(true);
    // setTimeout(() => setCartAnimation(false), 600);

    // const existingItem = cartItems.find((cartItem: CartItem) => cartItem.id === item.id);
    // if (existingItem) {
    //   const newQuantity = existingItem.quantity + quantity;
    //   setCartItems(
    //     cartItems.map((cartItem: CartItem) =>
    //       cartItem.id === item.id
    //         ? { ...cartItem, quantity: newQuantity }
    //         : cartItem
    //     )
    //   );
    //   dispatch({ type: "QTY", id: item.id, qty: newQuantity });
    // } else {
    //   const newItem = { ...item, quantity };
    //   setCartItems([...cartItems, newItem]);
    //   dispatch({ type: "ADD", item: newItem });
    // }
   if (!user?.id) return;
    
    const cartItem:any = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.images[0],
    };

    await addToCart(user.id, cartItem);
  }, [cartItems, dispatch]);

  const removeFromCart = useCallback((itemId: any) => {
    setCartItems(cartItems.filter((item: any) => item.id !== itemId));
    dispatch({ type: "REMOVE", id: itemId });
  }, [cartItems, dispatch]);

  // Enhanced quantity update that syncs with all states
  const updateQuantity = useCallback((itemId: string, change: number) => {
    const productId = parseInt(itemId);
    const currentItem = state.items.find((item: CartLine) => item.id === productId);
    
    if (currentItem) {
      const newQuantity = Math.max(0, currentItem.quantity + change);
      
      if (newQuantity === 0) {
        // Remove item if quantity becomes 0
        setCartItems(cartItems.filter((item: any) => item.id !== productId));
        dispatch({ type: "REMOVE", id: productId });
      } else {
        // Update quantity in both local state and global state
        setCartItems(cartItems.map((item: any) => 
          item.id === productId ? { ...item, quantity: newQuantity } : item
        ));
        dispatch({ type: "QTY", id: productId, qty: newQuantity });
      }
    }
  }, [cartItems, dispatch, state.items]);

  // Check if product is in cart
  const isInCart = useCallback((product: Product) => {
    return state.items.some((item: CartLine) => item.id === product.id);
  }, [state.items]);

  // Get cart quantity for a product
  const getCartQuantity = useCallback((product: Product) => {
    const cartItem = state.items.find((item: CartLine) => item.id === product.id);
    return cartItem ? cartItem.quantity : 0;
  }, [state.items]);

  const getTotalPrice = () => {
    return cartItems.reduce((total: any, item: any) => total + item.price * item.quantity, 0);
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilterAnimation(true);
    updateFilter('category', 'all');
    updateFilter('priceRanges', []);
    updateFilter('ratings', []);
    updateFilter('searchTerm', '');
    setTimeout(() => setFilterAnimation(false), 300);
  };
const handleLogout = () => {
    localStorage.removeItem("G-user");
    localStorage.removeItem("token");
    window.location.reload();
  };

  const fetchProducts = async () => {
    try {
        const response = await fetch(`/api/auth/products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        console.log('Categories response:', data);

     

        if (data?.success && data?.product) {
            // agar API se product mila toh use karo
            setProducts((prev: any) => [...prev, data.product]);
        } else {
            // warna static fallback product
            setProducts((prev: any) => [...prev, fallbackProduct]);
        }
    } catch (error) {
        console.error('Error fetching categories:', error);

        // agar fetch hi fail ho gaya toh bhi fallback dikhana
        setProducts((prev: any) => [...prev, fallbackProduct]);
    }
};
  useEffect(() => {
    fetchProducts();
  }, []);
        console.log('products response:', products);


  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 relative">
      {/* Enhanced Header with animations */}
      <div className='sticky top-0 z-40'>
        <AnnouncementBar />
      </div>
      
      <div className="sticky top-0 z-50 backdrop-blur-md bg-white/90 shadow-lg border-b border-orange-100">
        <header className="transition-all duration-300">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 border-b-1">
            <div className="flex items-center justify-between">
              {/* Enhanced Logo with hover animation */}
              <div className="flex items-center gap-2 flex-shrink-0 group">
                <img 
                  src="./logoGro.png" 
                  className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" 
                  alt="logo" 
                />
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent hover:from-orange-500 hover:via-red-600 hover:to-pink-600 transition-all duration-300">
                  Gro-Delivery
                </h1>
              </div>

              {/* Enhanced Search Bar with suggestions */}
              <div className="hidden md:flex items-center space-x-4 flex-1 max-w-2xl mx-0 relative" style={{marginLeft:"140px"}}>
                <div className="relative flex-1">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors duration-300 ${
                    searchFocused ? 'text-orange-600' : 'text-orange-400'
                  }`} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className={`pl-10 pr-4 w-full py-2 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-orange-400 focus:outline-none ${
                      searchFocused ? 'border-orange-500 shadow-lg' : 'border-orange-400'
                    }`}
                    value={filters.searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateFilter('searchTerm', e.target.value)
                    }
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  />
                  
                  {/* Search Suggestions */}
                  {searchFocused && searchSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white shadow-xl rounded-lg mt-1 border border-orange-200 z-50 max-h-60 overflow-y-auto">
                      {searchSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-orange-50 cursor-pointer transition-colors duration-200"
                          onClick={() => {
                            updateFilter('searchTerm', suggestion);
                            setSearchFocused(false);
                          }}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="z-50">
                  <LocationSelector />
                </div>
              </div>

              {/* Enhanced Right side icons */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Notifications */}
                <div className="relative">
                  <button 
                    className="relative p-2 hover:bg-orange-100 rounded-lg transition-all duration-300 hover:scale-110"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full animate-pulse">
                      3
                    </span>
                  </button>
                  
                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white shadow-xl rounded-lg border border-orange-200 z-50 animate-in slide-in-from-top-5 duration-300">
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 mb-3">Notifications</h3>
                        <div className="space-y-3">
                          <div className="p-3 bg-orange-50 rounded-lg">
                            <p className="text-sm font-medium">Order Delivered!</p>
                            <p className="text-xs text-gray-600">Your order #1234 has been delivered</p>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg">
                            <p className="text-sm font-medium">New Discount Available</p>
                            <p className="text-xs text-gray-600">Get 20% off on fresh fruits</p>
                          </div>
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm font-medium">Restock Alert</p>
                            <p className="text-xs text-gray-600">Your favorite items are back in stock</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhanced Wishlist */}
                <button className="relative p-2 hover:bg-orange-100 rounded-lg transition-all duration-300 hover:scale-110 group">
                  <Link href="/wishlist">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 group-hover:text-red-500 transition-colors duration-300" />
                    {wishListsData.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full animate-bounce">
                        {wishListsData.length}
                      </span>
                    )}
                  </Link>
                </button>

                {/* Enhanced Cart */}
                <div className="flex items-center space-x-2 relative z-[120px]">
                  <div className={`transition-transform duration-300 ${cartAnimation ? 'scale-110' : 'scale-100'}`}>
                    <AddCardList 
                      cartItems={cartItems} 
                      removeFromCart={removeFromCart} 
                      updateQuantity={(itemId: any, newQuantity: any) => {
                        if (newQuantity === 0) {
                          removeFromCart(itemId);
                        } else {
                          const change = newQuantity - getCartQuantity({ id: itemId } as Product);
                          updateQuantity(itemId.toString(), change);
                        }
                      }}
                      getTotalPrice={getTotalPrice} 
                      setCartItems={setCartItems} 
                      cartOpen={cartOpen} 
                      setCartOpen={setCartOpen} 
                    />
                  </div>
                  
                  {/* Enhanced Mobile Menu Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-gray-700 hover:bg-orange-100 transition-all duration-300"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  >
                    <div className="relative">
                      <Menu className={`h-5 w-5 transition-all duration-300 ${mobileMenuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`} />
                      <X className={`h-5 w-5 absolute top-0 left-0 transition-all duration-300 ${mobileMenuOpen ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'}`} />
                    </div>
                  </Button>
                </div>

                {/* Enhanced Profile with dropdown */}
                <div className="hidden sm:flex items-center relative">
                  <div 
                    className="cursor-pointer group" 
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  >
                    <img 
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-orange-300 group-hover:border-orange-500 transition-all duration-300 group-hover:scale-110" 
                      src="https://picsum.photos/200" 
                      alt="profile" 
                    />
                  </div>
                  
                  {/* Profile Dropdown */}
                  {profileMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-xl rounded-lg border border-orange-200 z-50 animate-in slide-in-from-top-5 duration-300">
                      <div className="py-2">
                        <button className="w-full px-4 py-2 text-left hover:bg-orange-50 transition-colors duration-200 flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </button>
                        <button onClick={()=>router.push("/profile")} className="w-full px-4 py-2 text-left hover:bg-orange-50 transition-colors duration-200 flex items-center space-x-2">
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </button>
                        <hr className="my-2" />
                        <button onClick={handleLogout} className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 transition-colors duration-200 flex items-center space-x-2">
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Mobile Search Bar */}
            <div className="md:hidden mt-3">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors duration-300 ${
                  searchFocused ? 'text-orange-600' : 'text-orange-400'
                }`} />
                <input
                  type="text"
                  placeholder="Search products..."
                  className={`pl-10 pr-4 w-full py-2 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-orange-400 focus:outline-none ${
                    searchFocused ? 'border-orange-500 shadow-lg' : 'border-orange-400'
                  }`}
                  value={filters.searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateFilter('searchTerm', e.target.value)
                  }
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
              </div>
              <div className="mt-2">
                <LocationSelector />
              </div>
            </div>
          </div>
        </header>
        
        {/* Navigation Filter */}
        <div className="hidden md:block">
          <NavbarFilter />
        </div>
      </div>

      {/* Enhanced Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden animate-in fade-in duration-300">
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg overflow-y-auto animate-in slide-in-from-right duration-400">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Menu</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:bg-orange-100 transition-colors duration-300"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Enhanced Profile in mobile menu */}
              <div className="flex items-center space-x-3 mb-6 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg hover:shadow-md transition-shadow duration-300" onClick={() => router.push('/profile')}>
                <img className="w-10 h-10 rounded-full border-2 border-orange-300" src="https://picsum.photos/200" alt="profile" />
                <div>
                  <p className="font-medium">Your Account</p>
                  <p className="text-sm text-gray-600">Manage your profile</p>
                </div>
              </div>

              {/* Mobile Filters */}
              <div className="mt-6">
                <SidebarFilters />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading fresh products...</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-2 sm:px-4 lg:px-6 py-2">
        <div className="flex gap-2 lg:gap-6">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block">
            <SidebarFilters />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Enhanced Header with animations */}
            <div className="mb-4 lg:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <h2 className={`text-xl sm:text-2xl font-bold text-gray-800 transition-all duration-300 ${
                  filterAnimation ? 'scale-105' : 'scale-100'
                }`}>
                  Fresh Groceries ({filteredProducts.length} products)
                </h2>
                {filteredProducts.length === 0 && (
                  <p className="text-gray-500 animate-pulse">No products found. Try adjusting your filters.</p>
                )}
              </div>
              
              {/* Enhanced Filter tags */}
              <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                {(filters.category !== 'all' || filters.priceRanges.length > 0 || filters.ratings.length > 0) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                    className="hover:bg-red-50 hover:border-red-300 transition-all duration-300"
                  >
                    Clear All
                  </Button>
                )}
                
                {filters.category !== 'all' && (
                  <span className="bg-orange-100 text-orange-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm animate-in slide-in-from-left duration-300">
                    Category: {filters.category}
                  </span>
                )}
                {filters.priceRanges.length > 0 && (
                  <span className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm animate-in slide-in-from-left duration-300 delay-100">
                    Price filters applied
                  </span>
                )}
                {filters.ratings.length > 0 && (
                  <span className="bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm animate-in slide-in-from-left duration-300 delay-200">
                    Rating filters applied
                  </span>
                )}
              </div>
            </div>

            {/* Enhanced Mobile Filter Button */}
            <div className="lg:hidden mb-4">
              <Button
                variant="outline"
                className="w-full sm:w-auto hover:bg-orange-50 hover:border-orange-300 transition-all duration-300 hover:shadow-md"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters & Categories
              </Button>
            </div>

            {/* Product Grid with enhanced loading state */}
            <div className={`transition-all duration-500 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
              <ProductCardGrid
                isLoading={isLoading}
                isInCart={isInCart}
                getCartQuantity={getCartQuantity}
                updateQuantity={updateQuantity}
                productLists={filteredProducts}
                onAddToCart={handleAddToCart}
                onToggleWishlist={toggleWishlist}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-40 animate-in slide-in-from-bottom duration-300"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}

      {/* Quick Actions Floating Menu */}
      <div className="fixed bottom-20 right-6 space-y-3 z-30">
        {/* Quick Cart Access */}
        {cartItems.length > 0 && (
          <button
            onClick={() => setCartOpen(true)}
            className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-bounce"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Background click handler for dropdowns */}
      {(profileMenuOpen || showNotifications) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setProfileMenuOpen(false);
            setShowNotifications(false);
          }}
        />
      )}
    </div>
  );
};

export default ProductGrid;