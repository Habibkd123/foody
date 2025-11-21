"use client"

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, MousePointerClick, Calendar, Bell, Send } from 'lucide-react'
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

  const [reminder, setReminder] = useState<{ subject: string; html: string; sendToAll: boolean; userIds: string }>(
    { subject: '', html: '', sendToAll: true, userIds: '' }
  )
  const [sendingReminder, setSendingReminder] = useState(false)
  const [useTemplate, setUseTemplate] = useState(true)
  const [templateConfig, setTemplateConfig] = useState<{ preheader: string; ctaText: string; ctaUrl: string; footerNote: string }>(
    { preheader: 'Exclusive update from Gro-Delivery', ctaText: 'Shop Now', ctaUrl: (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000') as string, footerNote: 'You are receiving this email because you have an account with Gro-Delivery.' }
  )

  const [userSearch, setUserSearch] = useState('')
  const [userOptions, setUserOptions] = useState<any[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [templatePreset, setTemplatePreset] = useState<'promotion' | 'announcement' | 'order'>('promotion')
  const [themeColor, setThemeColor] = useState('#f97316')
  const [logoUrl, setLogoUrl] = useState('/logoGro.png')

  const generateBrandedHtml = (
    subject: string,
    contentHtml: string,
    cfg: { preheader: string; ctaText: string; ctaUrl: string; footerNote: string },
    options?: { themeColor?: string; logoUrl?: string; preset?: 'promotion'|'announcement'|'order' }
  ) => {
    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000') as string
    const color = (options?.themeColor || themeColor || '#f97316').trim()
    const logo = options?.logoUrl || logoUrl || '/logoGro.png'
    const preset = options?.preset || templatePreset
    const presetBadge = preset === 'promotion' ? 'Deal' : preset === 'order' ? 'Order' : 'Notice'
    return `<!DOCTYPE html>
  <html>
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <title>${subject}</title>
      <style>
        body{margin:0;padding:0;background:#f5f5f7;color:#111;font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;}
        .preheader{display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;mso-hide:all;}
        a{color:${color};}
        @media only screen and (max-width:600px){
          .container{width:100%!important}
          .content{padding:16px!important}
        }
      </style>
    </head>
    <body>
      <span class="preheader">${cfg.preheader}</span>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width:640px;background:#ffffff">
        <tr>
          <td style="padding:0">
            <table role="presentation" width="100%" style="background:${color};color:#fff" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" style="padding:20px 16px">
                  <img src="${logo}" alt="Gro-Delivery" width="40" height="40" style="display:block;border:0;border-radius:8px" />
                  <div style="font-size:22px;font-weight:700;margin-top:8px">Gro-Delivery</div>
                  <div style="font-size:12px;opacity:0.9;margin-top:6px;padding:2px 8px;border:1px solid rgba(255,255,255,0.5);border-radius:999px;display:inline-block">${presetBadge}</div>
                  <h1 style="margin:12px 0 0;font-size:20px;line-height:1.3">${subject}</h1>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td class="content" style="padding:24px">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fafafa;border:1px solid #eee;border-radius:8px">
              <tr>
                <td style="padding:20px;font-size:15px;line-height:1.6;color:#111">
                  ${contentHtml}
                  ${cfg.ctaText && cfg.ctaUrl ? `
                  <div style="text-align:center;margin-top:20px">
                    <a href="${cfg.ctaUrl}" target="_blank" rel="noopener" style="display:inline-block;background:${color};color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600">${cfg.ctaText}</a>
                  </div>` : ''}
                </td>
              </tr>
            </table>
            <div style="height:1px;background:#eee;margin:24px 0"></div>
            <p style="margin:0 0 6px;font-size:13px;color:#444">Need help? Visit our <a href="${appUrl}/help">Help Center</a> or reply to this email.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 24px;background:#fafafa;text-align:center;color:#666;font-size:12px">
            <p style="margin:0 0 6px">${cfg.footerNote}</p>
            <p style="margin:0">© ${new Date().getFullYear()} Gro-Delivery • <a href="${appUrl}">${appUrl.replace('https://','').replace('http://','')}</a></p>
          </td>
        </tr>
      </table>
    </body>
  </html>`
  }

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

      <Card>
        <CardHeader>
          <CardTitle>Send Email Reminder</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Subject *</label>
              <Input
                value={reminder.subject}
                onChange={(e) => setReminder({ ...reminder, subject: e.target.value })}
                placeholder="Subject"
              />
            </div>
            <div>
              <label className="inline-flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" checked={useTemplate} onChange={(e) => setUseTemplate(e.target.checked)} />
                Use branded template
              </label>
            </div>
            {useTemplate && (
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium mb-2">Preheader</label>
                  <Input value={templateConfig.preheader} onChange={(e)=>setTemplateConfig({...templateConfig, preheader: e.target.value})} placeholder="Short preview line" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Preset</label>
                  <select
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
                    value={templatePreset}
                    onChange={(e)=>setTemplatePreset(e.target.value as any)}
                  >
                    <option value="promotion">Promotion</option>
                    <option value="announcement">Announcement</option>
                    <option value="order">Order</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Theme Color</label>
                  <Input type="color" value={themeColor} onChange={(e)=>setThemeColor(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Logo URL</label>
                  <Input value={logoUrl} onChange={(e)=>setLogoUrl(e.target.value)} placeholder="/logo.png or https://..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CTA Text</label>
                  <Input value={templateConfig.ctaText} onChange={(e)=>setTemplateConfig({...templateConfig, ctaText: e.target.value})} placeholder="Shop Now" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">CTA URL</label>
                  <Input value={templateConfig.ctaUrl} onChange={(e)=>setTemplateConfig({...templateConfig, ctaUrl: e.target.value})} placeholder="https://..." />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium mb-2">Footer Note</label>
                  <Input value={templateConfig.footerNote} onChange={(e)=>setTemplateConfig({...templateConfig, footerNote: e.target.value})} placeholder="Reason for receiving email" />
                </div>
                <div className="md:col-span-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (!reminder.subject) { toast.error('Enter subject before generating'); return }
                      if (!reminder.html) { toast.error('Enter message content (HTML or text) before generating'); return }
                      const generated = generateBrandedHtml(reminder.subject, reminder.html, templateConfig, { themeColor, logoUrl, preset: templatePreset })
                      setReminder(prev => ({ ...prev, html: generated }))
                      toast.success('Template applied')
                    }}
                  >
                    Apply Template
                  </Button>
                </div>
              </div>
            )}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Message (HTML allowed) *</label>
              <textarea
                value={reminder.html}
                onChange={(e) => setReminder({ ...reminder, html: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
                placeholder="<p>Your reminder message...</p>"
              />
            </div>
            <div>
              <label className="inline-flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={reminder.sendToAll}
                  onChange={(e) => setReminder({ ...reminder, sendToAll: e.target.checked })}
                />
                Send to all users
              </label>
            </div>
            {!reminder.sendToAll && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Select Users</label>
                <div className="flex gap-2 mb-2">
                  <Input value={userSearch} onChange={(e)=>setUserSearch(e.target.value)} placeholder="Search name or email" />
                </div>
                <div className="max-h-56 overflow-auto border rounded-md divide-y">
                  {loadingUsers ? (
                    <div className="p-3 text-sm text-gray-500">Loading users...</div>
                  ) : userOptions.length === 0 ? (
                    <div className="p-3 text-sm text-gray-500">No users</div>
                  ) : (
                    userOptions.map((u:any) => {
                      const id = u?._id || u?.id
                      const name = u?.fullName || [u?.firstName, u?.lastName].filter(Boolean).join(' ') || u?.username || 'User'
                      const email = u?.email || ''
                      const initials = (name || email).split(' ').map((p:string)=>p[0]).join('').slice(0,2).toUpperCase()
                      const checked = selectedUserIds.includes(String(id))
                      return (
                        <label key={String(id)} className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e)=>{
                              const v = String(id)
                              setSelectedUserIds(prev => e.target.checked ? [...prev, v] : prev.filter(x=>x!==v))
                            }}
                          />
                          <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-semibold">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium truncate">{name}</div>
                            <div className="text-xs text-gray-500 truncate">{email}</div>
                          </div>
                        </label>
                      )
                    })
                  )}
                </div>
                {selectedUserIds.length > 0 && (
                  <div className="mt-2 text-xs text-gray-600">Selected: {selectedUserIds.length}</div>
                )}
              </div>
            )}
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={async () => {
                if (!reminder.subject || !reminder.html) { toast.error('Subject and message are required'); return; }
                setSendingReminder(true)
                try {
                  const payload: any = { subject: reminder.subject, html: reminder.html, sendToAll: reminder.sendToAll }
                  if (!reminder.sendToAll) {
                    if (selectedUserIds.length === 0) { toast.error('Select at least one user'); setSendingReminder(false); return }
                    payload.userIds = selectedUserIds
                  }
                  const res = await fetch('/api/admin/reminders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                  })
                  const data = await res.json()
                  if (res.ok && data.success) {
                    toast.success(`Sent: ${data.sent}, Failed: ${data.failed}`)
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
              }}
              disabled={sendingReminder}
            >
              <Send className="w-4 h-4 mr-2" />
              {sendingReminder ? 'Sending...' : 'Send Reminder'}
            </Button>
          </div>
        </CardContent>
      </Card>

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
