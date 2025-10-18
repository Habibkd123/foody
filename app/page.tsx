
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
export function Grocery() {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)

  const { productsData } = useProductsContext();
  const [cartItems, setCartItems] = useState<Array<any>>([])
  const [cartOpen, setCartOpen] = useState<boolean>(false)
  const [userData, setUserData] = useState<any | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const { token, user, setToken, setUser } = useAuthStorage()
  const { addToCart, loading, error, removeFromCart, updateQuantity } = useCartOrder();
  const { wishListsData, addWishList, removeWishList, setWistListsData, getUserWishList } = useWishListContext();
  const { dispatch, state } = useOrder();
  let products = productsData
  const groceryCategories = [
    { id: 'all', name: "All Items", icon: "🛒" },
    { id: 'grocery', name: "Grocery", icon: "🛍️" },
    { id: 'mix', name: "Mix", icon: "🍞️" },
    { id: 'bakery', name: "Bakery", icon: "🍞" },
    { id: 'okoay', name: "Okoay", icon: "🌴" },
    { id: 'masala', name: "Masala & Spices", icon: "🌶️" },
    // { id: 'oil', name: "Cooking Oils", icon: "🫒" },

  ]

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
    const isWishlisted = wishListsData.some((item) => item?._id === item?._id);
    try {
      if (isWishlisted) {
        await removeWishList(user?._id, item?._id);
      } else {
        await addWishList(user?._id, item?._id);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  // Enhanced add to cart with animation and better state management
  const handleAddToCart = useCallback(async (item: any) => {
    console.log("user", user)
    if (!user?._id) return;
    console.log("item", item)
    const cartItem: any = {
      id: item._id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.images[0],
    };
    console.log("cartItem", cartItem)
    let response = await addToCart(user._id, cartItem);
    console.log("response", response)
    // @ts-ignore
    if (response.success) {
      alert("Product added to cart successfully");
    } else {
      alert(response);
    }
  }, [cartItems, dispatch]);

  const removeFromCart1 = useCallback((itemId: any) => {
    try {
      let response = removeFromCart(user._id, itemId);
      console.log("response", response)
      // @ts-ignore
      if (response.success) {
        alert("Product removed from cart successfully");
      } else {
        // @ts-ignore
        alert(response.message);
      }
    } catch (error) {
      console.log(error)
      alert(error)
    }
  }, [cartItems, dispatch]);

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
        updateQuantity(user._id, productId, newQuantity);
      } else {
        // Update quantity in both local state and global state
        setCartItems(cartItems.map((item: any) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        ));
        dispatch({ type: "UPDATE_QUANTITY", id: productId, qty: newQuantity });
        updateQuantity(user._id, productId, newQuantity);
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
                <span className="text-sm text-gray-700 dark:text-gray-300">Hi, {user?.firstName || user?.name || 'User'}</span>
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
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-gray-700 dark:text-gray-300"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>


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

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        >

          <HeroSlider type="LandInding" />
        </div>
        <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            Fresh Groceries delivered to your doorstep
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Quality products, unbeatable prices, lightning-fast delivery
          </p>

          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search for groceries..."
                className="pl-10 py-3 text-gray-900 bg-white/90 backdrop-blur-sm border-0 rounded-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => router.push("productList")} size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full">
              Shop Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-full bg-transparent"
            >
              View Offers
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Grocery Categories */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Shop by Category</h2>

          <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide">
            {groceryCategories.map((category) => (
              <div
                key={category.id}
                className={`flex-shrink-0 w-32 text-center group cursor-pointer ${selectedCategory === category.id ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                  }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className={`w-20 h-20 mx-auto mb-3 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 ${selectedCategory === category.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/20 dark:bg-gray-700/50'
                  }`}>
                  <span className="text-3xl">{category.icon}</span>
                </div>
                <p className={`text-sm font-medium transition-colors ${selectedCategory === category.id
                  ? 'text-orange-500'
                  : 'text-gray-700 dark:text-gray-300 group-hover:text-orange-500'
                  }`}>
                  {category.name}
                </p>
              </div>
            ))}
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
           { const isWishlisted = wishListsData.some((item: any) => item._id === product._id); return(
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

      {/* Offers and Coupons */}
      <section id="offers" className="py-16 bg-gray-50 dark:bg-gray-800">
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
      </section>

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
                <Input placeholder="Your Name" />
                <Input type="email" placeholder="Your Email" />
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white"
                ></textarea>
                <Button className="w-full bg-orange-500 hover:bg-orange-600">Send Message</Button>
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
    <main>
      <Grocery />
      <SupportChat />
    </main>
  );
}