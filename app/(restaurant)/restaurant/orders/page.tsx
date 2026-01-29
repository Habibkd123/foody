"use client"
import React, { useState, useEffect } from "react";
import { Search, Filter, Package, Clock, CheckCircle, Eye, X, ChefHat, Truck, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCustomToast } from "@/hooks/useCustomToast";
import { Button } from "@/components/ui/button";

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
    rider?: {
        name: string;
        phone: string;
    } | null;
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
    const [availableDrivers, setAvailableDrivers] = useState<any[]>([]);
    const [showDriverModal, setShowDriverModal] = useState(false);
    const [assigning, setAssigning] = useState(false);

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

    const fetchAvailableDrivers = async () => {
        try {
            const res = await fetch('/api/restaurant/drivers/available');
            const data = await res.json();
            if (data.success) {
                setAvailableDrivers(data.data);
            }
        } catch (error) {
            console.error("Error fetching drivers:", error);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchAvailableDrivers();
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

    const handleAssignDriver = async (driverId: string) => {
        if (!selectedOrder) return;

        try {
            setAssigning(true);
            const res = await fetch(`/api/restaurant/orders/${selectedOrder._id}/assign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ driverId }),
            });

            const data = await res.json();
            if (data.success) {
                toast.success('Driver Assigned', 'A delivery partner has been assigned to this order');
                setShowDriverModal(false);
                setShowOrderModal(false);
                fetchOrders();
            } else {
                throw new Error(data.message);
            }
        } catch (error: any) {
            toast.error('Assignment Failed', error.message);
        } finally {
            setAssigning(false);
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
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order Details</h2>
                                <button onClick={() => setShowOrderModal(false)} className="text-gray-600 hover:text-gray-900 dark:text-gray-300">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Customer Info</h3>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">{selectedOrder.customer.name}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedOrder.customer.email}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedOrder.customer.phone || 'No phone provided'}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Delivery Partner</h3>
                                    {selectedOrder.rider ? (
                                        <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded-lg">
                                            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                                                <Truck className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedOrder.rider.name}</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">{selectedOrder.rider.phone}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-3 bg-gray-50 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                                            <p className="text-xs text-gray-500 italic text-center">No driver assigned yet</p>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Order Status</h3>
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={selectedOrder.status}
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                const next = e.target.value;
                                                handleStatusUpdate(selectedOrder._id, next);
                                                setSelectedOrder((prev) => prev ? { ...prev, status: next as any } : prev);
                                            }}
                                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
                                        >
                                            <option value="pending">pending</option>
                                            <option value="paid">paid</option>
                                            <option value="processing">processing</option>
                                            <option value="shipped">shipped</option>
                                            <option value="delivered">delivered</option>
                                            <option value="canceled">canceled</option>
                                        </select>
                                        <button
                                            onClick={() => setShowDriverModal(true)}
                                            className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center gap-2"
                                        >
                                            <Truck className="h-4 w-4" />
                                            Assign Driver
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-4">Items Summary</h3>
                                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-100 dark:bg-gray-800">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-gray-600">Item</th>
                                                <th className="px-4 py-2 text-center text-gray-600">Qty</th>
                                                <th className="px-4 py-2 text-right text-gray-600">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {selectedOrder.items.map((it, idx) => (
                                                <tr key={idx}>
                                                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{it.name}</td>
                                                    <td className="px-4 py-2 text-center text-gray-800 dark:text-gray-200">{it.quantity}</td>
                                                    <td className="px-4 py-2 text-right text-gray-800 dark:text-gray-200">${(it.price * it.quantity).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-gray-100 dark:bg-gray-800 font-bold">
                                            <tr>
                                                <td colSpan={2} className="px-4 py-2 text-right">Total Amount</td>
                                                <td className="px-4 py-2 text-right text-orange-600">${selectedOrder.total.toFixed(2)}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            {selectedOrder.notes && (
                                <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Customer Notes</h3>
                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/30 rounded-lg p-3 italic text-sm text-gray-700 dark:text-gray-300">
                                        "{selectedOrder.notes}"
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {showDriverModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
                                <h3 className="font-bold text-gray-900 dark:text-white">Select Delivery Partner</h3>
                                <button onClick={() => setShowDriverModal(false)} className="text-gray-500 hover:text-gray-700">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="max-h-96 overflow-y-auto p-4 space-y-3">
                                {availableDrivers.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Truck className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                                        <p className="text-gray-500 text-sm">No available drivers nearby</p>
                                    </div>
                                ) : (
                                    availableDrivers.map((driver) => (
                                        <div
                                            key={driver._id}
                                            className="flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg hover:border-orange-500 dark:hover:border-orange-500 cursor-pointer transition-colors group"
                                            onClick={() => handleAssignDriver(driver._id)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                                                    <Truck className="h-5 w-5 text-orange-600" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white group-hover:text-orange-600">
                                                        {driver.firstName} {driver.lastName}
                                                    </p>
                                                    <p className="text-xs text-gray-500 capitalize">{driver.driverDetails?.vehicleType} • {driver.driverDetails?.vehicleNumber}</p>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="outline" className="text-xs group-hover:bg-orange-600 group-hover:text-white">
                                                Assign
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-900 text-center text-xs text-gray-500">
                                Drivers shown here are currently online and available to deliver.
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RestaurantOrdersPage;