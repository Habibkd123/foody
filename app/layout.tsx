import './globals.css';
import { WishListProvider } from '@/context/WishListsContext';
import { FilterProvider } from '@/context/FilterContext';
import { CartProvider } from '@/context/CartContext';
import { AddressProvider } from '@/context/AddressContext';
import { OrderProvider } from '@/context/OrderContext';
import { ProductsProvider } from '@/context/AllProductContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { SidebarProvider } from '@/context/SidebarContext';
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ProductsProvider>
            <ThemeProvider>
              <WishListProvider>
                <FilterProvider>
                  <CartProvider>
                    <AddressProvider>
                      <OrderProvider>
                        <SidebarProvider>
                          {children}
                        </SidebarProvider>
                      </OrderProvider>
                    </AddressProvider>
                  </CartProvider>
                </FilterProvider>
              </WishListProvider>
            </ThemeProvider>
          </ProductsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
