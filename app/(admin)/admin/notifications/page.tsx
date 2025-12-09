"use client";

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Bell, Calendar, Eye } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCustomToast } from '@/hooks/useCustomToast'
import ToastProvider from '@/components/ui/ToastProvider'
import NotificationsToolbar from '@/components/admin/notifications/NotificationsToolbar'
import StatsGrid from '@/components/admin/notifications/StatsGrid'
import ReminderCard from '@/components/admin/notifications/ReminderCard'
import NotificationForm from '@/components/admin/notifications/NotificationForm'
import NotificationsList from '@/components/admin/notifications/NotificationsList'
import { generateBrandedHtml } from '@/components/admin/notifications/generateBrandedHtml'

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

  // Email Reminder State
  const [reminder, setReminder] = useState<{ subject: string; html: string; sendToAll: boolean; userIds: string }>({
    subject: '', html: '', sendToAll: true, userIds: ''
  })
  const [sendingReminder, setSendingReminder] = useState(false)
  const [useTemplate, setUseTemplate] = useState(true)
  const [templateConfig, setTemplateConfig] = useState<{
    preheader: string; ctaText: string; ctaUrl: string; footerNote: string
  }>({
    preheader: 'Exclusive update from Gro-Delivery',
    ctaText: 'Shop Now',
    ctaUrl: (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000') as string,
    footerNote: 'You are receiving this email because you have an account with Gro-Delivery.'
  })

  // User Selection State
  const [userSearch, setUserSearch] = useState('')
  const [userOptions, setUserOptions] = useState<any[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])

  // Template State
  const [templatePreset, setTemplatePreset] = useState<'promotion' | 'announcement' | 'order'>('promotion')
  const [themeColor, setThemeColor] = useState('#f97316')
  const [logoUrl, setLogoUrl] = useState('/logoGro.png')

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'scheduled' | 'draft' | 'expired'>('all')

  type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'announcement'
  type NotificationStatus = 'draft' | 'scheduled' | 'active' | 'expired'
  type NotificationPriority = 'low' | 'medium' | 'high'

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

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           n.message.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || n.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [notifications, searchTerm, statusFilter])

  useEffect(() => {
    fetchNotifications()
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      try {
        setLoadingUsers(true)
        const q = new URLSearchParams({ limit: '20', search: userSearch || '' }).toString()
        const res = await fetch(`/api/users?${q}`, { signal: controller.signal })
        const data = await res.json()
        if (res.ok && data?.success !== false) {
          const list = data?.users || data?.data?.users || []
          setUserOptions(Array.isArray(list) ? list : [])
        }
      } catch {}
      finally { setLoadingUsers(false) }
    }
    if (!reminder.sendToAll) load()
    return () => controller.abort()
  }, [userSearch, reminder.sendToAll])

  const fetchNotifications = useCallback(async () => {
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
  }, [toast])

  const sendReminder = useCallback(async () => {
    if (!reminder.subject || !reminder.html) {
      toast.error('Subject and message are required')
      return
    }
    setSendingReminder(true)
    try {
      const payload: any = { subject: reminder.subject, html: reminder.html, sendToAll: reminder.sendToAll }
      if (!reminder.sendToAll) {
        if (selectedUserIds.length === 0) {
          toast.error('Select at least one user')
          setSendingReminder(false)
          return
        }
        payload.userIds = selectedUserIds
      }
      const res = await fetch('/api/admin/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (res.ok && data.success) {
        toast.success(`✅ Sent: ${data.sent}, Failed: ${data.failed}`)
        setReminder({ subject: '', html: '', sendToAll: true, userIds: '' })
        setSelectedUserIds([])
        setUserSearch('')
      } else {
        toast.error(data.message || 'Failed to send')
      }
    } catch {
      toast.error('Failed to send')
    } finally {
      setSendingReminder(false)
    }
  }, [reminder, selectedUserIds, toast])

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

  // badges now handled inside NotificationsListItem

  const stats = useMemo(() => ({
    total: notifications.length,
    active: notifications.filter(n => n.status === 'active').length,
    scheduled: notifications.filter(n => n.status === 'scheduled').length,
    totalViews: notifications.reduce((sum, n) => sum + n.viewCount, 0)
  }), [notifications])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-2 sm:p-4 lg:p-6 lg:pb-12 space-y-6">
      {/* Header */}
      <NotificationsToolbar
        showForm={showForm}
        onToggleForm={() => setShowForm(!showForm)}
      />

      {/* Quick Email Reminder Card */}
      <ReminderCard
        reminder={reminder}
        setReminder={setReminder}
        useTemplate={useTemplate}
        setUseTemplate={setUseTemplate}
        templateConfig={templateConfig}
        setTemplateConfig={setTemplateConfig}
        templatePreset={templatePreset}
        setTemplatePreset={setTemplatePreset}
        themeColor={themeColor}
        setThemeColor={setThemeColor}
        logoUrl={logoUrl}
        setLogoUrl={setLogoUrl}
        userSearch={userSearch}
        setUserSearch={setUserSearch}
        userOptions={userOptions}
        loadingUsers={loadingUsers}
        selectedUserIds={selectedUserIds}
        setSelectedUserIds={setSelectedUserIds}
        sendingReminder={sendingReminder}
        onApplyTemplate={() => {
          if (!reminder.subject) { toast.error('Enter subject first'); return }
          if (!reminder.html) { toast.error('Enter message content first'); return }
          const generated = generateBrandedHtml(reminder.subject, reminder.html, templateConfig, {
            themeColor, logoUrl, preset: templatePreset
          })
          setReminder(prev => ({ ...prev, html: generated }))
          toast.success('🎨 Branded template applied!')
        }}
        onSendReminder={sendReminder}
      />

      {/* Stats Cards */}
      <StatsGrid
        items={[
          { label: 'Total', value: stats.total, icon: Bell, color: 'from-blue-500 to-blue-600' },
          { label: 'Active', value: stats.active, icon: Bell, color: 'from-green-500 to-green-600' },
          { label: 'Scheduled', value: stats.scheduled, icon: Calendar, color: 'from-indigo-500 to-indigo-600' },
          { label: 'Views', value: stats.totalViews, icon: Eye, color: 'from-purple-500 to-purple-600' },
        ]}
      />

      {/* Notification Form */}
      {showForm && (
        <NotificationForm
          editingId={editingId}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
        />
      )}

      {/* Notifications List */}
      <NotificationsList
        notifications={filteredNotifications as any}
        loading={loading}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={(v) => setStatusFilter(v)}
        onEdit={(n) => handleEdit(n as any)}
        onDelete={(id) => handleDelete(id)}
      />
    </div>
  )
}

export default function NotificationsPage() {
  return (
    <ToastProvider>
      <NotificationsManagement />
    </ToastProvider>
  )
}
