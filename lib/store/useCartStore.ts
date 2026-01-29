import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartLine, Address } from '@/types/global';

interface CartState {
    items: CartLine[];
    address?: Address;
    distance?: number;
    deliveryCharge: number;
    handlingCharge: number;
    tip: number;
    notes?: string;
    couponCode?: string;
    discountAmount?: number;
    loading: boolean;
    error: string | null;

    // Actions
    addItem: (item: CartLine) => void;
    removeItem: (id: any) => void;
    updateQuantity: (id: any, qty: number) => void;
    setItems: (items: CartLine[]) => void;
    setAddress: (address?: Address) => void;
    setDistance: (distance: number) => void;
    setTip: (tip: number) => void;
    setDeliveryCharge: (charge: number) => void;
    setHandlingCharge: (charge: number) => void;
    setNotes: (notes: string) => void;
    setCoupon: (code: string, amount: number) => void;
    clearCoupon: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    reset: () => void;

    // Computed
    getTotalAmount: () => number;
    getTotalItems: () => number;
    getFinalTotal: () => number;
}

const calcDelivery = (distance: number) => {
    if (distance <= 5) return 20;
    if (distance <= 10) return 50;
    return 100;
};

const initialState = {
    items: [],
    tip: 0,
    deliveryCharge: 0,
    handlingCharge: 0,
    notes: '',
    couponCode: '',
    discountAmount: 0,
    loading: false,
    error: null,
};

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            ...initialState,

            addItem: (item) => {
                const { items } = get();
                const existingItem = items.find((i: any) => i.id === item.id);

                if (existingItem) {
                    set({
                        items: items.map((i) =>
                            (i as any).id === (item as any).id
                                ? { ...i, quantity: i.quantity + item.quantity }
                                : i
                        ),
                    });
                } else {
                    set({ items: [...items, item] });
                }
            },

            removeItem: (id) => {
                set((state) => ({
                    items: state.items.filter((i) => i.id !== id),
                }));
            },

            updateQuantity: (id, qty) => {
                set((state) => ({
                    items: state.items.map((i) =>
                        i.id === id ? { ...i, quantity: qty } : i
                    ),
                }));
            },

            setItems: (items) => set({ items }),

            setAddress: (address) => set({ address }),

            setDistance: (distance) => set({
                distance,
                deliveryCharge: calcDelivery(distance)
            }),

            setTip: (tip: number) => set({ tip }),
            setDeliveryCharge: (deliveryCharge: number) => set({ deliveryCharge }),
            setHandlingCharge: (handlingCharge: number) => set({ handlingCharge }),

            setNotes: (notes) => set({ notes }),

            setCoupon: (couponCode, discountAmount) => set({ couponCode, discountAmount }),

            clearCoupon: () => set({ couponCode: '', discountAmount: 0 }),

            setLoading: (loading) => set({ loading }),

            setError: (error) => set({ error }),

            reset: () => set(initialState),

            // Computed functions
            getTotalAmount: () => {
                return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
            },

            getTotalItems: () => {
                return get().items.reduce((sum, i) => sum + i.quantity, 0);
            },

            getFinalTotal: () => {
                const state = get();
                return (
                    state.items.reduce((sum, i) => sum + i.price * i.quantity, 0) +
                    state.deliveryCharge +
                    state.handlingCharge +
                    state.tip -
                    (state.discountAmount || 0)
                );
            },
        }),
        {
            name: 'foody-cart-storage',
            // skip hydration issues by only persisting parts if needed, 
            // or using a check in components
            partialize: (state) => ({
                items: state.items,
                address: state.address,
                notes: state.notes
            }),
        }
    )
);
