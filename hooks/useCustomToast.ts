"use client"

import { useToast } from '@/components/ui/ToastProvider'

// Enhanced toast hook with convenient methods for specific operations
export const useCustomToast = () => {
  const toast = useToast()
  
  return {
    // Cart operations
    cartAdded: (productName: string) => {
      toast.showCartAdd(productName)
    },
    
    cartUpdated: (productName: string) => {
      toast.showUpdateSuccess(`Cart item: ${productName}`)
    },
    
    cartRemoved: (productName: string) => {
      toast.showDeleteSuccess(`Cart item: ${productName}`)
    },
    
    cartCleared: () => {
      toast.showInfo('delete', 'Cart Cleared', 'All items have been removed from your cart')
    },
    
    // Wishlist operations
    wishlistAdded: (productName: string) => {
      toast.showWishlistAdd(productName)
    },
    
    wishlistRemoved: (productName: string) => {
      toast.showWishlistRemove(productName)
    },
    
    // Product operations
    productAdded: (productName: string) => {
      toast.showAddSuccess(productName)
    },
    
    productUpdated: (productName: string) => {
      toast.showUpdateSuccess(productName)
    },
    
    productDeleted: (productName: string) => {
      toast.showDeleteSuccess(productName)
    },
    
    // Order operations
    orderPlaced: (orderNumber: string) => {
      toast.showSuccess('add', 'Order Placed', `Order #${orderNumber} has been placed successfully`)
    },
    
    orderUpdated: (orderNumber: string) => {
      toast.showInfo('update', 'Order Updated', `Order #${orderNumber} has been updated`)
    },
    
    orderCancelled: (orderNumber: string) => {
      toast.showWarning('delete', 'Order Cancelled', `Order #${orderNumber} has been cancelled`)
    },
    
    // User operations
    loginSuccess: (userName: string) => {
      toast.showSuccess('add', 'Login Successful', `Welcome back, ${userName}!`)
    },
    
    logoutSuccess: () => {
      toast.showInfo('delete', 'Logged Out', 'You have been logged out successfully')
    },
    
    profileUpdated: () => {
      toast.showUpdateSuccess('Profile',  )
    },
    
    // General operations
    success: (title: string, message?: string) => {
      toast.showSuccess('generic', title, message)
    },
    
    error: (title: string, message?: string) => {
      toast.showError('generic', title, message)
    },
    
    info: (title: string, message?: string) => {
      toast.showInfo('generic', title, message)
    },
    
    warning: (title: string, message?: string) => {
      toast.showWarning('generic', title, message)
    },
    
    // Network operations
    loading: (message: string) => {
      toast.showInfo('generic', 'Loading', message)
    },
    
    networkError: (operation: string) => {
      toast.showError('generic', 'Network Error', `Failed to ${operation}. Please check your connection.`)
    },
    
    serverError: (operation: string) => {
      toast.showError('generic', 'Server Error', `Failed to ${operation}. Please try again later.`)
    },
    
    // Validation errors
    validationError: (field: string) => {
      toast.showWarning('generic', 'Validation Error', `Please check the ${field} field`)
    },
    
    formIncomplete: () => {
      toast.showWarning('generic', 'Form Incomplete', 'Please fill in all required fields')
    },
    
    // Success messages
    saved: (item: string) => {
      toast.showSuccess('update', 'Saved', `${item} has been saved successfully`)
    },
    
    copied: (item: string) => {
      toast.showInfo('generic', 'Copied', `${item} has been copied to clipboard`)
    },
    
    uploaded: (file: string) => {
      toast.showSuccess('add', 'Uploaded', `${file} has been uploaded successfully`)
    },
    
    deleted: (item: string) => {
      toast.showDeleteSuccess(item)
    }
  }
}
