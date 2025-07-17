"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Mail, Phone, Eye, EyeOff, ArrowLeft, Check, X, Loader2, Shield, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

interface AuthSystemProps {
  onClose: () => void
  onLoginSuccess: () => void
}

export default function AuthSystem({ onClose, onLoginSuccess }: AuthSystemProps) {
  const [currentStep, setCurrentStep] = useState<
    "login" | "signup" | "forgot-password" | "otp-verification" | "profile-setup"
  >("login")
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [otpTimer, setOtpTimer] = useState(0)
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    address: "",
    otp: "",
    agreeToTerms: false,
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
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = "Please confirm your password"
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match"
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

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      if (currentStep === "login") {
        // Simulate login success
        onLoginSuccess()
        onClose()
      } else if (currentStep === "signup") {
        // Move to OTP verification
        setCurrentStep("otp-verification")
        setOtpTimer(60)
      } else if (currentStep === "otp-verification") {
        // Move to profile setup for new users
        if (formData.otp === "123456") {
          setCurrentStep("profile-setup")
        } else {
          setErrors({ otp: "Invalid OTP. Please try again." })
        }
      } else if (currentStep === "profile-setup") {
        // Complete registration
        onLoginSuccess()
        onClose()
      } else if (currentStep === "forgot-password") {
        // Send reset link
        setCurrentStep("otp-verification")
        setOtpTimer(60)
      }
    } catch (error) {
      setErrors({ general: "Something went wrong. Please try again." })
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-between mb-4">
            {currentStep !== "login" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (currentStep === "signup" || currentStep === "forgot-password") {
                    setCurrentStep("login")
                  } else if (currentStep === "otp-verification") {
                    setCurrentStep(formData.firstName ? "signup" : "forgot-password")
                  } else if (currentStep === "profile-setup") {
                    setCurrentStep("otp-verification")
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
            <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">FD</span>
            </div>
          </div>

          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentStep === "login" && "Welcome Back"}
            {currentStep === "signup" && "Create Account"}
            {currentStep === "forgot-password" && "Reset Password"}
            {currentStep === "otp-verification" && "Verify OTP"}
            {currentStep === "profile-setup" && "Complete Profile"}
          </CardTitle>

          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {currentStep === "login" && "Sign in to your account to continue"}
            {currentStep === "signup" && "Join us for delicious food delivery"}
            {currentStep === "forgot-password" && "Enter your details to reset password"}
            {currentStep === "otp-verification" &&
              `Enter the 6-digit code sent to ${authMethod === "email" ? formData.email : formData.phone}`}
            {currentStep === "profile-setup" && "Tell us a bit about yourself"}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {errors.general && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Login Form */}
            {currentStep === "login" && (
              <>
                {/* Auth Method Toggle */}
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setAuthMethod("email")}
                    className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      authMethod === "email"
                        ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMethod("phone")}
                    className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      authMethod === "phone"
                        ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Phone
                  </button>
                </div>

                {/* Email/Phone Input */}
                <div>
                  <Label htmlFor="contact">{authMethod === "email" ? "Email Address" : "Phone Number"}</Label>
                  <Input
                    id="contact"
                    type={authMethod === "email" ? "email" : "tel"}
                    placeholder={authMethod === "email" ? "Enter your email" : "Enter your phone number"}
                    value={authMethod === "email" ? formData.email : formData.phone}
                    onChange={(e) => handleInputChange(authMethod === "email" ? "email" : "phone", e.target.value)}
                    className={errors[authMethod] ? "border-red-500" : ""}
                  />
                  {errors[authMethod] && <p className="text-red-500 text-sm mt-1">{errors[authMethod]}</p>}
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

                {/* Forgot Password Link */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setCurrentStep("forgot-password")}
                    className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Login Button */}
                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                {/* Social Login */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSocialLogin("google")}
                    disabled={loading}
                    className="bg-transparent"
                  >
                    <span className="mr-2">🔍</span>
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSocialLogin("facebook")}
                    disabled={loading}
                    className="bg-transparent"
                  >
                    <span className="mr-2">📘</span>
                    Facebook
                  </Button>
                </div>

                {/* Sign Up Link */}
                <div className="text-center">
                  <span className="text-gray-600 dark:text-gray-400">Don't have an account? </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep("signup")}
                    className="text-orange-500 hover:text-orange-600 font-medium"
                  >
                    Sign Up
                  </button>
                </div>
              </>
            )}

            {/* Signup Form */}
            {currentStep === "signup" && (
              <>
                {/* Auth Method Toggle */}
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setAuthMethod("email")}
                    className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      authMethod === "email"
                        ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMethod("phone")}
                    className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      authMethod === "phone"
                        ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Phone
                  </button>
                </div>

                {/* Email/Phone Input */}
                <div>
                  <Label htmlFor="contact">{authMethod === "email" ? "Email Address" : "Phone Number"}</Label>
                  <Input
                    id="contact"
                    type={authMethod === "email" ? "email" : "tel"}
                    placeholder={authMethod === "email" ? "Enter your email" : "Enter your phone number"}
                    value={authMethod === "email" ? formData.email : formData.phone}
                    onChange={(e) => handleInputChange(authMethod === "email" ? "email" : "phone", e.target.value)}
                    className={errors[authMethod] ? "border-red-500" : ""}
                  />
                  {errors[authMethod] && <p className="text-red-500 text-sm mt-1">{errors[authMethod]}</p>}
                </div>

                {/* Password Input */}
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
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

                {/* Confirm Password Input */}
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={errors.confirmPassword ? "border-red-500" : ""}
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                    className={errors.agreeToTerms ? "border-red-500" : ""}
                  />
                  <Label htmlFor="terms" className="text-sm leading-5">
                    I agree to the{" "}
                    <a href="#" className="text-orange-500 hover:text-orange-600">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-orange-500 hover:text-orange-600">
                      Privacy Policy
                    </a>
                  </Label>
                </div>
                {errors.agreeToTerms && <p className="text-red-500 text-sm">{errors.agreeToTerms}</p>}

                {/* Sign Up Button */}
                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>

                {/* Social Login */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or sign up with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSocialLogin("google")}
                    disabled={loading}
                    className="bg-transparent"
                  >
                    <span className="mr-2">🔍</span>
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSocialLogin("facebook")}
                    disabled={loading}
                    className="bg-transparent"
                  >
                    <span className="mr-2">📘</span>
                    Facebook
                  </Button>
                </div>

                {/* Sign In Link */}
                <div className="text-center">
                  <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep("login")}
                    className="text-orange-500 hover:text-orange-600 font-medium"
                  >
                    Sign In
                  </button>
                </div>
              </>
            )}

            {/* Forgot Password Form */}
            {currentStep === "forgot-password" && (
              <>
                {/* Auth Method Toggle */}
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setAuthMethod("email")}
                    className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      authMethod === "email"
                        ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMethod("phone")}
                    className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      authMethod === "phone"
                        ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Phone
                  </button>
                </div>

                {/* Email/Phone Input */}
                <div>
                  <Label htmlFor="contact">{authMethod === "email" ? "Email Address" : "Phone Number"}</Label>
                  <Input
                    id="contact"
                    type={authMethod === "email" ? "email" : "tel"}
                    placeholder={
                      authMethod === "email" ? "Enter your registered email" : "Enter your registered phone number"
                    }
                    value={authMethod === "email" ? formData.email : formData.phone}
                    onChange={(e) => handleInputChange(authMethod === "email" ? "email" : "phone", e.target.value)}
                    className={errors[authMethod] ? "border-red-500" : ""}
                  />
                  {errors[authMethod] && <p className="text-red-500 text-sm mt-1">{errors[authMethod]}</p>}
                </div>

                {/* Send Reset Code Button */}
                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
                    className="text-orange-500 hover:text-orange-600 font-medium"
                  >
                    Back to Sign In
                  </button>
                </div>
              </>
            )}

            {/* OTP Verification Form */}
            {currentStep === "otp-verification" && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-orange-500" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We've sent a 6-digit verification code to{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {authMethod === "email" ? formData.email : formData.phone}
                    </span>
                  </p>
                </div>

                {/* OTP Input */}
                <div>
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={formData.otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                      handleInputChange("otp", value)
                    }}
                    className={`text-center text-lg tracking-widest ${errors.otp ? "border-red-500" : ""}`}
                    maxLength={6}
                  />
                  {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
                </div>

                {/* Resend OTP */}
                <div className="text-center">
                  {otpTimer > 0 ? (
                    <p className="text-gray-600 dark:text-gray-400">
                      Resend code in <span className="font-medium text-orange-500">{formatTime(otpTimer)}</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={resendOTP}
                      disabled={loading}
                      className="text-orange-500 hover:text-orange-600 font-medium"
                    >
                      Resend Code
                    </button>
                  )}
                </div>

                {/* Verify Button */}
                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Code"
                  )}
                </Button>

                {/* Demo OTP Info */}
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-blue-600 dark:text-blue-400 text-sm text-center">
                    <strong>Demo:</strong> Use code <span className="font-mono font-bold">123456</span> to verify
                  </p>
                </div>
              </>
            )}

            {/* Profile Setup Form */}
            {currentStep === "profile-setup" && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-green-500" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Great! Your account has been verified. Let's complete your profile.
                  </p>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Address Field */}
                <div>
                  <Label htmlFor="address">Delivery Address</Label>
                  <div className="relative">
                    <Input
                      id="address"
                      type="text"
                      placeholder="Enter your delivery address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className={errors.address ? "border-red-500 pr-10" : "pr-10"}
                    />
                    <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                {/* Complete Profile Button */}
                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Completing Profile...
                    </>
                  ) : (
                    "Complete Profile"
                  )}
                </Button>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
