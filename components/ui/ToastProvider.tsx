"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { X, Check, AlertCircle, Info, ShoppingCart, Heart, Trash2, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ToastType = 'success' | 'error' | 'info' | 'warning'
type ToastAction = 'add' | 'update' | 'delete' | 'cart' | 'wishlist' | 'generic'

interface Toast {
  id: string
  type: ToastType
  action: ToastAction
  title: string
  message?: string
  duration?: number
}

interface ToastContextType {
  showToast: (type: ToastType, action: ToastAction, title: string, message?: string, duration?: number) => void
  showSuccess: (action: ToastAction, title: string, message?: string) => void
  showError: (action: ToastAction, title: string, message?: string) => void
  showInfo: (action: ToastAction, title: string, message?: string) => void
  showWarning: (action: ToastAction, title: string, message?: string) => void
  showAddSuccess: (item: string) => void
  showUpdateSuccess: (item: string) => void
  showDeleteSuccess: (item: string) => void
  showCartAdd: (item: string) => void
  showWishlistAdd: (item: string) => void
  showWishlistRemove: (item: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (
    type: ToastType, 
    action: ToastAction, 
    title: string, 
    message?: string, 
    duration: number = 3000
  ) => {
    const id = Date.now().toString()
    const newToast: Toast = { id, type, action, title, message, duration }
    
    setToasts(prev => [...prev, newToast])
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const showSuccess = (action: ToastAction, title: string, message?: string) => {
    showToast('success', action, title, message)
  }

  const showError = (action: ToastAction, title: string, message?: string) => {
    showToast('error', action, title, message, 5000)
  }

  const showInfo = (action: ToastAction, title: string, message?: string) => {
    showToast('info', action, title, message)
  }

  const showWarning = (action: ToastAction, title: string, message?: string) => {
    showToast('warning', action, title, message, 4000)
  }

  // Convenience methods for common operations
  const showAddSuccess = (item: string) => {
    showSuccess('add', 'Added Successfully', `${item} has been added`)
  }

  const showUpdateSuccess = (item: string) => {
    showSuccess('update', 'Updated Successfully', `${item} has been updated`)
  }

  const showDeleteSuccess = (item: string) => {
    showSuccess('delete', 'Deleted Successfully', `${item} has been removed`)
  }

  const showCartAdd = (item: string) => {
    showSuccess('cart', 'Added to Cart', `${item} added to your cart`)
  }

  const showWishlistAdd = (item: string) => {
    showSuccess('wishlist', 'Added to Wishlist', `${item} added to your wishlist`)
  }

  const showWishlistRemove = (item: string) => {
    showInfo('wishlist', 'Removed from Wishlist', `${item} removed from your wishlist`)
  }

  return (
    <ToastContext.Provider value={{
      showToast,
      showSuccess,
      showError,
      showInfo,
      showWarning,
      showAddSuccess,
      showUpdateSuccess,
      showDeleteSuccess,
      showCartAdd,
      showWishlistAdd,
      showWishlistRemove
    }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  removeToast: (id: string) => void
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  )
}

interface ToastItemProps {
  toast: Toast
  removeToast: (id: string) => void
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, removeToast }) => {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => removeToast(toast.id), 300)
  }

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <Check className="w-5 h-5 text-green-600" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />
      default:
        return <Info className="w-5 h-5 text-gray-600" />
    }
  }

  const getActionIcon = () => {
    switch (toast.action) {
      case 'add':
        return <Plus className="w-4 h-4 text-green-600" />
      case 'update':
        return <AlertCircle className="w-4 h-4 text-blue-600" />
      case 'delete':
        return <Trash2 className="w-4 h-4 text-red-600" />
      case 'cart':
        return <ShoppingCart className="w-4 h-4 text-orange-600" />
      case 'wishlist':
        return <Heart className="w-4 h-4 text-pink-600" />
      default:
        return null
    }
  }

  const getToastStyles = () => {
    const baseStyles = "transform transition-all duration-300 shadow-lg border"
    const typeStyles = {
      success: "bg-white border-green-200 dark:bg-gray-800 dark:border-green-800",
      error: "bg-white border-red-200 dark:bg-gray-800 dark:border-red-800",
      warning: "bg-white border-yellow-200 dark:bg-gray-800 dark:border-yellow-800",
      info: "bg-white border-blue-200 dark:bg-gray-800 dark:border-blue-800"
    }
    
    return `${baseStyles} ${typeStyles[toast.type]} ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`
  }

  return (
    <div className={getToastStyles()}>
      <div className="flex items-start p-4">
        <div className="flex-shrink-0 mr-3">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {getActionIcon()}
            <p className="font-semibold text-gray-900 dark:text-white">
              {toast.title}
            </p>
          </div>
          {toast.message && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {toast.message}
            </p>
          )}
        </div>
        
        <div className="flex-shrink-0 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Progress bar */}
      {toast.duration && toast.duration > 0 && (
        <div className="h-1 bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            style={{
              animation: `shrink ${toast.duration}ms linear`,
              animationFillMode: 'forwards'
            }}
          />
        </div>
      )}
      
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  )
}

export default ToastProvider
