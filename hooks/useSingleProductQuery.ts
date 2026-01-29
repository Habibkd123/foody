import { useQuery } from '@tanstack/react-query';

const fetchProduct = async (productId: string) => {
    if (!productId || productId.trim() === '') {
        return null;
    }

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
    if (data?.success && data?.data) {
        const apiProduct = data.data;
        // Transformed structure expected by the app
        return {
            _id: apiProduct._id,
            id: apiProduct._id || apiProduct.id,
            name: apiProduct.name,
            price: apiProduct.price,
            originalPrice: apiProduct.originalPrice || apiProduct.price,
            images: apiProduct.images || [],
            rating: apiProduct.rating || 4.0,
            totalReviews: apiProduct.reviews?.length || 0,
            category: typeof apiProduct.category === 'object' ? apiProduct.category.name : apiProduct.category,
            discount: apiProduct.originalPrice > apiProduct.price
                ? Math.round(((apiProduct.originalPrice - apiProduct.price) / apiProduct.originalPrice) * 100)
                : 0,
            description: apiProduct.description || "No description available",
            longDescription: apiProduct.longDescription || apiProduct.description || "No detailed description available",
            nutritionalInfo: apiProduct.nutritionalInfo || {},
            features: apiProduct.features || [],
            specifications: apiProduct.specifications || {},
            inStock: apiProduct.inStock !== false,
            stockCount: apiProduct.stock || 0,
            brand: apiProduct.brand || "Unknown Brand",
            sku: apiProduct.sku || "N/A",
            weight: apiProduct.weight || "N/A",
            dimensions: apiProduct.dimensions || "N/A",
            deliveryInfo: apiProduct.deliveryInfo,
            reviews: apiProduct.reviews || [],
            relatedProducts: apiProduct.relatedProducts || [],
        };
    }
    return null;
};

export const useSingleProductQuery = (productId: string) => {
    return useQuery({
        queryKey: ['product', productId],
        queryFn: () => fetchProduct(productId),
        enabled: !!productId,
        staleTime: 5 * 60 * 1000,
    });
};
