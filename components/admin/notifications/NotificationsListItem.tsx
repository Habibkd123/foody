"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, MousePointerClick, Calendar, Edit, Trash2 } from "lucide-react"

export interface NotificationItem {
  _id: string
  title: string
  message: string
  icon?: string
  type: 'info' | 'success' | 'warning' | 'error' | 'announcement'
  status: 'draft' | 'scheduled' | 'active' | 'expired'
  priority: 'low' | 'medium' | 'high'
  viewCount: number
  clickCount: number
  createdAt: string
}

interface Props {
  notification: NotificationItem
  onEdit: (n: NotificationItem) => void
  onDelete: (id: string) => void
}

export default function NotificationsListItem({ notification, onEdit, onDelete }: Props) {
  const getStatusBadge = (status: NotificationItem['status']) => {
    const styles: Record<NotificationItem['status'], string> = {
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800'
    }
    return (
      <Badge className={`text-xs px-2 py-1 ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getTypeBadge = (type: NotificationItem['type']) => {
    const styles: Record<NotificationItem['type'], string> = {
      info: 'bg-blue-100 text-blue-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      announcement: 'bg-purple-100 text-purple-800'
    }
    return (
      <Badge className={`text-xs px-2 py-1 ${styles[type]}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all duration-200 group">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start gap-3 mb-4">
            <span className="text-3xl flex-shrink-0">{notification.icon || '🔔'}</span>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-xl lg:text-2xl text-gray-900 dark:text-white truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                {notification.title}
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {getStatusBadge(notification.status)}
                {getTypeBadge(notification.type)}
                {notification.priority === 'high' && (
                  <Badge className="bg-red-100 text-red-800 border border-red-200 text-xs px-2.5 py-1 font-semibold shadow-sm">🚨 High Priority</Badge>
                )}
              </div>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-6 line-clamp-3">
            {notification.message}
          </p>
          <div className="flex flex-wrap gap-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2 p-2 bg-gray-100/50 dark:bg-gray-800/50 rounded-xl">
              <Eye className="w-4 h-4" />
              <span>{notification.viewCount.toLocaleString()} views</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-100/50 dark:bg-gray-800/50 rounded-xl">
              <MousePointerClick className="w-4 h-4" />
              <span>{notification.clickCount.toLocaleString()} clicks</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-100/50 dark:bg-gray-800/50 rounded-xl">
              <Calendar className="w-4 h-4" />
              <span>{new Date(notification.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 pt-2 lg:pt-0 lg:self-start w-full lg:w-auto">
          <Button
            size="sm"
            variant="outline"
            className="h-11 flex-1 sm:flex-none text-orange-600 hover:text-orange-700 hover:bg-orange-50 border-orange-200 shadow-sm hover:shadow-md"
            onClick={() => onEdit(notification)}
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-11 flex-1 sm:flex-none text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 shadow-sm hover:shadow-md"
            onClick={() => onDelete(notification._id)}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}
