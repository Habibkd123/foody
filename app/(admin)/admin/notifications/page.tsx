"use client"

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, MousePointerClick, Calendar, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useCustomToast } from '@/hooks/useCustomToast'
import ToastProvider from '@/components/ui/ToastProvider'

interface Notification {
  _id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'announcement'
  status: 'draft' | 'scheduled' | 'active' | 'expired'
  priority: 'low' | 'medium' | 'high'
  icon?: string
  link?: string
  linkText?: string
  startDate?: string
  endDate?: string
  scheduledDate?: string
  targetAudience: string
  displayLocation: string[]
  viewCount: number
  clickCount: number
  createdAt: string
}

function NotificationsManagement() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const toast = useCustomToast()

  type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'announcement';
  type NotificationStatus = 'draft' | 'scheduled' | 'active' | 'expired';
  type NotificationPriority = 'low' | 'medium' | 'high';

  const [formData, setFormData] = useState<{
    title: string;
    message: string;
    type: NotificationType;
    status: NotificationStatus;
    priority: NotificationPriority;
    icon: string;
    link: string;
    linkText: string;
    startDate: string;
    endDate: string;
    scheduledDate: string;
    targetAudience: string;
    displayLocation: string[];
  }>({
    title: '',
    message: '',
    type: 'info',
    status: 'draft',
    priority: 'medium',
    icon: '🔔',
    link: '',
    linkText: 'Learn More',
    startDate: '',
    endDate: '',
    scheduledDate: '',
    targetAudience: 'all',
    displayLocation: ['home', 'products']
  })

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications?admin=true')
      const data = await response.json()
      
      if (data.success) {
        setNotifications(data.data)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingId ? '/api/notifications' : '/api/notifications'
      const method = editingId ? 'PUT' : 'POST'
      
      const payload = editingId 
        ? { id: editingId, ...formData }
        : { ...formData, createdBy: 'admin' }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (data.success) {
        toast.success(editingId ? 'Notification updated!' : 'Notification created!')
        fetchNotifications()
        resetForm()
      } else {
        toast.error(data.error || 'Operation failed')
      }
    } catch (error) {
      console.error('Error saving notification:', error)
      toast.error('Failed to save notification')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) return

    try {
      const response = await fetch(`/api/notifications?id=${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        toast.deleted('Notification')
        fetchNotifications()
      } else {
        toast.error(data.error || 'Delete failed')
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
      toast.error('Failed to delete notification')
    }
  }

  const handleEdit = (notification: Notification) => {
    setEditingId(notification._id)
    setFormData({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      status: notification.status,
      priority: notification.priority,
      icon: notification.icon || '🔔',
      link: notification.link || '',
      linkText: notification.linkText || 'Learn More',
      startDate: notification.startDate ? notification.startDate.split('T')[0] : '',
      endDate: notification.endDate ? notification.endDate.split('T')[0] : '',
      scheduledDate: notification.scheduledDate ? notification.scheduledDate.split('T')[0] : '',
      targetAudience: notification.targetAudience,
      displayLocation: notification.displayLocation
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'info',
      status: 'draft',
      priority: 'medium',
      icon: '🔔',
      link: '',
      linkText: 'Learn More',
      startDate: '',
      endDate: '',
      scheduledDate: '',
      targetAudience: 'all',
      displayLocation: ['home', 'products']
    })
    setEditingId(null)
    setShowForm(false)
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800'
    }
    return <Badge className={styles[status as keyof typeof styles]}>{status}</Badge>
  }

  const getTypeBadge = (type: string) => {
    const styles = {
      info: 'bg-blue-100 text-blue-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      announcement: 'bg-purple-100 text-purple-800'
    }
    return <Badge className={styles[type as keyof typeof styles]}>{type}</Badge>
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Create and manage user notifications</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? 'Cancel' : 'New Notification'}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {notifications.filter(n => n.status === 'active').length}
                </p>
              </div>
              <Bell className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled</p>
                <p className="text-2xl font-bold text-blue-600">
                  {notifications.filter(n => n.status === 'scheduled').length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
                <p className="text-2xl font-bold text-purple-600">
                  {notifications.reduce((sum, n) => sum + n.viewCount, 0)}
                </p>
              </div>
              <Eye className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Notification' : 'Create New Notification'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                    placeholder="Enter notification title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Icon</label>
                  <Input
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    placeholder="🔔"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Message *</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
                    placeholder="Enter notification message"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
                  >
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                    <option value="announcement">Announcement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
                  >
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Target Audience</label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
                  >
                    <option value="all">All Users</option>
                    <option value="new">New Users</option>
                    <option value="active">Active Users</option>
                    <option value="premium">Premium Users</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Link (Optional)</label>
                  <Input
                    value={formData.link}
                    onChange={(e) => setFormData({...formData, link: e.target.value})}
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Link Text</label>
                  <Input
                    value={formData.linkText}
                    onChange={(e) => setFormData({...formData, linkText: e.target.value})}
                    placeholder="Learn More"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">End Date</label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Scheduled Date</label>
                  <Input
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                  {editingId ? 'Update' : 'Create'} Notification
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-gray-500">Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No notifications yet</p>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{notification.icon}</span>
                        <h3 className="font-semibold text-lg">{notification.title}</h3>
                        {getStatusBadge(notification.status)}
                        {getTypeBadge(notification.type)}
                        {notification.priority === 'high' && (
                          <Badge className="bg-red-100 text-red-800">High Priority</Badge>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">{notification.message}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{notification.viewCount} views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MousePointerClick className="w-4 h-4" />
                          <span>{notification.clickCount} clicks</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(notification)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(notification._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Wrap with ToastProvider
export default function NotificationsPage() {
  return (
    <ToastProvider>
      <NotificationsManagement />
    </ToastProvider>
  )
}
