"use client"

import React from "react"

import { useState } from "react"
import {
  Shield,
  Eye,
  EyeOff,
  ArrowLeft,
  X,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Users,
  Crown,
  UserCheck,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AdminAuthSystemProps {
  onClose: () => void
  onLoginSuccess: (user: AdminUser) => void
}

interface AdminUser {
  id: string
  email: string
  name: string
  role: "super_admin" | "admin" | "manager" | "support"
  permissions: string[]
  lastLogin: string
  avatar?: string
}

interface Permission {
  id: string
  name: string
  description: string
  category: string
}

const ADMIN_ROLES = {
  super_admin: {
    name: "Super Admin",
    color: "bg-purple-500",
    icon: Crown,
    description: "Full system access with all permissions",
  },
  admin: {
    name: "Admin",
    color: "bg-red-500",
    icon: Shield,
    description: "Administrative access with most permissions",
  },
  manager: {
    name: "Manager",
    color: "bg-blue-500",
    icon: Users,
    description: "Management access with limited permissions",
  },
  support: {
    name: "Support",
    color: "bg-green-500",
    icon: UserCheck,
    description: "Support access with basic permissions",
  },
}

const PERMISSIONS: Permission[] = [
  // User Management
  { id: "users.view", name: "View Users", description: "View user profiles and data", category: "User Management" },
  { id: "users.create", name: "Create Users", description: "Create new user accounts", category: "User Management" },
  {
    id: "users.edit",
    name: "Edit Users",
    description: "Modify user profiles and settings",
    category: "User Management",
  },
  { id: "users.delete", name: "Delete Users", description: "Delete user accounts", category: "User Management" },
  { id: "users.ban", name: "Ban Users", description: "Ban or suspend user accounts", category: "User Management" },

  // Order Management
  { id: "orders.view", name: "View Orders", description: "View all orders and details", category: "Order Management" },
  {
    id: "orders.edit",
    name: "Edit Orders",
    description: "Modify order status and details",
    category: "Order Management",
  },
  {
    id: "orders.cancel",
    name: "Cancel Orders",
    description: "Cancel orders and process refunds",
    category: "Order Management",
  },
  { id: "orders.refund", name: "Process Refunds", description: "Process order refunds", category: "Order Management" },

  // Restaurant Management
  {
    id: "restaurants.view",
    name: "View Restaurants",
    description: "View restaurant profiles",
    category: "Restaurant Management",
  },
  {
    id: "restaurants.create",
    name: "Add Restaurants",
    description: "Add new restaurants",
    category: "Restaurant Management",
  },
  {
    id: "restaurants.edit",
    name: "Edit Restaurants",
    description: "Modify restaurant details",
    category: "Restaurant Management",
  },
  {
    id: "restaurants.delete",
    name: "Remove Restaurants",
    description: "Remove restaurants from platform",
    category: "Restaurant Management",
  },

  // Analytics & Reports
  {
    id: "analytics.view",
    name: "View Analytics",
    description: "Access analytics dashboard",
    category: "Analytics & Reports",
  },
  {
    id: "reports.generate",
    name: "Generate Reports",
    description: "Generate system reports",
    category: "Analytics & Reports",
  },
  {
    id: "reports.export",
    name: "Export Data",
    description: "Export data and reports",
    category: "Analytics & Reports",
  },

  // System Settings
  { id: "settings.view", name: "View Settings", description: "View system settings", category: "System Settings" },
  { id: "settings.edit", name: "Edit Settings", description: "Modify system settings", category: "System Settings" },
  {
    id: "settings.backup",
    name: "System Backup",
    description: "Create and manage backups",
    category: "System Settings",
  },

  // Admin Management
  { id: "admins.view", name: "View Admins", description: "View admin accounts", category: "Admin Management" },
  {
    id: "admins.create",
    name: "Create Admins",
    description: "Create new admin accounts",
    category: "Admin Management",
  },
  { id: "admins.edit", name: "Edit Admins", description: "Modify admin permissions", category: "Admin Management" },
  { id: "admins.delete", name: "Delete Admins", description: "Remove admin accounts", category: "Admin Management" },
]

const ROLE_PERMISSIONS = {
  super_admin: PERMISSIONS.map((p) => p.id),
  admin: PERMISSIONS.filter((p) => !p.id.startsWith("admins.") || p.id === "admins.view").map((p) => p.id),
  manager: PERMISSIONS.filter(
    (p) =>
      p.category === "Order Management" ||
      p.category === "Restaurant Management" ||
      p.id === "users.view" ||
      p.id === "analytics.view",
  ).map((p) => p.id),
  support: PERMISSIONS.filter(
    (p) => p.id === "users.view" || p.id === "orders.view" || p.id === "orders.edit" || p.id === "restaurants.view",
  ).map((p) => p.id),
}

// Mock admin users for demo
const MOCK_ADMINS: AdminUser[] = [
  {
    id: "1",
    email: "superadmin@fooddelivery.com",
    name: "John Super",
    role: "super_admin",
    permissions: ROLE_PERMISSIONS.super_admin,
    lastLogin: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    email: "admin@fooddelivery.com",
    name: "Jane Admin",
    role: "admin",
    permissions: ROLE_PERMISSIONS.admin,
    lastLogin: "2024-01-15T09:15:00Z",
  },
  {
    id: "3",
    email: "manager@fooddelivery.com",
    name: "Mike Manager",
    role: "manager",
    permissions: ROLE_PERMISSIONS.manager,
    lastLogin: "2024-01-15T08:45:00Z",
  },
  {
    id: "4",
    email: "support@fooddelivery.com",
    name: "Sarah Support",
    role: "support",
    permissions: ROLE_PERMISSIONS.support,
    lastLogin: "2024-01-14T16:20:00Z",
  },
]

export default function AdminAuthSystem({ onClose, onLoginSuccess }: AdminAuthSystemProps) {
  const [currentStep, setCurrentStep] = useState<"login" | "role-selection" | "permission-check">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Find matching admin user
      const user = MOCK_ADMINS.find((admin) => admin.email === formData.email && formData.password === "admin123")

      if (user) {
        setSelectedUser(user)
        setCurrentStep("role-selection")
      } else {
        setErrors({ general: "Invalid email or password" })
      }
    } catch (error) {
      setErrors({ general: "Login failed. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const handleRoleConfirm = () => {
    if (selectedUser) {
      setCurrentStep("permission-check")
    }
  }

  const handleFinalLogin = () => {
    if (selectedUser) {
      onLoginSuccess(selectedUser)
      onClose()
    }
  }

  const getPermissionsByCategory = () => {
    if (!selectedUser) return {}

    const userPermissions = selectedUser.permissions
    const categorized: Record<string, Permission[]> = {}

    PERMISSIONS.forEach((permission) => {
      if (userPermissions.includes(permission.id)) {
        if (!categorized[permission.category]) {
          categorized[permission.category] = []
        }
        categorized[permission.category].push(permission)
      }
    })

    return categorized
  }

  const formatLastLogin = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-lg mx-auto bg-white dark:bg-gray-800 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-between mb-4">
            {currentStep !== "login" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (currentStep === "role-selection") {
                    setCurrentStep("login")
                  } else if (currentStep === "permission-check") {
                    setCurrentStep("role-selection")
                  }
                }}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <div className="flex-1" />
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>

          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentStep === "login" && "Admin Portal"}
            {currentStep === "role-selection" && "Role Confirmation"}
            {currentStep === "permission-check" && "Access Permissions"}
          </CardTitle>

          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {currentStep === "login" && "Secure access for authorized personnel only"}
            {currentStep === "role-selection" && "Confirm your administrative role"}
            {currentStep === "permission-check" && "Review your system permissions"}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {errors.general && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <p className="text-red-600 dark:text-red-400 text-sm">{errors.general}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          {currentStep === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Demo Credentials Info */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Demo Credentials:</h4>
                <div className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                  <p>
                    <strong>Super Admin:</strong> superadmin@fooddelivery.com
                  </p>
                  <p>
                    <strong>Admin:</strong> admin@fooddelivery.com
                  </p>
                  <p>
                    <strong>Manager:</strong> manager@fooddelivery.com
                  </p>
                  <p>
                    <strong>Support:</strong> support@fooddelivery.com
                  </p>
                  <p>
                    <strong>Password:</strong> admin123 (for all accounts)
                  </p>
                </div>
              </div>

              {/* Email Input */}
              <div>
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your admin email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Password Input */}
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange("rememberMe", e.target.checked)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <Label htmlFor="rememberMe" className="text-sm">
                  Keep me signed in for 30 days
                </Label>
              </div>

              {/* Login Button */}
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Secure Login
                  </>
                )}
              </Button>

              {/* Security Notice */}
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Lock className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div className="text-sm text-yellow-700 dark:text-yellow-300">
                    <p className="font-medium">Security Notice</p>
                    <p>All admin activities are logged and monitored for security purposes.</p>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* Role Selection */}
          {currentStep === "role-selection" && selectedUser && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                    {selectedUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedUser.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{selectedUser.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Last login: {formatLastLogin(selectedUser.lastLogin)}
                </p>
              </div>

              <Card className="border-2 border-purple-200 dark:border-purple-800">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 ${ADMIN_ROLES[selectedUser.role].color} rounded-full flex items-center justify-center`}
                    >
                      {React.createElement(ADMIN_ROLES[selectedUser.role].icon, {
                        className: "h-6 w-6 text-white",
                      })}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {ADMIN_ROLES[selectedUser.role].name}
                        </h4>
                        <Badge
                          className={`${ADMIN_ROLES[selectedUser.role].color} hover:${ADMIN_ROLES[selectedUser.role].color}`}
                        >
                          {selectedUser.role.replace("_", " ").toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {ADMIN_ROLES[selectedUser.role].description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex space-x-3">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setCurrentStep("login")}>
                  Switch Account
                </Button>
                <Button className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={handleRoleConfirm}>
                  Continue as {ADMIN_ROLES[selectedUser.role].name}
                </Button>
              </div>
            </div>
          )}

          {/* Permission Check */}
          {currentStep === "permission-check" && selectedUser && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Access Granted</h3>
                <p className="text-gray-600 dark:text-gray-400">You have been granted the following permissions:</p>
              </div>

              <div className="max-h-80 overflow-y-auto space-y-4">
                {Object.entries(getPermissionsByCategory()).map(([category, permissions]) => (
                  <Card key={category}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">{category}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {permissions.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-3">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{permission.name}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">{permission.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <p className="text-green-700 dark:text-green-300 text-sm">
                    <strong>Total Permissions:</strong> {selectedUser.permissions.length} of {PERMISSIONS.length}{" "}
                    available
                  </p>
                </div>
              </div>

              <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={handleFinalLogin}>
                <Shield className="h-4 w-4 mr-2" />
                Access Admin Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
