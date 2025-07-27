import type { Metadata } from 'next'
import './globals.css'
import { WishListProvider } from '@/context/WishListsContext'
import { FilterProvider } from '@/context/FilterContext'
import { CartProvider } from '@/context/CartContext'
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

        <WishListProvider >
          <FilterProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </FilterProvider>
        </WishListProvider>
      </body>
    </html>
  )
}

