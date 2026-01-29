"use client";
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useSidebar } from '@/context/SidebarContext';
import Header from "@/components/header/Header"
import Sidebar from "@/components/Sidebar"
import { usePathname } from 'next/navigation';
import { useUserStore } from '@/lib/store/useUserStore';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter()
  const { isExpanded, isMobile } = useSidebar()
  const [showHeader, setShowHeader] = useState(true);
  const { user } = useUserStore()
  useLayoutEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user])
  useEffect(() => {
    if (pathname === '/admin/products/add') {
      setShowHeader(false);
    } else {
      setShowHeader(true);
    }
  }, [pathname]);

  const { theme } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className={`flex-1 min-w-0 flex flex-col transition-all duration-300 ${!isMobile ? (isExpanded ? 'lg:ml-64' : 'lg:ml-16') : ''}`}>
          {showHeader && <Header />}
          <div className="flex-1 overflow-auto">
            <div className="container mx-auto px-3 sm:px-5 lg:px-8 py-3 sm:py-5 md:py-6">
              {children}
            </div>
          </div>
        </div>
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

