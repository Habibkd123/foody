"use client"

import { useState, useEffect } from "react"
import {
  Home,
  ShoppingBag,
  ShoppingCart,
  Heart,
  User,
  LogOut,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  Star,
  Clock,
  Plus,
  Minus,
  Trash2,
  Filter,
  CreditCard,
  Settings,
  Camera,
  Edit,
  AlertCircle,
  Wallet,
  TrendingUp,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UserDashboardProps {
  onClose: () => void
}

export default function UserDashboard({ onClose }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState("home")
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Butter Chicken",
      image: "/placeholder.svg?height=60&width=60",
      price: 320,
      quantity: 2,
      restaurant: "Spice Garden",
    },
    {
      id: 2,
      name: "Paneer Tikka",
      image: "/placeholder.svg?height=60&width=60",
      price: 280,
      quantity: 1,
      restaurant: "Spice Garden",
    },
  ])

  // Sample data
  const user = {
    name: "Rahul Kumar",
    email: "rahul.kumar@example.com",
    phone: "+91 9876543210",
    avatar: "/placeholder.svg?height=40&width=40",
  }

  const dashboardStats = [
    { title: "Total Orders", value: "47", icon: ShoppingBag, color: "bg-blue-500" },
    { title: "Active Orders", value: "2", icon: Clock, color: "bg-orange-500" },
    { title: "Saved Dishes", value: "23", icon: Heart, color: "bg-red-500" },
    { title: "Wallet Balance", value: "₹1,250", icon: Wallet, color: "bg-green-500" },
  ]

  const recentOrders = [
    {
      id: 1,
      items: ["Butter Chicken", "Naan", "Rice"],
      restaurant: "Spice Garden",
      date: "2024-01-15",
      time: "7:30 PM",
      total: 450,
      status: "Delivered",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 2,
      items: ["Margherita Pizza", "Garlic Bread"],
      restaurant: "Pizza Corner",
      date: "2024-01-14",
      time: "2:15 PM",
      total: 380,
      status: "Delivered",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 3,
      items: ["Hakka Noodles", "Spring Rolls"],
      restaurant: "Dragon Palace",
      date: "2024-01-13",
      time: "8:45 PM",
      total: 320,
      status: "In Transit",
      image: "/placeholder.svg?height=60&width=60",
    },
  ]

  const favoriteItems = [
    {
      id: 1,
      name: "Butter Chicken",
      restaurant: "Spice Garden",
      price: 320,
      image: "/placeholder.svg?height=150&width=200",
      rating: 4.5,
    },
    {
      id: 2,
      name: "Margherita Pizza",
      restaurant: "Pizza Corner",
      price: 380,
      image: "/placeholder.svg?height=150&width=200",
      rating: 4.7,
    },
    {
      id: 3,
      name: "Hakka Noodles",
      restaurant: "Dragon Palace",
      price: 220,
      image: "/placeholder.svg?height=150&width=200",
      rating: 4.3,
    },
    {
      id: 4,
      name: "Paneer Tikka",
      restaurant: "Spice Garden",
      price: 280,
      image: "/placeholder.svg?height=150&width=200",
      rating: 4.6,
    },
  ]

  const recommendedMeals = [
    {
      id: 1,
      name: "Today's Special Thali",
      restaurant: "Home Kitchen",
      price: 199,
      image: "/placeholder.svg?height=120&width=180",
      discount: "20% OFF",
    },
    {
      id: 2,
      name: "Chicken Biryani",
      restaurant: "Biryani House",
      price: 299,
      image: "/placeholder.svg?height=120&width=180",
      discount: "15% OFF",
    },
    {
      id: 3,
      name: "Veg Combo",
      restaurant: "Green Garden",
      price: 179,
      image: "/placeholder.svg?height=120&width=180",
      discount: "25% OFF",
    },
  ]

  const navigationItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "cart", label: "Cart", icon: ShoppingCart },
    { id: "favorites", label: "Favorites", icon: Heart },
    { id: "profile", label: "Profile", icon: User },
  ]

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter((item) => item.id !== itemId))
    } else {
      setCartItems(cartItems.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
    }
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500"
      case "In Transit":
        return "bg-blue-500"
      case "Cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  return (
    <div className={`fixed inset-0 z-50 ${darkMode ? "dark" : ""}`}>
      <div className="flex h-full bg-gray-50 dark:bg-gray-900">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">FD</span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">Dashboard</span>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={() => setShowLogoutModal(true)}
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          {/* Top Header */}
          <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
                  <Menu className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Welcome back, {user?.name.split(" ")[0]}!
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)}>
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                    3
                  </Badge>
                </Button>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {user?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)}></div>
              <div className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">FD</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Dashboard</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <nav className="px-4 py-6 space-y-2">
                  {navigationItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id)
                        setSidebarOpen(false)
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                          ? "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          )}

          {/* Dashboard Content */}
          <main className="p-4 lg:p-6">
            {/* Home Dashboard */}
            {activeTab === "home" && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {dashboardStats.map((stat, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                          </div>
                          <div className={`p-3 rounded-full ${stat.color}`}>
                            <stat.icon className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Today's Recommended Meals */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Today's Recommended</span>
                      <TrendingUp className="h-5 w-5 text-orange-500" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {recommendedMeals.map((meal) => (
                        <div key={meal.id} className="relative group cursor-pointer">
                          <div className="relative overflow-hidden rounded-lg">
                            <img
                              src={meal.image || "/placeholder.svg"}
                              alt={meal.name}
                              className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">
                              {meal.discount}
                            </Badge>
                          </div>
                          <div className="mt-3">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{meal.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{meal.restaurant}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="font-bold text-orange-500">₹{meal.price}</span>
                              <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                                Order Now
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Recent Orders</span>
                      <Button variant="ghost" size="sm" onClick={() => setActiveTab("orders")}>
                        View All <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentOrders.slice(0, 3).map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <img
                            src={order.image || "/placeholder.svg"}
                            alt="Order"
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{order.items.join(", ")}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{order.restaurant}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {order.date} • {order.time}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 dark:text-white">₹{order.total}</p>
                            <Badge className={`${getStatusColor(order.status)} hover:${getStatusColor(order.status)}`}>
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Orders Page */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Orders</h2>
                  <div className="flex items-center space-x-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Orders</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="transit">In Transit</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <Card key={order.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center space-x-4">
                            <img
                              src={order.image || "/placeholder.svg"}
                              alt="Order"
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                Order #{order.id.toString().padStart(4, "0")}
                              </h4>
                              <p className="text-gray-600 dark:text-gray-400">{order.items.join(", ")}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{order.restaurant}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {order.date} • {order.time}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-semibold text-gray-900 dark:text-white">₹{order.total}</p>
                              <Badge
                                className={`${getStatusColor(order.status)} hover:${getStatusColor(order.status)}`}
                              >
                                {order.status}
                              </Badge>
                            </div>
                            <div className="flex flex-col space-y-2">
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                              <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                                Reorder
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Cart Page */}
            {activeTab === "cart" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Cart</h2>

                {cartItems.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Your cart is empty</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Add some delicious items to your cart to get started!
                      </p>
                      <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setActiveTab("home")}>
                        Browse Menu
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                      {cartItems.map((item) => (
                        <Card key={item.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-4">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 dark:text-white">{item.name}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{item.restaurant}</p>
                                <p className="text-orange-500 font-semibold">₹{item.price}</p>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2">
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8 bg-transparent"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8 bg-transparent"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-red-500 hover:text-red-700"
                                  onClick={() => updateQuantity(item.id, 0)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Input placeholder="Enter promo code" />
                            <Button variant="outline">Apply</Button>
                          </div>
                          <div className="space-y-2 pt-4 border-t">
                            <div className="flex justify-between">
                              <span>Subtotal</span>
                              <span>₹{getTotalPrice()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Delivery Fee</span>
                              <span>₹40</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Taxes</span>
                              <span>₹{Math.round(getTotalPrice() * 0.05)}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                              <span>Total</span>
                              <span>₹{getTotalPrice() + 40 + Math.round(getTotalPrice() * 0.05)}</span>
                            </div>
                          </div>
                          <Button className="w-full bg-orange-500 hover:bg-orange-600">Proceed to Checkout</Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Favorites Page */}
            {activeTab === "favorites" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Favorites</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {favoriteItems.map((item) => (
                    <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-40 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                        />
                        <Button
                          size="icon"
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500 shadow-md"
                        >
                          <Heart className="h-4 w-4 fill-current" />
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{item.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.restaurant}</p>
                        <div className="flex items-center space-x-1 mb-3">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{item.rating}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-orange-500">₹{item.price}</span>
                          <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                            Reorder
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Page */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center space-x-6">
                        <div className="relative">
                          <Avatar className="w-20 h-20">
                            <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-lg">
                              {user?.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <Button
                            size="icon"
                            className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-orange-500 hover:bg-orange-600"
                          >
                            <Camera className="h-4 w-4" />
                          </Button>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{user?.name}</h3>
                          <p className="text-gray-600 dark:text-gray-400">Update your profile picture</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" defaultValue={user?.name} />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" defaultValue={user?.email} />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" defaultValue={user?.phone} />
                        </div>
                        <div>
                          <Label htmlFor="language">Language</Label>
                          <Select defaultValue="en">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="hi">Hindi</SelectItem>
                              <SelectItem value="ta">Tamil</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                          id="address"
                          placeholder="Enter your delivery address"
                          defaultValue="123 Main Street, City, State 12345"
                        />
                      </div>

                      <Button className="bg-orange-500 hover:bg-orange-600">Save Changes</Button>
                    </CardContent>
                  </Card>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Preferences</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Push Notifications</Label>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Get notified about order updates</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Email Newsletter</Label>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Receive offers and updates</p>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Dark Mode</Label>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Toggle dark theme</p>
                          </div>
                          <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Security</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          <Edit className="h-4 w-4 mr-2" />
                          Change Password
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Payment Methods
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          <Settings className="h-4 w-4 mr-2" />
                          Privacy Settings
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 lg:hidden">
          <div className="grid grid-cols-5 py-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center py-2 px-1 ${
                  activeTab === item.id ? "text-orange-500" : "text-gray-600 dark:text-gray-400"
                }`}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex flex-col items-center py-2 px-1 text-red-500"
            >
              <LogOut className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Logout Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  <span>Confirm Logout</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to logout? You'll need to sign in again to access your account.
                </p>
                <div className="flex space-x-3">
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowLogoutModal(false)}>
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-red-500 hover:bg-red-600"
                    onClick={() => {
                      setShowLogoutModal(false)
                      onClose()
                    }}
                  >
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
