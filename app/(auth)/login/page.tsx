"use client";
import React, { useState } from 'react'
import AuthSystem from '@/components/auth-system'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/lib/store/useUserStore'
import { usePathname } from 'next/navigation';

const page = () => {
  const router = useRouter()
  const pathname = usePathname();
  const [showAuth, setShowAuth] = useState(false)
  const { user } = useUserStore();
  const userRole = user?.role;
  console.log("user", user, "userRole", userRole)

  // Redirect logic - only run once when component mounts if user is already logged in
  // useEffect(() => {
  //   if (user && (user?._id || user?.id) && userRole) {
  //     const target = userRole === "admin" ? "/admin" : "/productlist";
  //     console.log("Login page: User already logged in, redirecting to", target);
  //     router.replace(target);
  //   }
  // }, []) // Empty dependency array - only run once on mount


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-10">
      <div className="w-full max-w-md">
        <AuthSystem onClose={() => setShowAuth(false)} userRole1={userRole || ''} onLoginSuccess={() => console.log("Login success")} />
      </div>
    </div>
  )
}

export default page
