"use client";
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useSidebar } from '@/context/SidebarContext';
import Header from "@/components/header/Header"
import RestaurantSidebar from "@/components/RestaurantSidebar"
import RestaurantNotifications from "@/components/RestaurantNotifications"
import { usePathname } from 'next/navigation';
import { useUserStore } from '@/lib/store/useUserStore';
import { useRouter } from 'next/navigation';

export default function RestaurantLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter()
  const { isExpanded, isMobile } = useSidebar()
  const [showHeader, setShowHeader] = useState(true);
  const { user } = useUserStore()

  useLayoutEffect(() => {
    if (!user) {
      router.push('/login')
      return;
    }

    // Only restaurant users can access this layout
    if (user?.role && user.role !== 'restaurant') {
      router.push('/login')
      return;
    }

    const status = user?.restaurant?.status;
    // Pending/rejected restaurants can only view the dashboard
    if (status && status !== 'approved' && pathname !== '/restaurant') {
      router.replace('/restaurant');
      return;
    }
  }, [user, pathname, router])

  useEffect(() => {
    if (pathname === '/restaurant/food/add') {
      setShowHeader(false);
    } else {
      setShowHeader(true);
    }
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="flex min-h-screen">
        <RestaurantSidebar />
        <div className={`flex-1 min-w-0 flex flex-col transition-all duration-300 ${!isMobile ? (isExpanded ? 'lg:ml-64' : 'lg:ml-16') : ''}`}>
          {showHeader && <Header />}
          <div className="flex-1 overflow-auto">
            <div className="container mx-auto px-3 sm:px-5 lg:px-8 py-3 sm:py-5 md:py-6">
              {children}
            </div>
          </div>
        </div>
        <RestaurantNotifications />
        <style jsx global>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
        `}</style>
      </div>
    </div>
  )
}
