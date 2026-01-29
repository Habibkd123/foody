import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Address } from '@/types/global';

export function useAddressQuery(userId: string | undefined) {
    const queryClient = useQueryClient();

    const { data: addresses = [], isLoading, error } = useQuery<Address[]>({
        queryKey: ['addresses', userId],
        queryFn: async () => {
            if (!userId) return [];
            const response = await fetch(`/api/users/${userId}/addresses`);
            const data = await response.json();
            if (!data.success) throw new Error(data.message || 'Failed to fetch addresses');
            return data.addresses;
        },
        enabled: !!userId,
    });

    const addAddress = useMutation({
        mutationFn: async (newAddress: Omit<Address, '_id' | 'id'>) => {
            if (!userId) throw new Error('User not logged in');
            const response = await fetch(`/api/users/${userId}/addresses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAddress),
            });
            const data = await response.json();
            if (!data.success) throw new Error(data.message || 'Failed to add address');
            return data.address;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses', userId] });
        },
    });

    const updateAddress = useMutation({
        mutationFn: async ({ addressId, updates }: { addressId: string, updates: Partial<Address> }) => {
            if (!userId) throw new Error('User not logged in');
            const response = await fetch(`/api/users/${userId}/addresses/${addressId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            const data = await response.json();
            if (!data.success) throw new Error(data.message || 'Failed to update address');
            return data.address;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses', userId] });
        },
    });

    const deleteAddress = useMutation({
        mutationFn: async (addressId: string) => {
            if (!userId) throw new Error('User not logged in');
            const response = await fetch(`/api/users/${userId}/addresses/${addressId}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (!data.success) throw new Error(data.message || 'Failed to delete address');
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses', userId] });
        },
    });

    const patchDefaultFlag = useMutation({
        mutationFn: async ({ addressId, isDefault }: { addressId: string, isDefault: boolean }) => {
            if (!userId) throw new Error('User not logged in');
            const response = await fetch(`/api/users/${userId}/addresses`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ addressId, isDefault }),
            });
            const data = await response.json();
            if (!data.success) throw new Error(data.message || 'Failed to update default flag');
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses', userId] });
        },
    });

    return {
        addresses,
        isLoading,
        error,
        addAddress: addAddress.mutateAsync,
        updateAddress: updateAddress.mutateAsync,
        deleteAddress: deleteAddress.mutateAsync,
        patchDefaultFlag: patchDefaultFlag.mutateAsync,
        isAdding: addAddress.isPending,
        isUpdating: updateAddress.isPending,
        isDeleting: deleteAddress.isPending,
    };
}
