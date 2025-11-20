import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login — Gro-Delivery',
  description: 'Sign in to Gro-Delivery to access your account, orders, and wishlist.',
  alternates: { canonical: '/login' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    url: '/login',
    title: 'Login — Gro-Delivery',
    description: 'Access your Gro-Delivery account for orders, wishlist, and profile.',
    images: [{ url: '/og-cover.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Login — Gro-Delivery',
    description: 'Sign in to your Gro-Delivery account.',
    images: ['/og-cover.png'],
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
