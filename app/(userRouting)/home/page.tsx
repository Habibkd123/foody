'use client'

import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Script from "next/script";
import AnnouncementBar from "@/components/AnnouncementBar";
import HeroSlider from "@/components/ui/HeroSlider";
import { useRouter } from "next/navigation";
import { useFilterStore } from "@/lib/store/useFilterStore";
import { useWishlistQuery } from "@/hooks/useWishlistQuery";
import Link from "next/link";
import NavbarFilter from "@/components/NavbarFilter";
import { Heart, ChevronUp, ArrowRight, ShoppingBag, Clock } from 'lucide-react';
import dynamic from "next/dynamic";

const LocationSelector = dynamic(() => import("@/components/LocationSelector"), { ssr: false });
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "@/lib/store/useUserStore";
import NotificationCenter from "@/components/NotificationCenter";
import AppHeader from "@/components/ui/AppHeader";
import NotificationBanner from "@/components/NotificationBanner";
import AddCardList from "@/components/AddCards";
import { useCartStore } from "@/lib/store/useCartStore";
import { Product } from "@/types/global";
import { CategorySection, CategorySectionSkeleton } from "@/components/home/CategoryGridSection";
import SiteFooter from "@/components/home/SiteFooter";

const HomePage: React.FC = () => {
  const router = useRouter();
  const { filters, updateFilter } = useFilterStore();
  const { user, logout } = useUserStore();
  const { data: wishListsData = [] } = useWishlistQuery(user?._id);

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);
  const [categoriesError, setCategoriesError] = useState<boolean>(false);

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const {
    items: cartStoreItems,
    removeItem: removeFromCart,
    updateQuantity: updateCartQuantity,
    getTotalAmount
  } = useCartStore();

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    setCategoriesError(false);
    try {
      const response = await fetch('/api/categories/productcategory');
      const data = await response.json();
      if (data?.success && Array.isArray(data?.data)) {
        setCategories(data.data);
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
  };

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
    logout();
    router.push('/login');
  };

  const getCartQuantity = useCallback((product: any) => {
    const pid = product?._id ?? product?.id;
    const cartItem = cartStoreItems.find((item: any) => (item._id ?? item.id) === pid);
    return cartItem ? cartItem.quantity : 0;
  }, [cartStoreItems]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Schema.org JSON-LD */}
      <Script
        id="ld-json-organization"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Gro-Delivery',
            url: (typeof window !== 'undefined' ? window.location.origin : ''),
            logo: '/logoGro.png',
          }),
        }}
      />

      <AnnouncementBar />

      <AppHeader
        logoSrc="/logoGro.png"
        title="Gro-Delivery"
        showSearch
        onSearch={(q) => updateFilter('searchTerm', q)}
        initialSearch={filters.searchTerm}
        actions={[
          ...(user?._id ? [
            { key: 'location', icon: <div className="hidden md:block"><LocationSelector /></div> },
            { key: 'notify', icon: <NotificationCenter location="home" /> }
          ] : []),
          {
            key: 'wishlist',
            href: '/wishlist',
            icon: <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />,
            badgeCount: wishListsData ? wishListsData.length : 0
          },
          {
            key: 'cart',
            icon: (
              <AddCardList
                cartItems={cartItems}
                removeFromCart={(id: any) => removeFromCart(id)}
                updateQuantity={(itemId: any, newQuantity: any) => {
                  updateCartQuantity(itemId, newQuantity);
                }}
                getTotalPrice={() => getTotalAmount()}
                setCartItems={setCartItems}
                cartOpen={cartOpen}
                setCartOpen={setCartOpen}
              />
            )
          },
          ...(user?._id ? [{
            key: 'profile',
            icon: (
              <Image
                src={(user as any)?.avatar || (user as any)?.image || 'https://picsum.photos/seed/profile/100'}
                alt="Profile"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full border border-border object-cover"
              />
            ),
            onClick: () => setProfileMenuOpen(!profileMenuOpen)
          }] : [])
        ]}
      />

      {profileMenuOpen && (
        <div className="fixed right-4 top-16 z-[60] bg-card border border-border shadow-soft-lg rounded-lg w-56">
          <div className="p-3 border-b border-border">
            <div className="flex items-center gap-3">
              <Image
                src={(user as any)?.avatar || (user as any)?.image || 'https://picsum.photos/seed/profile/100'}
                className="w-10 h-10 rounded-full border object-cover"
                alt="Profile"
                width={40}
                height={40}
              />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{user?.name || (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Your Account')}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email || ''}</p>
              </div>
            </div>
          </div>
          <div className="py-1">
            <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-secondary">Profile</Link>
            <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm hover:bg-secondary">Logout</button>
          </div>
        </div>
      )}

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4">
          <NotificationBanner location="home" />
        </div>

        <nav className="hidden md:block sticky top-16 z-40 backdrop-blur-md bg-white/80 border-b border-border">
          <NavbarFilter />
        </nav>

        <div className="absolute inset-0 pointer-events-none overflow-hidden h-full w-full">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              x: [0, 50, 0],
              y: [0, 30, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[100px] rounded-full"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
              x: [0, -40, 0],
              y: [0, 50, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-[20%] -right-[5%] w-[35%] h-[35%] bg-orange-400/10 blur-[100px] rounded-full"
          />
        </div>

        <section className="relative h-[65vh] sm:h-[75vh] lg:h-[85vh] flex items-center justify-center overflow-hidden mx-2 sm:mx-4 md:mx-6 lg:mx-8 mt-4 rounded-[2.5rem] shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10 transition-opacity duration-700"></div>
          <div className="absolute inset-0">
            <HeroSlider type="Home" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-20 text-center px-4 max-w-5xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-medium mb-6"
            >
              <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
              New: Fresh Organic Milkshakes Now Available
            </motion.div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-tight tracking-tighter drop-shadow-2xl mb-6">
              FR<span className="text-primary italic">E</span>SHNESS <br />
              AT YOUR <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">DOORSTEP</span>
            </h1>

            <p className="text-base sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
              Elevate your daily essentials with our premium selection of farm-fresh groceries
              and artisanal handcrafted milkshakes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/productlist"
                  className="group relative flex items-center gap-3 bg-primary px-10 py-4 rounded-2xl text-white font-bold text-lg shadow-[0_10px_40px_-10px_rgba(255,138,0,0.5)] transition-all overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <button
                onClick={() => {
                  const el = document.getElementById('categories');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group flex items-center gap-2 px-10 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-lg hover:bg-white hover:text-black transition-all"
              >
                Explore More
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ChevronUp className="w-5 h-5 rotate-180" />
                </motion.div>
              </button>
            </div>
          </motion.div>

          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
        </section>

        <div id="categories" className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {categoriesLoading ? (
            <div className="space-y-12">
              <CategorySectionSkeleton />
              <CategorySectionSkeleton />
            </div>
          ) : categoriesError ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed">
              <p className="text-gray-500">Unable to load categories. Please try refreshing.</p>
              <button onClick={fetchCategories} className="mt-4 text-primary font-bold">Retry</button>
            </div>
          ) : categories.length > 0 ? (
            <div className="space-y-12">
              {categories.map((section, idx) => (
                <CategorySection section={section} key={section._id || idx} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 italic">No categories available at the moment.</p>
            </div>
          )}
        </div>

        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-12">
          <RecentlyViewedHome />
        </div>
      </main>

      <SiteFooter />

      <AnimatePresence>
        {cartStoreItems.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] md:hidden"
          >
            <button
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-3 bg-gray-900 text-white px-6 py-4 rounded-full shadow-2xl border border-white/10 backdrop-blur-xl"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartStoreItems.length}
                </span>
              </div>
              <div className="flex flex-col items-start leading-none">
                <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Cart Total</span>
                <span className="text-sm font-bold">₹{getTotalAmount()}</span>
              </div>
              <div className="h-6 w-[1px] bg-white/20 mx-1"></div>
              <span className="text-sm font-black text-primary uppercase">View Cart</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-primary text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 animate-bounce"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-7 h-7" />
        </button>
      )}
    </div>
  );
}

const RecentlyViewedHome = () => {
  const [recentProducts, setRecentProducts] = useState<any[]>([]);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recent_views") || "[]");
    setRecentProducts(recent.slice(0, 6));
  }, []);

  if (recentProducts.length === 0) return null;

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-6 h-6 text-primary" />
            Pick up where you left off
          </h3>
          <p className="text-gray-500 text-sm">Products you viewed recently</p>
        </div>
        <Link href="/products" className="text-primary font-bold hover:underline flex items-center gap-1">
          See all products <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {recentProducts.map((p: any) => (
          <Link
            key={p._id}
            href={`/products/${p._id}`}
            className="group block"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 bg-gray-50 border border-gray-100 group-hover:border-primary transition-colors">
              <Image
                src={p.images?.[0] || '/placeholder.svg'}
                alt={p.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <h4 className="text-sm font-semibold truncate group-hover:text-primary transition-colors text-gray-800">
              {p.name}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-primary font-bold text-sm">₹{p.price}</span>
              {p.originalPrice > p.price && (
                <span className="text-gray-400 line-through text-[10px]">₹{p.originalPrice}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;