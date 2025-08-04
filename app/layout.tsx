import type { Metadata } from 'next'
import './globals.css'
import { WishListProvider } from '@/context/WishListsContext'
import { FilterProvider } from '@/context/FilterContext'
import { CartProvider } from '@/context/CartContext'
import { AddressProvider } from '@/context/AddressContext'
import { OrderProvider } from '@/context/OrderContext'
import { ProductsProvider } from '@/context/AllProductContext'
export const metadata: Metadata = {
  title: 'Grocery Mart',
  description: 'Grocery for your services',
  generator: 'Grocery Mart',
  icons: './logoGro.png'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ProductsProvider >
          <WishListProvider >
            <FilterProvider>
              <CartProvider>
                <AddressProvider>
                  <OrderProvider>
                    {children}
                  </OrderProvider>
                </AddressProvider>
              </CartProvider>
            </FilterProvider>
          </WishListProvider>
        </ProductsProvider>
      </body>
    </html>
  )
}

