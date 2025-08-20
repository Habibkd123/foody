"use client"
import { useState, useEffect } from "react";

const fallbackProduct = {
  id: 16,
  name: "Better Nutrition Biofortified Rice (Medium Grain)",
  price: 213,
  originalPrice: 400,
  images: [
    "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/1c01d181-b2dd-4633-95a2-746fa3f78117.png",
    "https://picsum.photos/600/600?random=17a",
    "https://picsum.photos/600/600?random=17b",
    "https://picsum.photos/600/600?random=17c",
  ],
  rating: 4.6,
  totalReviews: 187,
  category: "rice",
  discount: 20,
  description:
    "Better Nutrition Biofortified Rice (Medium Grain) is a perfect blend...",
  features: [
    "Biofortified with essential nutrients",
    "Medium grain rice",
    "Perfect for daily use",
    "Rich in aroma",
    "Easy to cook",
  ],
  specifications: {
    Weight: "1kg",
    Brand: "Better Nutrition",
    Type: "Biofortified Rice",
    "Shelf Life": "12 months",
    Storage: "Cool & Dry Place",
    "Nutritional Benefits": "Enriched with vitamins and minerals",
  },
  inStock: true,
  stockCount: 75,
  brand: "Maggi",
  sku: "MGI-SMM-001",
  weight: "80g",
  dimensions: "12cm x 8cm x 3cm",
  reviews: [
    {
      id: 1,
      userName: "Sunita Devi",
      rating: 5,
      comment: "Excellent masala! Makes vegetables taste amazing.",
      date: "3 days ago",
      verified: true,
      helpful: 15,
    },
  ],
};

export const useProduct = (productId: string) => {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't fetch if no productId
    if (!productId || productId.trim() === '') {
      setProduct(fallbackProduct);
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch(`/api/auth/products/${productId}`, {
          method: "GET",
          headers: { 
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Single product response:", data);

        if (data?.success && data?.data) {
          // Transform API data to match your component's expected structure
          const apiProduct = data.data;
          const transformedProduct = {
            id: apiProduct._id || apiProduct.id,
            name: apiProduct.name,
            price: apiProduct.price,
            originalPrice: apiProduct.originalPrice || apiProduct.price,
            images: apiProduct.images || [fallbackProduct.images[0]],
            rating: apiProduct.rating || 4.0,
            totalReviews: apiProduct.reviews?.length || 0,
            category: typeof apiProduct.category === 'object' ? apiProduct.category.name : apiProduct.category,
            discount: apiProduct.originalPrice > apiProduct.price 
              ? Math.round(((apiProduct.originalPrice - apiProduct.price) / apiProduct.originalPrice) * 100)
              : 0,
            description: apiProduct.description || "No description available",
            features: apiProduct.features || [],
            specifications: apiProduct.specifications || {},
            inStock: apiProduct.inStock !== false,
            stockCount: apiProduct.stock || 0,
            brand: apiProduct.brand || "Unknown Brand",
            sku: apiProduct.sku || "N/A",
            weight: apiProduct.weight || "N/A",
            dimensions: apiProduct.dimensions || "N/A",
            deliveryInfo: apiProduct.deliveryInfo ,
            reviews: apiProduct.reviews || [],
          };
          
          setProduct(transformedProduct);
        } else {
          console.warn("No product data in response, using fallback");
          setProduct(fallbackProduct);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch product");
        setProduct(fallbackProduct); // Use fallback on error
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, loading, error };
};
