"use client"

import { useState, useEffect } from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import AdminAuthSystem from "@/components/admin-auth-system"
import AdminDashboard from "@/components/admin-dashboard"
import MyMap from "@/components/ui/mapsData"
import HeroSlider from "@/components/ui/HeroSlider"
import SupportChat from "@/components/SupportChat"
import logo from "./../public/logoGro.png"
export function FoodDeliveryWebsite() {
  const [darkMode, setDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartItems, setCartItems] = useState<any>([])
  const [cartOpen, setCartOpen] = useState<boolean>(false)
  const [activeSection, setActiveSection] = useState("home")
  const [showDashboard, setShowDashboard] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [showAdminAuth, setShowAdminAuth] = useState(false)
  const [showAdminDashboard, setShowAdminDashboard] = useState(false)
  const [adminUser, setAdminUser] = useState(null)

  // Sample data
  const foodCategories = [
    { id: 1, name: "North Indian", image: "/placeholder.svg?height=80&width=80", icon: "🍛" },
    { id: 2, name: "South Indian", image: "/placeholder.svg?height=80&width=80", icon: "🥞" },
    { id: 3, name: "Chinese", image: "/placeholder.svg?height=80&width=80", icon: "🥡" },
    { id: 4, name: "Italian", image: "/placeholder.svg?height=80&width=80", icon: "🍝" },
    { id: 5, name: "Street Food", image: "/placeholder.svg?height=80&width=80", icon: "🌮" },
    { id: 6, name: "Desserts", image: "/placeholder.svg?height=80&width=80", icon: "🍰" },
    { id: 7, name: "Beverages", image: "/placeholder.svg?height=80&width=80", icon: "🥤" },
    { id: 8, name: "Fast Food", image: "/placeholder.svg?height=80&width=80", icon: "🍔" },
  ]

  const restaurants = [
    {
      id: 1,
      name: "Spice Garden",
      image: "https://media.istockphoto.com/id/1427322105/photo/bombay-duck-fry-served-in-a-plate-over-white-background-selective-focus.webp?a=1&b=1&s=612x612&w=0&k=20&c=VVjTpR29Qss8AMMmsuY-E5NlNWLPPW_5THMCqrgNJr4=",
      rating: 4.5,
      deliveryTime: "30 mins",
      priceRange: "₹200-400",
      isOpen: true,
      cuisine: "North Indian",
    },
    {
      id: 2,
      name: "Dragon Palace",
      image: "https://media.istockphoto.com/id/508214703/photo/image-of-chinese-takeaway-selection-on-white-plate-sweet-and-sour-sauce.jpg?s=1024x1024&w=is&k=20&c=YP6SE70aeQxWLloYe9X30gKYbDm2esPp4MSMGtDtVcs=",
      rating: 4.2,
      deliveryTime: "25 mins",
      priceRange: "₹150-300",
      isOpen: true,
      cuisine: "Chinese",
    },
    {
      id: 3,
      name: "Pasta Corner",
      image: "https://images.unsplash.com/photo-1708184528301-b0dad28dded5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fFBhc3RhJTIwQ29ybmVyJTIwSXRhbGlhbmZvb2R8ZW58MHx8MHx8fDA%3D",
      rating: 4.7,
      deliveryTime: "35 mins",
      priceRange: "₹300-500",
      isOpen: false,
      cuisine: "Italian",
    },
    {
      id: 4,
      name: "Street Bites",
      image: "https://images.unsplash.com/photo-1638689253215-0e730f5b9e1e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8U3RyZWV0JTIwRm9vZCUyMElTdHJlZXQlMjBCaXRlcyUyMGZvb2R8ZW58MHx8MHx8fDA%3D",
      rating: 4.3,
      deliveryTime: "20 mins",
      priceRange: "₹100-250",
      isOpen: true,
      cuisine: "Street Food",
    },
    {
      id: 5,
      name: "South Delights",
      image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fFNvdXRoJTIwSW5kaWFuJTIwU291dGglMjBEZWxpZ2h0cyUyMGZvb2R8ZW58MHx8MHx8fDA%3D",
      rating: 4.6,
      deliveryTime: "28 mins",
      priceRange: "₹180-350",
      isOpen: true,
      cuisine: "South Indian",
    },
    {
      id: 6,
      name: "Sweet Dreams",
      image: "https://plus.unsplash.com/premium_photo-1717529138199-0644d58ce0cf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8U3dlZXQlMjBEcmVhbXMlMjBEZXNzZXJ0cyUyMGZvb2R8ZW58MHx8MHx8fDA%3D",
      rating: 4.4,
      deliveryTime: "15 mins",
      priceRange: "₹80-200",
      isOpen: true,
      cuisine: "Desserts",
    },
  ]

  const foodItems = [
    {
      id: 1,
      name: "Butter Chicken",
      description: "Creamy tomato-based curry with tender chicken",
      price: 320,
      image: "https://images.unsplash.com/photo-1714799263303-29e7d638578a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8QnV0dGVyJTIwQ2hpY2tlbiUyMGZvb2R8ZW58MHx8MHx8fDA%3D",
      isVeg: false,
      restaurant: "Spice Garden",
    },
    {
      id: 2,
      name: "Paneer Tikka",
      description: "Grilled cottage cheese with aromatic spices",
      price: 280,
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8UGFuZWVyJTIwVGlra2F8ZW58MHx8MHx8fDA%3D",
      isVeg: true,
      restaurant: "Spice Garden",
    },
    {
      id: 3,
      name: "Hakka Noodles",
      description: "Stir-fried noodles with vegetables and sauces",
      price: 220,
      image: "https://media.istockphoto.com/id/1159004213/photo/schezwan-noodles-with-vegetables-in-a-plate-top-view.webp?a=1&b=1&s=612x612&w=0&k=20&c=1urIQ80xe_34IwgSMNhg4FJAYYGc53-38yT47NnLlEE=",
      isVeg: true,
      restaurant: "Dragon Palace",
    },
    {
      id: 4,
      name: "Margherita Pizza",
      description: "Classic pizza with fresh mozzarella and basil",
      price: 380,
      image: "https://media.istockphoto.com/id/1414575281/photo/a-delicious-and-tasty-italian-pizza-margherita-with-tomatoes-and-buffalo-mozzarella.webp?a=1&b=1&s=612x612&w=0&k=20&c=qO_TA5oZTY4d1e14l6noMYmAB26sSoE8L0m_VYl2bcU=",
      isVeg: true,
      restaurant: "Pasta Corner",
    },
  ]

  const offers = [
    {
      id: 1,
      title: "Flat 20% Off",
      code: "SAVE20",
      description: "On orders above ₹500",
      expiry: "31 Dec 2024",
      color: "bg-gradient-to-r from-orange-400 to-red-500",
    },
    {
      id: 2,
      title: "Buy 1 Get 1 Free",
      code: "BOGO",
      description: "On selected items",
      expiry: "25 Dec 2024",
      color: "bg-gradient-to-r from-green-400 to-blue-500",
    },
    {
      id: 3,
      title: "Free Delivery",
      code: "FREEDEL",
      description: "On orders above ₹300",
      expiry: "30 Dec 2024",
      color: "bg-gradient-to-r from-purple-400 to-pink-500",
    },
  ]

  const addToCart = (item: any) => {
    const existingItem = cartItems.find((cartItem: any) => cartItem.id === item.id)
    if (existingItem) {
      setCartItems(
        cartItems.map((cartItem: any) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        ),
      )
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }])
    }
  }

  const removeFromCart = (itemId: any) => {
    setCartItems(cartItems.filter((item: any) => item.id !== itemId))
  }

  const updateQuantity = (itemId: any, newQuantity: any) => {
    if (newQuantity === 0) {
      removeFromCart(itemId)
    } else {
      setCartItems(cartItems.map((item: any) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
    }
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total: any, item: any) => total + item.price * item.quantity, 0)
  }

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const handleAdminLoginSuccess = (user: any) => {
    setAdminUser(user)
    setShowAdminAuth(false)
    setShowAdminDashboard(true)
  }
  let userData = JSON.parse(localStorage.getItem("G-user"))
  const logout =()=>{
    localStorage.removeItem("G-user")
    localStorage.removeItem("token")
    router.push("/")
  }
  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark bg-gray-900" : "bg-white"}`}>
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              {/* <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center"> */}
                {/* <span className="text-white font-bold text-sm">FD</span> */}
                <img src="./logoGro.png" alt="FoodDelivery Logo" className="w-12 h-12 rounded-md" />
              {/* </div> */}
              <span className="text-xl font-bold text-gray-900 dark:text-white">Gro-Delivery</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors">
                Home
              </a>
              <a href="#menu" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors">
                Menu
              </a>
              <a href="#offers" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors">
                Offers
              </a>
              <a href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors">
                Contact
              </a>
              <a href="#profile" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors">
                Profile
              </a>
             {!userData? <Button
                onClick={() => setShowAuth(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full"
              >
                Login
              </Button>:
              <Button
                onClick={() => logout()}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full"
              >
                Logout
              </Button>}
              {/* <Button
                onClick={() => setShowAdminAuth(true)}
                variant="outline"
                className="border-purple-500 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-4 py-2 rounded-full bg-transparent"
              >
                Admin
              </Button> */}
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDarkMode(!darkMode)}
                className="text-gray-700 dark:text-gray-300"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              <Sheet open={cartOpen} onOpenChange={setCartOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative text-gray-700 dark:text-gray-300">
                    <ShoppingCart className="h-5 w-5" />
                    {cartItems.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-orange-500">
                        {cartItems.reduce((sum: any, item: any) => sum + item.quantity, 0)}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle>Your Cart</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {cartItems.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">Your cart is empty</p>
                    ) : (
                      <>
                        {cartItems.map((item: any) => (
                          <div
                            key={item.id}
                            className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          >
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{item.name}</h4>
                              <p className="text-orange-500 font-semibold">₹{item.price}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 bg-transparent"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 bg-transparent"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-red-500"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-semibold">Total: ₹{getTotalPrice()}</span>
                          </div>
                          <Input placeholder="Enter promo code" className="mb-4" />
                          <Button className="w-full bg-orange-500 hover:bg-orange-600">Proceed to Checkout</Button>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-gray-700 dark:text-gray-300"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col space-y-3 pt-4">
                <a href="#home" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors">
                  Home
                </a>
                <a href="#menu" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors">
                  Menu
                </a>
                <a href="#offers" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors">
                  Offers
                </a>
                <a href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors">
                  Contact
                </a>
                <a href="#profile" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors">
                  Profile
                </a>
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
        // style={{
        //   backgroundImage: "url('https://plus.unsplash.com/premium_photo-1663858367001-89e5c92d1e0e?q=80&w=415&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        // }}
        >
          <HeroSlider />
        </div>

        <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            Deliciousness delivered to your doorstep
          </h1>

          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search for dishes, restaurants or cuisines"
                className="pl-10 py-3 text-gray-900 bg-white/90 backdrop-blur-sm border-0 rounded-full"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full">
              Order Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-full bg-transparent"
            >
              Explore Menu
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Food Categories */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">What's on your mind?</h2>

          <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide">
            {foodCategories.map((category) => (
              <div key={category.id} className="flex-shrink-0 w-32 text-center group cursor-pointer">
                <div className="w-20 h-20 mx-auto mb-3 bg-white/20 dark:bg-gray-700/50 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <span className="text-3xl">{category.icon}</span>
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-orange-500 transition-colors">
                  {category.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Restaurants */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Popular Restaurants</h2>
            <Button variant="outline" className="hidden sm:flex items-center space-x-2 bg-transparent">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <Card
                key={restaurant.id}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={restaurant.image || "/placeholder.svg"}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge
                    className={`absolute top-3 right-3 ${restaurant.isOpen ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                      }`}
                  >
                    {restaurant.isOpen ? "Open now" : "Closed"}
                  </Badge>
                </div>

                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{restaurant.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{restaurant.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{restaurant.cuisine}</p>

                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{restaurant.deliveryTime}</span>
                    </div>
                    <span>{restaurant.priceRange}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Food Items Grid */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Popular Dishes</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {foodItems.map((item) => (
              <Card
                key={item.id}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div
                    className={`absolute top-3 left-3 w-4 h-4 rounded-full ${item.isVeg ? "bg-green-500" : "bg-red-500"}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${item.isVeg ? "bg-green-600" : "bg-red-600"} absolute top-1 left-1`}
                    ></div>
                  </div>
                  <Button
                    size="icon"
                    className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-700 shadow-md"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">{item.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">{item.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{item.restaurant}</p>

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-orange-500">₹{item.price}</span>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600" onClick={() => addToCart(item)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Offers and Coupons */}
      <section id="offers" className="py-16">
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

      {/* User Profile Dashboard */}
      <section id="profile" className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Your Profile</h2>

          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-6 mb-6">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src="https://media.istockphoto.com/id/2219271644/photo/portrait-of-cheerful-trendy-interracial-girl-sitting-in-fast-food-restaurant-with-pizza-in.webp?a=1&b=1&s=612x612&w=0&k=20&c=BPTUPeraTndFahbSHW5UWMjDCia4fII-4wnf0vK1q9k=" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">John Doe</h3>
                        <p className="text-gray-600 dark:text-gray-400">sina.doe@gamil.com</p>
                        <p className="text-gray-600 dark:text-gray-400">+91 9876543210</p>
                      </div>
                    </div>
                    <Button className="bg-orange-500 hover:bg-orange-600">Edit Profile</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders" className="mt-6">
                <div className="space-y-4">
                  {[1, 2, 3].map((order) => (
                    <Card key={order}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">Order #{order}001</h4>
                            <p className="text-gray-600 dark:text-gray-400">Spice Garden • 2 items</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Dec {20 + order}, 2024</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 dark:text-white">₹{320 + order * 50}</p>
                            <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                              Reorder
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="favorites" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {foodItems.slice(0, 3).map((item) => (
                    <Card key={item.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                        <h4 className="font-semibold text-gray-900 dark:text-white">{item.name}</h4>
                        <p className="text-orange-500 font-semibold">₹{item.price}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="addresses" className="mt-6">
                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Home</h4>
                          <p className="text-gray-600 dark:text-gray-400">123 Main Street, City, State 12345</p>
                        </div>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">Add New Address</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-16">
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
                    <span className="text-gray-700 dark:text-gray-300">support@fooddelivery.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-orange-500" />
                    <span className="text-gray-700 dark:text-gray-300">123 Food Street, Delivery City, DC 12345</span>
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
                  <span className="text-white font-bold text-sm">FD</span>
                </div>
                <span className="text-xl font-bold">FoodDelivery</span>
              </div>
              <p className="text-gray-400 mb-4">
                Delicious food delivered fast to your doorstep. Quality meals from the best restaurants in your city.
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
                    Order Food
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Restaurants
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
            <p>&copy; 2024 FoodDelivery. All rights reserved.</p>
          </div>
        </div>
      </footer>
      {showDashboard && <UserDashboard onClose={() => setShowDashboard(false)} />}
      {showAuth && <AuthSystem onClose={() => setShowAuth(false)} onLoginSuccess={() => setShowDashboard(true)} />}
      {showAdminAuth && (
        <AdminAuthSystem onClose={() => setShowAdminAuth(false)} onLoginSuccess={handleAdminLoginSuccess} />
      )}
      {showAdminDashboard && adminUser && (
        <AdminDashboard
          user={adminUser}
          onClose={() => {
            setShowAdminDashboard(false)
            setAdminUser(null)
          }}
        />
      )}
    </div>
  )
}

const UserDashboard = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">User Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400">Welcome to your dashboard!</p>
        <Button onClick={onClose} className="mt-4 bg-orange-500 hover:bg-orange-600 text-white">
          Close
        </Button>
      </div>
    </div>
  )
}

const AuthSystem = ({ onClose, onLoginSuccess }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Authentication</h2>
        <p className="text-gray-600 dark:text-gray-400">Login or Sign Up</p>
        <Button onClick={onLoginSuccess} className="mt-4 bg-orange-500 hover:bg-orange-600 text-white">
          Login
        </Button>
        <Button onClick={onClose} className="mt-4 bg-gray-500 hover:bg-gray-600 text-white">
          Close
        </Button>
      </div>
    </div>
  )
}




export default function Page() {
  return (
    <main>
      <FoodDeliveryWebsite />
      <SupportChat />
    </main>
  );
}

