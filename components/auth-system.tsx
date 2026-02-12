"use client";
import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Mail, Phone, Eye, EyeOff, Loader2, Shield, MapPin, Check, User, Briefcase, Truck, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useUserStore } from "@/lib/store/useUserStore"
import { motion, AnimatePresence } from "framer-motion"

interface AuthSystemProps {
  onClose: () => void
  onLoginSuccess: () => void
  userRole1: string
}

export default function AuthSystem({ onClose, onLoginSuccess, userRole1 }: AuthSystemProps) {
  const { user, checkAuth } = useUserStore();
  const userRole = user?.role;
  console.log("User Role in AuthSystem:", userRole);

  const [currentStep, setCurrentStep] = useState<
    "login" | "signup" | "forgot-password" | "otp-verification" | "profile-setup"
  >("login")
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [otpTimer, setOtpTimer] = useState(0)
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    username: "",
    address: "",
    otp: "",
    agreeToTerms: false,
    role: "user",
    restaurantName: "",
    restaurantOwnerName: "",
    restaurantAddress: "",
    openingTime: "",
    closingTime: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // OTP Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [otpTimer])

  // API Functions
  const createUser = async () => {
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email?.trim() || undefined,
        phone: formData.phone?.trim() || undefined,
        password: formData.password,
        username: formData.username || undefined,
        otp: formData.otp?.trim() || undefined,
        role: formData.role,
        restaurantName: formData.restaurantName?.trim() || undefined,
        restaurantOwnerName: formData.restaurantOwnerName?.trim() || undefined,
        restaurantAddress: formData.restaurantAddress?.trim() || undefined,
        openingTime: formData.openingTime?.trim() || undefined,
        closingTime: formData.closingTime?.trim() || undefined,
      }

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create user')
      }

      console.log('User created successfully:', result)

      return result
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  const sendOtp = async () => {
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email?.trim(), name: formData.firstName || 'there' }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to send OTP')
      }
      return data
    } catch (error) {
      console.error('Error sending OTP:', error)
      throw error
    }
  }

  const verifyOtp = async () => {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email?.trim(), otp: formData.otp?.trim() })
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Invalid or expired OTP')
      }
      return data
    } catch (error) {
      console.error('Error verifying OTP:', error)
      throw error
    }
  }

  const loginUser = async () => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // important for cookies
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();
      console.log('Login response:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      if (result.success && result) {
        console.log('Login successful, token:', result.token);

        // Refresh the local store state
        await checkAuth();

        // Important: Perform a full reload to ensure middleware sees the cookie
        if (result.user?.role === "user") {
          window.location.href = '/productlist';
        } else if (result.user?.role === "admin") {
          window.location.href = '/admin';
        } else if (result.user?.role === "restaurant") {
          window.location.href = '/restaurant';
        } else if (result.user?.role === "driver") {
          window.location.href = '/driver';
        } else {
          window.location.reload();
        }
        return result;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (userRole == "user") {
      router.push('/productlist');
    } else if (userRole == "admin") {
      router.push('/admin');
    } else if (userRole == "restaurant") {
      router.push('/restaurant');
    } else if (userRole == "driver") {
      router.push('/driver');
    } else {
      setCurrentStep("login")
    }
  }, [userRole, router]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[6-9]\d{9}$/
    return phoneRegex.test(phone.replace(/\D/g, ""))
  }

  const validatePassword = (password: string) => {
    return password.length >= 8
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (currentStep === "login" || currentStep === "signup") {
      if (authMethod === "email") {
        if (!formData.email) {
          newErrors.email = "Email is required"
        } else if (!validateEmail(formData.email)) {
          newErrors.email = "Please enter a valid email"
        }
      } else {
        if (!formData.phone) {
          newErrors.phone = "Phone number is required"
        } else if (!validatePhone(formData.phone)) {
          newErrors.phone = "Please enter a valid 10-digit phone number"
        }
      }

      if (!formData.password) {
        newErrors.password = "Password is required"
      } else if (!validatePassword(formData.password)) {
        newErrors.password = "Password must be at least 8 characters"
      }

      if (currentStep === "signup") {
        if (!formData.firstName.trim()) {
          newErrors.firstName = "First name is required"
        }
        if (!formData.lastName.trim()) {
          newErrors.lastName = "Last name is required"
        }

        if (!formData.role) {
          newErrors.role = "Role is required"
        }

        if (formData.role === "restaurant") {
          if (!formData.restaurantName.trim()) newErrors.restaurantName = "Restaurant name is required"
          if (!formData.restaurantOwnerName.trim()) newErrors.restaurantOwnerName = "Owner name is required"
          if (!formData.restaurantAddress.trim()) newErrors.restaurantAddress = "Restaurant address is required"
          if (!formData.openingTime.trim()) newErrors.openingTime = "Opening time is required"
          if (!formData.closingTime.trim()) newErrors.closingTime = "Closing time is required"
        }

        if (!formData.agreeToTerms) {
          newErrors.agreeToTerms = "Please agree to the terms and conditions"
        }
      }
    }

    if (currentStep === "otp-verification") {
      if (!formData.otp || formData.otp.length !== 6) {
        newErrors.otp = "Please enter a valid 6-digit OTP"
      }
    }

    if (currentStep === "profile-setup") {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required"
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required"
      }
      if (!formData.address.trim()) {
        newErrors.address = "Address is required"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setErrors({}) // Clear any previous errors

    try {
      if (currentStep === "login") {
        // Call login API
        await loginUser()
        onLoginSuccess()
        onClose()
      } else if (currentStep === "signup") {
        await sendOtp()
        setCurrentStep("otp-verification")
        setOtpTimer(60)
      } else if (currentStep === "otp-verification") {
        const result = await createUser()
        if (result?.success) {
          onLoginSuccess()
          onClose()
        }
      } else if (currentStep === "profile-setup") {
        // Complete registration
        await new Promise((resolve) => setTimeout(resolve, 1000))
        onLoginSuccess()
        onClose()
      } else if (currentStep === "forgot-password") {
        // Send reset link
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setCurrentStep("otp-verification")
        setOtpTimer(60)
      }
    } catch (error: any) {
      console.error('Form submission error:', error)
      setErrors({ general: error.message || "Something went wrong. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    setLoading(true)
    try {
      // Simulate social login
      await new Promise((resolve) => setTimeout(resolve, 1500))
      onLoginSuccess()
      onClose()
    } catch (error) {
      setErrors({ general: "Social login failed. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const resendOTP = async () => {
    if (otpTimer > 0) return

    setLoading(true)
    try {
      // Simulate OTP resend
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setOtpTimer(60)
      setErrors({ otp: "" })
    } catch (error) {
      setErrors({ otp: "Failed to resend OTP. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  }

  const inputClasses = "h-11 sm:h-12 text-sm sm:text-base bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={cardVariants}
          className="w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto"
        >
          <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-2xl border-0 overflow-hidden ring-1 ring-black/5">
            <CardHeader className="text-center px-4 sm:px-8 pt-8 pb-6 bg-gradient-to-b from-orange-50/50 to-transparent dark:from-orange-950/20">
              <div className="flex flex-col items-center justify-center mb-2">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-full p-1 bg-gradient-to-tr from-orange-400 to-red-600 mb-4"
                >
                  <div className="bg-white rounded-full p-1">
                    <img
                      src="./logoGro.png"
                      alt="Logo"
                      className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full object-cover"
                    />
                  </div>
                </motion.div>
                <CardTitle className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600 pb-1">
                  Foody
                </CardTitle>
              </div>

              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                {currentStep === "login" && "Welcome Back"}
                {currentStep === "signup" && "Create Account"}
                {currentStep === "forgot-password" && "Reset Password"}
                {currentStep === "otp-verification" && "Verify OTP"}
                {currentStep === "profile-setup" && "Complete Profile"}
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                {currentStep === "login" && "Sign in to continue your delicious journey"}
                {currentStep === "signup" && "Join us and satisfy your cravings"}
                {currentStep === "forgot-password" && "Enter your details to generate a reset link"}
                {currentStep === "otp-verification" && `Enter the code sent to ${authMethod === "email" ? formData.email : formData.phone}`}
                {currentStep === "profile-setup" && "Tell us a bit about yourself"}
              </p>
            </CardHeader>

            <CardContent className="px-4 sm:px-8 pb-8">
              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-3 sm:p-4 mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                >
                  <p className="text-red-600 dark:text-red-400 text-sm sm:text-base flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    {errors.general}
                  </p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Login Form */}
                {currentStep === "login" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    {/* Auth Method Toggle */}
                    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1.5 shadow-inner">
                      <button
                        type="button"
                        onClick={() => setAuthMethod("email")}
                        className={`flex-1 flex items-center justify-center py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${authMethod === "email"
                          ? "bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-400 shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                          }`}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthMethod("phone")}
                        className={`flex-1 flex items-center justify-center py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${authMethod === "phone"
                          ? "bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-400 shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                          }`}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Phone
                      </button>
                    </div>

                    {/* Email/Phone Input */}
                    <div className="space-y-1.5">
                      <Label htmlFor="contact" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {authMethod === "email" ? "Email Address" : "Phone Number"}
                      </Label>
                      <Input
                        id="contact"
                        type={authMethod === "email" ? "email" : "tel"}
                        placeholder={authMethod === "email" ? "name@example.com" : "9876543210"}
                        value={authMethod === "email" ? formData.email : formData.phone}
                        onChange={(e) => handleInputChange(authMethod === "email" ? "email" : "phone", e.target.value)}
                        className={`${inputClasses} ${errors[authMethod] ? "border-red-500 focus:ring-red-500" : ""}`}
                      />
                      {errors[authMethod] && <p className="text-red-500 text-xs mt-1 font-medium">{errors[authMethod]}</p>}
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          className={`${inputClasses} pr-12 ${errors.password ? "border-red-500 focus:ring-red-500" : ""}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1 h-9 w-9 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        {errors.password ? <p className="text-red-500 text-xs font-medium">{errors.password}</p> : <div></div>}
                        <button
                          type="button"
                          onClick={() => setCurrentStep("forgot-password")}
                          className="text-orange-600 hover:text-orange-700 text-xs font-medium transition-colors"
                        >
                          Forgot Password?
                        </button>
                      </div>
                    </div>

                    {/* Login Button */}
                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        <span className="flex items-center justify-center font-semibold text-base">
                          Sign In <ArrowRight className="ml-2 h-4 w-4" />
                        </span>
                      )}
                    </Button>

                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200 dark:border-gray-700" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    {/* Sign Up Link */}
                    <div className="text-center">
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Don't have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setCurrentStep("signup")}
                          className="text-orange-600 hover:text-orange-700 font-bold hover:underline"
                        >
                          Sign Up
                        </button>
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Signup Form */}
                {currentStep === "signup" && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    {/* Auth Method Toggle */}
                    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1.5 shadow-inner">
                      <button
                        type="button"
                        onClick={() => setAuthMethod("email")}
                        className={`flex-1 flex items-center justify-center py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${authMethod === "email"
                          ? "bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-400 shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                          }`}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthMethod("phone")}
                        className={`flex-1 flex items-center justify-center py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${authMethod === "phone"
                          ? "bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-400 shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                          }`}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Phone
                      </button>
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-1.5">
                      <Label htmlFor="role" className="text-sm font-medium text-gray-700 dark:text-gray-300">I am a</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div
                          className={`cursor-pointer border rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-all ${formData.role === 'user' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 hover:border-gray-300'}`}
                          onClick={() => handleInputChange("role", "user")}
                        >
                          <User className="h-5 w-5" />
                          <span className="text-xs font-medium">User</span>
                        </div>
                        <div
                          className={`cursor-pointer border rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-all ${formData.role === 'restaurant' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 hover:border-gray-300'}`}
                          onClick={() => handleInputChange("role", "restaurant")}
                        >
                          <Briefcase className="h-5 w-5" />
                          <span className="text-xs font-medium">Restaurant</span>
                        </div>
                        <div
                          className={`cursor-pointer border rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-all ${formData.role === 'driver' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 hover:border-gray-300'}`}
                          onClick={() => handleInputChange("role", "driver")}
                        >
                          <Truck className="h-5 w-5" />
                          <span className="text-xs font-medium">Rider</span>
                        </div>
                      </div>
                      {errors.role && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.role}</p>}
                    </div>

                    {formData.role === "restaurant" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                          <Label htmlFor="restaurantName" className="text-sm font-medium">Restaurant Name</Label>
                          <Input
                            id="restaurantName"
                            type="text"
                            placeholder="Restaurant name"
                            value={formData.restaurantName}
                            onChange={(e) => handleInputChange("restaurantName", e.target.value)}
                            className={inputClasses}
                          />
                          {errors.restaurantName && <p className="text-red-500 text-xs mt-1">{errors.restaurantName}</p>}
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="restaurantOwnerName" className="text-sm font-medium">Owner Name</Label>
                          <Input
                            id="restaurantOwnerName"
                            type="text"
                            placeholder="Owner name"
                            value={formData.restaurantOwnerName}
                            onChange={(e) => handleInputChange("restaurantOwnerName", e.target.value)}
                            className={inputClasses}
                          />
                          {errors.restaurantOwnerName && (
                            <p className="text-red-500 text-xs mt-1">{errors.restaurantOwnerName}</p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="restaurantAddress" className="text-sm font-medium">Verified Address</Label>
                          <Input
                            id="restaurantAddress"
                            type="text"
                            placeholder="Full address"
                            value={formData.restaurantAddress}
                            onChange={(e) => handleInputChange("restaurantAddress", e.target.value)}
                            className={inputClasses}
                          />
                          {errors.restaurantAddress && (
                            <p className="text-red-500 text-xs mt-1">{errors.restaurantAddress}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="openingTime" className="text-sm font-medium">Opening Time</Label>
                            <Input
                              id="openingTime"
                              type="time"
                              value={formData.openingTime}
                              onChange={(e) => handleInputChange("openingTime", e.target.value)}
                              className={inputClasses}
                            />
                            {errors.openingTime && <p className="text-red-500 text-xs mt-1">{errors.openingTime}</p>}
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="closingTime" className="text-sm font-medium">Closing Time</Label>
                            <Input
                              id="closingTime"
                              type="time"
                              value={formData.closingTime}
                              onChange={(e) => handleInputChange("closingTime", e.target.value)}
                              className={inputClasses}
                            />
                            {errors.closingTime && <p className="text-red-500 text-xs mt-1">{errors.closingTime}</p>}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          className={inputClasses}
                        />
                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          className={inputClasses}
                        />
                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    {/* Email/Phone Input */}
                    <div className="space-y-1.5">
                      <Label htmlFor="contact" className="text-sm font-medium">
                        {authMethod === "email" ? "Email Address" : "Phone Number"}
                      </Label>
                      <Input
                        id="contact"
                        type={authMethod === "email" ? "email" : "tel"}
                        placeholder={authMethod === "email" ? "name@example.com" : "9876543210"}
                        value={authMethod === "email" ? formData.email : formData.phone}
                        onChange={(e) => handleInputChange(authMethod === "email" ? "email" : "phone", e.target.value)}
                        className={inputClasses}
                      />
                      {errors[authMethod] && <p className="text-red-500 text-xs mt-1">{errors[authMethod]}</p>}
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5">
                      <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          className={`${inputClasses} pr-12`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1 h-9 w-9 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
                      {errors.password && <p className="text-red-500 text-xs font-medium">{errors.password}</p>}
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-start space-x-3 pt-2">
                      <Checkbox
                        id="terms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                        className={`mt-0.5 data-[state=checked]:bg-orange-500 ${errors.agreeToTerms ? "border-red-500" : ""}`}
                      />
                      <Label htmlFor="terms" className="text-xs leading-4 cursor-pointer text-gray-600 dark:text-gray-400">
                        I agree to the{" "}
                        <a href="#" className="text-orange-600 hover:text-orange-700 font-medium">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-orange-600 hover:text-orange-700 font-medium">
                          Privacy Policy
                        </a>
                      </Label>
                    </div>
                    {errors.agreeToTerms && <p className="text-red-500 text-xs">{errors.agreeToTerms}</p>}

                    {/* Sign Up Button */}
                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg shadow-orange-500/30 transition-all duration-300 mt-4"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>

                    {/* Sign In Link */}
                    <div className="text-center pt-2">
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setCurrentStep("login")}
                          className="text-orange-600 hover:text-orange-700 font-bold hover:underline"
                        >
                          Sign In
                        </button>
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Forgot Password Form */}
                {currentStep === "forgot-password" && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                    {/* Auth Method Toggle */}
                    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1.5 shadow-inner">
                      <button
                        type="button"
                        onClick={() => setAuthMethod("email")}
                        className={`flex-1 flex items-center justify-center py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${authMethod === "email"
                          ? "bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-400 shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                          }`}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthMethod("phone")}
                        className={`flex-1 flex items-center justify-center py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${authMethod === "phone"
                          ? "bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-400 shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                          }`}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Phone
                      </button>
                    </div>

                    {/* Email/Phone Input */}
                    <div className="space-y-1.5">
                      <Label htmlFor="contact" className="text-sm font-medium">
                        {authMethod === "email" ? "Email Address" : "Phone Number"}
                      </Label>
                      <Input
                        id="contact"
                        type={authMethod === "email" ? "email" : "tel"}
                        placeholder={
                          authMethod === "email" ? "Enter your registered email" : "Enter your registered phone number"
                        }
                        value={authMethod === "email" ? formData.email : formData.phone}
                        onChange={(e) => handleInputChange(authMethod === "email" ? "email" : "phone", e.target.value)}
                        className={inputClasses}
                      />
                      {errors[authMethod] && <p className="text-red-500 text-xs mt-1 font-medium">{errors[authMethod]}</p>}
                    </div>

                    {/* Send Reset Code Button */}
                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Sending Code...
                        </>
                      ) : (
                        "Send Reset Code"
                      )}
                    </Button>

                    {/* Back to Login */}
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setCurrentStep("login")}
                        className="flex items-center justify-center text-gray-500 hover:text-gray-800 text-sm font-medium w-full group"
                      >
                        <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                        Back to Sign In
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* OTP Verification Form */}
                {currentStep === "otp-verification" && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Shield className="h-8 w-8 text-orange-600" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 px-2">
                        We've sent a 6-digit verification code to
                        <br />
                        <span className="font-semibold text-gray-900 dark:text-white break-all">
                          {authMethod === "email" ? formData.email : formData.phone}
                        </span>
                      </p>
                    </div>

                    {/* OTP Input */}
                    <div className="space-y-2">
                      <Label htmlFor="otp" className="sr-only">Verification Code</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="000000"
                        value={formData.otp}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                          handleInputChange("otp", value)
                        }}
                        className="text-center text-2xl tracking-[0.5em] h-16 font-mono border-2 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                        maxLength={6}
                      />
                      {errors.otp && <p className="text-red-500 text-xs text-center font-medium">{errors.otp}</p>}
                    </div>

                    {/* Resend OTP */}
                    <div className="text-center">
                      {otpTimer > 0 ? (
                        <p className="text-gray-500 text-sm">
                          Resend code in <span className="font-medium text-orange-600">{formatTime(otpTimer)}</span>
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={resendOTP}
                          disabled={loading}
                          className="text-orange-600 hover:text-orange-700 font-medium text-sm hover:underline"
                        >
                          Resend Code
                        </button>
                      )}
                    </div>

                    {/* Verify Button */}
                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Verify Code"
                      )}
                    </Button>

                    {/* Back to Login */}
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setCurrentStep("login")}
                        className="flex items-center justify-center text-gray-500 hover:text-gray-800 text-sm font-medium w-full group"
                      >
                        <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                        Back to Sign In
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Profile Setup Form */}
                {currentStep === "profile-setup" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                    <div className="text-center mb-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        type="spring"
                        className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
                      >
                        <Check className="h-8 w-8 text-green-600" />
                      </motion.div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Account Verified!</h3>
                      <p className="text-sm text-gray-600 px-4">
                        Just a few more details to complete your profile.
                      </p>
                    </div>

                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="First name"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          className={inputClasses}
                        />
                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Last name"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          className={inputClasses}
                        />
                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    {/* Address Field */}
                    <div className="space-y-1.5">
                      <Label htmlFor="address" className="text-sm font-medium">Delivery Address</Label>
                      <div className="relative">
                        <Input
                          id="address"
                          type="text"
                          placeholder="Enter your delivery address"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          className={`${inputClasses} pr-10`}
                        />
                        <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>

                    {/* Complete Profile Button */}
                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-0.5 mt-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Completing Profile...
                        </>
                      ) : (
                        <span className="flex items-center justify-center">
                          Complete Profile <ArrowRight className="h-4 w-4 ml-2" />
                        </span>
                      )}
                    </Button>
                  </motion.div>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}