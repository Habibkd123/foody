'use client';

import { ThemeProvider } from '@/context/ThemeContext';
import { SidebarProvider } from '@/context/SidebarContext';
import { ToastProvider } from '@/components/ui/ToastProvider';
import QueryProvider from '@/lib/query-provider';
import { AuthInit } from '@/components/AuthInit';
import React, { ReactNode } from 'react';

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <SidebarProvider>
          <AuthInit />
          <ToastProvider>
            {children}
          </ToastProvider>
        </SidebarProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
