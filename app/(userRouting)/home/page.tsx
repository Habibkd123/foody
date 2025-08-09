'use client'

import AnnouncementBar from "@/components/AnnouncementBar";
import HeroSlider from "@/components/ui/HeroSlider";
import { useRouter } from "next/navigation";
import { useFilterContext } from "@/context/FilterContext";
import { useWishListContext } from "@/context/WishListsContext";
import LocationSelector from "@/components/LocationSelector";
import Link from "next/link";
import NavbarFilter from "@/components/NavbarFilter";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Search, Heart, ShoppingCart, Menu, X, Filter, Star, ChevronUp, Bell, Settings, User, LogOut, ChevronDown, MapPin, ArrowRight, Plus, Minus, Eye, TrendingUp, Clock, Truck } from 'lucide-react';

// Mock data and types
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  discount?: number;
  inStock: boolean;
  isOrganic?: boolean;
  deliveryTime: string;
  unit: string;
}


// Mock product data
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Organic Basmati Rice",
    price: 299,
    originalPrice: 349,
    rating: 4.5,
    reviews: 1250,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop",
    category: "Atta, Rice & Dal",
    discount: 14,
    inStock: true,
    isOrganic: true,
    deliveryTime: "30 mins",
    unit: "1 kg"
  },
  {
    id: "2",
    name: "Cold Pressed Mustard Oil",
    price: 450,
    originalPrice: 520,
    rating: 4.3,
    reviews: 890,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&h=200&fit=crop",
    category: "Cooking Oil",
    discount: 13,
    inStock: true,
    deliveryTime: "45 mins",
    unit: "1 litre"
  },
  {
    id: "3",
    name: "Pure Desi Ghee",
    price: 650,
    originalPrice: 750,
    rating: 4.7,
    reviews: 2100,
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200&h=200&fit=crop",
    category: "Ghee & Vanaspati",
    discount: 13,
    inStock: true,
    deliveryTime: "30 mins",
    unit: "500g"
  },
  {
    id: "4",
    name: "Fresh Red Apples",
    price: 180,
    rating: 4.2,
    reviews: 567,
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop",
    category: "Fruits & Vegetables",
    inStock: true,
    deliveryTime: "25 mins",
    unit: "1 kg"
  }
];

const categoryData: CategorySectionType[] = [
  {
    id:1,
    title: "Grocery & Kitchen",
    items: [
      {id:9, label: "Atta, Rice & Dal", img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&h=100&fit=crop", productCount: 245 },
      { id:10,label: "Cooking Oil", img: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=100&h=100&fit=crop", productCount: 89 },
      { id:11,label: "Ghee & Vanaspati", img: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=100&h=100&fit=crop", productCount: 67 },
      { id:12,label: "Masala & Spices", img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=100&h=100&fit=crop", productCount: 156 },
      {id:13, label: "Fruits & Vegetables", img: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=100&h=100&fit=crop", productCount: 298 },
      { id:14,label: "Dairy, Bread & Eggs", img: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=100&h=100&fit=crop", productCount: 134 },
      { id:15,label: "Dry Fruits", img: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop", productCount: 78 },
      { id:16,label: "Organic Food", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&h=100&fit=crop", productCount: 189 },
    ],
  },
  {
    id:2,
    title: "Snacks & Drinks",
    items: [
      {id:1, label: "Biscuits & Cookies", img: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=100&h=100&fit=crop", productCount: 123 },
      {id:2, label: "Breakfast Cereals", img: "https://images.unsplash.com/photo-1574483264252-809cbda49c13?w=100&h=100&fit=crop", productCount: 45 },
      {id:3, label: "Pasta & Noodles", img: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=100&h=100&fit=crop", productCount: 67 },
      {id:4, label: "Jams & Spreads", img: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=100&h=100&fit=crop", productCount: 34 },
      {id:5, label: "Sweets & Chocolates", img: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=100&h=100&fit=crop", productCount: 156 },
      {id:6, label: "Chips & Namkeens", img: "https://images.unsplash.com/photo-1613919113640-25732ec5e61f?w=100&h=100&fit=crop", productCount: 89 },
      {id:7, label: "Drinks & Juices", img: "https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=100&h=100&fit=crop", productCount: 234 },
      {id:8, label: "Tea, Coffee & Beverages", img: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=100&h=100&fit=crop", productCount: 167 },
    ],
  },
];
// types.ts
export interface CategoryItem {
    label: string;
    img: string;
}
export interface CategorySectionType {
    title: string;
    items: CategoryItem[];
}


const ProductCard = ({ product }: { product: Product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div
      className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden group ${
        isHovered ? 'scale-105 shadow-2xl' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`products/${product?.id}`}>
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-48 object-cover transition-transform duration-700 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-bounce">
            {product.discount}% OFF
          </div>
        )}
        
        {/* Organic Badge */}
        {product.isOrganic && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            ORGANIC
          </div>
        )}
        
        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
            product.isOrganic ? 'top-12' : ''
          } ${
            isWishlisted
              ? 'bg-red-500 text-white scale-110'
              : 'bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
        
        {/* Quick View */}
        <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>Quick View</span>
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
            {product.category}
          </span>
          <div className="flex items-center space-x-1">
            <Truck className="w-3 h-3 text-green-600" />
            <span className="text-xs text-green-600 font-medium">{product.deliveryTime}</span>
          </div>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center space-x-1 mb-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
            )}
          </div>
          <span className="text-xs text-gray-500">{product.unit}</span>
        </div>
        
        {quantity === 0 ? (
          <button
            onClick={() => setQuantity(1)}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center space-x-2 group"
          >
            <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Add to Cart</span>
          </button>
        ) : (
          <div className="flex items-center justify-between bg-orange-100 rounded-lg p-2">
            <button
              onClick={() => setQuantity(Math.max(0, quantity - 1))}
              className="bg-white text-orange-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-orange-200 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-medium text-orange-800">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="bg-white text-orange-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-orange-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      </Link>
    </div>
  );
};

const CategorySection = ({ section }: { section: CategorySectionType }) => (
  <div className="mb-12">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
       <Link href={`/productList`}  className="text-orange-600 hover:text-orange-700 font-medium flex items-center space-x-1 group transition-colors">
        <span>View All</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
    
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
      {section.items.map((item, idx) => (
        <div
          key={idx}
          className="group bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:border-orange-200"
        >
           <Link href={`/products/${item.id}`}>
          <div className="relative overflow-hidden rounded-lg mb-3">
            <img
              src={item.img}
              alt={item.label}
              className="w-full h-20 sm:h-24 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          <div className="text-center">
            <h3 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-orange-600 transition-colors line-clamp-2">
              {item.label}
            </h3>
            <p className="text-xs text-gray-500">{item.productCount} items</p>
          </div>
          </Link>
        </div>
      ))}
    </div>
  </div>
);



const HomePage: React.FC = () => {
    const router = useRouter();
    const { filters, updateFilter } = useFilterContext();
    const { wishListsData, setWistListsData } = useWishListContext();

    // Enhanced UI states
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [cartAnimation, setCartAnimation] = useState(false);
    const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);

    // Scroll to top functionality
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

    const handleLogout = () => {
        localStorage.removeItem("G-user");
        localStorage.removeItem("token");
        window.location.reload();
    };

    return (
        <>
          <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 relative">
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
                            <div className="hidden md:flex items-center space-x-4 flex-1 max-w-2xl mx-0 relative" style={{ marginLeft: "140px" }}>
                                <div className="relative flex-1">
                                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors duration-300 ${searchFocused ? 'text-orange-600' : 'text-orange-400'
                                        }`} />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        className={`pl-10 pr-4 w-full py-2 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-orange-400 focus:outline-none ${searchFocused ? 'border-orange-500 shadow-lg' : 'border-orange-400'
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
                                            <button onClick={() => router.push("/profile")} className="w-full px-4 py-2 text-left hover:bg-orange-50 transition-colors duration-200 flex items-center space-x-2">
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
                            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors duration-300 ${searchFocused ? 'text-orange-600' : 'text-orange-400'
                                }`} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className={`pl-10 pr-4 w-full py-2 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-orange-400 focus:outline-none ${searchFocused ? 'border-orange-500 shadow-lg' : 'border-orange-400'
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
                </header>

                {/* Navigation Filter */}
                <div className="hidden md:block">
                    <NavbarFilter />
                </div>
            </div>


            <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40 z-10"></div>
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                >

                    <HeroSlider />
                </div>
            </section>
            <div className="max-w-7xl mx-auto px-4 py-6">

                {categoryData.map((section, idx) => (
                    <CategorySection section={section} key={idx} />
                ))}
            </div>

             {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Products Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
              <p className="text-gray-600">Handpicked favorites just for you</p>
            </div>
            <button onClick={()=>router.push("/productList")} className="hidden sm:flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium group transition-colors">
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div className="space-y-12">
          {categoryData.map((section, idx) => (
            <CategorySection section={section} key={idx} />
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">50K+</div>
              <div className="text-orange-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">10K+</div>
              <div className="text-orange-100">Products</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">30min</div>
              <div className="text-orange-100">Avg Delivery</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">4.8★</div>
              <div className="text-orange-100">Customer Rating</div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h3>
          <p className="text-gray-600 mb-6">Get notified about new products, offers, and more!</p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
            <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-r-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  G
                </div>
                <h3 className="text-xl font-bold">Gro-Delivery</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Fresh groceries delivered to your doorstep. Quality products, quick delivery, happy customers.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">About Us</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Contact</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">FAQs</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Support</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Categories</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Fruits & Vegetables</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Dairy Products</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Snacks & Beverages</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Personal Care</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-400">
                <p>📞 +91 98765 43210</p>
                <p>📧 info@gro-delivery.com</p>
                <p>📍 Jaipur, Rajasthan</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Gro-Delivery. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-red-500 text-white w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 z-50 animate-bounce"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}

            </div>

        </>
    );
}

export default HomePage;
