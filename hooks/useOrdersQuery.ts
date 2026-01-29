import { useQuery } from '@tanstack/react-query';

const fetchUserOrders = async (userId: string) => {
    const res = await fetch(`/api/orders/user/${userId}`, { method: "GET" });
    const json = await res.json();
    if (!res.ok || !json?.success) {
        throw new Error(json?.error || "Failed to fetch orders");
    }
    return json.data;
};

export const useOrdersQuery = (userId?: string) => {
    return useQuery({
        queryKey: ['orders', userId],
        queryFn: () => fetchUserOrders(userId!),
        enabled: !!userId,
        staleTime: 60 * 1000, // 1 minute
    });
};
