"use client"
import React, { useState, useEffect } from "react";
import { Search, Filter, Package, Clock, CheckCircle, Eye, X, ChefHat, Truck, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCustomToast } from "@/hooks/useCustomToast";

interface RestaurantOrder {
    _id: string;
    orderId: string;
    customer: {
        name: string;
        email: string;
        phone?: string;
    };
    items: Array<{
        name: string;
        quantity: number;
        price: number;
        category?: string;
    }>;
    total: number;
    status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "canceled";
    paymentStatus: "paid" | "pending";
    createdAt: string;
    estimatedTime?: string;
    notes?: string;
}

const RestaurantOrdersPage = () => {
    const router = useRouter();
    const toast = useCustomToast();
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [orders, setOrders] = useState<RestaurantOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<RestaurantOrder | null>(null);
    const [showOrderModal, setShowOrderModal] = useState(false);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);

            const url = searchQuery && searchQuery.trim().length > 0
                ? `/api/restaurant/orders?q=${encodeURIComponent(searchQuery.trim())}`
                : '/api/restaurant/orders';

            const res = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await res.json();
            if (!data?.success) {
                throw new Error(data?.error || 'Failed to fetch orders');
            }
            setOrders(Array.isArray(data.data) ? data.data : []);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError((err as any)?.message || "Failed to fetch orders");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleViewOrder = (order: RestaurantOrder) => {
        setSelectedOrder(order);
        setShowOrderModal(true);
    };

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/restaurant/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            const data = await res.json();
            if (!data?.success) {
                throw new Error(data?.error || 'Failed to update order status');
            }

            setOrders(prev => prev.map(order =>
                order._id === orderId ? { ...order, status: data.data.status } : order
            ));
            const orderNo = orders.find((o) => o._id === orderId)?.orderId || orderId;
            toast.info('Order Updated', `Order #${orderNo} status changed to ${data.data.status}`);
        } catch (error) {
            toast.error('Update Failed', (error as any)?.message || 'Error updating order status');
        }
    };

    const getStatusColor = (status: string) => {
        const colors = {
            pending: "bg-yellow-100 text-yellow-800",
            paid: "bg-blue-100 text-blue-800",
            processing: "bg-purple-100 text-purple-800",
            shipped: "bg-indigo-100 text-indigo-800",
            delivered: "bg-green-100 text-green-800",
            canceled: "bg-red-100 text-red-800"
        };
        return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-lg text-gray-600">Loading orders...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Restaurant Orders
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your restaurant orders and track delivery status
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-blue-500">
                                <Package className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Total Orders
                                </p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {orders.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        Order ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {order.orderId}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {order.customer.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                ${order.total.toFixed(2)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleViewOrder(order)}
                                                className="text-green-600 hover:text-green-900 mr-3"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {showOrderModal && selectedOrder && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order {selectedOrder.orderId}</h2>
                                <button onClick={() => setShowOrderModal(false)} className="text-gray-600 hover:text-gray-900 dark:text-gray-300">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Customer</h3>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{selectedOrder.customer.name}</p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{selectedOrder.customer.email}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Status</h3>
                                    <select
                                        value={selectedOrder.status}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                            const next = e.target.value;
                                            handleStatusUpdate(selectedOrder._id, next);
                                            setSelectedOrder((prev) => prev ? { ...prev, status: next as any } : prev);
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                                    >
                                        <option value="pending">pending</option>
                                        <option value="paid">paid</option>
                                        <option value="processing">processing</option>
                                        <option value="shipped">shipped</option>
                                        <option value="delivered">delivered</option>
                                        <option value="canceled">canceled</option>
                                    </select>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Kitchen Notes</h3>
                                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3">
                                      <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                                        {selectedOrder.notes?.trim() ? selectedOrder.notes : '—'}
                                      </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Items</h3>
                                <div className="space-y-2">
                                    {selectedOrder.items.map((it, idx) => (
                                        <div key={idx} className="flex justify-between text-sm text-gray-800 dark:text-gray-200">
                                            <span>{it.name} x {it.quantity}</span>
                                            <span>${(it.price * it.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 flex justify-end font-semibold text-gray-900 dark:text-white">
                                    Total: ${selectedOrder.total.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RestaurantOrdersPage;