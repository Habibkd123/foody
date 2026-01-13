import type { Metadata, ResolvingMetadata } from 'next';

async function getProduct(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products/${id}`, {
      cache: 'no-store',
    });
    const data = await res.json();
    if (res.ok && data?.success) return data.data;
  } catch {}
  return null;
}

export async function generateMetadata(
  props: any,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const product_id: string | undefined = props?.params?.product_id;
  if (!product_id) {
    return {
      title: 'Product — Gro-Delivery',
      description: 'Discover fresh products and delightful milkshakes at Gro-Delivery.',
      alternates: { canonical: '/products' },
      openGraph: {
        type: 'website',
        url: '/products',
        title: 'Product — Gro-Delivery',
        description: 'Discover fresh products and delightful milkshakes at Gro-Delivery.',
        images: [{ url: '/og-cover.png', width: 1200, height: 630 }],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Product — Gro-Delivery',
        description: 'Discover fresh products and delightful milkshakes at Gro-Delivery.',
        images: ['/og-cover.png'],
      },
    };
  }
  const product = await getProduct(product_id as string);

  const title = product?.name ? `${product.name} — Buy Online | Gro-Delivery` : 'Product — Gro-Delivery';
  const description = product?.shortDescription || product?.description || 'Discover fresh products and delightful milkshakes at Gro-Delivery.';
  const image = product?.images?.[0] || '/og-cover.png';
  const url = `/products/${product_id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children;
}
