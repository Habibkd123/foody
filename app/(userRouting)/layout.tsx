import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Gro-Delivery — Order Fresh Food Online',
    template: '%s | Gro-Delivery',
  },
  description: 'Browse products, manage your cart, and track orders. Fresh groceries and milkshakes delivered fast.',
  alternates: { canonical: '/home' },
  openGraph: {
    type: 'website',
    url: '/home',
    title: 'Gro-Delivery — Fresh Food & Milkshakes',
    description: 'Fresh groceries, trending products, and delightful milkshakes. Delivered to your door.',
    images: [{ url: '/og-cover.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gro-Delivery — Fresh Food & Milkshakes',
    description: 'Shop fresh groceries and milkshakes with quick delivery.',
    images: ['/og-cover.png'],
  },
};

export default function UserRoutingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
