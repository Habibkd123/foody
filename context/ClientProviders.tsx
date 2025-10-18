'use client';

import { WishListProvider } from '@/context/WishListsContext';
import { FilterProvider } from '@/context/FilterContext';
import { CartProvider } from '@/context/CartContext';
import { AddressProvider } from '@/context/AddressContext';
import { OrderProvider } from '@/context/OrderContext';
import { ProductsProvider } from '@/context/AllProductContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { SidebarProvider } from '@/context/SidebarContext';
import { AuthProvider } from '@/context/AuthContext';
import React, { ReactNode } from 'react';

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ProductsProvider>
      <ThemeProvider>
        <WishListProvider>
          <FilterProvider>
            <CartProvider>
              <AddressProvider>
                <OrderProvider>
                  <SidebarProvider>
                    <AuthProvider>
                      {children}
                    </AuthProvider>
                  </SidebarProvider>
                </OrderProvider>
              </AddressProvider>
            </CartProvider>
          </FilterProvider>
        </WishListProvider>
      </ThemeProvider>
    </ProductsProvider>
  );
}