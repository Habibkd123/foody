"use client"

import { useState, useEffect } from 'react'
import { X, Info, CheckCircle, AlertTriangle, AlertCircle, Megaphone, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Notification {
  _id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'announcement'
  priority: 'low' | 'medium' | 'high'
  icon?: string
  link?: string
  linkText?: string
}

interface NotificationBannerProps {
  location?: string
}

export default function NotificationBanner({ location = 'home' }: NotificationBannerProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [dismissedIds, setDismissedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
    // Load dismissed notifications from localStorage
    const dismissed = localStorage.getItem('dismissedNotifications')
    if (dismissed) {
      setDismissedIds(JSON.parse(dismissed))
    }
  }, [location])

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`/api/notifications?location=${location}`)
      const data = await response.json()
      
      if (data.success) {
        setNotifications(data.data)
        
        // Track views for all notifications
        data.data.forEach((notification: Notification) => {
          trackNotification(notification._id, 'view')
        })
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
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

  const dismissNotification = (id: string) => {
    const newDismissed = [...dismissedIds, id]
    setDismissedIds(newDismissed)
    localStorage.setItem('dismissedNotifications', JSON.stringify(newDismissed))
  }

  const handleLinkClick = (notification: Notification) => {
    trackNotification(notification._id, 'click')
    if (notification.link) {
      window.open(notification.link, '_blank')
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />
      case 'error':
        return <AlertCircle className="w-5 h-5" />
      case 'announcement':
        return <Megaphone className="w-5 h-5" />
      default:
        return <Info className="w-5 h-5" />
    }
  }

  const getStyles = (type: string, priority: string) => {
    const baseStyles = "border-l-4 transition-all duration-300"
    
    const typeStyles = {
      info: "bg-blue-50 border-blue-500 text-blue-900 dark:bg-blue-900/20 dark:text-blue-100",
      success: "bg-green-50 border-green-500 text-green-900 dark:bg-green-900/20 dark:text-green-100",
      warning: "bg-yellow-50 border-yellow-500 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-100",
      error: "bg-red-50 border-red-500 text-red-900 dark:bg-red-900/20 dark:text-red-100",
      announcement: "bg-purple-50 border-purple-500 text-purple-900 dark:bg-purple-900/20 dark:text-purple-100"
    }

    const priorityStyles = priority === 'high' ? 'shadow-lg' : 'shadow-md'
    
    return `${baseStyles} ${typeStyles[type as keyof typeof typeStyles]} ${priorityStyles}`
  }

  const getIconColor = (type: string) => {
    const colors = {
      info: "text-blue-500",
      success: "text-green-500",
      warning: "text-yellow-500",
      error: "text-red-500",
      announcement: "text-purple-500"
    }
    return colors[type as keyof typeof colors]
  }

  const visibleNotifications = notifications.filter(n => !dismissedIds.includes(n._id))

  if (loading || visibleNotifications.length === 0) {
    return null
  }

  return (
    <div className="space-y-3 mb-6 animate-fadeIn">
      {visibleNotifications.map((notification, index) => (
        <div
          key={notification._id}
          className={getStyles(notification.type, notification.priority)}
          style={{
            animation: `slideInDown 0.5s ease-out ${index * 0.1}s both`
          }}
        >
          <div className="flex items-start gap-3 p-4">
            {/* Icon */}
            <div className={`flex-shrink-0 ${getIconColor(notification.type)}`}>
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
                  <h4 className="font-semibold text-sm mb-1">
                    {notification.title}
                    {notification.priority === 'high' && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200">
                        Important
                      </span>
                    )}
                  </h4>
                  <p className="text-sm opacity-90 leading-relaxed">
                    {notification.message}
                  </p>
                  
                  {/* Link Button */}
                  {notification.link && (
                    <Button
                      variant="link"
                      size="sm"
                      className="mt-2 p-0 h-auto font-semibold"
                      onClick={() => handleLinkClick(notification)}
                    >
                      {notification.linkText || 'Learn More'}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  )}
                </div>

                {/* Dismiss Button */}
                <button
                  onClick={() => dismissNotification(notification._id)}
                  className="flex-shrink-0 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  aria-label="Dismiss notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
