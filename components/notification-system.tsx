"use client"
import { useState, useEffect, useCallback } from "react"
import {
  Bell,
  X,
  Check,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  User,
  ShoppingBag,
  Store,
  Settings,
  Shield,
  Trash2,
  Search,
  Volume2,
  VolumeX,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface Notification {
  id: string
  type: "success" | "warning" | "error" | "info"
  category: "user" | "order" | "restaurant" | "system" | "security"
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  priority: "low" | "medium" | "high" | "critical"
  actionBy?: string
  actionType?: string
  relatedId?: string
  metadata?: Record<string, any>
}

interface NotificationSystemProps {
  adminUser: {
    id: string
    name: string
    role: string
    permissions: string[]
  }
}

const NOTIFICATION_TYPES = {
  success: {
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
  },
  error: {
    icon: XCircle,
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
  },
  info: {
    icon: Info,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
}

const CATEGORY_ICONS = {
  user: User,
  order: ShoppingBag,
  restaurant: Store,
  system: Settings,
  security: Shield,
}

const PRIORITY_COLORS = {
  low: "bg-gray-500",
  medium: "bg-blue-500",
  high: "bg-orange-500",
  critical: "bg-red-500",
}

// Mock WebSocket simulation for real-time notifications
class NotificationWebSocket {
  private listeners: ((notification: Notification) => void)[] = []
  private interval: NodeJS.Timeout | null = null

  connect() {
    // Simulate WebSocket connection
    console.log("🔗 Connected to notification WebSocket")

    // Simulate receiving notifications every 10-30 seconds
    this.interval = setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% chance every interval
        const mockNotification = this.generateMockNotification()
        this.listeners.forEach((listener) => listener(mockNotification))
      }
    }, 15000) // Check every 15 seconds
  }

  disconnect() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
    console.log("🔌 Disconnected from notification WebSocket")
  }

  subscribe(callback: (notification: Notification) => void) {
    this.listeners.push(callback)
  }

  unsubscribe(callback: (notification: Notification) => void) {
    this.listeners = this.listeners.filter((listener) => listener !== callback)
  }

  private generateMockNotification(): Notification {
    const types: Array<Notification["type"]> = ["success", "warning", "error", "info"]
    const categories: Array<Notification["category"]> = ["user", "order", "restaurant", "system", "security"]
    const priorities: Array<Notification["priority"]> = ["low", "medium", "high", "critical"]

    const mockNotifications = [
      {
        type: "success" as const,
        category: "order" as const,
        title: "Order Completed",
        message: "Order #ORD12345 has been successfully delivered to customer.",
        priority: "medium" as const,
        actionType: "order_delivered",
      },
      {
        type: "warning" as const,
        category: "restaurant" as const,
        title: "Restaurant Offline",
        message: "Spice Garden restaurant has gone offline unexpectedly.",
        priority: "high" as const,
        actionType: "restaurant_offline",
      },
      {
        type: "error" as const,
        category: "system" as const,
        title: "Payment Gateway Error",
        message: "Payment processing is experiencing issues. Multiple transactions failed.",
        priority: "critical" as const,
        actionType: "payment_error",
      },
      {
        type: "info" as const,
        category: "user" as const,
        title: "New User Registration",
        message: "A new user has registered: john.doe@example.com",
        priority: "low" as const,
        actionType: "user_registered",
      },
      {
        type: "error" as const,
        category: "security" as const,
        title: "Failed Login Attempts",
        message: "Multiple failed login attempts detected from IP: 192.168.1.100",
        priority: "high" as const,
        actionType: "security_alert",
      },
      {
        type: "success" as const,
        category: "restaurant" as const,
        title: "New Restaurant Added",
        message: "Pizza Palace has been successfully onboarded to the platform.",
        priority: "medium" as const,
        actionType: "restaurant_added",
      },
    ]

    const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)]

    return {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...randomNotification,
      timestamp: new Date(),
      isRead: false,
      actionBy: "System",
      relatedId: `REL_${Math.random().toString(36).substr(2, 6)}`,
      metadata: {
        source: "realtime",
        severity: randomNotification.priority,
      },
    }
  }
}

export default function NotificationSystem({ adminUser }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState<{
    type?: string
    category?: string
    priority?: string
    isRead?: boolean
  }>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showOnlyUnread, setShowOnlyUnread] = useState(false)
  const [ws] = useState(() => new NotificationWebSocket())

  // Initialize with some mock notifications
  useEffect(() => {
    const initialNotifications: Notification[] = [
      {
        id: "1",
        type: "warning",
        category: "order",
        title: "Order Delayed",
        message: "Order #ORD001 is running 15 minutes behind schedule.",
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        isRead: false,
        priority: "high",
        actionBy: "System",
        actionType: "order_delayed",
        relatedId: "ORD001",
      },
      {
        id: "2",
        type: "success",
        category: "user",
        title: "User Verification",
        message: "User alice@example.com has been successfully verified.",
        timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
        isRead: true,
        priority: "medium",
        actionBy: adminUser.name,
        actionType: "user_verified",
        relatedId: "USR002",
      },
      {
        id: "3",
        type: "error",
        category: "system",
        title: "Database Connection",
        message: "Temporary database connection issue resolved automatically.",
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        isRead: false,
        priority: "critical",
        actionBy: "System",
        actionType: "db_error",
      },
    ]

    setNotifications(initialNotifications)
    setUnreadCount(initialNotifications.filter((n) => !n.isRead).length)
  }, [adminUser.name])

  // WebSocket connection
  useEffect(() => {
    const handleNewNotification = (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev])
      setUnreadCount((prev) => prev + 1)

      // Play notification sound
      if (soundEnabled) {
        playNotificationSound(notification.priority)
      }

      // Show browser notification if permission granted
      showBrowserNotification(notification)
    }

    ws.subscribe(handleNewNotification)
    ws.connect()

    return () => {
      ws.unsubscribe(handleNewNotification)
      ws.disconnect()
    }
  }, [ws, soundEnabled])

  // Request browser notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  const playNotificationSound = (priority: Notification["priority"]) => {
    if (!soundEnabled) return

    // Create audio context for different sounds based on priority
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Different frequencies for different priorities
    const frequencies = {
      low: 400,
      medium: 600,
      high: 800,
      critical: 1000,
    }

    oscillator.frequency.setValueAtTime(frequencies[priority], audioContext.currentTime)
    oscillator.type = "sine"

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.3)
  }

  const showBrowserNotification = (notification: Notification) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`${notification.title}`, {
        body: notification.message,
        icon: "/placeholder.svg?height=64&width=64",
        tag: notification.id,
        requireInteraction: notification.priority === "critical",
      })
    }
  }

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)))
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    setUnreadCount(0)
  }, [])

  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications((prev) => {
      const notification = prev.find((n) => n.id === notificationId)
      const newNotifications = prev.filter((n) => n.id !== notificationId)

      if (notification && !notification.isRead) {
        setUnreadCount((prevCount) => Math.max(0, prevCount - 1))
      }

      return newNotifications
    })
  }, [])

  const clearAllNotifications = useCallback(() => {
    setNotifications([])
    setUnreadCount(0)
  }, [])

  const filteredNotifications = notifications.filter((notification) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!notification.title.toLowerCase().includes(query) && !notification.message.toLowerCase().includes(query)) {
        return false
      }
    }

    // Type filter
    if (filter.type && notification.type !== filter.type) {
      return false
    }

    // Category filter
    if (filter.category && notification.category !== filter.category) {
      return false
    }

    // Priority filter
    if (filter.priority && notification.priority !== filter.priority) {
      return false
    }

    // Read status filter
    if (showOnlyUnread && notification.isRead) {
      return false
    }

    return true
  })

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const getNotificationIcon = (notification: Notification) => {
    const typeConfig = NOTIFICATION_TYPES[notification.type]
    return typeConfig.icon
  }

  const getCategoryIcon = (category: Notification["category"]) => {
    return CATEGORY_ICONS[category]
  }

  return (
    <>
      {/* Notification Bell Button */}
      <div className="relative">
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 animate-pulse">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>

        {/* Notification Panel */}
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="h-8 w-8"
                  >
                    {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-8"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch id="unread-only" checked={showOnlyUnread} onCheckedChange={setShowOnlyUnread} />
                    <Label htmlFor="unread-only" className="text-sm">
                      Unread only
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Select
                      value={filter.category || "all"}
                      onValueChange={(value) =>
                        setFilter((prev) => ({ ...prev, category: value === "all" ? undefined : value }))
                      }
                    >
                      <SelectTrigger className="w-24 h-8">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="user">Users</SelectItem>
                        <SelectItem value="order">Orders</SelectItem>
                        <SelectItem value="restaurant">Restaurants</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={filter.priority || "all"}
                      onValueChange={(value) =>
                        setFilter((prev) => ({ ...prev, priority: value === "all" ? undefined : value }))
                      }
                    >
                      <SelectTrigger className="w-24 h-8">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {notifications.length > 0 && (
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                    className="text-xs"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Mark all read
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllNotifications}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Clear all
                  </Button>
                </div>
              )}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {notifications.length === 0 ? "No notifications yet" : "No notifications match your filters"}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredNotifications.map((notification) => {
                    const TypeIcon = getNotificationIcon(notification)
                    const CategoryIcon = getCategoryIcon(notification.category)
                    const typeConfig = NOTIFICATION_TYPES[notification.type]

                    return (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          !notification.isRead ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {/* Icon */}
                          <div className={`flex-shrink-0 p-2 rounded-full ${typeConfig.bgColor}`}>
                            <TypeIcon className={`h-4 w-4 ${typeConfig.color}`} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <CategoryIcon className="h-3 w-3 text-gray-400" />
                                  <h4
                                    className={`text-sm font-medium ${
                                      !notification.isRead
                                        ? "text-gray-900 dark:text-white"
                                        : "text-gray-700 dark:text-gray-300"
                                    }`}
                                  >
                                    {notification.title}
                                  </h4>
                                  <Badge
                                    className={`${PRIORITY_COLORS[notification.priority]} hover:${PRIORITY_COLORS[notification.priority]} text-xs px-1 py-0`}
                                  >
                                    {notification.priority}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{notification.message}</p>
                                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                                  <Clock className="h-3 w-3" />
                                  <span>{formatTimestamp(notification.timestamp)}</span>
                                  {notification.actionBy && (
                                    <>
                                      <span>•</span>
                                      <span>by {notification.actionBy}</span>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center space-x-1 ml-2">
                                {!notification.isRead && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => markAsRead(notification.id)}
                                    className="h-6 w-6"
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteNotification(notification.id)}
                                  className="h-6 w-6 text-red-600 hover:text-red-700"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {filteredNotifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Showing {filteredNotifications.length} of {notifications.length} notifications
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Click outside to close */}
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </>
  )
}

// Activity Logger Hook
export const useActivityLogger = (adminUser: { id: string; name: string; role: string }) => {
  const logActivity = useCallback(
    (
      action: string,
      category: Notification["category"],
      details: {
        title: string
        message: string
        priority?: Notification["priority"]
        relatedId?: string
        metadata?: Record<string, any>
      },
    ) => {
      // In a real app, this would send to your backend
      console.log("📝 Activity logged:", {
        adminId: adminUser.id,
        adminName: adminUser.name,
        adminRole: adminUser.role,
        action,
        category,
        ...details,
        timestamp: new Date().toISOString(),
      })

      // You could also trigger a notification here
      // This would typically be handled by your backend and pushed via WebSocket
    },
    [adminUser],
  )

  return { logActivity }
}
