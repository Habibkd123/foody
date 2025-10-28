"use client"

import { useState, useEffect } from 'react'
import { Bell, Check, Info, AlertTriangle, AlertCircle, Megaphone, ExternalLink, Trash2, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Notification {
  _id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'announcement'
  priority: 'low' | 'medium' | 'high'
  icon?: string
  link?: string
  linkText?: string
  createdAt: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [readNotifications, setReadNotifications] = useState<string[]>([])

  useEffect(() => {
    fetchNotifications()
    loadReadNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications?location=home')
      const data = await response.json()
      
      if (data.success) {
        setNotifications(data.data)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadReadNotifications = () => {
    const read = localStorage.getItem('readNotifications')
    if (read) {
      setReadNotifications(JSON.parse(read))
    }
  }

  const markAsRead = (notificationId: string) => {
    if (!readNotifications.includes(notificationId)) {
      const newRead = [...readNotifications, notificationId]
      setReadNotifications(newRead)
      localStorage.setItem('readNotifications', JSON.stringify(newRead))
      trackNotification(notificationId, 'view')
    }
  }

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n._id)
    setReadNotifications(allIds)
    localStorage.setItem('readNotifications', JSON.stringify(allIds))
  }

  const clearNotification = (notificationId: string) => {
    setNotifications(notifications.filter(n => n._id !== notificationId))
    markAsRead(notificationId)
  }

  const trackNotification = async (notificationId: string, action: 'view' | 'click') => {
    try {
      await fetch('/api/notifications/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId, action })
      })
    } catch (error) {
      console.error('Error tracking notification:', error)
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification._id)
    if (notification.link) {
      trackNotification(notification._id, 'click')
      window.open(notification.link, '_blank')
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <Check className="w-6 h-6 text-green-500" />
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-500" />
      case 'announcement':
        return <Megaphone className="w-6 h-6 text-purple-500" />
      default:
        return <Info className="w-6 h-6 text-blue-500" />
    }
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`
    return date.toLocaleDateString()
  }

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !readNotifications.includes(n._id))
    : notifications

  const unreadCount = notifications.filter(n => !readNotifications.includes(n._id)).length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Check className="w-4 h-4 mr-2" />
                Mark all as read
              </Button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-orange-500 hover:bg-orange-600' : ''}
            >
              All ({notifications.length})
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              onClick={() => setFilter('unread')}
              className={filter === 'unread' ? 'bg-orange-500 hover:bg-orange-600' : ''}
            >
              Unread ({unreadCount})
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-4">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Bell className="w-20 h-20 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                {filter === 'unread' 
                  ? 'You\'re all caught up! Check back later for updates.'
                  : 'We\'ll notify you when something important happens.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => {
              const isUnread = !readNotifications.includes(notification._id)
              
              return (
                <Card
                  key={notification._id}
                  className={`transition-all duration-300 hover:shadow-lg cursor-pointer ${
                    isUnread ? 'border-l-4 border-l-orange-500 bg-orange-50/50 dark:bg-orange-900/10' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        {notification.icon ? (
                          <div className="text-4xl">{notification.icon}</div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            {getIcon(notification.type)}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                              {notification.title}
                            </h3>
                            {isUnread && (
                              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                            )}
                            {notification.priority === 'high' && (
                              <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200">
                                Important
                              </Badge>
                            )}
                            <Badge className="capitalize">
                              {notification.type}
                            </Badge>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              clearNotification(notification._id)
                            }}
                            className="flex-shrink-0 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Clear notification"
                          >
                            <Trash2 className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>

                        <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {getTimeAgo(notification.createdAt)}
                          </span>

                          {notification.link && (
                            <Button
                              variant="link"
                              size="sm"
                              className="text-orange-600 dark:text-orange-400 font-semibold p-0 h-auto"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleNotificationClick(notification)
                              }}
                            >
                              {notification.linkText || 'Learn More'}
                              <ExternalLink className="w-4 h-4 ml-1" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
