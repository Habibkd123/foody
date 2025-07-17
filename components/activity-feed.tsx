"use client"
import { useState, useEffect } from "react"
import {
  Activity,
  User,
  ShoppingBag,
  Store,
  Settings,
  Shield,
  Clock,
  Search,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface ActivityLog {
  id: string
  adminId: string
  adminName: string
  adminRole: string
  action: string
  category: "user" | "order" | "restaurant" | "system" | "security"
  title: string
  description: string
  timestamp: Date
  ipAddress: string
  userAgent: string
  success: boolean
  relatedId?: string
  metadata?: Record<string, any>
}

interface ActivityFeedProps {
  adminUser: {
    id: string
    name: string
    role: string
    permissions: string[]
  }
}

const CATEGORY_ICONS = {
  user: User,
  order: ShoppingBag,
  restaurant: Store,
  system: Settings,
  security: Shield,
}

const CATEGORY_COLORS = {
  user: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  order: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  restaurant: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
  system: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  security: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
}

const ACTION_TYPES = {
  // User actions
  user_created: { icon: User, label: "User Created", color: "text-green-600" },
  user_updated: { icon: User, label: "User Updated", color: "text-blue-600" },
  user_deleted: { icon: User, label: "User Deleted", color: "text-red-600" },
  user_banned: { icon: Shield, label: "User Banned", color: "text-red-600" },
  user_unbanned: { icon: Shield, label: "User Unbanned", color: "text-green-600" },

  // Order actions
  order_created: { icon: ShoppingBag, label: "Order Created", color: "text-green-600" },
  order_updated: { icon: ShoppingBag, label: "Order Updated", color: "text-blue-600" },
  order_cancelled: { icon: XCircle, label: "Order Cancelled", color: "text-red-600" },
  order_refunded: { icon: ShoppingBag, label: "Order Refunded", color: "text-orange-600" },

  // Restaurant actions
  restaurant_added: { icon: Store, label: "Restaurant Added", color: "text-green-600" },
  restaurant_updated: { icon: Store, label: "Restaurant Updated", color: "text-blue-600" },
  restaurant_removed: { icon: Store, label: "Restaurant Removed", color: "text-red-600" },

  // System actions
  settings_updated: { icon: Settings, label: "Settings Updated", color: "text-blue-600" },
  backup_created: { icon: Settings, label: "Backup Created", color: "text-green-600" },
  system_maintenance: { icon: Settings, label: "System Maintenance", color: "text-orange-600" },

  // Security actions
  login_success: { icon: CheckCircle, label: "Login Success", color: "text-green-600" },
  login_failed: { icon: XCircle, label: "Login Failed", color: "text-red-600" },
  permission_changed: { icon: Shield, label: "Permission Changed", color: "text-blue-600" },
  security_alert: { icon: AlertTriangle, label: "Security Alert", color: "text-red-600" },
}

export default function ActivityFeed({ adminUser }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [filteredActivities, setFilteredActivities] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    category: "all",
    admin: "all",
    dateRange: "today",
    success: "all",
  })
  const [searchQuery, setSearchQuery] = useState("")

  // Mock activity data
  useEffect(() => {
    const mockActivities: ActivityLog[] = [
      {
        id: "act_001",
        adminId: adminUser.id,
        adminName: adminUser.name,
        adminRole: adminUser.role,
        action: "user_banned",
        category: "security",
        title: "User Account Banned",
        description: "Banned user account for violating terms of service",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        ipAddress: "192.168.1.100",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        success: true,
        relatedId: "USR_123",
        metadata: { reason: "spam", duration: "permanent" },
      },
      {
        id: "act_002",
        adminId: "admin_002",
        adminName: "Jane Admin",
        adminRole: "admin",
        action: "order_refunded",
        category: "order",
        title: "Order Refund Processed",
        description: "Processed refund for cancelled order #ORD12345",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        ipAddress: "192.168.1.101",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        success: true,
        relatedId: "ORD_12345",
        metadata: { amount: 450, reason: "customer_request" },
      },
      {
        id: "act_003",
        adminId: "admin_003",
        adminName: "Mike Manager",
        adminRole: "manager",
        action: "restaurant_added",
        category: "restaurant",
        title: "New Restaurant Onboarded",
        description: "Successfully onboarded Pizza Palace to the platform",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        ipAddress: "192.168.1.102",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        success: true,
        relatedId: "REST_456",
        metadata: { cuisine: "Italian", location: "Downtown" },
      },
      {
        id: "act_004",
        adminId: adminUser.id,
        adminName: adminUser.name,
        adminRole: adminUser.role,
        action: "login_failed",
        category: "security",
        title: "Failed Login Attempt",
        description: "Multiple failed login attempts detected",
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        ipAddress: "192.168.1.200",
        userAgent: "Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36",
        success: false,
        relatedId: "USR_789",
        metadata: { attempts: 5, blocked: true },
      },
      {
        id: "act_005",
        adminId: "admin_004",
        adminName: "Sarah Support",
        adminRole: "support",
        action: "user_updated",
        category: "user",
        title: "User Profile Updated",
        description: "Updated user profile information and preferences",
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        ipAddress: "192.168.1.103",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        success: true,
        relatedId: "USR_789",
        metadata: { fields_updated: ["email", "phone", "address"] },
      },
    ]

    setActivities(mockActivities)
    setFilteredActivities(mockActivities)
  }, [adminUser])

  // Filter activities
  useEffect(() => {
    let filtered = activities

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (activity) =>
          activity.title.toLowerCase().includes(query) ||
          activity.description.toLowerCase().includes(query) ||
          activity.adminName.toLowerCase().includes(query) ||
          activity.action.toLowerCase().includes(query),
      )
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter((activity) => activity.category === filters.category)
    }

    // Admin filter
    if (filters.admin !== "all") {
      filtered = filtered.filter((activity) => activity.adminId === filters.admin)
    }

    // Success filter
    if (filters.success !== "all") {
      const isSuccess = filters.success === "true"
      filtered = filtered.filter((activity) => activity.success === isSuccess)
    }

    // Date range filter
    if (filters.dateRange !== "all") {
      const now = new Date()
      let startDate: Date

      switch (filters.dateRange) {
        case "today":
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        default:
          startDate = new Date(0)
      }

      filtered = filtered.filter((activity) => activity.timestamp >= startDate)
    }

    setFilteredActivities(filtered)
  }, [activities, searchQuery, filters])

  const refreshActivities = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const exportActivities = () => {
    const csvContent = [
      ["Timestamp", "Admin", "Action", "Category", "Title", "Description", "Success", "IP Address"].join(","),
      ...filteredActivities.map((activity) =>
        [
          activity.timestamp.toISOString(),
          activity.adminName,
          activity.action,
          activity.category,
          `"${activity.title}"`,
          `"${activity.description}"`,
          activity.success,
          activity.ipAddress,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `admin_activities_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getUniqueAdmins = () => {
    const admins = new Map()
    activities.forEach((activity) => {
      if (!admins.has(activity.adminId)) {
        admins.set(activity.adminId, {
          id: activity.adminId,
          name: activity.adminName,
          role: activity.adminRole,
        })
      }
    })
    return Array.from(admins.values())
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Feed</h2>
          <p className="text-gray-600 dark:text-gray-400">Monitor all admin activities and system events</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={refreshActivities} disabled={loading} className="bg-transparent">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportActivities} className="bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select
              value={filters.category}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="user">User Management</SelectItem>
                <SelectItem value="order">Order Management</SelectItem>
                <SelectItem value="restaurant">Restaurant Management</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="security">Security</SelectItem>
              </SelectContent>
            </Select>

            {/* Admin Filter */}
            <Select value={filters.admin} onValueChange={(value) => setFilters((prev) => ({ ...prev, admin: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All Admins" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Admins</SelectItem>
                {getUniqueAdmins().map((admin) => (
                  <SelectItem key={admin.id} value={admin.id}>
                    {admin.name} ({admin.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Date Range Filter */}
            <Select
              value={filters.dateRange}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, dateRange: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">This month</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>

            {/* Success Filter */}
            <Select
              value={filters.success}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, success: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Results" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Results</SelectItem>
                <SelectItem value="true">Success Only</SelectItem>
                <SelectItem value="false">Failed Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Activities</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{filteredActivities.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Successful</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {filteredActivities.filter((a) => a.success).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Failed</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {filteredActivities.filter((a) => !a.success).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Admins</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{getUniqueAdmins().length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activities List */}
      <Card>
        <CardContent className="p-0">
          {filteredActivities.length === 0 ? (
            <div className="p-8 text-center">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No activities found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredActivities.map((activity) => {
                const CategoryIcon = CATEGORY_ICONS[activity.category]
                const actionConfig = ACTION_TYPES[activity.action as keyof typeof ACTION_TYPES]
                const ActionIcon = actionConfig?.icon || Activity

                return (
                  <div key={activity.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-start space-x-4">
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 p-2 rounded-full ${
                          activity.success ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"
                        }`}
                      >
                        <ActionIcon
                          className={`h-4 w-4 ${
                            activity.success ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                          }`}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</h4>
                              <Badge className={CATEGORY_COLORS[activity.category]}>{activity.category}</Badge>
                              {!activity.success && (
                                <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                                  Failed
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{activity.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                              <div className="flex items-center space-x-1">
                                <Avatar className="h-4 w-4">
                                  <AvatarFallback className="text-xs">
                                    {activity.adminName
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{activity.adminName}</span>
                                <Badge className="text-xs px-1 py-0 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                                  {activity.adminRole}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{formatTimestamp(activity.timestamp)}</span>
                              </div>
                              <span>IP: {activity.ipAddress}</span>
                              {activity.relatedId && <span>ID: {activity.relatedId}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
