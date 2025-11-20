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
  { params }: { params: Promise<{ product_id: string }> },
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const { product_id } = await params;
  const product = await getProduct(product_id);

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
