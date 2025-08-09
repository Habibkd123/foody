
"use client"

import React, { useState } from "react"
import {
  Shield,
  Users,
  ShoppingBag,
  Store,
  BarChart3,
  Settings,
  LogOut,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  Ban,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Menu,
  X,
  Activity,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
interface AdminUser {
  id: string
  email: string
  name: string
  lastLogin: string
  avatar?: string
}

interface AdminDashboardProps {
  user: AdminUser
  onClose: () => void
}


export default function AdminDashboard({  onClose }: AdminDashboardProps) {
    let user= {
         name: "Super Admin",
    color: "bg-purple-500",
    icon: ""
    }
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  // Sample data
  const dashboardStats = [
    {
      title: "Total Users",
      value: "12,543",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Active Orders",
      value: "1,234",
      change: "+8%",
      trend: "up",
      icon: ShoppingBag,
      color: "bg-green-500",
    },
    {
      title: "Products",
      value: "456",
      change: "+3%",
      trend: "up",
      icon: Store,
      color: "bg-orange-500",
    },
    {
      title: "Revenue",
      value: "₹2.4M",
      change: "-2%",
      trend: "down",
      icon: DollarSign,
      color: "bg-purple-500",
    },
  ]

  const recentOrders = [
    {
      id: "ORD001",
      customer: "John Doe",
      product: "Product A",
      amount: 450,
      status: "delivered",
      time: "2 mins ago",
    },
    {
      id: "ORD002",
      customer: "Jane Smith",
      product: "Product B",
      amount: 680,
      status: "preparing",
      time: "5 mins ago",
    },
    {
      id: "ORD003",
      customer: "Mike Johnson",
      product: "Product C",
      amount: 320,
      status: "cancelled",
      time: "10 mins ago",
    },
  ]

  const recentUsers = [
    {
      id: "USR001",
      name: "Alice Brown",
      email: "alice@example.com",
      joinDate: "2024-01-15",
      orders: 23,
      status: "active",
    },
    {
      id: "USR002",
      name: "Bob Wilson",
      email: "bob@example.com",
      joinDate: "2024-01-14",
      orders: 12,
      status: "active",
    },
    {
      id: "USR003",
      name: "Carol Davis",
      email: "carol@example.com",
      joinDate: "2024-01-13",
      orders: 5,
      status: "banned",
    },
  ]

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "products", label: "Products", icon: Store },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "preparing":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "cancelled":
      case "banned":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 dark:bg-gray-900">
      <div className="flex h-full">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">Admin Panel</span>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Admin Info */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Administrator</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Logout */}
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
          {/* <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="lg:hidden" 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {navigationItems.find((item) => item.id === activeTab)?.label || "Dashboard"}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Welcome back, {user.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {user.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header> */}

          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)}></div>
              <div className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Admin Panel</span>
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
                          ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
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
            {/* Dashboard Overview */}
            {activeTab === "dashboard" && (
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
                            <div className="flex items-center mt-1">
                              {stat.trend === "up" ? (
                                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                              )}
                              <span className={`text-sm ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                                {stat.change}
                              </span>
                            </div>
                          </div>
                          <div className={`p-3 rounded-full ${stat.color}`}>
                            <stat.icon className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
{/* <LatestSignupsTable  data={recentUsers.map(u => ({
    User: u.name,
    Email: u.email,
    Role: "Customer", // or whatever role applies
    "Signup Date": u.joinDate,
    Status: u.status === "active" ? "Active" : u.status === "banned" ? "Banned" : "Pending",
    avatar: u.avatar
  }))}/> */}
                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentOrders.map((order) => (
                          <div
                            key={order.id}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{order.id}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{order.customer}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{order.product}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900 dark:text-white">₹{order.amount}</p>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{order.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentUsers.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>
                                  {user.name.split(" ").map((n) => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Joined {formatDate(user.joinDate)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{user.orders} orders</p>
                              <Badge className={getStatusColor(user.status)}>
                                {user.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Users Management */}
            {activeTab === "users" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input placeholder="Search users..." className="pl-10 w-64" />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Orders
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Join Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                          {recentUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <Avatar className="h-10 w-10">
                                    <AvatarFallback>
                                      {user.name.split(" ").map((n) => n[0]).join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge className={getStatusColor(user.status)}>
                                  {user.status}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {user.orders}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(user.joinDate)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-2">
                                  <Button variant="ghost" size="icon">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="text-red-600">
                                    <Ban className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Orders Management */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order Management</h2>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input placeholder="Search orders..." className="pl-10 w-64" />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{order.id}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{order.customer}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{order.product}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-semibold text-gray-900 dark:text-white">₹{order.amount}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{order.time}</p>
                            </div>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Simple Placeholder for other tabs */}
            {!["dashboard", "users", "orders"].includes(activeTab) && (
              <div className="flex items-center justify-center h-96">
                <Card className="w-full max-w-md">
                  <CardContent className="p-8 text-center">
                    <Activity className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {navigationItems.find((item) => item.id === activeTab)?.label}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      This section is under development.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </div>

        {/* Logout Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <span>Confirm Logout</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to logout from the admin panel?
                </p>
                <div className="flex space-x-3">
                  <Button variant="outline" className="flex-1" onClick={() => setShowLogoutModal(false)}>
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