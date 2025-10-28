"use client"
import React, { useEffect, useState, useLayoutEffect } from 'react'
import AuthSystem from '@/components/auth-system'
import UserDashboard from '@/components/user-dashboard'
import AdminAuthSystem from '@/components/admin-auth-system'
import AdminDashboard from '@/components/admin-dashboard'
import { useRouter } from 'next/navigation'
import { useAuthStorage } from '@/hooks/useAuth'
import { usePathname } from 'next/navigation';
const page = () => {
  const router = useRouter()
    const pathname = usePathname();
  const [showDashboard, setShowDashboard] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [showAdminAuth, setShowAdminAuth] = useState(false)
  const [showAdminDashboard, setShowAdminDashboard] = useState(false)
  const [adminUser, setAdminUser] = useState<any>({
    name: "",
    email: "",
    password: "",
    role: "admin",
    permissions: [],
    lastLogin: "",
    avatar: "",
  })
  const handleAdminLoginSuccess = (user: any) => {
    setAdminUser(user)
    setShowAdminAuth(false)
    setShowAdminDashboard(true)
  }
 const { user, userRole } = useAuthStorage()
 console.log("user", user, "userRole", userRole)
 
  // Redirect logic - only run once when component mounts if user is already logged in
  useEffect(() => {
    if (user && (user?._id || user?.id) && userRole) {
      const target = userRole === "admin" ? "/admin" : "/productlist";
      console.log("Login page: User already logged in, redirecting to", target);
      router.replace(target);
    }
  }, []) // Empty dependency array - only run once on mount


  return (
    <div>
      {/* {showDashboard && 
     <UserDashboard onClose={() => setShowDashboard(false)} />
     } 
          {showAuth && 
          <AuthSystem onClose={() => setShowAuth(false)} onLoginSuccess={() => setShowDashboard(true)} />
          }
          {showAdminAuth && (
            <AdminAuthSystem onClose={() => setShowAdminAuth(false)} onLoginSuccess={handleAdminLoginSuccess} />
          )}
          {showAdminDashboard && adminUser && (
            <AdminDashboard
              user={adminUser}
              onClose={() => {
                setShowAdminDashboard(false)
                setAdminUser(null)
              }}
            />
         )}  */}
      <div className='mt-4 '>

        <AuthSystem onClose={() => setShowAuth(false)} userRole1={userRole} onLoginSuccess={() => setShowDashboard(true)} />
      </div>
    </div>
  )
}

export default page
