import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Driver Portal — Gro-Delivery',
  description: 'Driver portal for deliveries, routes, and schedules.',
  alternates: { canonical: '/driver' },
  robots: { index: false, follow: false },
  openGraph: {
    type: 'website',
    url: '/driver',
    title: 'Driver Portal — Gro-Delivery',
    description: 'Manage deliveries and routes in the driver portal.',
    images: [{ url: '/og-cover.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Driver Portal — Gro-Delivery',
    description: 'Delivery management for Gro-Delivery drivers.',
    images: ['/og-cover.png'],
  },
};

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  return children;
}
