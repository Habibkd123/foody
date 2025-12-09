"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Download, MoreVertical, Plus, TrendingUp, Package, Clock, CheckCircle, Eye, Edit3, FileText, RefreshCw, X, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
interface Order {
    _id: string;
    orderId: string;
    user: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
    };
    items: Array<{
        product: {
            _id: string;
            name: string;
            price: number;
            image?: string;
            category?: string;
        };
        quantity: number;
        price: number;
    }>;
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentId: string;
    delivery?: {
        _id: string;
        address: string;
        status: string;
        estimatedDelivery?: Date;
    };
    method: string;
    createdAt: string;
    updatedAt: string;
}

const OrdersAdminPage = () => {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalOrders: 0,
        hasNextPage: false,
        hasPrevPage: false
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fallback static data when API fails
    const staticOrders: Order[] = []

    // Fetch orders from API
    const fetchOrders = async (page = 1, status?: string, search?: string) => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10'
            });

            if (status && status !== 'all') {
                params.append('status', status);
            }

            if (search && search.trim()) {
                // For now, we'll filter on frontend since API might not support search
                // In a real implementation, you might want to add search to API
            }

            const response = await fetch(`/api/orders?${params.toString()}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch orders: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.success) {
                setOrders(data.data);
                setPagination(data.pagination);
                setCurrentPage(data.pagination.currentPage);
            } else {
                throw new Error(data.error || 'Failed to fetch orders');
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch orders');
            // Fallback to static data
            setOrders(staticOrders);
            setPagination({
                currentPage: 1,
                totalPages: 1,
                totalOrders: staticOrders.length,
                hasNextPage: false,
                hasPrevPage: false
            });
        } finally {
            setLoading(false);
        }
    };

    // Fetch orders on component mount and when filters change
    useEffect(() => {
        fetchOrders(1, activeTab === 'all' ? undefined : activeTab);
    }, [activeTab]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdownId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Action handlers
    const handleViewOrder = (order: Order) => {
        setSelectedOrder(order);
        setShowOrderModal(true);
        setOpenDropdownId(null);
        router.push(`/orders/${order?._id}`)
    };

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                // Refresh orders
                fetchOrders(pagination.currentPage, activeTab === 'all' ? undefined : activeTab);
                alert('Order status updated successfully!');
            } else {
                alert('Failed to update order status');
            }
        } catch (error) {
            alert('Error updating order status');
        }
        setOpenDropdownId(null);
    };

    const handleGenerateBill = async (order: Order) => {
        try {
            const response = await fetch('/api/orders/bill', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: order._id })
            });

            if (response.ok) {
                const data = await response.json();
                // Open bill in new window or download
                const billWindow = window.open('', '_blank');
                if (billWindow) {
                    billWindow.document.write(`
            <html>
              <head>
                <title>Bill - ${order.orderId}</title>
                <style>
                  body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                  .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
                  .bill-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
                  .customer-info, .bill-info { flex: 1; }
                  table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                  th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                  th { background-color: #f5f5f5; font-weight: bold; }
                  .total { font-weight: bold; font-size: 18px; }
                  .footer { margin-top: 50px; text-align: center; color: #666; }
                  @media print { .no-print { display: none; } }
                </style>
              </head>
              <body>
                <div class="header">
                  <h1>FoodY Bill</h1>
                  <p>Order Invoice</p>
                </div>

                <div class="bill-details">
                  <div class="bill-info">
                    <h3>Bill Information</h3>
                    <p><strong>Bill Number:</strong> ${data.data.billNumber}</p>
                    <p><strong>Bill Date:</strong> ${new Date(data.data.billDate).toLocaleDateString()}</p>
                    <p><strong>Order ID:</strong> ${data.data.orderId}</p>
                  </div>
                  <div class="customer-info">
                    <h3>Customer Information</h3>
                    <p><strong>Name:</strong> ${data.data.customer.name}</p>
                    <p><strong>Email:</strong> ${data.data.customer.email}</p>
                    <p><strong>Phone:</strong> ${data.data.customer.phone || 'N/A'}</p>
                    <p><strong>Address:</strong> ${data.data.customer.address}</p>
                  </div>
                </div>

                <h3>Order Items</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Category</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${data.data.items.map((item: any) => `
                      <tr>
                        <td>${item.name}</td>
                        <td>${item.category}</td>
                        <td>${item.quantity}</td>
                        <td>$${item.unitPrice.toFixed(2)}</td>
                        <td>$${item.totalPrice.toFixed(2)}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                  <tfoot>
                    <tr class="total">
                      <td colspan="4" style="text-align: right;">Total:</td>
                      <td>$${data.data.total.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>

                <div class="bill-details">
                  <div>
                    <h3>Payment Information</h3>
                    <p><strong>Payment Method:</strong> ${data.data.paymentMethod}</p>
                    <p><strong>Payment ID:</strong> ${data.data.paymentId}</p>
                    <p><strong>Status:</strong> ${data.data.status}</p>
                  </div>
                  ${data.data.delivery ? `
                    <div>
                      <h3>Delivery Information</h3>
                      <p><strong>Address:</strong> ${data.data.delivery.address}</p>
                      <p><strong>Status:</strong> ${data.data.delivery.status}</p>
                      <p><strong>Estimated Delivery:</strong> ${data.data.delivery.estimatedDelivery ? new Date(data.data.delivery.estimatedDelivery).toLocaleDateString() : 'N/A'}</p>
                      ${data.data.delivery.trackingNumber ? `<p><strong>Tracking Number:</strong> ${data.data.delivery.trackingNumber}</p>` : ''}
                    </div>
                  ` : ''}
                </div>

                <div class="footer">
                  <p>Thank you for choosing FoodY!</p>
                  <button class="no-print" onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #f97316; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Bill</button>
                </div>
              </body>
            </html>
          `);
                    billWindow.document.close();
                }
            } else {
                alert('Failed to generate bill');
            }
        } catch (error) {
            alert('Error generating bill');
        }
        setOpenDropdownId(null);
    };

    const handleProcessRefund = async (order: Order) => {
        const refundAmount = parseFloat(prompt(`Enter refund amount for order ${order.orderId} (max: $${order.total}):`) || '0');

        if (isNaN(refundAmount) || refundAmount <= 0 || refundAmount > order.total) {
            alert('Invalid refund amount');
            setOpenDropdownId(null);
            return;
        }

        const refundReason = prompt('Enter refund reason:') || '';

        if (!refundReason.trim()) {
            alert('Refund reason is required');
            setOpenDropdownId(null);
            return;
        }

        try {
            const response = await fetch('/api/orders/refund', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: order._id,
                    refundAmount,
                    refundReason
                })
            });

            if (response.ok) {
                const data = await response.json();
                alert(`Refund processed successfully! Refund ID: ${data.data.refundId}`);
                // Refresh orders
                fetchOrders(pagination.currentPage, activeTab === 'all' ? undefined : activeTab);
            } else {
                const error = await response.json();
                alert(`Failed to process refund: ${error.error}`);
            }
        } catch (error) {
            alert('Error processing refund');
        }
        setOpenDropdownId(null);
    };
    const handleCancelOrder = async (orderId: string) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            try {
                const response = await fetch(`/api/orders/${orderId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'cancelled' })
                });

                if (response.ok) {
                    fetchOrders(pagination.currentPage, activeTab === 'all' ? undefined : activeTab);
                    alert('Order cancelled successfully!');
                } else {
                    alert('Failed to cancel order');
                }
            } catch (error) {
                alert('Error cancelling order');
            }
        }
        setOpenDropdownId(null);
    };

    // Transform API order data to UI format
    const transformOrderForUI = (order: Order) => {
        return {
            id: order._id,
            orderNumber: order.orderId,
            customer: {
                name: `${order.user?.firstName} ${order.user?.lastName}`,
                email: order.user?.email,
                avatar: `${order.user?.firstName.charAt(0)}${order.user?.lastName.charAt(0)}`.toUpperCase()
            },
            date: new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }),
            items: order.items.reduce((total, item) => total + item.quantity, 0),
            total: order.total,
            payment: order.method === 'card' ? 'Credit Card' : order.method.charAt(0).toUpperCase() + order.method.slice(1),
            status: order.status,
            shippingAddress: order.delivery?.address || 'N/A'
        };
    };

    const getStatusColor = (status: string) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    // Transform orders for UI display
    const transformedOrders = orders.map(transformOrderForUI);

    const filteredOrders = transformedOrders.filter(order => {
        const matchesSearch = order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === 'all' || order.status === activeTab;
        return matchesSearch && matchesTab;
    });

    const tabs = [
        { id: 'all', label: 'All Orders', count: transformedOrders.length },
        { id: 'pending', label: 'Pending', count: transformedOrders.filter(o => o.status === 'pending').length },
        { id: 'processing', label: 'Processing', count: transformedOrders.filter(o => o.status === 'processing').length },
        { id: 'shipped', label: 'Shipped', count: transformedOrders.filter(o => o.status === 'shipped').length },
        { id: 'delivered', label: 'Delivered', count: transformedOrders.filter(o => o.status === 'delivered').length }
    ];

    const stats = [
        {
            title: 'Total Orders',
            value: pagination.totalOrders.toString(),
            change: '+12.5%',
            icon: Package,
            color: 'bg-primary'
        },
        {
            title: 'Pending',
            value: transformedOrders.filter(o => o.status === 'pending').length.toString(),
            change: '+3.2%',
            icon: Clock,
            color: 'bg-primary'
        },
        {
            title: 'Processing',
            value: transformedOrders.filter(o => o.status === 'processing').length.toString(),
            change: '+8.1%',
            icon: TrendingUp,
            color: 'bg-primary'
        },
        {
            title: 'Delivered',
            value: transformedOrders.filter(o => o.status === 'delivered').length.toString(),
            change: '+15.3%',
            icon: CheckCircle,
            color: 'bg-primary'
        }
    ];

    return (
        <div>
            {/* Order Details Modal */}
            {showOrderModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                                <button
                                    onClick={() => setShowOrderModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Order Information</h3>
                                    <div className="space-y-2">
                                        <p><span className="font-medium">Order ID:</span> {selectedOrder.orderId}</p>
                                        <p><span className="font-medium">Status:</span>
                                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                                                {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                            </span>
                                        </p>
                                        <p><span className="font-medium">Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                        <p><span className="font-medium">Payment Method:</span> {selectedOrder.method}</p>
                                        <p><span className="font-medium">Payment ID:</span> {selectedOrder.paymentId}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
                                    <div className="space-y-2">
                                        <p><span className="font-medium">Name:</span> {selectedOrder.user?.firstName} {selectedOrder.user?.lastName}</p>
                                        <p><span className="font-medium">Email:</span> {selectedOrder.user?.email}</p>
                                        {selectedOrder.user?.phone && <p><span className="font-medium">Phone:</span> {selectedOrder.user?.phone}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left">Product</th>
                                                <th className="px-4 py-2 text-left">Quantity</th>
                                                <th className="px-4 py-2 text-left">Price</th>
                                                <th className="px-4 py-2 text-left">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedOrder.items.map((item, index) => (
                                                <tr key={index} className="border-t">
                                                    <td className="px-4 py-2">
                                                        <div>
                                                            <p className="font-medium">{item.product.name}</p>
                                                            <p className="text-sm text-gray-500">{item.product.category}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-2">{item.quantity}</td>
                                                    <td className="px-4 py-2">${item.price.toFixed(2)}</td>
                                                    <td className="px-4 py-2">${(item.quantity * item.price).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="border-t-2">
                                            <tr>
                                                <td colSpan={3} className="px-4 py-2 text-right font-semibold">Total:</td>
                                                <td className="px-4 py-2 font-semibold">${selectedOrder.total.toFixed(2)}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            {selectedOrder.delivery && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-4">Delivery Information</h3>
                                    <div className="space-y-2">
                                        <p><span className="font-medium">Address:</span> {selectedOrder.delivery.address}</p>
                                        <p><span className="font-medium">Status:</span> {selectedOrder.delivery.status}</p>
                                        {selectedOrder.delivery.estimatedDelivery && (
                                            <p><span className="font-medium">Estimated Delivery:</span> {new Date(selectedOrder.delivery.estimatedDelivery).toLocaleString()}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => handleGenerateBill(selectedOrder)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    Generate Bill
                                </button>
                                <button
                                    onClick={() => handleProcessRefund(selectedOrder)}
                                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
                                >
                                    Process Refund
                                </button>
                                <button
                                    onClick={() => setShowOrderModal(false)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
export default OrdersAdminPage;