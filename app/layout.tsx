import './globals.css';
import { ClientProviders } from '../context/ClientProviders';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Gro-Delivery — Modern Milkshakes & Groceries',
    template: '%s | Gro-Delivery',
  },
  description:
    'Order modern milkshakes and fresh groceries with fast delivery. Clean design, great deals, and delightful flavors.',
  keywords: [
    'milkshake',
    'groceries',
    'food delivery',
    'fresh',
    'modern',
    'strawberry',
    'chocolate',
    'vanilla',
  ],
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Gro-Delivery',
    title: 'Gro-Delivery — Modern Milkshakes & Groceries',
    description:
      'Order modern milkshakes and fresh groceries with fast delivery. Clean design, great deals, and delightful flavors.',
    images: [
      {
        url: '/og-cover.png',
        width: 1200,
        height: 630,
        alt: 'Gro-Delivery Milkshakes & Groceries',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gro-Delivery — Modern Milkshakes & Groceries',
    description:
      'Order modern milkshakes and fresh groceries with fast delivery. Clean design, great deals, and delightful flavors.',
    images: ['/og-cover.png'],
  },
  alternates: { canonical: '/' },
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}