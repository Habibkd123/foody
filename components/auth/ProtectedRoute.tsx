'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUserStore } from '@/lib/store/useUserStore';

type ProtectedRouteProps = {
  children: React.ReactNode;
  adminOnly?: boolean;
};

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading: loading, checkAuth: refreshAuth } = useUserStore();
  const isAdmin = user?.role === 'admin';
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!loading) {
        try {
          // Double check auth state with the server
          await refreshAuth();

          if (!isAuthenticated) {
            router.push(`/login?from=${encodeURIComponent(pathname)}`);
          } else if (adminOnly && !isAdmin) {
            router.push('/unauthorized');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          router.push(`/login?from=${encodeURIComponent(pathname)}`);
        } finally {
          setIsCheckingAuth(false);
        }
      }
    };

    checkAuth();
  }, [isAuthenticated, isAdmin, loading, router, adminOnly, pathname, refreshAuth]);

  if (loading || isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || (adminOnly && !isAdmin)) {
    return null; // Will be redirected by the useEffect
  }

  return <>{children}</>;
}
