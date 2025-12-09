"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Search } from "lucide-react"
import NotificationsListItem, { NotificationItem } from "./NotificationsListItem"

interface Props {
  notifications: NotificationItem[]
  loading: boolean
  searchTerm: string
  setSearchTerm: (v: string) => void
  statusFilter: 'all' | 'active' | 'scheduled' | 'draft' | 'expired'
  setStatusFilter: (v: 'all' | 'active' | 'scheduled' | 'draft' | 'expired') => void
  onEdit: (n: NotificationItem) => void
  onDelete: (id: string) => void
}

export default function NotificationsList({ notifications, loading, searchTerm, setSearchTerm, statusFilter, setStatusFilter, onEdit, onDelete }: Props) {
  return (
    <Card className="lg:max-w-7xl">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6">
        <CardTitle className="text-xl sm:text-2xl lg:text-3xl flex items-center gap-2">
          📋 All Notifications ({notifications.length})
        </CardTitle>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notifications..."
              className="pl-10 h-11 w-full sm:w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <SelectTrigger className="h-11 w-40 lg:w-48">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4"></div>
              <p className="text-lg text-gray-500 dark:text-gray-400">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-16 text-center py-24">
              <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">No notifications found</h3>
              <p className="text-gray-400 dark:text-gray-500">Create your first notification to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {notifications.map((notification) => (
                <NotificationsListItem
                  key={notification._id}
                  notification={notification}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
