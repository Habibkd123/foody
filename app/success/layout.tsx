import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Success — Gro-Delivery',
  description: 'Your order was placed successfully. Track status and delivery updates.',
  alternates: { canonical: '/success' },
  openGraph: {
    type: 'website',
    url: '/success',
    title: 'Order Success — Gro-Delivery',
    description: 'Order placed successfully. Thank you for choosing Gro-Delivery!',
    images: [{ url: '/og-cover.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Order Success — Gro-Delivery',
    description: 'Thank you for your order at Gro-Delivery.',
    images: ['/og-cover.png'],
  },
};

export default function SuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
