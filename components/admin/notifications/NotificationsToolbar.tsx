"use client"

import React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  title?: string
  subtitle?: string
  showForm: boolean
  onToggleForm: () => void
}

export default function NotificationsToolbar({ title = 'Notifications Management', subtitle = 'Create, manage and send targeted user notifications', showForm, onToggleForm }: Props) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
      </div>
      <Button
        onClick={onToggleForm}
        className="w-full lg:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl px-6 h-12 text-lg font-semibold"
        size="lg"
      >
        <Plus className="w-5 h-5 mr-2" />
        {showForm ? 'Cancel' : 'New Notification'}
      </Button>
    </div>
  )
}
