"use client"

import { useState, useEffect, useRef } from 'react'
import { Bell, X, Check, Info, AlertTriangle, AlertCircle, Megaphone, ExternalLink, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'

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
  userState?: {
    read: boolean
    dismissed: boolean
    readAt?: string | null
    dismissedAt?: string | null
  }
}

interface NotificationCenterProps {
  location?: string
}

export default function NotificationCenter({ location = 'home' }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null)
  const lastIdsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    fetchNotifications()
    // SSE for realtime updates
    const es = new EventSource('/api/notifications/stream')
    es.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data)
        if (data?.type?.startsWith('notification:')) {
          // Refresh list
          fetchNotifications().then(() => {
            // Non-intrusive toast for new items if panel is closed
            if (!isOpen) {
              const currentIds = new Set(notifications.map(n => n._id))
              const lastIds = lastIdsRef.current
              const newOnes = notifications.find(n => !lastIds.has(n._id))
              lastIdsRef.current = currentIds
              if (newOnes) {
                toast({
                  title: newOnes.title,
                  description: newOnes.message,
                })
              }
            }
          })
        }
      } catch {}
    }
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      es.close()
    }
  }, [location])

  // When the panel opens, auto-mark the visible (top 5) as read
  useEffect(() => {
    if (!isOpen || notifications.length === 0) return
    const visible = sortForDisplay(notifications).slice(0, 5)
    const unreadVisible = visible.filter(n => !(n.userState?.read) && !(n.userState?.dismissed))
    if (unreadVisible.length === 0) return
    unreadVisible.forEach(n => markAsRead(n._id))
  }, [isOpen, notifications])

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`/api/notifications/user?location=${location}`)
      if (response.status === 401) {
        setIsAuthed(false)
        const pubRes = await fetch(`/api/notifications?location=${location}`)
        const pubData = await pubRes.json()
        if (pubData.success) {
          const list = pubData.data as Notification[]
          setNotifications(list)
          calculateUnreadCount(list)
          lastIdsRef.current = new Set(list.map(n => n._id))
        }
        return
      }
      const data = await response.json()
      if (data.success) {
        setIsAuthed(true)
        const list = data.data as Notification[]
        setNotifications(list)
        calculateUnreadCount(list)
        lastIdsRef.current = new Set(list.map((n: Notification) => n._id))
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const calculateUnreadCount = (notifs: Notification[]) => {
    const unread = notifs.filter(n => !(n.userState?.read) && !(n.userState?.dismissed))
    setUnreadCount(unread.length)
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch('/api/notifications/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId, action: 'read' })
      })
      setNotifications(prev => prev.map(n => n._id === notificationId ? ({
        ...n,
        userState: {
          read: true,
          dismissed: n.userState?.dismissed ?? false,
          readAt: n.userState?.readAt ?? null,
          dismissedAt: n.userState?.dismissedAt ?? null,
        }
      }) : n))
      setUnreadCount(c => Math.max(0, c - 1))
      // Track view
      trackNotification(notificationId, 'view')
    } catch (e) {
      console.error('Failed to mark as read', e)
    }
  }

  const markAllAsRead = () => {
    Promise.all(notifications.map(n => fetch('/api/notifications/user', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationId: n._id, action: 'read' })
    }))).finally(() => {
      setNotifications(prev => prev.map(n => ({
        ...n,
        userState: {
          read: true,
          dismissed: n.userState?.dismissed ?? false,
          readAt: n.userState?.readAt ?? null,
          dismissedAt: n.userState?.dismissedAt ?? null,
        }
      })))
      setUnreadCount(0)
    })
  }

  const clearNotification = (notificationId: string) => {
    // persist dismissal and also mark read
    fetch('/api/notifications/user', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationId, action: 'dismiss' })
    }).catch(() => {})
    markAsRead(notificationId)
    setNotifications(prev => prev.filter(n => n._id !== notificationId))
  }

  const sortForDisplay = (list: Notification[]) => {
    // Unread first, then newest by createdAt desc
    return [...list].sort((a, b) => {
      const ar = a.userState?.read ? 1 : 0
      const br = b.userState?.read ? 1 : 0
      if (ar !== br) return ar - br
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
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
        return <Check className="w-5 h-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'announcement':
        return <Megaphone className="w-5 h-5 text-purple-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-[100] animate-slideDown">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Notifications</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-orange-600 hover:text-orange-700"
              >
                Mark all read
              </Button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">No notifications yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  We'll notify you when something arrives
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {sortForDisplay(notifications).slice(0, 5).map((notification) => {
                  const isUnread = !(notification.userState?.read)
                  
                  return (
                    <div
                      key={notification._id}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                        isUnread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="flex-shrink-0 mt-1">
                          {notification.icon ? (
                            <span className="text-2xl">{notification.icon}</span>
                          ) : (
                            getIcon(notification.type)
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                                  {notification.title}
                                </h4>
                                {isUnread && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                )}
                                {notification.priority === 'high' && (
                                  <Badge className="bg-red-100 text-red-800 text-xs">
                                    Important
                                  </Badge>
                                )}
                              </div>
                              
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 dark:text-gray-500">
                                  {getTimeAgo(notification.createdAt)}
                                </span>
                                
                                {notification.link && (
                                  <span className="text-xs text-orange-600 dark:text-orange-400 font-medium flex items-center gap-1">
                                    {notification.linkText || 'View'}
                                    <ExternalLink className="w-3 h-3" />
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Clear Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                clearNotification(notification._id)
                              }}
                              className="flex-shrink-0 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                              aria-label="Clear notification"
                            >
                              <X className="w-4 h-4 text-gray-400" />
                            </button>
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
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
              <a
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium"
              >
                View All Notifications
              </a>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
      `}</style>
    </div>
  )
}
