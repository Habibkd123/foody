"use client"

import React from "react"
import { Bell, Search, Send } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TemplateConfig { preheader: string; ctaText: string; ctaUrl: string; footerNote: string }

interface ReminderState { subject: string; html: string; sendToAll: boolean; userIds: string }

interface Props {
  reminder: ReminderState
  setReminder: React.Dispatch<React.SetStateAction<ReminderState>>
  useTemplate: boolean
  setUseTemplate: (v: boolean) => void
  templateConfig: TemplateConfig
  setTemplateConfig: React.Dispatch<React.SetStateAction<TemplateConfig>>
  templatePreset: 'promotion' | 'announcement' | 'order'
  setTemplatePreset: (v: 'promotion' | 'announcement' | 'order') => void
  themeColor: string
  setThemeColor: (v: string) => void
  logoUrl: string
  setLogoUrl: (v: string) => void
  userSearch: string
  setUserSearch: (v: string) => void
  userOptions: any[]
  loadingUsers: boolean
  selectedUserIds: string[]
  setSelectedUserIds: React.Dispatch<React.SetStateAction<string[]>>
  sendingReminder: boolean
  onApplyTemplate: () => void
  onSendReminder: () => Promise<void>
}

export default function ReminderCard(props: Props) {
  const {
    reminder, setReminder,
    useTemplate, setUseTemplate,
    templateConfig, setTemplateConfig,
    templatePreset, setTemplatePreset,
    themeColor, setThemeColor,
    logoUrl, setLogoUrl,
    userSearch, setUserSearch,
    userOptions, loadingUsers,
    selectedUserIds, setSelectedUserIds,
    sendingReminder,
    onApplyTemplate,
    onSendReminder,
  } = props

  return (
    <Card className="lg:max-w-6xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Bell className="w-6 h-6 text-blue-500" />
          Send Email Reminder
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-6 lg:p-8 space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-6">
            <div className="xl:col-span-2">
              <label className="block text-sm font-semibold mb-3 text-gray-900 dark:text-white">Subject *</label>
              <Input
                value={reminder.subject}
                onChange={(e) => setReminder({ ...reminder, subject: e.target.value })}
                placeholder="Enter email subject"
                className="h-12 text-lg"
              />
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl">
              <input 
                type="checkbox" 
                checked={useTemplate} 
                onChange={(e) => setUseTemplate(e.target.checked)}
                className="w-5 h-5 rounded accent-orange-500"
              />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                Use branded template
              </label>
            </div>

            {useTemplate && (
              <div className="xl:col-span-2 space-y-4 p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-2xl border border-blue-100/50 dark:border-blue-800/50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Preset</label>
                    <Select value={templatePreset} onValueChange={(v) => setTemplatePreset(v as any)}>
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="promotion">Promotion</SelectItem>
                        <SelectItem value="announcement">Announcement</SelectItem>
                        <SelectItem value="order">Order</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Theme Color</label>
                    <Input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="h-10 w-full p-1" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Logo</label>
                    <Input 
                      value={logoUrl} 
                      onChange={(e) => setLogoUrl(e.target.value)} 
                      placeholder="/logo.png" 
                      className="h-10"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Preheader</label>
                    <Input 
                      value={templateConfig.preheader} 
                      onChange={(e) => setTemplateConfig({...templateConfig, preheader: e.target.value})}
                      className="h-10"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">CTA Text</label>
                    <Input 
                      value={templateConfig.ctaText} 
                      onChange={(e) => setTemplateConfig({...templateConfig, ctaText: e.target.value})}
                      className="h-10"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">CTA URL</label>
                    <Input 
                      value={templateConfig.ctaUrl} 
                      onChange={(e) => setTemplateConfig({...templateConfig, ctaUrl: e.target.value})}
                      className="h-10"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full lg:w-auto h-11"
                  onClick={onApplyTemplate}
                >
                  ✨ Apply Template
                </Button>
              </div>
            )}

            <div className="xl:col-span-2">
              <label className="block text-sm font-semibold mb-3 text-gray-900 dark:text-white">Message (HTML supported) *</label>
              <textarea
                value={reminder.html}
                onChange={(e) => setReminder({ ...reminder, html: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-800/50 resize-vertical min-h-[120px] focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Write your message here... HTML tags supported"
              />
            </div>

            <div className="flex items-center gap-3 p-3 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-2xl">
              <input
                type="checkbox"
                checked={reminder.sendToAll}
                onChange={(e) => setReminder({ ...reminder, sendToAll: e.target.checked })}
                className="w-5 h-5 rounded accent-emerald-500"
              />
              <label className="text-sm font-semibold text-emerald-800 dark:text-emerald-200 cursor-pointer select-none">
                📧 Send to all users
              </label>
            </div>

            {!reminder.sendToAll && (
              <div className="xl:col-span-2 space-y-3">
                <div className="flex gap-2">
                  <Input 
                    value={userSearch} 
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="🔍 Search users by name or email"
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm" className="shrink-0">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
                <div className="max-h-64 overflow-auto border border-gray-200 dark:border-gray-700 rounded-xl divide-y divide-gray-100 dark:divide-gray-800">
                  {loadingUsers ? (
                    <div className="p-6 text-center text-sm text-gray-500 animate-pulse">Loading users...</div>
                  ) : userOptions.length === 0 ? (
                    <div className="p-6 text-center text-sm text-gray-500">No users found</div>
                  ) : (
                    userOptions.map((u: any) => {
                      const id = u?._id || u?.id
                      const name = u?.fullName || [u?.firstName, u?.lastName].filter(Boolean).join(' ') || u?.username || 'User'
                      const email = u?.email || ''
                      const initials = (name || email).split(' ').map((p: string) => p[0]).join('').slice(0, 2).toUpperCase()
                      const checked = selectedUserIds.includes(String(id))
                      
                      return (
                        <label key={String(id)} className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              const v = String(id)
                              setSelectedUserIds(prev => e.target.checked ? [...prev, v] : prev.filter(x => x !== v))
                            }}
                            className="w-4 h-4 rounded accent-orange-500"
                          />
                          <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 text-white flex items-center justify-center text-xs font-bold shadow-md">
                            {initials}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm truncate">{name}</div>
                            <div className="text-xs text-gray-500 truncate">{email}</div>
                          </div>
                        </label>
                      )
                    })
                  )}
                </div>
                {selectedUserIds.length > 0 && (
                  <div className="flex items-center justify-between text-sm text-gray-600 bg-green-50/50 dark:bg-green-900/20 p-3 rounded-xl">
                    <span>✅ Selected: <span className="font-semibold text-green-800 dark:text-green-200">{selectedUserIds.length}</span> users</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedUserIds([])}
                      className="h-8 px-3 text-xs"
                    >
                      Clear All
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-xl h-12 text-lg font-semibold"
              onClick={onSendReminder}
              disabled={sendingReminder}
            >
              <Send className="w-5 h-5 mr-2" />
              {sendingReminder ? '📤 Sending...' : '📧 Send Reminder'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
