import { useQuery } from '@tanstack/react-query';
import { Product } from '@/types/global';

const fetchProducts = async (): Promise<Product[]> => {
    const response = await fetch(`/api/auth/products`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();

    if (data?.success && data.data.products) {
        return Array.isArray(data.data.products)
            ? data.data.products
            : [data.data.products];
    }

    return [];
};

export const useProductsQuery = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
