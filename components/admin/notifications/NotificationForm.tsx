"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'announcement'
type NotificationStatus = 'draft' | 'scheduled' | 'active' | 'expired'
type NotificationPriority = 'low' | 'medium' | 'high'

interface FormData {
  title: string
  message: string
  type: NotificationType
  status: NotificationStatus
  priority: NotificationPriority
  icon: string
  link: string
  linkText: string
  startDate: string
  endDate: string
  scheduledDate: string
  targetAudience: string
  displayLocation: string[]
}

interface Props {
  editingId: string | null
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
  onSubmit: (e: React.FormEvent) => Promise<void> | void
}

export default function NotificationForm({ editingId, formData, setFormData, onSubmit }: Props) {
  return (
    <Card className="lg:max-w-7xl">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl lg:text-3xl">
          {editingId ? '✏️ Edit Notification' : '➕ Create New Notification'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 lg:p-8">
        <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6 lg:col-span-1">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Notification title"
                className="h-12 text-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">Icon</label>
              <Input
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="🔔 or 😊"
                className="h-12"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">Type</label>
              <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as NotificationType })}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">Priority</label>
              <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v as NotificationPriority })}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">Target Audience</label>
              <Select value={formData.targetAudience} onValueChange={(v) => setFormData({ ...formData, targetAudience: v })}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="new">New Users</SelectItem>
                  <SelectItem value="active">Active Users</SelectItem>
                  <SelectItem value="premium">Premium Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-1">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">Message *</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={6}
                required
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-800/50 resize-vertical min-h-[160px] focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Write your notification message..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">Status</label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as NotificationStatus })}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">Start Date</label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="h-12"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">End Date</label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="h-12"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">Scheduled Date</label>
              <Input
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                className="h-12"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">Link</label>
                <Input
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="https://..."
                  className="h-12"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">Link Text</label>
                <Input
                  value={formData.linkText}
                  onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                  placeholder="Learn More"
                  className="h-12"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">Display Locations</label>
              <div className="flex flex-wrap gap-2">
                {['home', 'products', 'cart', 'checkout', 'restaurant'].map(loc => {
                  const checked = formData.displayLocation.includes(loc)
                  return (
                    <label key={loc} className={`px-3 py-2 rounded-lg border text-sm cursor-pointer select-none ${checked ? 'bg-blue-50 border-blue-400 text-blue-700' : 'bg-transparent border-gray-300 text-gray-700 dark:text-gray-300'}`}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, displayLocation: [...formData.displayLocation, loc] })
                          } else {
                            setFormData({ ...formData, displayLocation: formData.displayLocation.filter(x => x !== loc) })
                          }
                        }}
                        className="mr-2 hidden"
                      />
                      {loc}
                    </label>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 flex justify-end gap-3">
            <Button type="submit" className="h-12 px-6">
              {editingId ? 'Update Notification' : 'Create Notification'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
