import { create } from 'zustand';

interface Filters {
    category: string;
    priceRanges: string[];
    ratings: number[];
    searchTerm: string;
}

interface FilterStore {
    filters: Filters;
    updateFilter: (key: keyof Filters, value: any) => void;
    toggleArrayFilter: (key: 'priceRanges' | 'ratings', value: string | number) => void;
    resetFilters: () => void;
}

const initialFilters: Filters = {
    category: 'all',
    priceRanges: [],
    ratings: [],
    searchTerm: ''
};

export const useFilterStore = create<FilterStore>((set) => ({
    filters: initialFilters,
    updateFilter: (key, value) =>
        set((state) => ({
            filters: { ...state.filters, [key]: value }
        })),
    toggleArrayFilter: (key, value) =>
        set((state) => ({
            filters: {
                ...state.filters,
                [key]: state.filters[key].includes(value as never)
                    ? state.filters[key].filter((item: any) => item !== value)
                    : [...state.filters[key], value as never]
            }
        })),
    resetFilters: () => set({ filters: initialFilters })
}));
