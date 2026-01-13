'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStorage } from '@/hooks/useAuth';

type User = {
  _id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'restaurant';
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  refreshAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const {user,setUser ,setToken,token}=useAuthStorage()
  const router = useRouter();
  const pathname = usePathname();

  const setAuthCookies = useCallback((token: string, userData: User) => {
    fetch('/api/auth/set-cookies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, user: userData }),
      credentials: 'include',
    });
  }, []);

  const clearAuthCookies = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Clear any client-side storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, []);

  const refreshAuth = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        clearAuthCookies();
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to refresh auth:', error);
      clearAuthCookies();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [clearAuthCookies]);

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
        
        
  //       if (token && user) {
  //         await refreshAuth();
  //       } else if (!['/', '/login', '/signup'].includes(pathname)) {
  //         router.push('/login');
  //       }
  //     } catch (error) {
  //       console.error('Auth check failed:', error);
  //       clearAuthCookies();
  //       if (!['/', '/login', '/signup'].includes(pathname)) {
  //         router.push('/login');
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   checkAuth();
  // }, [pathname, router, refreshAuth, clearAuthCookies]);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setAuthCookies(data.token, data.user);
      setUser(data.user);
      
      const redirectTo = new URLSearchParams(window.location.search).get('from') || '/';
      router.push(redirectTo);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthCookies();
      setUser(null);
      router.push('/login');
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
