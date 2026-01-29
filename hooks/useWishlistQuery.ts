import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '@/types/global';
import {
    getUserWishList as apiGetUserWishList,
    addWishList as apiAddWishList,
    removeWishList as apiRemoveWishList
} from '@/components/APICall/wishlist';

export const useWishlistQuery = (userId?: string) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['wishlist', userId],
        queryFn: async () => {
            if (!userId) return [];
            const response = await apiGetUserWishList({ userId });
            if (response.success) {
                return response.data.products as Product[];
            }
            return [];
        },
        enabled: !!userId,
    });

    const addMutation = useMutation({
        mutationFn: ({ userId, productId }: { userId: string; productId: string }) =>
            apiAddWishList(userId, productId),
        onSuccess: (data) => {
            // Update the cache with the new wishlist data returned from server
            if (data.success && data.data?.products) {
                queryClient.setQueryData(['wishlist', userId], data.data.products);
            } else {
                queryClient.invalidateQueries({ queryKey: ['wishlist', userId] });
            }
        },
    });

    const removeMutation = useMutation({
        mutationFn: ({ userId, productId }: { userId: string; productId: string }) =>
            apiRemoveWishList(userId, productId),
        onSuccess: (data) => {
            // Update the cache with the new wishlist data returned from server
            if (data.success && data.data?.products) {
                queryClient.setQueryData(['wishlist', userId], data.data.products);
            } else {
                queryClient.invalidateQueries({ queryKey: ['wishlist', userId] });
            }
        },
    });

    return {
        ...query,
        addToWishlist: addMutation.mutateAsync,
        removeFromWishlist: removeMutation.mutateAsync,
        isAdding: addMutation.isPending,
        isRemoving: removeMutation.isPending,
    };
};
