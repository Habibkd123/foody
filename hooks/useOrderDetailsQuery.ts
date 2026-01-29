import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const fetchOrderDetails = async (orderId: string) => {
    const res = await fetch(`/api/orders/${orderId}`, { method: "GET" });
    const json = await res.json();
    if (!res.ok || !json?.success) {
        throw new Error(json?.error || "Failed to fetch order");
    }
    return json.data;
};

export const useOrderDetailsQuery = (orderId?: string) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['order', orderId],
        queryFn: () => fetchOrderDetails(orderId!),
        enabled: !!orderId,
        staleTime: 30 * 1000, // 30 seconds
    });

    const updateOrderMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string, data: any }) => {
            const res = await fetch(`/api/orders/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!res.ok || !json?.success) throw new Error(json?.error || 'Failed to update order');
            return json.data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['order', orderId], data);
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });

    return {
        ...query,
        updateOrder: updateOrderMutation.mutateAsync,
        isUpdating: updateOrderMutation.isPending,
    };
};
