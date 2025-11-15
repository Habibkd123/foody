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
  userState?: {
    read: boolean
    dismissed: boolean
    readAt?: string | null
    dismissedAt?: string | null
  }
}

interface NotificationBannerProps {
  location?: string
}

export default function NotificationBanner({ location = 'home' }: NotificationBannerProps) {
  return null
}
