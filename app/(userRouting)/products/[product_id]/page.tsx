import { Metadata, ResolvingMetadata } from 'next';
import ProductDetailsClient from "@/components/products/ProductDetailsClient";
import connectDB from "@/lib/mongodb";
import Product from "@/app/models/Product";
import { isValidObjectId } from 'mongoose';

// Force dynamic rendering to handle searchParams or dynamic data correctly if needed
export const dynamic = 'force-dynamic';

type Props = {
  params: { product_id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

async function getProduct(id: string) {
  try {
    await connectDB();
    if (!isValidObjectId(id)) return null;
    const product = await Product.findById(id).select('name description images price originalPrice brand sku').lean();
    return product ? JSON.parse(JSON.stringify(product)) : null;
  } catch (error) {
    console.error("Error fetching product for metadata:", error);
    return null;
  }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.product_id;

  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Product Not Found | Gro-Delivery',
      description: 'The requested product could not be found.',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const productImages = product.images || [];

  return {
    title: `${product.name} | Gro-Delivery`,
    description: product.description || `Buy ${product.name} at the best price on Gro-Delivery.`,
    openGraph: {
      title: product.name,
      description: product.description || `Buy ${product.name} at the best price on Gro-Delivery.`,
      url: `https://grodelivery.com/products/${id}`, // Replace with actual domain
      siteName: 'Gro-Delivery',
      images: [
        ...productImages,
        ...previousImages,
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description?.slice(0, 200),
      images: productImages.length > 0 ? [productImages[0]] : [],
    },
    alternates: {
      canonical: `/products/${id}`,
    },
  };
}

export default function ProductPage() {
  return <ProductDetailsClient />;
}
