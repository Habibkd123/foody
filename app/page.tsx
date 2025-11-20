"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Search,
  ShoppingCart,
  Star,
  Clock,
  MapPin,
  Phone,
  Mail,
  Menu,
  X,
  Sun,
  Moon,
  Heart,
  Plus,
  Minus,
  Trash2,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import HeroSlider from "@/components/ui/HeroSlider"
import SupportChat from "@/components/SupportChat"
import { useRouter } from "next/navigation"
import AddCardList from "@/components/AddCards"
import MyMap from "@/components/ui/mapsData"
import { useAuthStorage } from "@/hooks/useAuth"
import { useTheme } from "@/context/ThemeContext"
import { useProductsContext } from "@/context/AllProductContext"
import { useCartOrder } from "@/context/OrderContext"
import { useOrder } from "@/context/OrderContext"
import { useWishListContext } from "@/context/WishListsContext"
import { useCustomToast } from "@/hooks/useCustomToast"
import ToastProvider from "@/components/ui/ToastProvider"
import FlashSales from "@/components/FlashSales"
import TrendingProducts from "@/components/TrendingProducts"
import LoyaltyRewards from "@/components/LoyaltyRewards"
import NotificationBanner from "@/components/NotificationBanner"
import NotificationCenter from "@/components/NotificationCenter"

function GroceryApp() {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
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

  const { productsData } = useProductsContext();
  const [cartItems, setCartItems] = useState<Array<any>>([])
  const [cartOpen, setCartOpen] = useState<boolean>(false)
  const [userData, setUserData] = useState<any | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [categories, setCategories] = useState<Array<any>>([])
  const { token, user, setToken, setUser ,logout} = useAuthStorage()
  const { addToCart, loading, error, removeFromCart, updateQuantity } = useCartOrder();
  const { wishListsData, addWishList, removeWishList, setWistListsData, getUserWishList } = useWishListContext();
  const { dispatch, state } = useOrder();
  let products = productsData
  
  // Get fallback icon based on category name
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('grocery') || name.includes('store')) return '🛍️';
    if (name.includes('bakery') || name.includes('bread')) return '🍞';
    if (name.includes('masala') || name.includes('spice')) return '🌶️';
    if (name.includes('fruit') || name.includes('apple')) return '🍎';
    if (name.includes('vegetable') || name.includes('veggie')) return '🥬';
    if (name.includes('dairy') || name.includes('milk')) return '🥛';
    if (name.includes('meat') || name.includes('chicken')) return '🍗';
    if (name.includes('snack') || name.includes('chips')) return '🍿';
    if (name.includes('beverage') || name.includes('drink')) return '🥤';
    if (name.includes('oil') || name.includes('cooking')) return '🫒';
    if (name.includes('rice') || name.includes('grain')) return '🌾';
    if (name.includes('sweet') || name.includes('dessert')) return '🍰';
    return '🏪'; // Default store icon
  };

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
          icon: "🛒",
          isAllCategory: true 
        };
        setCategories([allCategory, ...data.data]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to default categories if API fails
      setCategories([
        { _id: 'all', name: "All Items", icon: "🛒", isAllCategory: true },
        { _id: 'grocery', name: "Grocery", icon: "🛍️" },
        { _id: 'bakery', name: "Bakery", icon: "🍞" },
        { _id: 'masala', name: "Masala & Spices", icon: "🌶️" },
      ]);
    }
  };

  // Grocery categories (will be replaced by API data)
  const groceryCategories = categories

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (user?._id) {
      getUserWishList(user?._id);
    }
  }, [user?._id]);
  const date = new Date();
  const upcomingDate = new Date(date.setDate(date.getDate() + 10));
  const formattedUpcomingDate = upcomingDate.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const offers = [
    {
      id: 1,
      title: "Flat 20% Off",
      code: "SAVE20",
      description: "On orders above ₹500",
      expiry: formattedUpcomingDate,
      color: "bg-gradient-to-r from-orange-400 to-red-500",
    },

    {
      id: 3,
      title: "Free Delivery",
      code: "FREEDEL",
      description: "On orders above ₹500",
      expiry: formattedUpcomingDate,
      color: "bg-gradient-to-r from-purple-400 to-pink-500",
    },
  ]

  // Filter products based on category and search
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // const addToCart = (item: typeof products[number]): void => {
  //   const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);

  //   if (existingItem) {
  //     setCartItems(
  //       cartItems.map((cartItem) =>
  //         cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
  //       ),
  //     );
  //   } else {
  //     setCartItems([...cartItems, { ...item, quantity: 1 }]);
  //   }
  // };





  // Enhanced wishlist toggle with animation
  const toggleWishlist = async (item: any) => {
    console.log("item", item)
    console.log("wishListsData", wishListsData)
    const isWishlisted = wishListsData&&wishListsData.some((item) => item?._id === item?._id);
    try {
      if (isWishlisted) {
        await removeWishList(user?._id, item?._id);
        toast.wishlistRemoved(item.name);
      } else {
        await addWishList(user?._id, item?._id);
        toast.wishlistAdded(item.name);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast.error("Wishlist Error", "Failed to update wishlist");
    }
  };

  // Enhanced add to cart with animation and better state management
  const handleAddToCart = useCallback(async (item: any) => {
    console.log("user", user)
    if (!user?._id) {
      toast.warning("Login Required", "Please login to add items to cart");
      return;
    }
    console.log("item", item)
    const cartItem: any = {
      id: item._id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.images[0],
    };
    console.log("cartItem", cartItem)
    try {
      let response = await addToCart(user?._id, cartItem);
      console.log("response", response)
      // @ts-ignore
      if (response.success) {
        toast.cartAdded(item.name);
      } else {
        // @ts-ignore
        toast.error("Cart Error", response?.message || "Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Cart Error", "Failed to add item to cart");
    }
  }, [cartItems, dispatch, user, addToCart]);

  const removeFromCart1 = useCallback(async (itemId: any) => {
    try {
      let response = await removeFromCart(user?._id, itemId);
      console.log("response", response)
      // @ts-ignore
      if (response.success) {
        toast.cartRemoved("Item from cart");
      } else {
        // @ts-ignore
        toast.error("Cart Error", response?.message || "Failed to remove item from cart");
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Cart Error", "Failed to remove item from cart");
    }
  }, [cartItems, dispatch, user, removeFromCart]);

  // Enhanced quantity update that syncs with all states
  const updateQuantity1 = useCallback((itemId: string, change: number) => {
    const productId = parseInt(itemId);
    const currentItem = state.items.find((item: any) => item._id === productId);

    if (currentItem) {
      const newQuantity = Math.max(0, currentItem.quantity + change);

      if (newQuantity === 0) {
        // Remove item if quantity becomes 0
        setCartItems(cartItems.filter((item: any) => item._id !== productId));
        // dispatch({ type: "REMOVE_ITEM", id: productId });
        updateQuantity(user?._id, productId, newQuantity);
      } else {
        // Update quantity in both local state and global state
        setCartItems(cartItems.map((item: any) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        ));
        dispatch({ type: "UPDATE_QUANTITY", id: productId, qty: newQuantity });
        updateQuantity(user?._id, productId, newQuantity);
      }
    }
  }, [cartItems, dispatch, state.items]);

  const getTotalPrice = (): number => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Theme is applied globally via ThemeProvider; no local effect needed here




  return (
    <div className={"min-h-screen transition-colors duration-300 bg-white dark:bg-gray-900"}>
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">GD</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Gro-Delivery</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="home" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors">
                Home
              </a>
              <a href="#products" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors">
                Products
              </a>
              <a href="#offers" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors">
                Offers
              </a>
              <a href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors">
                Contact
              </a>
              {user?._id ? (
                <button onClick={() => router.push('/profile')} className="text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors">
                <span className="text-sm text-gray-700 dark:text-gray-300">Hi, {user?.firstName || user?.name || 'User'}</span>
                </button>
              ) : (
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full"
                  onClick={() => router.push('/login')}
                >
                  Login
                </Button>
              )}
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Notification Center */}
              {user?._id && <NotificationCenter location="home" />}
              
              {/* <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-gray-700 dark:text-gray-300"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button> */}


              <div className="flex items-center space-x-2 relative z-[120px]">
                <AddCardList
                  cartItems={cartItems}
                  removeFromCart={removeFromCart1}
                  updateQuantity={updateQuantity1}
                  getTotalPrice={getTotalPrice}
                  setCartItems={setCartItems}
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
                <a href="home" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors">
                  Home
                </a>
                <a href="#products" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors">
                  Products
                </a>
                <a href="#offers" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors">
                  Offers
                </a>
                <a href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors">
                  Contact
                </a>
                {user?._id ? (
                  <span className="text-sm text-gray-700 dark:text-gray-300 px-2">Hi, {user?.firstName || user?.name || 'User'}</span>
                ) : (
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full" onClick={() => router.push('/login')}>
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
      <section id="home" className="relative overflow-hidden">
        {/* Soft abstract shapes */}
        <div className="pointer-events-none absolute -top-32 -left-24 h-96 w-96 rounded-full bg-gray-100 dark:bg-gray-800 blur-3xl opacity-70" />
        <div className="pointer-events-none absolute -bottom-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-gray-100 dark:bg-gray-800 blur-3xl opacity-70" />

        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Copy */}
            <div className="relative z-10">
              <Badge className="mb-6 bg-black/90 text-white dark:bg-white/10 dark:text-white rounded-full px-4 py-1">New</Badge>
              <h1 className="font-serif tracking-tight text-gray-900 dark:text-white text-4xl md:text-6xl leading-tight">
                Indulge in<br />
                <span className="whitespace-nowrap">Modern Milkshakes</span>
              </h1>
              <p className="mt-5 text-gray-600 dark:text-gray-300 text-lg max-w-md">
                Small-batch, creamy perfection. Fresh fruits, real chocolate, and artisanal toppings.
              </p>

              {/* Rating and CTA */}
              <div className="mt-8 flex items-center gap-6">
                {/* Star rating */}
                <div className="flex items-center gap-2">
                  {[0,1,2,3,4].map((i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">4.9/5 • 2k+ reviews</span>
                </div>

                {/* Circular Order button with rotating text */}
                <button
                  onClick={() => {
                    const el = document.getElementById('products');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="relative group inline-flex items-center justify-center"
                  aria-label="Order Now"
                >
                  <span className="relative z-10 h-14 w-14 rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 flex items-center justify-center shadow-xl">
                    Order
                  </span>
                  {/* Rotating text ring */}
                  <span className="absolute inset-0 -m-5 flex items-center justify-center">
                    <svg className="h-24 w-24 animate-spin-slow" viewBox="0 0 100 100" fill="none">
                      <defs>
                        <path id="circlePath" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                      </defs>
                      <text className="text-[8px] tracking-[3px] uppercase" fill="currentColor">
                        <textPath href="#circlePath"> Order Now • Fresh • Creamy • Crafted • </textPath>
                      </text>
                    </svg>
                  </span>
                </button>
              </div>

              {/* Search (optional, minimal) */}
              <div className="mt-8 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Find your flavor (e.g., strawberry, chocolate)"
                    className="pl-10 py-3 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Images — Continuous LTR Marquee */}
            <div className="relative z-10">
              <div className="overflow-hidden rounded-3xl marquee-mask">
                <div className="flex gap-6 w-[200%] animate-marquee-ltr">
                  {/* Track A */}
                  <div className="flex gap-6 w-1/2 py-2">
                    <img
                      src="https://images.unsplash.com/photo-1542444459-db63c9f0ae30?q=80&w=1400&auto=format&fit=crop"
                      alt="Strawberry milkshake"
                      className="h-64 w-80 object-cover rounded-2xl shadow-2xl bg-white"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1527169402691-feff5539e52c?q=80&w=1200&auto=format&fit=crop"
                      alt="Chocolate milkshake"
                      className="h-64 w-80 object-cover rounded-2xl shadow-2xl bg-white"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop"
                      alt="Vanilla milkshake"
                      className="h-64 w-80 object-cover rounded-2xl shadow-2xl bg-white"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1511910849309-0dffb9c9bb40?q=80&w=1200&auto=format&fit=crop"
                      alt="Berry milkshake"
                      className="h-64 w-80 object-cover rounded-2xl shadow-2xl bg-white"
                    />
                  </div>
                  {/* Track B (duplicate for seamless loop) */}
                  <div className="flex gap-6 w-1/2 py-2">
                    <img
                      src="https://images.unsplash.com/photo-1542444459-db63c9f0ae30?q=80&w=1400&auto=format&fit=crop"
                      alt="Strawberry milkshake"
                      className="h-64 w-80 object-cover rounded-2xl shadow-2xl bg-white"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1527169402691-feff5539e52c?q=80&w=1200&auto=format&fit=crop"
                      alt="Chocolate milkshake"
                      className="h-64 w-80 object-cover rounded-2xl shadow-2xl bg-white"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop"
                      alt="Vanilla milkshake"
                      className="h-64 w-80 object-cover rounded-2xl shadow-2xl bg-white"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1511910849309-0dffb9c9bb40?q=80&w=1200&auto=format&fit=crop"
                      alt="Berry milkshake"
                      className="h-64 w-80 object-cover rounded-2xl shadow-2xl bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Shop by Category - Simple & Clean */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white">
              Shop by Category
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Browse our fresh products by category
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {groceryCategories.map((category) => {
              const categoryId = category._id || category.id;
              const categoryProducts = products.filter(p => categoryId === 'all' || p.category === categoryId)
              const productCount = categoryProducts.length
              const isSelected = selectedCategory === categoryId
              return (
                <div
                  key={categoryId}
                  onClick={() => setSelectedCategory(categoryId)}
                  className={`group cursor-pointer transition-all duration-300 ${
                    isSelected ? 'scale-105' : 'hover:scale-105'
                  }`}
                >
                  <div className={`relative rounded-2xl p-6 text-center transition-all duration-300 ${
                    isSelected
                      ? 'bg-gradient-to-br from-orange-500 to-red-500 shadow-xl shadow-orange-500/30'
                      : 'bg-white dark:bg-gray-700 shadow-lg hover:shadow-xl'
                  }`}>
                    {/* Icon */}
                    <div className={`w-16 h-16 mx-auto mb-3 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-300 ${
                      isSelected
                        ? 'bg-white/20'
                        : 'bg-orange-100 dark:bg-orange-900/30 group-hover:scale-110'
                    }`}>
                      {category?.isAllCategory ? (
                        // Special icon for "All Items"
                        <div className="text-4xl animate-pulse">
                          🛒
                        </div>
                      ) : category?.image ? (
                        // Show category image if available
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            // Hide image and show fallback icon on error
                            e.currentTarget.style.display = 'none';
                            const fallbackIcon = e.currentTarget.nextElementSibling;
                            if (fallbackIcon) {
                              (fallbackIcon as HTMLElement).style.display = 'block';
                            }
                          }}
                        />
                      ) : null}
                      {/* Fallback icon (hidden by default, shown if image fails) */}
                      <span 
                        className="text-4xl transition-transform duration-500 group-hover:scale-110"
                        style={{ display: category?.image && !category?.isAllCategory ? 'none' : 'block' }}
                      >
                        {category?.icon || getCategoryIcon(category?.name || '')}
                      </span>
                    </div>
                    
                    {/* Category Name */}
                    <h3 className={`font-semibold mb-2 transition-colors ${
                      isSelected
                        ? 'text-white'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {category.name}
                    </h3>
                    
                    {/* Product Count */}
                    <p className={`text-sm ${
                      isSelected
                        ? 'text-white/90'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {productCount} items
                    </p>

                    {/* Selected Indicator */}
                    {isSelected && (
                      <div className="absolute top-3 right-3">
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Grocery Products Grid */}
      <section id="products" className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {selectedCategory === 'all' ? 'All Products' : groceryCategories.find(cat => cat.id === selectedCategory)?.name}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="hidden sm:flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => 
           { const isWishlisted = wishListsData&&wishListsData.some((item: any) => item._id === product._id); return(
              <Card
                key={product._id}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={product?.images?.[0] || "/placeholder.svg"}
                    alt={product?.name}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product?.discount > 0 && (
                    <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">
                      {product?.discount}% OFF
                    </Badge>
                  )}
                  <Button onClick={() => toggleWishlist(product)}
                    size="icon"
                    className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-700 shadow-md"
                  >
                    <Heart
                      className={`w-4 h-4 transition-all duration-300 ${isWishlisted
                        ? "text-red-500 fill-current scale-110"
                        : "text-gray-400 hover:text-red-500"
                        }`}
                    />
                  </Button>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white line-clamp-2">{product?.name}</h3>

                  <div className="flex items-center space-x-1 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product?.rating || 0}</span>
                    <span className="text-xs text-gray-500">({product?.reviews?.length || 0})</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-orange-500">₹{product?.price}</span>
                      {product?.originalPrice > product?.price && (
                        <span className="text-sm text-gray-500 line-through">₹{product?.originalPrice}</span>
                      )}
                    </div>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600" onClick={() => handleAddToCart(product)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )})}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No products found matching your search.</p>
            </div>
          )}
        </div>
      </section>

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

      {/* Offers and Coupons */}
      {/* <section id="offers" className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Deals & Offers</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <Card
                key={offer.id}
                className={`${offer.color} text-white overflow-hidden relative group cursor-pointer hover:shadow-xl transition-all duration-300`}
              >
                <CardContent className="p-6">
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-2">{offer.title}</h3>
                    <p className="text-white/90 mb-4">{offer.description}</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm opacity-90">Use code:</p>
                        <p className="font-mono font-bold text-lg">{offer.code}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm opacity-90">Valid till:</p>
                        <p className="font-semibold">{offer.expiry}</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Why Choose Gro-Delivery?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Fast Delivery</h3>
              <p className="text-gray-600 dark:text-gray-400">Get your groceries delivered within 30 minutes</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Quality Products</h3>
              <p className="text-gray-600 dark:text-gray-400">Fresh and high-quality groceries every time</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Best Prices</h3>
              <p className="text-gray-600 dark:text-gray-400">Competitive prices with regular discounts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Get in Touch</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={async (e) => {
                  e.preventDefault()
                  
                  // Validation
                  if (!contactForm.name || !contactForm.email || !contactForm.message) {
                    toast.warning('Form Incomplete', 'Please fill in all required fields')
                    return
                  }
                  
                  setIsSubmitting(true)
                  
                  try {
                    const response = await fetch('/api/contact', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(contactForm),
                    })
                    
                    const data = await response.json()
                    
                    if (data.success) {
                      toast.success('Message Sent!', data.message || 'We will get back to you soon')
                      // Reset form
                      setContactForm({
                        name: '',
                        email: '',
                        subject: '',
                        message: ''
                      })
                    } else {
                      toast.error('Failed to Send', data.error || 'Please try again later')
                    }
                  } catch (error) {
                    console.error('Contact form error:', error)
                    toast.error('Network Error', 'Failed to send message. Please check your connection.')
                  } finally {
                    setIsSubmitting(false)
                  }
                }}>
                  <div className="space-y-4">
                    <Input 
                      placeholder="Your Name *" 
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      required
                      disabled={isSubmitting}
                    />
                    <Input 
                      type="email" 
                      placeholder="Your Email *" 
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      required
                      disabled={isSubmitting}
                    />
                    <Input 
                      placeholder="Subject (Optional)" 
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                      disabled={isSubmitting}
                    />
                    <textarea
                      placeholder="Your Message *"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      required
                      disabled={isSubmitting}
                    ></textarea>
                    <Button 
                      type="submit"
                      className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-orange-500" />
                    <span className="text-gray-700 dark:text-gray-300">+91 9876543210</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-orange-500" />
                    <span className="text-gray-700 dark:text-gray-300">support@grodelivery.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-orange-500" />
                    <span className="text-gray-700 dark:text-gray-300">123 Grocery Street, Delivery City, DC 12345</span>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg flex items-center justify-center">
                {/* <p className="text-gray-500 dark:text-gray-400">Map Integration</p> */}
                <MyMap />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GD</span>
                </div>
                <span className="text-xl font-bold">Gro-Delivery</span>
              </div>
              <p className="text-gray-400 mb-4">
                Fresh groceries delivered fast to your doorstep. Quality products from the best suppliers in your city.
              </p>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Shop Groceries
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Fresh Produce
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help & Support
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>📘
                </Button>
                <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>🐦
                </Button>
                <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Instagram</span>📷
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Gro-Delivery. All rights reserved.</p>
          </div>
        </div>
      </footer>
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