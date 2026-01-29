import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    _id: string;
    email: string;
    name: string;
    firstName?: string;
    lastName?: string;
    role: 'user' | 'admin' | 'restaurant' | 'driver';
    loyaltyPoints?: number;
    image?: string;
    phone?: string;
    phoneNumber?: string;
    restaurant?: {
        _id: string;
        isOpen: boolean;
        status: 'pending' | 'approved' | 'rejected' | 'none';
    };
    driverDetails?: {
        vehicleType?: 'bike' | 'scooter' | 'car';
        vehicleNumber?: string;
        licenseNumber?: string;
        status?: 'pending' | 'approved' | 'rejected';
        rejectionReason?: string;
        isAvailable?: boolean;
        address?: {
            city?: string;
        };
        bankDetails?: {
            accountNumber?: string;
            ifscCode?: string;
            accountHolderName?: string;
        };
        earnings?: {
            today?: number;
            thisWeek?: number;
            thisMonth?: number;
            total?: number;
        };
        documents?: {
            licenseFront?: string;
            licenseBack?: string;
            aadharFront?: string;
            aadharBack?: string;
            vehicleRC?: string;
            photo?: string;
        };
        currentLocation?: {
            latitude?: number;
            longitude?: number;
            heading?: number;
            speed?: number;
            updatedAt?: string;
        };
        stats?: {
            totalDeliveries?: number;
            completedDeliveries?: number;
            cancelledDeliveries?: number;
            rating?: number;
            reviews?: number;
        };
    };
    createdAt?: string;
}

interface UserState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    setLoading: (isLoading: boolean) => void;
    updateUser: (userData: Partial<User>) => Promise<User | null>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: true,

            setUser: (user) => set({ user, isAuthenticated: !!user }),
            setToken: (token) => set({ token }),
            setLoading: (isLoading) => set({ isLoading }),

            updateUser: async (userData) => {
                const user = get().user;
                if (!user?._id) return null;

                try {
                    const res = await fetch(`/api/users/${user._id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(userData),
                    });

                    const data = await res.json();
                    if (data.success) {
                        set({ user: data.data });
                        return data.data;
                    }
                    return null;
                } catch (error) {
                    console.error("Failed to update user:", error);
                    return null;
                }
            },

            logout: async () => {
                try {
                    await fetch("/api/auth/set-cookies", { method: "DELETE" });
                    set({ user: null, token: null, isAuthenticated: false });
                    window.location.href = "/login";
                } catch (error) {
                    console.error("Logout failed:", error);
                }
            },

            checkAuth: async () => {
                set({ isLoading: true });
                try {
                    const res = await fetch("/api/auth/set-cookies", {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    });

                    const data = await res.json();
                    if (data.success) {
                        set({
                            token: data.token,
                            user: data.userAuth,
                            isAuthenticated: true
                        });

                        // Optionally fetch full user data if userAuth is just a session
                        if (data.user_id) {
                            const userRes = await fetch(`/api/users/${data.user_id}`);
                            const userData = await userRes.json();
                            if (userData.success) {
                                set({ user: userData.data });
                            }
                        }
                    } else {
                        set({ user: null, token: null, isAuthenticated: false });
                    }
                } catch (error) {
                    console.error("Auth check failed:", error);
                    set({ user: null, token: null, isAuthenticated: false });
                } finally {
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: 'foody-user-storage',
            partialize: (state) => ({ user: state.user, token: state.token }),
        }
    )
);
