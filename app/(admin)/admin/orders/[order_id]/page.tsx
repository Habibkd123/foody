"use client"
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package, Truck, MapPin, CreditCard, Phone, Mail, Calendar, Clock, Edit, Printer, Download, MessageSquare, AlertCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const SingleOrderPage = () => {
    const [orderStatus, setOrderStatus] = useState('processing');
    const [trackingNumber, setTrackingNumber] = useState('TRK123456789');
    const [isEditingTracking, setIsEditingTracking] = useState(false);
    const [notes, setNotes] = useState('');
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [refundAmount, setRefundAmount] = useState('1096.77');
    const [refundReason, setRefundReason] = useState('');
    const [refundNotes, setRefundNotes] = useState('');

    const order = {
        orderNumber: 'ORD-2024-001',
        date: 'October 5, 2024',
        time: '10:30 AM',
        customer: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            avatar: 'JD'
        },
        shippingAddress: {
            street: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zip: '10001',
            country: 'United States'
        },
        billingAddress: {
            street: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zip: '10001',
            country: 'United States'
        },
        payment: {
            method: 'Credit Card',
            cardType: 'Visa',
            last4: '4242',
            transactionId: 'TXN987654321'
        },
        items: [
            {
                id: '1',
                name: 'Wireless Headphones Pro',
                sku: 'WHP-001',
                image: 'WH',
                quantity: 2,
                price: 299.99,
                total: 599.98
            },
            {
                id: '2',
                name: 'Smart Watch Series 5',
                sku: 'SWS-005',
                image: 'SW',
                quantity: 1,
                price: 399.99,
                total: 399.99
            },
            {
                id: '3',
                name: 'USB-C Cable (2m)',
                sku: 'USB-002',
                image: 'UC',
                quantity: 3,
                price: 15.99,
                total: 47.97
            }
        ],
        subtotal: 1047.94,
        shipping: 15.00,
        tax: 83.83,
        discount: 50.00,
        total: 1096.77
    };

    const timeline = [
        {
            status: 'Order Placed',
            date: 'Oct 5, 2024',
            time: '10:30 AM',
            description: 'Order has been placed successfully',
            completed: true
        },
        {
            status: 'Payment Confirmed',
            date: 'Oct 5, 2024',
            time: '10:31 AM',
            description: 'Payment has been verified and confirmed',
            completed: true
        },
        {
            status: 'Processing',
            date: 'Oct 5, 2024',
            time: '11:00 AM',
            description: 'Order is being prepared for shipment',
            completed: orderStatus !== 'pending'
        },
        {
            status: 'Shipped',
            date: 'Oct 6, 2024',
            time: '2:00 PM',
            description: 'Package has been shipped',
            completed: orderStatus === 'shipped' || orderStatus === 'delivered'
        },
        {
            status: 'Out for Delivery',
            date: 'Oct 7, 2024',
            time: '9:00 AM',
            description: 'Package is out for delivery',
            completed: orderStatus === 'delivered'
        },
        {
            status: 'Delivered',
            date: 'Oct 7, 2024',
            time: '3:00 PM',
            description: 'Order has been delivered',
            completed: orderStatus === 'delivered'
        }
    ];

    const statusOptions = [
        { value: 'pending', label: 'Pending', color: 'bg-yellow-500' },
        { value: 'processing', label: 'Processing', color: 'bg-orange-500' },
        { value: 'shipped', label: 'Shipped', color: 'bg-purple-500' },
        { value: 'delivered', label: 'Delivered', color: 'bg-green-500' },
        { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500' }
    ];

    const handleStatusChange = (newStatus:any) => {
        setOrderStatus(newStatus);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-4 sm:p-6">
            <div className="max-w-8xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <button className="flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-4 transition-colors">
                        <ArrowLeft size={20} />
                        <span className="font-medium">Back to Orders</span>
                    </button>

                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Order Details</h1>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                    <Calendar size={16} />
                                    {order.date}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock size={16} />
                                    {order.time}
                                </span>
                                <span className="text-orange-600 font-semibold">{order.orderNumber}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button onClick={handlePrint} className="px-4 py-2 border border-orange-200 bg-white rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all flex items-center gap-2 text-sm font-medium">
                                <Printer size={18} />
                                <span className="hidden sm:inline">Print</span>
                            </button>
                            <button className="px-4 py-2 border border-orange-200 bg-white rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all flex items-center gap-2 text-sm font-medium">
                                <Download size={18} />
                                <span className="hidden sm:inline">Invoice</span>
                            </button>
                            <button onClick={() => setShowRefundModal(true)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm">
                                <RefreshCw size={18} />
                                <span className="hidden sm:inline">Refund</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Order Status */}
                        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6 hover:shadow-md transition-shadow">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Package size={20} className="text-orange-600" />
                                Order Status
                            </h2>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {statusOptions.map((status) => (
                                    <button
                                        key={status.value}
                                        onClick={() => handleStatusChange(status.value)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                                            orderStatus === status.value
                                                ? `${status.color} text-white shadow-md scale-105`
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {status.label}
                                    </button>
                                ))}
                            </div>

                            {/* Tracking Number */}
                            <div className="border-t border-orange-100 pt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tracking Number</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                        disabled={!isEditingTracking}
                                        className="flex-1 px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                                    />
                                    <button
                                        onClick={() => setIsEditingTracking(!isEditingTracking)}
                                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                                    >
                                        <Edit size={18} />
                                        {isEditingTracking ? 'Save' : 'Edit'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6 hover:shadow-md transition-shadow">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Package size={20} className="text-orange-600" />
                                Order Items
                            </h2>

                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-orange-100 last:border-0 hover:bg-orange-50 -mx-2 px-2 py-2 rounded-lg transition-colors">
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm">
                                            {item.image}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                                            <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                                            <p className="text-sm text-gray-600 mt-1">${item.price.toFixed(2)} × {item.quantity}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="font-bold text-gray-900">${item.total.toFixed(2)}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="border-t-2 border-orange-200 mt-6 pt-6 space-y-3 bg-gradient-to-br from-orange-50 to-transparent -mx-6 -mb-6 px-6 pb-6 rounded-b-xl">
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Subtotal</span>
                                    <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Shipping</span>
                                    <span className="font-medium">${order.shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Tax</span>
                                    <span className="font-medium">${order.tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-orange-600 text-sm">
                                    <span>Discount</span>
                                    <span className="font-medium">-${order.discount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-orange-300">
                                    <span>Total</span>
                                    <span className="text-orange-600">${order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Order Timeline */}
                        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6 hover:shadow-md transition-shadow">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <Truck size={20} className="text-orange-600" />
                                Order Timeline
                            </h2>

                            <div className="relative">
                                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 to-gray-200"></div>

                                <div className="space-y-6">
                                    {timeline.map((event, index) => (
                                        <div key={index} className="relative flex gap-4 group">
                                            <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                                event.completed ? 'bg-orange-500 shadow-lg shadow-orange-200' : 'bg-gray-300'
                                            }`}>
                                                {event.completed ? (
                                                    <CheckCircle size={16} className="text-white" />
                                                ) : (
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                )}
                                            </div>
                                            <div className="flex-1 pb-6">
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-1">
                                                    <h3 className={`font-semibold ${event.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                                                        {event.status}
                                                    </h3>
                                                    <span className="text-sm text-gray-500 whitespace-nowrap">{event.date} {event.time}</span>
                                                </div>
                                                <p className={`text-sm ${event.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                                                    {event.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Internal Notes */}
                        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6 hover:shadow-md transition-shadow">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <MessageSquare size={20} className="text-orange-600" />
                                Internal Notes
                            </h2>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add notes about this order..."
                                className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all"
                                rows={4}
                            ></textarea>
                            <button className="mt-3 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium shadow-sm">
                                Save Notes
                            </button>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Customer Info */}
                        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6 hover:shadow-md transition-shadow">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer</h2>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                                    {order.customer.avatar}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{order.customer.name}</h3>
                                    <p className="text-sm text-gray-500">Customer</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <a href={`mailto:${order.customer.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 transition-colors">
                                    <Mail size={16} />
                                    <span className="truncate">{order.customer.email}</span>
                                </a>
                                <a href={`tel:${order.customer.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 transition-colors">
                                    <Phone size={16} />
                                    {order.customer.phone}
                                </a>
                            </div>

                            <button className="w-full mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium shadow-sm">
                                View Profile
                            </button>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6 hover:shadow-md transition-shadow">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin size={20} className="text-orange-600" />
                                Shipping Address
                            </h2>
                            <div className="text-sm text-gray-600 space-y-1 leading-relaxed">
                                <p>{order.shippingAddress.street}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                                <p>{order.shippingAddress.country}</p>
                            </div>
                            <button className="w-full mt-4 px-4 py-2 border border-orange-200 rounded-lg hover:bg-orange-50 transition-all flex items-center justify-center gap-2 font-medium">
                                <Edit size={16} />
                                Edit Address
                            </button>
                        </div>

                        {/* Billing Address */}
                        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6 hover:shadow-md transition-shadow">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin size={20} className="text-orange-600" />
                                Billing Address
                            </h2>
                            <div className="text-sm text-gray-600 space-y-1 leading-relaxed">
                                <p>{order.billingAddress.street}</p>
                                <p>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zip}</p>
                                <p>{order.billingAddress.country}</p>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6 hover:shadow-md transition-shadow">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <CreditCard size={20} className="text-orange-600" />
                                Payment
                            </h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center py-2 border-b border-orange-50">
                                    <span className="text-gray-600">Method</span>
                                    <span className="font-medium text-gray-900">{order.payment.method}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-orange-50">
                                    <span className="text-gray-600">Card</span>
                                    <span className="font-medium text-gray-900">{order.payment.cardType} •••• {order.payment.last4}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-600">Transaction ID</span>
                                    <span className="font-mono text-xs text-gray-900">{order.payment.transactionId}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6 hover:shadow-md transition-shadow">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                            <div className="space-y-2">
                                <button className="w-full px-4 py-2 border border-orange-200 rounded-lg hover:bg-orange-50 transition-all text-left flex items-center gap-2 font-medium">
                                    <Mail size={16} />
                                    Send Email
                                </button>
                                <button className="w-full px-4 py-2 border border-orange-200 rounded-lg hover:bg-orange-50 transition-all text-left flex items-center gap-2 font-medium">
                                    <Package size={16} />
                                    Duplicate Order
                                </button>
                                <button className="w-full px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-all text-left flex items-center gap-2 font-medium">
                                    <XCircle size={16} />
                                    Cancel Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Refund Modal */}
            {showRefundModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl animate-in">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertCircle className="text-red-600" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Process Refund</h3>
                                <p className="text-sm text-gray-500">Refund for order {order.orderNumber}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Refund Amount</label>
                                <input
                                    type="number"
                                    value={refundAmount}
                                    onChange={(e) => setRefundAmount(e.target.value)}
                                    max={order.total}
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                />
                                <p className="text-xs text-gray-500 mt-1">Maximum refund amount: ${order.total.toFixed(2)}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                                <select
                                    value={refundReason}
                                    onChange={(e) => setRefundReason(e.target.value)}
                                    className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                >
                                    <option value="">Select a reason</option>
                                    <option value="Customer Request">Customer Request</option>
                                    <option value="Product Defect">Product Defect</option>
                                    <option value="Wrong Item Shipped">Wrong Item Shipped</option>
                                    <option value="Late Delivery">Late Delivery</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                                <textarea
                                    value={refundNotes}
                                    onChange={(e) => setRefundNotes(e.target.value)}
                                    className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all"
                                    rows={3}
                                    placeholder="Additional details..."
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowRefundModal(false)}
                                className="flex-1 px-4 py-2 border border-orange-200 rounded-lg hover:bg-orange-50 transition-all font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm"
                            >
                                Process Refund
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SingleOrderPage;