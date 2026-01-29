"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    History,
    Wallet,
    User,
    LifeBuoy
} from 'lucide-react';

export default function DriverBottomNav() {
    const pathname = usePathname();

    // Hide nav on specific pages if needed
    const shouldHideNav = pathname === '/driver/pending' || pathname.includes('/register');
    if (shouldHideNav) return null;

    const navItems = [
        { label: 'Home', icon: Home, href: '/driver' },
        { label: 'History', icon: History, href: '/driver/history' },
        { label: 'Earnings', icon: Wallet, href: '/driver/earnings' },
        { label: 'Support', icon: LifeBuoy, href: '/driver/support' },
        { label: 'Profile', icon: User, href: '/driver/profile' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 safe-area-inset-bottom md:hidden z-50">
            <div className="flex justify-around items-center">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-all ${isActive
                                    ? 'text-orange-600 bg-orange-50'
                                    : 'text-gray-500 hover:text-orange-400'
                                }`}
                        >
                            <Icon className={`w-6 h-6 ${isActive ? 'fill-orange-50' : ''}`} />
                            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
