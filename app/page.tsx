"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Menu,
  X,
  ArrowRight,
  LayoutGrid
} from "lucide-react"
import { Button } from "@/components/ui/button"
import SupportChat from "@/components/SupportChat"
import { useRouter } from "next/navigation"
import AddCardList from "@/components/AddCards"
import { useUserStore } from "@/lib/store/useUserStore"
import { useWishlistQuery } from "@/hooks/useWishlistQuery"
import { useProductsQuery } from "@/hooks/useProductsQuery"
import { useCartStore } from "@/lib/store/useCartStore"
import { useCustomToast } from "@/hooks/useCustomToast"
import ToastProvider from "@/components/ui/ToastProvider"
import FlashSales from "@/components/FlashSales"
import TrendingProducts from "@/components/TrendingProducts"
import LoyaltyRewards from "@/components/LoyaltyRewards"
import NotificationBanner from "@/components/NotificationBanner"
import NotificationCenter from "@/components/NotificationCenter"
import CategoriesSection from "@/components/home/CategoriesSection"
import ProductsSection from "@/components/home/ProductsSection"
import WhyChooseSection from "@/components/home/WhyChooseSection"
import ContactSection from "@/components/home/ContactSection"
import SiteFooter from "@/components/home/SiteFooter"
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton"
import AppHeader from "@/components/ui/AppHeader"
import NavbarFilter from "@/components/NavbarFilter"
import HeroSlider from "@/components/ui/HeroSlider"
import Image from "next/image"
import { motion } from "framer-motion"
import { CategorySection, CategorySectionSkeleton } from "@/components/home/CategoryGridSection"
import { Product } from "@/types/global"



const GroceryApp = () => {
  const router = useRouter()
  const toast = useCustomToast()

  const { data: productsData = [], isLoading: isProductsLoading } = useProductsQuery();
  const { user, logout } = useUserStore();
  const { data: wishListsData = [] } = useWishlistQuery(user?._id);
  const { items: cartItems, addItem, updateQuantity, removeItem } = useCartStore();

  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [categories, setCategories] = useState<Array<any>>([])
  const [cartOpen, setCartOpen] = useState(false)

  // Pagination for category sections
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sectionsLoading, setSectionsLoading] = useState(false);

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddToCart = (product: Product) => {
    addItem({ ...product, quantity: 1 })
  }

  const fetchCategories = async (pageNum = 1, limitNum = 20) => {
    if (pageNum === 1) setSectionsLoading(true);
    try {
      const response = await fetch(`/api/categories/productcategory?page=${pageNum}&limit=${limitNum}`);
      const data = await response.json();
      if (data.success) {
        if (pageNum === 1) {
          setCategories(data.data);
        } else {
          setCategories(prev => [...prev, ...data.data]);
        }

        if (data.data.length < limitNum) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setSectionsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(1, 20);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchCategories(nextPage, 30);
  };

  const filteredProducts = productsData.filter((product: any) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const name = product.name || "";
    return matchesCategory && name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  // Prepare top-level categories for the CategoriesSection (the slider)
  // We can just use the names of the fetched sections
  const topCategories = [{ _id: 'all', name: "All Items", icon: "🌟", isAllCategory: true }, ...categories];

  return (
    <div className="min-h-screen bg-[#fdfbf7] dark:bg-gray-950 transition-colors duration-500 overflow-x-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-[20%] -right-[5%] w-[35%] h-[35%] bg-orange-400/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] left-[20%] w-[30%] h-[30%] bg-blue-400/10 blur-[120px] rounded-full" />
      </div>

      <header className="sticky top-0 z-40 w-full transition-all duration-300">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 shadow-sm shadow-black/5 supports-[backdrop-filter]:bg-white/60">
          <div className="max-w-[2000px] mx-auto">
            <AppHeader
              logoSrc="/logoGro.png"
              title="Gro-Delivery"
              showSearch
              sticky={false}
              border={false}
              className="!bg-transparent !shadow-none py-2 md:py-3"
              onSearch={setSearchTerm}
              initialSearch={searchTerm}
              actions={[
                { key: 'notify', icon: <NotificationCenter location="home" /> },
                {
                  key: 'cart',
                  icon: (
                    <AddCardList
                      cartItems={cartItems}
                      removeFromCart={(id: string) => removeItem(id)}
                      updateQuantity={(id: string, q: number) => updateQuantity(id, q)}
                      getTotalPrice={() => cartItems.reduce((acc: any, i: any) => acc + i.price * i.quantity, 0)}
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
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-primary/20 hover:border-primary transition-all shadow-md object-cover"
                    />
                  ),
                  onClick: () => router.push('/profile')
                }] : [{
                  key: 'login',
                  icon: <Button variant="ghost" className="font-bold text-gray-700 hover:text-primary transition-colors hover:bg-primary/5" onClick={() => router.push('/login')}>Login</Button>
                }])
              ]}
            />
          </div>
        </div>

        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 overflow-visible relative z-[9998]">
          <NavbarFilter />
        </div>
      </header>

      <main className="relative z-10">
        {/* Modern Hero Section - Edge to Edge */}
        {/* <section className="relative ">
          <div className="grid lg:grid-cols-12 gap-8 items-center bg-white dark:bg-gray-900 sm:p-10 lg:p-8  border border-gray-100 dark:border-gray-800 overflow-hidden relative">
            <div className="lg:col-span-6 space-y-10 relative z-10 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-black tracking-wide"
              >
                <span className="flex h-3 w-3 rounded-full bg-primary animate-ping" />
                30 MINS EXPRESS DELIVERY
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl sm:text-7xl xl:text-8xl font-[900] text-gray-900 dark:text-white leading-[0.9] tracking-tighter"
              >
                FRESHNESS <br />
                <span className="text-primary italic font-serif">Handpicked</span> <br />
                FOR YOU
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-xl text-gray-500/80 dark:text-gray-400 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed"
              >
                Experience the finest organic groceries and artisanal products delivered straight from local farms to your kitchen.
              </motion.p>


              <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start pt-4">
                <Button
                  size="lg"
                  className="h-20 px-12 rounded-[2rem] text-xl font-black bg-primary hover:bg-primary/95 shadow-[0_20px_50px_-15px_rgba(255,138,0,0.4)] group overflow-hidden relative"
                  onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Shopping
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="hidden md:block h-20 px-12 rounded-[2rem] text-xl font-black border-2 border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  View Offers
                </Button>
              </div>

              <div className="flex items-center gap-10 pt-8 justify-center lg:justify-start opacity-80">
                <div className="text-left">
                  <p className="text-3xl font-black text-gray-900 dark:text-white">10k+</p>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] mt-1">Happy Users</p>
                </div>
                <div className="w-[1px] h-12 bg-gray-100 dark:bg-gray-800" />
                <div className="text-left">
                  <p className="text-3xl font-black text-gray-900 dark:text-white">5k+</p>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] mt-1">Products</p>
                </div>
                <div className="w-[1px] h-12 bg-gray-100 dark:bg-gray-800" />
                <div className="text-left">
                  <p className="text-3xl font-black text-gray-900 dark:text-white">50+</p>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] mt-1">Locations</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative h-[450px] lg:h-[570px] w-full mt-8 lg:mt-0 hidden lg:block">
              <div className="absolute inset-x-[-20%] inset-y-[-10%] bg-primary/5 rounded-[4rem] transform rotate-3 scale-95 blur-3xl opacity-50" />
              <div className="relative h-full w-full rounded-[3rem] overflow-hidden shadow-2xl border border-white/50 dark:border-white/10">
                <HeroSlider type="Home" />
              </div>
            </div>
          </div>
        </section> */}


        <section className="relative">
          <div
            className="
          grid grid-cols-1 lg:grid-cols-12
          gap-6 lg:gap-8
          bg-white dark:bg-gray-900
          p-5 sm:p-8 lg:p-8
          border border-gray-100 dark:border-gray-800
          overflow-hidden
        "
          >
            {/* LEFT CONTENT */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left relative z-10">

              {/* BADGE */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="
              inline-flex items-center gap-2
              px-4 py-2
              rounded-full
              bg-primary/10 border border-primary/30
              text-primary text-xs sm:text-sm font-black
            "
              >
                <span className="flex h-2.5 w-2.5 rounded-full bg-primary animate-ping" />
                30 MINS EXPRESS DELIVERY
              </motion.div>

              {/* HEADING */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="
              text-3xl sm:text-5xl lg:text-7xl xl:text-8xl
              font-[900]
              leading-tight sm:leading-[0.95]
              tracking-tight
              text-gray-900 dark:text-white
            "
              >
                FRESHNESS <br />
                <span className="text-primary italic font-serif">
                  Handpicked
                </span>{" "}
                <br />
                FOR YOU
              </motion.h1>

              {/* DESCRIPTION */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="
              text-base sm:text-lg lg:text-xl
              text-gray-500 dark:text-gray-400
              max-w-md mx-auto lg:mx-0
              leading-relaxed
            "
              >
                Experience the finest organic groceries and artisanal products
                delivered straight from local farms to your kitchen.
              </motion.p>

              {/* BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <Button
                  size="lg"
                  className="
                h-14 sm:h-16 lg:h-20
                w-full sm:w-auto
                px-8 lg:px-12
                rounded-2xl
                text-base sm:text-lg lg:text-xl
                font-black
                bg-primary hover:bg-primary/95
                shadow-[0_20px_50px_-15px_rgba(255,138,0,0.4)]
                group relative overflow-hidden
              "
                  onClick={() =>
                    document
                      .getElementById("products")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Shopping
                    <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-2 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="
                h-14 sm:h-16 lg:h-20
                w-full sm:w-auto
                px-8 lg:px-12
                rounded-2xl
                text-base sm:text-lg lg:text-xl
                font-black
                border-2
                hidden sm:flex
              "
                >
                  View Offers
                </Button>
              </div>

              {/* STATS */}
              <div
                className="
              grid grid-cols-3 gap-4
              sm:flex sm:gap-10
              pt-6
              justify-center lg:justify-start
              opacity-80
              
            "
              >
                {[
                  { value: "10k+", label: "Happy Users" },
                  { value: "5k+", label: "Products" },
                  { value: "50+", label: "Locations" },
                ].map((item, i) => (
                  <div key={i} className="text-center lg:text-left">
                    <p className="text-xl sm:text-3xl font-black text-gray-900 dark:text-white">
                      {item.value}
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT SLIDER */}
            <div
              className="
            lg:col-span-6
            relative
            h-[250px] sm:h-[420px] lg:h-[570px]
            w-full
            mt-6 lg:mt-0
            hidden lg:block
            
          "
            >
              <div className="absolute inset-x-[-20%] inset-y-[-10%] bg-primary/5 rounded-[4rem] rotate-3 blur-3xl opacity-50" />
              <div className="relative h-full w-full rounded-[3rem] overflow-hidden shadow-2xl border border-white/50 dark:border-white/10">
                <HeroSlider type="Home" />
              </div>
            </div>
          </div>
        </section>



        <NotificationBanner location="home" />

        <div className="space-y-12 sm:space-y-20 pb-12 mt-5">
          {/* Shop by Category Slider */}
          <CategoriesSection
            categories={topCategories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          <FlashSales
            products={productsData}
            onAddToCart={handleAddToCart}
            onToggleWishlist={() => { }}
          />

          {/* Featured Grid */}
          <ProductsSection
            title={selectedCategory === 'all' ? 'Fresh Recommendations' : (topCategories.find((c) => c._id === selectedCategory)?.name || 'Products')}
            filteredProducts={filteredProducts}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            wishListsData={wishListsData}
            onAddToCart={handleAddToCart}
            onToggleWishlist={() => { }}
          />

          {/* Paginated Category Sections */}
          <div className="max-w-7xl  px-2 sm:px-0 lg:px-8 space-y-20">
            {sectionsLoading && page === 1 ? (
              Array.from({ length: 2 }).map((_, i) => <CategorySectionSkeleton key={i} />)
            ) : (
              categories?.slice(0, 10).map((section, idx) => (
                <CategorySection section={section} key={section._id || idx} />
              ))
            )}

            {/* {hasMore && (
              <div className="flex justify-center pt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLoadMore}
                  disabled={sectionsLoading}
                  className="flex items-center gap-4 bg-white dark:bg-gray-900 border-2 border-primary/20 hover:border-primary px-12 py-5 rounded-[2rem] text-primary font-black text-lg transition-all shadow-xl hover:shadow-primary/20 disabled:opacity-50"
                >
                  {sectionsLoading ? (
                    <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <LayoutGrid className="w-6 h-6" />
                  )}
                  <span>{sectionsLoading ? 'Discovering more...' : 'Load More Categories'}</span>
                </motion.button>
              </div>
            )} */}
          </div>

          <TrendingProducts
            onAddToCart={handleAddToCart}
            onToggleWishlist={() => { }}
          />



        </div>
      </main>

      <SiteFooter />
    </div>
  )
}



export default function Page() {
  return (
    <main>
      <GroceryApp />
      <SupportChat />
    </main>
  );
}