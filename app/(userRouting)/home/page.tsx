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
import AppHeader from "@/components/ui/AppHeader";
import NotificationBanner from "@/components/NotificationBanner";
import AddCardList from "@/components/AddCards";
import { useCartOrder, useOrder } from "@/context/OrderContext";
import { Product } from "@/types/global";


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
        <Link href={{ pathname: '/productlist', query: { category: section?.name } }} className="text-orange-600 hover:text-orange-700 font-medium flex items-center space-x-1 group transition-colors">
          <span>View All</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {Array.isArray(section.products) && section.products.length > 0 ? (
          section.products.map((item: any, idx: any) => (
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
  // Cart state (for header dropdown)
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartAnimation, setCartAnimation] = useState(false);
  const { dispatch, state } = useOrder();
  const { addToCart, removeFromCart, updateQuantity } = useCartOrder();

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

  // Cart helpers (match usage from Product List header)
  const removeFromCart1 = useCallback((itemId: any) => {
    try {
      const response: any = removeFromCart(user?._id, itemId);
      if (response?.success) {
        // no-op UI
      }
    } catch { }
  }, [removeFromCart, user?._id]);

  const updateQuantity1 = useCallback((itemId: string, change: number) => {
    const productId = parseInt(itemId);
    const currentItem = state.items.find((item: any) => item._id === productId || item.id === productId);
    if (currentItem) {
      const newQuantity = Math.max(0, (currentItem.quantity || 0) + change);
      if (newQuantity === 0) {
        setCartItems((prev) => prev.filter((it: any) => (it._id ?? it.id) !== productId));
        updateQuantity(user?._id, productId, newQuantity);
      } else {
        setCartItems((prev) => prev.map((it: any) => ((it._id ?? it.id) === productId ? { ...it, quantity: newQuantity } : it)));
        dispatch({ type: 'UPDATE_QUANTITY', id: productId, qty: newQuantity });
        updateQuantity(user?._id, productId, newQuantity);
      }
    }
  }, [dispatch, state.items, updateQuantity, user?._id]);

  const getCartQuantity = useCallback((product: any) => {
    const pid = product?._id ?? product?.id;
    const cartItem = state.items.find((item: any) => (item._id ?? item.id) === pid);
    return cartItem ? cartItem.quantity : 0;
  }, [state.items]);

  const getTotalPrice = () => {
    return cartItems.reduce((total: number, item: any) => total + (item.price || 0) * (item.quantity || 0), 0);
  };
  console.log("Categories:",user);
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 relative">
        <div className="min-h-screen bg-gray-50">
          {/* Announcement Bar */}
          <AnnouncementBar />

          <AppHeader
            logoSrc="/logoGro.png"
            title="Gro-Delivery"
            showSearch
            onSearch={(q) => updateFilter('searchTerm', q)}
            initialSearch={filters.searchTerm}
            actions={[
              ...(user?._id ?
                [
                  { key: 'location', icon: <div className="hidden md:block"><LocationSelector /></div> },
                  { key: 'notify', icon: <NotificationCenter location="home" /> }] : []),
              { key: 'wishlist', href: '/wishlist', icon: <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />, badgeCount: wishListsData ? wishListsData.length : 0 },
              {
                key: 'cart', icon: (
                  <div className={`transition-transform duration-300 ${cartAnimation ? 'scale-110' : 'scale-100'}`}>
                    <AddCardList
                      cartItems={cartItems}
                      removeFromCart={removeFromCart1}
                      updateQuantity={(itemId: any, newQuantity: any) => {
                        if (newQuantity === 0) {
                          removeFromCart1(itemId);
                        } else {
                          const change = newQuantity - getCartQuantity({ id: itemId } as Product);
                          updateQuantity1(itemId?.toString(), change);
                        }
                      }}
                      getTotalPrice={getTotalPrice}
                      setCartItems={setCartItems}
                      cartOpen={cartOpen}
                      setCartOpen={setCartOpen}
                    />
                  </div>
                )
              },
              ...(user?._id ? [{
                key: 'profile',
                icon: (
                  <img
                    src={(user as any)?.avatar || (user as any)?.image || 'https://picsum.photos/seed/profile/100'}
                    alt="profile"
                    className="w-8 h-8 rounded-full border border-border"
                  />
                ),
                onClick: () => setProfileMenuOpen(!profileMenuOpen)
              }] : [])
            ]}
          />

          {/* Profile Dropdown */}
          {profileMenuOpen && (
            <div className="fixed right-4 top-16 z-50 bg-card border border-border shadow-soft-lg rounded-lg w-56">
              <div className="p-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <img
                    src={(user as any)?.avatar || (user as any)?.image || 'https://picsum.photos/seed/profile/100'}
                    className="w-10 h-10 rounded-full border"
                    alt="profile"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{(user as any)?.firstName+ " " +(user as any)?.lastName || 'Your Account'}</p>
                    <p className="text-xs text-muted-foreground truncate">{(user as any)?.email || ''}</p>
                  </div>
                </div>
              </div>
              <div className="py-1">
                <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-secondary">Profile</Link>
                <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm hover:bg-secondary">Logout</button>
              </div>
            </div>
          )}

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <NotificationBanner location="home" />
          </div>

          {/* Navigation Filter (sticky under header) */}
          <div className="hidden md:block sticky top-20 z-40 backdrop-blur-md bg-background/90 border-b border-border">
            <NavbarFilter />
          </div>


          <section
            id="home"
            className="relative min-h-[70vh] sm:h-[80vh] lg:h-screen flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40 z-10"></div>
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            >

              <HeroSlider type="Home" />
            </div>
          </section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
