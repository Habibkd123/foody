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
 const { user } = useAuthStorage()
 console.log("user", user)
 
//  useEffect(() => {
//    if (!user && pathname !== "/login") {
//      router.push('/login')
//    } else if (user && pathname !== "/productList") {
//      router.push('/productList')
//    }
//  }, [user, pathname])


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

        <AuthSystem onClose={() => setShowAuth(false)} onLoginSuccess={() => setShowDashboard(true)} />
      </div>
    </div>
  )
}

export default page
