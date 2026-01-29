import { create } from 'zustand';
import { Product } from '@/types/global';

interface ProductStore {
    productsData: Product[];
    setProductsData: (data: Product[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
    productsData: [],
    setProductsData: (data) => set({ productsData: data }),
    loading: false,
    setLoading: (loading) => set({ loading }),
}));
