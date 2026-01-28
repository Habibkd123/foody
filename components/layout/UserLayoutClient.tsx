'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AnnouncementBar from '@/components/AnnouncementBar';
import AppHeader from '@/components/ui/AppHeader';
import NotificationBanner from '@/components/NotificationBanner';
import SiteFooter from '@/components/home/SiteFooter';
import { useAuthStorage } from '@/hooks/useAuth';
import { useWishListContext } from '@/context/WishListsContext';
import { useCartOrder, useOrder } from '@/context/OrderContext';
import { useFilterContext } from '@/context/FilterContext';
import LocationSelector from '@/components/LocationSelector';
import NotificationCenter from '@/components/NotificationCenter';
import { Heart, ShoppingBag } from 'lucide-react';
import AddCardList from '@/components/AddCards';
import Image from 'next/image';
import Link from 'next/link';

export default function UserLayoutClient({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, logout } = useAuthStorage();
    const { wishListsData } = useWishListContext();
    const { state } = useOrder();
    const { removeFromCart, updateQuantity } = useCartOrder();
    const { filters, updateFilter } = useFilterContext();

    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState<any[]>([]);

    const handleLogout = () => {
        logout();
        setProfileMenuOpen(false);
    };

    const getCartQuantity = useCallback((product: any) => {
        const pid = product?._id ?? product?.id;
        const cartItem = state.items.find((item: any) => (item._id ?? item.id) === pid);
        return cartItem ? cartItem.quantity : 0;
    }, [state.items]);

    const updateQuantity1 = useCallback((itemId: string, change: number) => {
        const productId = itemId;
        const currentItem = state.items.find((item: any) => (item._id || item.id) === productId);
        if (currentItem) {
            const newQuantity = Math.max(0, (currentItem.quantity || 0) + change);
            updateQuantity(user?._id, productId, newQuantity);
        }
    }, [state.items, updateQuantity, user?._id]);

    // Actions for AppHeader
    const headerActions = [
        ...(user?._id ? [
            { key: 'location', icon: <div className="hidden md:block"><LocationSelector /></div> },
            { key: 'notify', icon: <NotificationCenter location={pathname.split('/')[1] || 'home'} /> }
        ] : []),
        {
            key: 'wishlist',
            href: '/wishlist',
            icon: <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />,
            badgeCount: wishListsData ? wishListsData.length : 0
        },
        {
            key: 'cart',
            icon: (
                <AddCardList
                    cartItems={cartItems}
                    removeFromCart={(id: any) => removeFromCart(user?._id, id)}
                    updateQuantity={(itemId: any, newQuantity: any) => {
                        const currentQty = getCartQuantity({ id: itemId });
                        updateQuantity1(itemId.toString(), newQuantity - currentQty);
                    }}
                    getTotalPrice={() => state.items.reduce((total, i) => total + i.price * i.quantity, 0)}
                    setCartItems={setCartItems}
                    cartOpen={cartOpen}
                    setCartOpen={setCartOpen}
                />
            )
        },
        ...(user?._id ? [{
            key: 'profile',
            icon: (
                <Image
                    src={(user as any)?.avatar || (user as any)?.image || 'https://picsum.photos/seed/profile/100'}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full border border-border object-cover"
                />
            ),
            onClick: () => setProfileMenuOpen(!profileMenuOpen)
        }] : [])
    ];

    return (
        <div className="flex flex-col min-h-screen">
            {/* <AnnouncementBar />

            <AppHeader
                logoSrc="/logoGro.png"
                title="Gro-Delivery"
                showSearch={pathname === '/productlist' || pathname === '/home'}
                onSearch={(q) => updateFilter('searchTerm', q)}
                initialSearch={filters.searchTerm}
                actions={headerActions as any}
            /> */}

            {/* Profile Dropdown */}
            {/* {profileMenuOpen && (
                <div className="fixed right-4 top-16 z-[60] bg-card border border-border shadow-soft-lg rounded-lg w-56">
                    <div className="p-3 border-b border-border">
                        <div className="flex items-center gap-3">
                            <Image
                                src={(user as any)?.avatar || (user as any)?.image || 'https://picsum.photos/seed/profile/100'}
                                className="w-10 h-10 rounded-full border object-cover"
                                alt="Profile"
                                width={40}
                                height={40}
                            />
                            <div className="min-w-0">
                                <p className="text-sm font-medium truncate">{(user as any)?.firstName + " " + (user as any)?.lastName || 'Your Account'}</p>
                                <p className="text-xs text-muted-foreground truncate">{(user as any)?.email || ''}</p>
                            </div>
                        </div>
                    </div>
                    <div className="py-1">
                        <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-secondary">Profile</Link>
                        <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm hover:bg-secondary">Logout</button>
                    </div>
                </div>
            )} */}

            <main className="flex-1">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <NotificationBanner location={pathname.split('/')[1] || 'home'} />
                </div>
                {children}
            </main>

            {/* <SiteFooter /> */}

            {/* Background click handler for profile dropdown */}
            {profileMenuOpen && (
                <div className="fixed inset-0 z-[55]" onClick={() => setProfileMenuOpen(false)} />
            )}
        </div>
    );
}
