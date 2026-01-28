"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { DollarSign, Clock, CheckCircle, Utensils, Power } from 'lucide-react';
import { useAuthStorage } from '@/hooks/useAuth';

const RestaurantDashboard = () => {
    const { user } = useAuthStorage();
    const [isRestaurantOpen, setIsRestaurantOpen] = useState(true);
    const [effectiveStatus, setEffectiveStatus] = useState<{ isOpen: boolean; reason?: string; timingAutomationEnabled?: boolean; timingAutomationMode?: string } | null>(null);
    const [toggleLoading, setToggleLoading] = useState(false);

    const [announcements, setAnnouncements] = useState<any[]>([]);

    const [orders, setOrders] = useState<any[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [ordersError, setOrdersError] = useState<string | null>(null);

    const isApproved = !!user?.restaurant?.status && user.restaurant.status === 'approved';

    useEffect(() => {
        let ignore = false;
        const loadAnnouncements = async () => {
            try {
                const res = await fetch('/api/notifications?location=restaurant', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                const json = await res.json();
                if (!json?.success) return;
                if (!ignore) setAnnouncements(Array.isArray(json.data) ? json.data : []);
            } catch {
                // ignore
            }
        };

        loadAnnouncements();
        const t = setInterval(loadAnnouncements, 60000);
        return () => {
            ignore = true;
            clearInterval(t);
        };
    }, []);

    useEffect(() => {
        if (typeof user?.restaurant?.isOpen === 'boolean') {
            setIsRestaurantOpen(user.restaurant.isOpen);
        }
    }, [user?.restaurant?.isOpen]);

    useEffect(() => {
        let ignore = false;
        const loadEffective = async () => {
            if (!isApproved) {
                if (!ignore) setEffectiveStatus(null);
                return;
            }
            try {
                const res = await fetch('/api/restaurant/effective-status', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                const json = await res.json();
                if (!json?.success) return;
                if (!ignore) {
                    setEffectiveStatus({
                        isOpen: Boolean(json?.data?.effectiveIsOpen),
                        reason: json?.data?.reason,
                        timingAutomationEnabled: Boolean(json?.data?.timingAutomation?.enabled),
                        timingAutomationMode: String(json?.data?.timingAutomation?.mode || ''),
                    });
                }
            } catch {
                // ignore
            }
        };

        loadEffective();
        const t = setInterval(loadEffective, 30000);
        return () => {
            ignore = true;
            clearInterval(t);
        };
    }, [isApproved]);

    const handleToggleRestaurantOpen = async () => {
        const next = !isRestaurantOpen;
        try {
            setToggleLoading(true);
            setIsRestaurantOpen(next);
            const res = await fetch('/api/restaurant/status', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isOpen: next }),
            });
            const json = await res.json();
            if (!json?.success) {
                throw new Error(json?.error || 'Failed to update restaurant status');
            }
        } catch (e: any) {
            setIsRestaurantOpen(!next);
            alert(e?.message || 'Failed to update restaurant status');
        } finally {
            setToggleLoading(false);
        }
    };

    const disableManualToggle = Boolean(effectiveStatus?.timingAutomationEnabled) && (effectiveStatus?.timingAutomationMode || 'auto') === 'auto';

    useEffect(() => {
        let ignore = false;
        let socket: any = null;

        const load = async () => {
            if (!isApproved) {
                setOrders([]);
                setOrdersError(null);
                setOrdersLoading(false);
                return;
            }

            try {
                // Initial load
                setOrdersLoading(true);
                setOrdersError(null);
                const res = await fetch('/api/restaurant/orders', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                const json = await res.json();
                if (!json?.success) {
                    throw new Error(json?.error || 'Failed to fetch orders');
                }
                if (!ignore) {
                    setOrders(Array.isArray(json.data) ? json.data : []);
                }
            } catch (e: any) {
                if (!ignore) {
                    setOrders([]);
                    setOrdersError(e?.message || 'Failed to fetch orders');
                }
            } finally {
                if (!ignore) setOrdersLoading(false);
            }
        };

        const initSocket = async () => {
            if (!isApproved) return;

            // Ensure the socket server is running
            await fetch('/api/socket');

            const { io } = await import('socket.io-client');
            socket = io({
                path: '/api/socket',
                addTrailingSlash: false,
            });

            socket.on('connect', () => {
                console.log('Connected to socket', socket.id);
            });

            socket.on('newOrder', (newOrder: any) => {
                console.log('New order received:', newOrder);
                setOrders((prev) => [newOrder, ...prev]);
                // Optional: Play sound here
            });
        };

        load();
        initSocket();

        return () => {
            ignore = true;
            if (socket) socket.disconnect();
        };
    }, [isApproved]);

    const todayOrders = useMemo(() => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        return orders.filter((o: any) => {
            const d = new Date(o?.createdAt);
            return d >= start && d < end;
        });
    }, [orders]);

    const ordersTodayCount = todayOrders.length;
    const earningsToday = todayOrders.reduce((sum: number, o: any) => {
        const isPaid = (o?.paymentStatus || '').toLowerCase() === 'paid';
        return sum + (isPaid ? Number(o?.total || 0) : 0);
    }, 0);

    const pendingOrdersCount = orders.filter((o: any) => {
        const s = String(o?.status || '').toLowerCase();
        return ['pending', 'paid', 'processing', 'shipped'].includes(s);
    }).length;

    const completedOrdersCount = orders.filter((o: any) => String(o?.status || '').toLowerCase() === 'delivered').length;

    const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);

    const stats: Array<{ title: string; value: string; icon: any; color: string }> = [
        { title: 'Orders Today', value: String(ordersTodayCount), icon: Utensils, color: 'bg-blue-500' },
        { title: 'Earnings Today', value: `₹${earningsToday.toLocaleString()}`, icon: DollarSign, color: 'bg-green-500' },
        { title: 'Pending Orders', value: String(pendingOrdersCount), icon: Clock, color: 'bg-yellow-500' },
        { title: 'Completed Orders', value: String(completedOrdersCount), icon: CheckCircle, color: 'bg-purple-500' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-2 sm:p-4 md:p-6">
            {announcements.length > 0 && (
                <div className="mb-6 space-y-3">
                    {announcements.slice(0, 2).map((n: any) => (
                        <div
                            key={n._id}
                            className="rounded-lg border border-blue-200 bg-blue-50 p-2 sm:p-3 md:p-4 text-blue-900"
                        >
                            <div className="font-semibold">
                                {n.icon ? `${n.icon} ` : ''}{n.title}
                            </div>
                            <div className="text-sm mt-1">{n.message}</div>
                        </div>
                    ))}
                </div>
            )}
            {user?.restaurant?.status && user.restaurant.status !== 'approved' && (
                <div className={`mb-6 rounded-lg border p-2 sm:p-3 md:p-4 ${user.restaurant.status === 'pending'
                    ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                    <p className="font-semibold">
                        {user.restaurant.status === 'pending'
                            ? 'Your restaurant account is pending admin approval.'
                            : 'Your restaurant account was rejected by admin.'}
                    </p>
                    <p className="text-sm mt-1">
                        Until approval, you can only view the dashboard.
                    </p>
                </div>
            )}

            {ordersError && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-2 sm:p-3 md:p-4 text-red-800">
                    {ordersError}
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <div className="flex items-center space-x-4">
                    <div className="flex flex-col items-end">
                        <span className={`text-sm font-medium ${(effectiveStatus?.isOpen ?? isRestaurantOpen) ? 'text-green-600' : 'text-red-600'}`}>
                            {(effectiveStatus?.isOpen ?? isRestaurantOpen) ? 'Effective: Open' : 'Effective: Closed'}
                        </span>
                        <span className="text-xs text-gray-500">
                            Manual: {isRestaurantOpen ? 'Open' : 'Closed'}
                        </span>
                    </div>
                    <button
                        onClick={handleToggleRestaurantOpen}
                        disabled={toggleLoading || disableManualToggle}
                        className={`p-2 rounded-full text-white transition-colors ${isRestaurantOpen ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                            } ${(toggleLoading || disableManualToggle) ? 'opacity-60 cursor-not-allowed' : ''}`}>
                        <Power size={20} />
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 md:p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                        <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-lg ${stat.color}`}>
                                <stat.icon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
                </div>
                <div className="overflow-x-auto">
                    {ordersLoading ? (
                        <p className="text-center py-12 text-gray-500 dark:text-gray-400">Loading orders...</p>
                    ) : recentOrders.length === 0 ? (
                        <p className="text-center py-12 text-gray-500 dark:text-gray-400">No recent orders to display.</p>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Order</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Created</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {recentOrders.map((o: any) => (
                                    <tr key={o._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {o.orderId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                            {o.customer?.name || 'Customer'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                            ₹{Number(o.total || 0).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                            {String(o.status || '')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                            {o.createdAt ? new Date(o.createdAt).toLocaleString() : ''}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RestaurantDashboard;
