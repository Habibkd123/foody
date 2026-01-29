"use client";

import DriverBottomNav from '@/components/layout/DriverBottomNav';
import { useUserStore } from '@/lib/store/useUserStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Basic auth check
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'driver') {
      router.push('/');
      return;
    }

    // Redirect to pending if not approved, unless already on pending page
    if (user.driverDetails?.status !== 'approved' && pathname !== '/driver/pending') {
      router.push('/driver/pending');
      return;
    }

    setAuthorized(true);
  }, [user, router, pathname]);

  if (!authorized && pathname !== '/driver/pending') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Sidebar for Desktop would go here, currently mobile-focused */}
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>

      {/* Bottom Nav for Mobile */}
      <DriverBottomNav />
    </div>
  );
}
