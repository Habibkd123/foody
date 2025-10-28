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
    const staticOrders: Order[] = [
        {
            _id: '1',
            orderId: 'ORD-2024-001',
            user: {
                _id: 'user1',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com'
            },
            items: [
                {
                    product: { _id: 'prod1', name: 'Sample Product', price: 415, image: '', category: 'Food' },
                    quantity: 3,
                    price: 415
                }
            ],
            total: 1245.99,
            status: 'delivered',
            paymentId: 'pay_123',
            method: 'card',
            createdAt: '2024-10-05T10:00:00Z',
            updatedAt: '2024-10-05T10:00:00Z'
        },
        {
            _id: '2',
            orderId: 'ORD-2024-002',
            user: {
                _id: 'user2',
                firstName: 'Sarah',
                lastName: 'Johnson',
                email: 'sarah.j@example.com'
            },
            items: [
                {
                    product: { _id: 'prod2', name: 'Sample Product 2', price: 599, image: '', category: 'Food' },
                    quantity: 1,
                    price: 599
                }
            ],
            total: 599.00,
            status: 'shipped',
            paymentId: 'pay_124',
            method: 'card',
            createdAt: '2024-10-05T09:00:00Z',
            updatedAt: '2024-10-05T09:00:00Z'
        },
        {
            _id: '3',
            orderId: 'ORD-2024-003',
            user: {
                _id: 'user3',
                firstName: 'Michael',
                lastName: 'Chen',
                email: 'mchen@example.com'
            },
            items: [
                {
                    product: { _id: 'prod3', name: 'Sample Product 3', price: 430, image: '', category: 'Food' },
                    quantity: 5,
                    price: 430
                }
            ],
            total: 2150.50,
            status: 'processing',
            paymentId: 'pay_125',
            method: 'card',
            createdAt: '2024-10-04T15:00:00Z',
            updatedAt: '2024-10-04T15:00:00Z'
        },
        {
            _id: '4',
            orderId: 'ORD-2024-004',
            user: {
                _id: 'user4',
                firstName: 'Emily',
                lastName: 'Wilson',
                email: 'emily.w@example.com'
            },
            items: [
                {
                    product: { _id: 'prod4', name: 'Sample Product 4', price: 449.995, image: '', category: 'Food' },
                    quantity: 2,
                    price: 449.995
                }
            ],
            total: 899.99,
            status: 'pending',
            paymentId: 'pay_126',
            method: 'card',
            createdAt: '2024-10-04T12:00:00Z',
            updatedAt: '2024-10-04T12:00:00Z'
        },
        {
            _id: '5',
            orderId: 'ORD-2024-005',
            user: {
                _id: 'user5',
                firstName: 'David',
                lastName: 'Martinez',
                email: 'dmartinez@example.com'
            },
            items: [
                {
                    product: { _id: 'prod5', name: 'Sample Product 5', price: 418.8125, image: '', category: 'Food' },
                    quantity: 4,
                    price: 418.8125
                }
            ],
            total: 1675.25,
            status: 'cancelled',
            paymentId: 'pay_127',
            method: 'card',
            createdAt: '2024-10-03T08:00:00Z',
            updatedAt: '2024-10-03T08:00:00Z'
        }
    ];

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
            color: 'bg-orange-500'
        },
        {
            title: 'Pending',
            value: transformedOrders.filter(o => o.status === 'pending').length.toString(),
            change: '+3.2%',
            icon: Clock,
            color: 'bg-orange-500'
        },
        {
            title: 'Processing',
            value: transformedOrders.filter(o => o.status === 'processing').length.toString(),
            change: '+8.1%',
            icon: TrendingUp,
            color: 'bg-orange-500'
        },
        {
            title: 'Delivered',
            value: transformedOrders.filter(o => o.status === 'delivered').length.toString(),
            change: '+15.3%',
            icon: CheckCircle,
            color: 'bg-orange-500'
        }
    ];
    return (
        <div className="min-h-screen bg-orange-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
                            <p className="text-gray-500 mt-1">Manage and track all customer orders</p>
                        </div>
                        <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition">
                            <Plus size={20} />
                            Create Order
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-orange-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                                        <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                                        <p className="text-sm text-orange-600 mt-2">{stat.change} from last month</p>
                                    </div>
                                    <div className={`${stat.color} p-3 rounded-lg`}>
                                        <stat.icon className="text-white" size={24} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-xl shadow-sm border border-orange-100 mb-6">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search by order number or customer name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <button className="px-6 py-3 border border-orange-200 rounded-lg flex items-center gap-2 hover:bg-orange-50 transition">
                                <Filter size={20} />
                                Filters
                            </button>
                            <button className="px-6 py-3 border border-orange-200 rounded-lg flex items-center gap-2 hover:bg-orange-50 transition">
                                <Download size={20} />
                                Export
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2 overflow-x-auto border-b border-orange-200">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-3 font-medium whitespace-nowrap border-b-2 transition ${activeTab === tab.id
                                            ? 'border-orange-600 text-orange-600'
                                            : 'border-transparent text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    {tab.label}
                                    <span className="ml-2 px-2 py-1 text-xs rounded-full bg-orange-50">
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Loading/Error States */}
                    {loading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading orders...</p>
                            </div>
                        </div>
                    )}

                    {error && !loading && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <div className="flex items-center">
                                <div className="text-red-600 mr-3">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-red-800">Error loading orders</h3>
                                    <p className="text-sm text-red-700 mt-1">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Orders Table */}
                    {!loading && !error && (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-orange-50 border-y border-orange-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            <input type="checkbox" className="rounded border-gray-300" />
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Items</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-orange-50 transition">
                                            <td className="px-6 py-4">
                                                <input type="checkbox" className="rounded border-gray-300" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-orange-600">{order.orderNumber}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold">
                                                        {order.customer.avatar}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                                                        <div className="text-sm text-gray-500">{order.customer.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{order.items}</td>
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">${order.total.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{order.payment}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="relative" ref={dropdownRef}>
                                                    <button
                                                        onClick={() => setOpenDropdownId(openDropdownId === order.id ? null : order.id)}
                                                        className="p-2 hover:bg-orange-100 rounded-lg transition"
                                                    >
                                                        <MoreVertical size={18} className="text-gray-600" />
                                                    </button>
                                                    <Link href={`/admin/orders/${order.id}`}>
                                                        <button
                                                            onClick={() => handleViewOrder(orders.find(o => o._id === order.id)!)}
                                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                        >
                                                            <Eye size={16} className="mr-2" />
                                                        </button>
                                                    </Link>
                                                    {openDropdownId === order.id && (
                                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                                            <div className="py-1">
                                                                <Link href={`/admin/orders/${order.id}`}>
                                                                    <button
                                                                        onClick={() => handleViewOrder(orders.find(o => o._id === order.id)!)}
                                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                                    >
                                                                        <Eye size={16} className="mr-2" />
                                                                        View Details
                                                                    </button>
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleStatusUpdate(order.id, 'processing')}
                                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                                >
                                                                    <Edit3 size={16} className="mr-2" />
                                                                    Update Status
                                                                </button>

                                                                <button
                                                                    onClick={() => handleGenerateBill(orders.find(o => o._id === order.id)!)}
                                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                                >
                                                                    <FileText size={16} className="mr-2" />
                                                                    Generate Bill
                                                                </button>

                                                                <button
                                                                    onClick={() => handleProcessRefund(orders.find(o => o._id === order.id)!)}
                                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                                >
                                                                    <RefreshCw size={16} className="mr-2" />
                                                                    Process Refund
                                                                </button>

                                                                <div className="border-t border-gray-100 my-1"></div>

                                                                <button
                                                                    onClick={() => handleCancelOrder(order.id)}
                                                                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                                                >
                                                                    <X size={16} className="mr-2" />
                                                                    Cancel Order
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && !error && (
                        <div className="px-6 py-4 border-t border-orange-200 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Showing <span className="font-medium">{(pagination.currentPage - 1) * 10 + 1}</span> to{' '}
                                <span className="font-medium">{Math.min(pagination.currentPage * 10, pagination.totalOrders)}</span> of{' '}
                                <span className="font-medium">{pagination.totalOrders}</span> results
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => fetchOrders(pagination.currentPage - 1)}
                                    disabled={!pagination.hasPrevPage || loading}
                                    className="px-4 py-2 border border-orange-200 rounded-lg hover:bg-orange-50 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm"
                                >
                                    {pagination.currentPage}
                                </button>
                                {pagination.hasNextPage && (
                                    <button
                                        onClick={() => fetchOrders(pagination.currentPage + 1)}
                                        disabled={loading}
                                        className="px-4 py-2 border border-orange-200 rounded-lg hover:bg-orange-50 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {pagination.currentPage + 1}
                                    </button>
                                )}
                                <button
                                    onClick={() => fetchOrders(pagination.currentPage + 1)}
                                    disabled={!pagination.hasNextPage || loading}
                                    className="px-4 py-2 border border-orange-200 rounded-lg hover:bg-orange-50 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

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