"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Menu,
  X,
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

function GroceryApp() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const toast = useCustomToast()

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: productsData = [], isLoading: isProductsLoading } = useProductsQuery();

  const [cartOpen, setCartOpen] = useState<boolean>(false)
  const [userData, setUserData] = useState<any | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [categories, setCategories] = useState<Array<any>>([])

  const { user, logout } = useUserStore();
  const { data: wishListsData = [], addToWishlist, removeFromWishlist } = useWishlistQuery(user?._id);
  const { items: cartItems, addItem, updateQuantity, removeItem } = useCartStore();

  const products = productsData

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories/productcategory');
      const data = await response.json();
      console.log('Categories response:', data.data);

      if (data.success) {
        // Add "All Items" as first category with special styling
        const allCategory = {
          _id: 'all',
          name: "All Items",
          icon: "",
          isAllCategory: true
        };
        setCategories([allCategory, ...data.data]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to default categories if API fails
      setCategories([
        { _id: 'all', name: "All Items", icon: "", isAllCategory: true },
        { _id: 'grocery', name: "Grocery", icon: "" },
        { _id: 'bakery', name: "Bakery", icon: "" },
        { _id: 'masala', name: "Masala & Spices", icon: "" },
      ]);
    }
  };

  // Grocery categories (will be replaced by API data)
  const groceryCategories = categories

  useEffect(() => {
    fetchCategories();
  }, []);


  // Filter products based on category and search
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const name = product.name || "";
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Enhanced wishlist toggle with animation
  const toggleWishlist = async (item: any) => {
    if (!user?._id) {
      toast.warning("Login Required", "Please login to manage wishlist");
      return;
    }
    const isWishlisted = wishListsData && wishListsData.some((wItem: any) => wItem._id === item._id);
    try {
      if (isWishlisted) {
        await removeFromWishlist({ userId: user._id, productId: item._id });
        toast.wishlistRemoved(item.name);
      } else {
        await addToWishlist({ userId: user._id, productId: item._id });
        toast.wishlistAdded(item.name);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast.error("Wishlist Error", "Failed to update wishlist");
    }
  };

  // Enhanced add to cart with animation and better state management
  const handleAddToCart = useCallback((item: any) => {
    if (!user?._id) {
      toast.warning("Login Required", "Please login to add items to cart");
      return;
    }
    addItem({
      ...item,
      id: item._id || item.id,
      productId: item._id || String(item.id),
      quantity: 1,
      image: item.images[0],
    });
    toast.cartAdded(item.name);
  }, [user?._id, addItem, toast]);

  const removeFromCart1 = useCallback((itemId: any) => {
    removeItem(itemId);
    toast.cartRemoved("Item from cart");
  }, [removeItem, toast]);

  // Enhanced quantity update that syncs with all states
  const updateQuantity1 = useCallback((itemId: string, change: number) => {
    const item = cartItems.find((i: any) => (i._id || i.id) === itemId);
    if (item) {
      const newQuantity = Math.max(0, item.quantity + change);
      if (newQuantity === 0) {
        removeItem(itemId);
      } else {
        updateQuantity(itemId, newQuantity);
      }
    }
  }, [cartItems, updateQuantity, removeItem]);

  const getTotalPrice = (): number => {
    return cartItems.reduce((total: number, item: any) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-white dark:bg-gray-900">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">GD</span>
              </div>
              <span className="text-xl font-bold text-foreground">Gro-Delivery</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="home" className="text-foreground hover:text-primary transition-colors">
                Home
              </a>
              <a href="#products" className="text-foreground hover:text-primary transition-colors">
                Products
              </a>
              <a href="#offers" className="text-foreground hover:text-primary transition-colors">
                Offers
              </a>
              <a href="#contact" className="text-foreground hover:text-primary transition-colors">
                Contact
              </a>
              {user?._id ? (
                <button onClick={() => router.push('/profile')} className="text-foreground hover:text-primary transition-colors">
                  <span className="text-sm text-foreground">Hi, {user?.firstName || user?.name || 'User'}</span>
                </button>
              ) : (
                <Button
                  className="bg-primary hover:opacity-90 text-primary-foreground px-4 py-2 rounded-full"
                  onClick={() => router.push('/login')}
                >
                  Login
                </Button>
              )}
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              <ThemeToggleButton />
              {/* Notification Center */}
              {user?._id && <NotificationCenter location="home" />}
              <div className="flex items-center space-x-2 relative z-[120px]">
                <AddCardList
                  cartItems={cartItems}
                  removeFromCart={removeFromCart1}
                  updateQuantity={updateQuantity1}
                  getTotalPrice={getTotalPrice}
                  cartOpen={cartOpen}
                  setCartOpen={setCartOpen}
                />

                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-gray-700"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col space-y-3 pt-4">
                <a href="home" className="text-foreground hover:text-primary transition-colors">
                  Home
                </a>
                <a href="#products" className="text-foreground hover:text-primary transition-colors">
                  Products
                </a>
                <a href="#offers" className="text-foreground hover:text-primary transition-colors">
                  Offers
                </a>
                <a href="#contact" className="text-foreground hover:text-primary transition-colors">
                  Contact
                </a>
                {user?._id ? (
                  <span className="text-sm text-foreground px-2">Hi, {user?.firstName || user?.name || 'User'}</span>
                ) : (
                  <Button className="bg-primary hover:opacity-90 text-primary-foreground px-4 py-2 rounded-full" onClick={() => router.push('/login')}>
                    Login
                  </Button>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Notification Banner */}
      <div className="container mx-auto px-4 pt-6">
        <NotificationBanner location="home" />
      </div>

      {/* Hero Section — Minimal Milkshake Landing */}
      <CategoriesSection
        categories={groceryCategories}
        products={products ?? []}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Grocery Products Grid */}
      <ProductsSection
        title={selectedCategory === 'all' ? 'All Products' : (groceryCategories.find((cat: any) => (cat.id || cat._id) === selectedCategory)?.name || 'Products')}
        filteredProducts={filteredProducts as any}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        wishListsData={wishListsData as any}
        onAddToCart={handleAddToCart as any}
        onToggleWishlist={toggleWishlist as any}
      />

      {/* Flash Sales Section */}
      <FlashSales
        products={products}
        onAddToCart={handleAddToCart}
        onToggleWishlist={toggleWishlist}
      />

      {/* Trending Products Section */}
      <TrendingProducts
        onAddToCart={handleAddToCart}
        onToggleWishlist={toggleWishlist}
      />

      {/* Loyalty Rewards Section */}
      <LoyaltyRewards />

      {/* Why Choose Us */}
      <WhyChooseSection />

      {/* Contact Us Section */}
      <ContactSection
        contactForm={contactForm}
        setContactForm={setContactForm}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
        toast={toast as any}
      />

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}

export default function Page() {
  return (
    <ToastProvider>
      <main>
        <GroceryApp />
        <SupportChat />
      </main>
    </ToastProvider>
  );
}