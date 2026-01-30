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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className={`flex-1 min-w-0 flex flex-col transition-all duration-500 ${!isMobile ? (isExpanded ? 'lg:ml-64' : 'lg:ml-20') : ''}`}>
          {showHeader && <Header />}
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="max-w-8xl mx-auto p-4 sm:p-6 lg:p-8 animate-fadeIn">
              {children}
            </div>
          </main>
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

