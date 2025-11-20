import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Unauthorized — Gro-Delivery',
  description: 'You do not have permission to view this page. Please sign in.',
  alternates: { canonical: '/unauthorized' },
  openGraph: {
    type: 'website',
    url: '/unauthorized',
    title: 'Unauthorized — Gro-Delivery',
    description: 'Access restricted. Please sign in to continue.',
    images: [{ url: '/og-cover.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unauthorized — Gro-Delivery',
    description: 'Please sign in to continue.',
    images: ['/og-cover.png'],
  },
};

export default function UnauthorizedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
