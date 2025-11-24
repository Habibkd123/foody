'use client'

import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import HeroSlider from "@/components/ui/HeroSlider";
import { useRouter } from "next/navigation";
import { useFilterContext } from "@/context/FilterContext";
import { useWishListContext } from "@/context/WishListsContext";
import LocationSelector from "@/components/LocationSelector";
import Link from "next/link";
import NavbarFilter from "@/components/NavbarFilter";
import { Search, Heart, ShoppingCart, Menu, X, Filter, Star, ChevronUp, Bell, Settings, User, LogOut, ChevronDown, MapPin, ArrowRight, Plus, Minus, Eye, TrendingUp, Clock, Truck } from 'lucide-react';
import { useAuthStorage } from "@/hooks/useAuth";
import NotificationCenter from "@/components/NotificationCenter";


// types.ts
export interface CategoryItem {
  label: string;
  img: string;
}
export interface CategorySectionType {
  title: string;
  items: CategoryItem[];
}




const CategorySectionSkeleton = () => {
  return (
    <div className="mb-12 animate-pulse">
      <div className="flex justify-between items-center mb-6">
        <div className="h-7 w-40 bg-gray-200 rounded shadow-sm" />
        <div className="h-5 w-24 bg-gray-200 rounded shadow-sm" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="relative overflow-hidden rounded-lg mb-3">
              <div className="w-full h-20 sm:h-24 bg-gray-200 rounded-lg shadow-sm" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4 shadow-sm" />
              <div className="h-4 bg-gray-100 rounded w-1/2 shadow-sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const CategorySection = ({ section }: { section: any }) => {
  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{section?.name}</h2>
        <Link href={`/productlist`} className="text-orange-600 hover:text-orange-700 font-medium flex items-center space-x-1 group transition-colors">
          <span>View All</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {Array.isArray(section.products) && section.products.length > 0 ? (
          section.products.map((item:any, idx:any) => (
            <div
              key={idx}
              className="group bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:border-orange-200"
            >
              {/* @ts-ignore */}
              <Link href={`/products/${item._id}`}>
                <div className="relative overflow-hidden rounded-lg mb-3">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-20 sm:h-24 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {item.name}
                  </h3>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="col-span-full text-gray-400 text-center py-8">No products in this category.</div>
        )}
      </div>
    </div>
  );
}



const HomePage: React.FC = () => {
  const router = useRouter();
  const { filters, updateFilter } = useFilterContext();
  const { wishListsData, setWistListsData } = useWishListContext();
  const { user, setUser, updateUser, logout } = useAuthStorage();
  // Enhanced UI states
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [categories, setCategories] = useState<CategorySectionType[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);
  const [categoriesError, setCategoriesError] = useState<boolean>(false);

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    setCategoriesError(false);
    try {
      const response = await fetch('/api/categories/productcategory');
      const data = await response.json();
      console.log('Categories response:', data.data);

      if (data?.success && Array.isArray(data?.data)) {
        setCategories(data.data as any);
      } else {
        setCategories([]);
        setCategoriesError(true);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
      setCategoriesError(true);
    } finally {
      setCategoriesLoading(false);
    }
  };    // Scroll to top functionality

  useEffect(() => {
    fetchCategories();
  }, []);
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
    logout();
    window.location.reload();
  };
// console.log("Categories:", categories?.length);
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 relative">
        <div className="min-h-screen bg-gray-50">
        {/* Announcement Bar */}
        <AnnouncementBar />

        <div className="sticky top-0 z-50 backdrop-blur-md bg-background/90 shadow-soft border-b border-border">
          <header className="transition-all duration-300">
            <div className="max-w-8xl mx-auto px-2 sm:px-4 lg:px-6 py-2 border-b-1">
              <div className="flex items-center justify-between">
                {/* Enhanced Logo with hover animation */}
                <div className="flex items-center gap-2 flex-shrink-0 group max-w-8xl">
                  <img
                    src="./logoGro.png"
                    className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                    alt="logo"
                  />
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary transition-all duration-300">
                    Gro-Delivery
                  </h1>
                </div>

                {/* Enhanced Search Bar with suggestions */}
                <div className="hidden md:flex items-center space-x-4 flex-1 max-w-6xl mx-0 relative" style={{ marginLeft: "140px" }}>
                  <div className="relative flex-1 z-50">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors duration-300 ${searchFocused ? 'text-primary' : 'text-muted-foreground'}` } />
                    <input
                      type="text"
                      placeholder="Search products..."
                      className={`pl-10 pr-4 w-full py-2 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-primary focus:outline-none ${searchFocused ? 'border-primary shadow-soft' : 'border-border'}`}
                      value={filters.searchTerm}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateFilter('searchTerm', e.target.value)
                      }
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                    />

                    {/* Search Suggestions */}
                    {searchFocused && searchSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-card shadow-soft-lg rounded-lg mt-1 border border-border z-50 max-h-60 overflow-y-auto">
                        {searchSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 hover:bg-secondary cursor-pointer transition-colors duration-200"
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




                {/* Right side - Actions */}
                <div className="flex items-center space-x-3">

                  {/* Dynamic Notification Center */}
                  {user?._id && <NotificationCenter location="home" />}
                  {/* Enhanced Wishlist */}
                  <button className="relative p-2 hover:bg-secondary rounded-lg transition-all duration-300 hover:scale-110 group">
                    <Link href="/wishlist">
                      <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-primary group-hover:text-primary transition-colors duration-300" />
                      {wishListsData&&wishListsData.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full animate-bounce">
                          {wishListsData.length}
                        </span>
                      )}
                    </Link>
                  </button>


                </div>


                <div className="hidden sm:flex items-center relative">
                  <div
                    className="cursor-pointer group"
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  >
                    <img
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-border group-hover:border-primary transition-all duration-300 group-hover:scale-110"
                      src="https://picsum.photos/200"
                      alt="profile"
                    />
                  </div>

                  {/* Profile Dropdown */}
                  {profileMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-card shadow-soft-lg rounded-lg border border-border z-50 animate-in slide-in-from-top-5 duration-300">
                      <div className="py-2">
                        <button className="w-full px-4 py-2 text-left hover:bg-secondary transition-colors duration-200 flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </button>
                        <button onClick={() => router.push("/profile")} className="w-full px-4 py-2 text-left hover:bg-secondary transition-colors duration-200 flex items-center space-x-2">
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </button>
                        <hr className="my-2" />
                        <button onClick={handleLogout} className="w-full px-4 py-2 text-left hover:bg-secondary text-foreground transition-colors duration-200 flex items-center space-x-2">
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

            <HeroSlider type="Home" />
          </div>
        </section>
        <div className="max-w-8xl mx-auto px-6 py-6">
          {categoriesLoading ? (
            <>
              <CategorySectionSkeleton />
              <CategorySectionSkeleton />
              <CategorySectionSkeleton />
            </>
          ) : categories && categories.length > 0 ? (
            categories.map((section, idx) => (
              // @ts-ignore
              <CategorySection section={section} key={idx} />
            ))
          ) : (
            <>
              {categoriesError ? (
                <>
                  <CategorySectionSkeleton />
                  <div className="text-center text-gray-400 py-6">Unable to load categories right now.</div>
                </>
              ) : (
                <div className="text-center text-gray-400 py-12">No categories available.</div>
              )}
            </>
          )}
        </div>

        {/* <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        </div> */}

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
      </div>
    </>
  );
}

export default HomePage;
