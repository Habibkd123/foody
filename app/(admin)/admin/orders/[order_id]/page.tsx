"use client"
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package, Truck, MapPin, CreditCard, Phone, Mail, Calendar, Clock, Edit, Printer, Download, MessageSquare, AlertCircle, CheckCircle, XCircle, RefreshCw, User, DollarSign, ShoppingBag } from 'lucide-react';
import { useParams } from 'next/navigation';


interface Timeline {
    status: string;
    date: string;
    time: string;
    description: string;
    completed: boolean;
}



const SingleOrderPage = () => {
    const params = useParams();
    const orderId = params.order_id as string;

    const [orderData, setOrderData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [orderStatus, setOrderStatus] = useState('processing');
    const [trackingNumber, setTrackingNumber] = useState('');
    const [isEditingTracking, setIsEditingTracking] = useState(false);
    const [notes, setNotes] = useState('');
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [refundAmount, setRefundAmount] = useState('');
    const [refundReason, setRefundReason] = useState('');
    const [refundNotes, setRefundNotes] = useState('');
    const [itemsOrder, setItemsOrder] = useState<any[]>([]);
    const [showProfileModal, setShowProfileModal] = useState(false);

    // Fetch order data
    const fetchOrder = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/orders/${orderId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch order');
            }

            const data = await response.json();
            console.log("dataorder", data.data);

            if (data.success) {
                setOrderData(data.data);
                setOrderStatus(data.data.status);
                setTrackingNumber(data.data.delivery?.trackingNumber || '');
                setRefundAmount(data.data.total.toString());
                setItemsOrder(data.data.items || []);
            } else {
                throw new Error(data.error || 'Failed to fetch order');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch order');
        } finally {
            setLoading(false);
        }
    };

    // Load on mount
    useEffect(() => {
        if (orderId) fetchOrder();
    }, [orderId]);

    const order = {
        orderNumber: orderData?._id || 'ORD-2024-001',
        date: orderData?.createdAt
            ? new Date(orderData.createdAt).toLocaleDateString()
            : 'October 5, 2024',
        time: orderData?.createdAt
            ? new Date(orderData.createdAt).toLocaleTimeString()
            : '10:30 AM',
        status: orderData?.status || orderStatus || 'processing',
        customer: {
            name: (orderData?.user?.firstName && orderData?.user?.lastName)
                ? `${orderData.user?.firstName} ${orderData.user?.lastName}`
                : 'John Doe',
            email: orderData?.user?.email || 'john.doe@example.com',
            phone: orderData?.user?.phone || '+1 (555) 123-4567',
            avatar: orderData?.user?.firstName?.charAt(0)?.toUpperCase() || 'JD'
        },
        shippingAddress: orderData?.user?.addresses?.[0] || {
            street: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zip: '10001',
            country: 'United States'
        },
        billingAddress: orderData?.user?.addresses?.[0] || {
            street: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zip: '10001',
            country: 'United States'
        },
        payment: {
            method: orderData?.method || 'Credit Card',
            transactionId: orderData?.paymentId || 'TXN987654321',
            cardType: 'Visa',
            last4: '4242',
        },
        items: itemsOrder && itemsOrder.length > 0
            ? itemsOrder.map((item) => ({
                id: item._id,
                name: item.product?.name || 'Wireless Headphones Pro',
                sku: item.product?.sku || 'WHP-001',
                image: item.product?.images?.[0] || 'WH',
                quantity: item.quantity || 1,
                price: item.price || 299.99,
                total: (item.price || 299.99) * (item.quantity || 1)
            }))
            : [
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
                }
            ],
        subtotal: itemsOrder && itemsOrder.length > 0
            ? itemsOrder.reduce((acc, item) => acc + item.price * item.quantity, 0)
            : 1047.94,
        shipping: orderData?.shipping || 15.00,
        tax: orderData?.tax || 83.83,
        discount: orderData?.discount || 50.00,
        total: orderData?.total || 1096.77
    };


    const timeline: Timeline[] = [
    ];


    const handleStatusChange = async (newStatus: string) => {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                setOrderStatus(newStatus);
                alert('Order status updated successfully!');
                // Refresh order data
                fetchOrder();
            } else {
                alert('Failed to update order status');
            }
        } catch (error) {
            alert('Error updating order status');
        }
    };

    const handleGenerateBill = async () => {
        try {
            const response = await fetch('/api/orders/bill', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId })
            });

            if (response.ok) {
                const data = await response.json();
                // Open bill in new window
                const billWindow = window.open('', '_blank');
                if (billWindow) {
                    billWindow.document.write(`
            <html>
              <head>
                <title>Bill - ${orderData?.orderId || 'N/A'}</title>
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
    };

    const handleProcessRefund = async () => {
        const amount = parseFloat(refundAmount);
        if (isNaN(amount) || amount <= 0 || amount > (orderData?.total || 0)) {
            alert('Invalid refund amount');
            return;
        }

        if (!refundReason.trim()) {
            alert('Please select a refund reason');
            return;
        }

        try {
            const response = await fetch('/api/orders/refund', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId,
                    refundAmount: amount,
                    refundReason: refundReason
                })
            });

            if (response.ok) {
                const data = await response.json();
                alert(`Refund processed successfully! Refund ID: ${data.data.refundId}`);
                setShowRefundModal(false);
                // Reset form
                setRefundAmount((orderData?.total || 0).toString());
                setRefundReason('');
                setRefundNotes('');
                // Refresh order data
                fetchOrder();
            } else {
                const error = await response.json();
                alert(`Failed to process refund: ${error.error}`);
            }
        } catch (error) {
            alert('Error processing refund');
        }
    };

    const handleCancelOrder = async () => {
        if (confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
            try {
                const response = await fetch(`/api/orders/${orderId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'canceled' })
                });

                if (response.ok) {
                    alert('Order cancelled successfully!');
                    fetchOrder(); // Refresh order data
                } else {
                    alert('Failed to cancel order');
                }
            } catch (error) {
                alert('Error cancelling order');
            }
        }
    };

    const handleSaveNotes = async () => {
        try {
            const response = await fetch(`/api/orders/${orderId}/notes`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notes })
            });

            if (response.ok) {
                alert('Notes saved successfully!');
                // Refresh order data if needed
                fetchOrder();
            } else {
                alert('Failed to save notes');
            }
        } catch (error) {
            alert('Error saving notes');
        }
    };

    const handleSendEmail = async () => {
        try {
            const response = await fetch(`/api/orders/${orderId}/email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'order_update' })
            });

            if (response.ok) {
                alert('Email sent successfully!');
            } else {
                alert('Failed to send email');
            }
        } catch (error) {
            alert('Error sending email');
        }
    };

    const handleDuplicateOrder = async () => {
        if (confirm('Are you sure you want to duplicate this order?')) {
            try {
                const response = await fetch(`/api/orders/${orderId}/duplicate`, {
                    method: 'POST'
                });

                if (response.ok) {
                    const data = await response.json();
                    alert(`Order duplicated successfully! New Order ID: ${data.data.newOrderId}`);
                    // Optionally redirect to new order
                    // window.location.href = `/admin/orders/${data.data.newOrderId}`;
                } else {
                    alert('Failed to duplicate order');
                }
            } catch (error) {
                alert('Error duplicating order');
            }
        }
    };

    const handleViewProfile = () => {
        setShowProfileModal(true);
    };
    const handleUpdateTracking = async () => {
        if (isEditingTracking) {
            // Save mode - update tracking number
            try {
                const response = await fetch(`/api/orders/${orderId}/tracking`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ trackingNumber })
                });

                if (response.ok) {
                    alert('Tracking number updated successfully!');
                    setIsEditingTracking(false);
                    // Refresh order data to show updated tracking number
                    fetchOrder();
                } else {
                    const error = await response.json();
                    alert(`Failed to update tracking number: ${error.error}`);
                }
            } catch (error) {
                alert('Error updating tracking number');
            }
        } else {
            // Edit mode - enable editing
            setIsEditingTracking(true);
        }
    };

    const statusOptions = [
        { value: 'pending', label: 'Pending', color: 'bg-yellow-500', icon: Clock },
        { value: 'processing', label: 'Processing', color: 'bg-blue-500', icon: Package },
        { value: 'shipped', label: 'Shipped', color: 'bg-purple-500', icon: Truck },
        { value: 'delivered', label: 'Delivered', color: 'bg-green-500', icon: CheckCircle },
        { value: 'canceled', label: 'Cancelled', color: 'bg-red-500', icon: XCircle }
    ];

    const currentStatus = statusOptions.find(s => s.value === orderStatus);

    const handlePrint = () => {
        window.print();
    };

    //                         <div className="flex-1">
    //                             <div className="flex items-start justify-between mb-3">
    //                                 <div>
    //                                     <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Order #{order.orderNumber}</h1>
    //                                     <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
    //                                         <span className="flex items-center gap-1">
    //                                             <Calendar size={14} className="sm:w-4 sm:h-4" />
    //                                             {order.date}
    //                                         </span>
    //                                         <span className="flex items-center gap-1">
    //                                             <Clock size={14} className="sm:w-4 sm:h-4" />
    //                                             {order.time}
    //                                         </span>
    //                                     </div>
    //                                 </div>

    //                                 {/* Status Badge - Mobile */}
    //                                 <div className="lg:hidden">
    //                                     <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-white text-xs font-medium ${currentStatus?.color}`}>
    //                                         {React.createElement(currentStatus?.icon || Package, { size: 12 })}
    //                                         {currentStatus?.label}
    //                                     </span>
    //                                 </div>
    //                             </div>

    //                             {/* Status Badge - Desktop */}
    //                             <div className="hidden lg:block mt-3">
    //                                 <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium ${currentStatus?.color}`}>
    //                                     {React.createElement(currentStatus?.icon || Package, { size: 16 })}
    //                                     {currentStatus?.label}
    //                                 </span>
    //                             </div>
    //                         </div>

    //                         {/* Action Buttons */}
    //                         <div className="flex flex-wrap gap-2 sm:gap-3">
    //                             <button
    //                                 onClick={handlePrint}
    //                                 className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-orange-300 rounded-lg hover:bg-orange-50 flex items-center justify-center gap-2 text-sm transition-colors"
    //                             >
    //                                 <Printer size={16} />
    //                                 <span className="hidden sm:inline">Print</span>
    //                             </button>
    //                             <button
    //                                 onClick={handleGenerateBill}
    //                                 className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-orange-300 rounded-lg hover:bg-orange-50 flex items-center justify-center gap-2 text-sm transition-colors">
    //                                 <Download size={16} />
    //                                 <span className="hidden sm:inline">Invoice</span>
    //                             </button>
    //                             <button
    //                                 onClick={() => setShowRefundModal(true)}
    //                                 className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 text-sm transition-colors"
    //                             >
    //                                 <RefreshCw size={16} />
    //                                 <span className="hidden sm:inline">Refund</span>
    //                             </button>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>

    //             {/* Main Content Grid */}
    //             <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
    //                 {/* Left Column - Order Management */}
    //                 <div className="lg:col-span-2 space-y-4 sm:space-y-6">
    //                     {/* Order Items */}
    //                     <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-4 sm:p-6">
    //                         <div className="flex items-center justify-between mb-4">
    //                             <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
    //                                 <ShoppingBag size={20} />
    //                                 Order Items
    //                             </h2>
    //                             <span className="text-xs sm:text-sm text-gray-500">{order.items.length} items</span>
    //                         </div>

    //                         {/* Items List - Scrollable on mobile */}
    //                         <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
    //                             {order.items.map((item) => (
    //                                 <div key={item.id} className="flex gap-3 sm:gap-4 pb-3 border-b border-orange-100 last:border-0">
    //                                     <img
    //                                         src={item.image}
    //                                         alt={item.name}
    //                                         className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover flex-shrink-0 bg-gray-100"
    //                                     />
    //                                     <div className="flex-1 min-w-0">
    //                                         <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{item.name}</h3>
    //                                         <p className="text-xs sm:text-sm text-gray-500">SKU: {item.sku}</p>
    //                                         <div className="flex items-center justify-between mt-2">
    //                                             <p className="text-xs sm:text-sm text-gray-600">
    //                                                 ${item.price.toFixed(2)} × {item.quantity}
    //                                             </p>
    //                                             <p className="font-semibold text-orange-600 text-sm sm:text-base">
    //                                                 ${item.total.toFixed(2)}
    //                                             </p>
    //                                         </div>
    //                                     </div>
    //                                 </div>
    //                             ))}
    //                         </div>

    //                         {/* Order Summary */}
    //                         <div className="border-t border-orange-200 mt-4 pt-4 space-y-2">
    //                             <div className="flex justify-between text-sm text-gray-600">
    //                                 <span>Subtotal</span>
    //                                 <span>${order.subtotal.toFixed(2)}</span>
    //                             </div>
    //                             <div className="flex justify-between text-sm text-gray-600">
    //                                 <span>Shipping</span>
    //                                 <span>${order.shipping.toFixed(2)}</span>
    //                             </div>
    //                             <div className="flex justify-between text-sm text-gray-600">
    //                                 <span>Tax</span>
    //                                 <span>${order.tax.toFixed(2)}</span>
    //                             </div>
    //                             <div className="flex justify-between text-sm text-orange-600">
    //                                 <span>Discount</span>
    //                                 <span>-${order.discount.toFixed(2)}</span>
    //                             </div>
    //                             <div className="flex justify-between text-base sm:text-lg font-bold text-gray-900 pt-2 border-t border-orange-200">
    //                                 <span>Total</span>
    //                                 <span className="text-orange-600">${order.total.toFixed(2)}</span>
    //                             </div>
    //                         </div>
    //                     </div>

    //                     {/* Status Management */}
    //                     <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-4 sm:p-6">
    //                         <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
    //                             <Package size={20} />
    //                             Update Status
    //                         </h2>

    //                         <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 mb-4">
    //                             {statusOptions.map((status) => {
    //                                 const Icon = status?.icon;
    //                                 return (
    //                                     <button
    //                                         key={status.value}
    //                                         onClick={() => handleStatusChange(status.value)}
    //                                         className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 text-sm ${orderStatus === status.value
    //                                                 ? `${status.color} text-white shadow-md`
    //                                                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    //                                             }`}
    //                                     >
    //                                         {/* <Icon size={14} /> */}
    //                                         <span className="hidden sm:inline">{status.label}</span>
    //                                         <span className="sm:hidden">{status.label.split(' ')[0]}</span>
    //                                     </button>
    //                                 );
    //                             })}
    //                         </div>

    //                         {/* Tracking Number */}
    //                         <div className="border-t border-orange-200 pt-4">
    //                             <label className="block text-sm font-medium text-gray-700 mb-2">Tracking Number</label>
    //                             <div className="flex gap-2 sm:gap-3">
    //                                 <input
    //                                     type="text"
    //                                     value={trackingNumber}
    //                                     onChange={(e) => setTrackingNumber(e.target.value)}
    //                                     disabled={!isEditingTracking}
    //                                     className="flex-1 px-3 sm:px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 text-sm"
    //                                     placeholder="Enter tracking number"
    //                                 />
    //                                 <button
    //                                     onClick={handleUpdateTracking}
    //                                     className="px-3 sm:px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2 text-sm transition-colors"
    //                                 >
    //                                     <Edit size={16} />
    //                                     <span className="hidden sm:inline">{isEditingTracking ? 'Save' : 'Edit'}</span>
    //                                 </button>
    //                             </div>
    //                         </div>
    //                     </div>

    //                     {/* Timeline - Desktop */}
    //                     <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-orange-100 p-6">
    //                         <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
    //                             <Truck size={20} />
    //                             Order Timeline
    //                         </h2>

    //                         <div className="relative">
    //                             <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-orange-200"></div>

    //                             <div className="space-y-6">
    //                                 {timeline.map((event, index) => (
    //                                     <div key={index} className="relative flex gap-4">
    //                                         <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${event.completed ? 'bg-orange-500' : 'bg-gray-300'
    //                                             }`}>
    //                                             {event.completed ? (
    //                                                 <CheckCircle size={16} className="text-white" />
    //                                             ) : (
    //                                                 <div className="w-2 h-2 bg-white rounded-full"></div>
    //                                             )}
    //                                         </div>
    //                                         <div className="flex-1 pb-6">
    //                                             <div className="flex justify-between items-start mb-1">
    //                                                 <h3 className={`font-semibold ${event.completed ? 'text-gray-900' : 'text-gray-400'}`}>
    //                                                     {event.status}
    //                                                 </h3>
    //                                                 <span className="text-sm text-gray-500">{event.date} {event.time}</span>
    //                                             </div>
    //                                             <p className={`text-sm ${event.completed ? 'text-gray-600' : 'text-gray-400'}`}>
    //                                                 {event.description}
    //                                             </p>
    //                                         </div>
    //                                     </div>
    //                                 ))}
    //                             </div>
    //                         </div>
    //                     </div>
    //                 </div>

    //                 {/* Right Column - Customer & Details */}
    //                 <div className="space-y-4 sm:space-y-6">
    //                     {/* Customer Info */}
    //                     <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-4 sm:p-6">
    //                         <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
    //                             <User size={20} />
    //                             Customer
    //                         </h2>

    //                         <div className="flex items-center gap-3 mb-4 pb-4 border-b border-orange-100">
    //                             <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
    //                                 {order.customer.avatar}
    //                             </div>
    //                             <div className="min-w-0">
    //                                 <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{order.customer.name}</h3>
    //                                 <p className="text-xs sm:text-sm text-gray-500">Customer</p>
    //                             </div>
    //                         </div>

    //                         <div className="space-y-3">
    //                             <a href={`mailto:${order.customer.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 transition-colors break-all">
    //                                 <Mail size={16} className="flex-shrink-0" />
    //                                 <span className="truncate">{order.customer.email}</span>
    //                             </a>
    //                             <a href={`tel:${order.customer.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 transition-colors">
    //                                 <Phone size={16} className="flex-shrink-0" />
    //                                 {order.customer.phone}
    //                             </a>
    //                         </div>

    //                         <button
    //                             onClick={handleViewProfile}
    //                             className="w-full mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm transition-colors">
    //                             View Profile
    //                         </button>
    //                     </div>

    //                     {/* Addresses */}
    //                     <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-4 sm:p-6">
    //                         <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
    //                             <MapPin size={20} />
    //                             Addresses
    //                         </h2>

    //                         <div className="space-y-4">
    //                             <div>
    //                                 <h3 className="text-sm font-semibold text-gray-700 mb-2">Shipping Address</h3>
    //                                 <div className="text-sm text-gray-600 space-y-1 bg-orange-50 p-3 rounded-lg">
    //                                     <p>{order.shippingAddress.street}</p>
    //                                     <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
    //                                     <p>{order.shippingAddress.country}</p>
    //                                 </div>
    //                             </div>

    //                             <div>
    //                                 <h3 className="text-sm font-semibold text-gray-700 mb-2">Billing Address</h3>
    //                                 <div className="text-sm text-gray-600 space-y-1 bg-gray-50 p-3 rounded-lg">
    //                                     <p>{order.billingAddress.street}</p>
    //                                     <p>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zip}</p>
    //                                     <p>{order.billingAddress.country}</p>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     </div>

    //                     {/* Payment Info */}
    //                     <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-4 sm:p-6">
    //                         <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
    //                             <CreditCard size={20} />
    //                             Payment
    //                         </h2>
    //                         <div className="space-y-3 text-sm">
    //                             <div className="flex justify-between">
    //                                 <span className="text-gray-600">Method</span>
    //                                 <span className="font-medium text-gray-900">{order.payment.method}</span>
    //                             </div>
    //                             <div className="flex justify-between">
    //                                 <span className="text-gray-600">Card</span>
    //                                 <span className="font-medium text-gray-900">{order.payment.cardType} •••• {order.payment.last4}</span>
    //                             </div>
    //                             <div className="flex justify-between items-start">
    //                                 <span className="text-gray-600">Transaction ID</span>
    //                                 <span className="font-mono text-xs text-gray-900 text-right break-all">{order.payment.transactionId}</span>
    //                             </div>
    //                         </div>
    //                     </div>

    //                     {/* Internal Notes */}
    //                     <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-4 sm:p-6">
    //                         <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
    //                             <MessageSquare size={20} />
    //                             Notes
    //                         </h2>
    //                         <textarea
    //                             value={notes}
    //                             onChange={(e) => setNotes(e.target.value)}
    //                             placeholder="Add internal notes..."
    //                             className="w-full px-3 sm:px-4 py-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none text-sm"
    //                             rows={3}
    //                         ></textarea>
    //                         <button
    //                             onClick={handleSaveNotes}
    //                             className="mt-3 w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm transition-colors">
    //                             Save Notes
    //                         </button>
    //                     </div>

    //                     {/* Quick Actions */}
    //                     <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-4 sm:p-6">
    //                         <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
    //                         <div className="space-y-2">
    //                             <button
    //                                 onClick={handleSendEmail}
    //                                 className="w-full px-4 py-2 border border-orange-300 rounded-lg hover:bg-orange-50 text-left flex items-center gap-2 text-sm transition-colors">
    //                                 <Mail size={16} />
    //                                 Send Email
    //                             </button>
    //                             <button
    //                                 onClick={handleDuplicateOrder}
    //                                 className="w-full px-4 py-2 border border-orange-300 rounded-lg hover:bg-orange-50 text-left flex items-center gap-2 text-sm transition-colors">
    //                                 <Package size={16} />
    //                                 Duplicate Order
    //                             </button>
    //                             <button className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-left flex items-center gap-2 text-sm transition-colors"
    //                                 onClick={handleCancelOrder}>
    //                                 <XCircle size={16} />
    //                                 Cancel Order
    //                             </button>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>

    //             {/* Timeline - Mobile */}
    //             <div className="lg:hidden mt-4 sm:mt-6 bg-white rounded-xl shadow-sm border border-orange-100 p-4 sm:p-6">
    //                 <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
    //                     <Truck size={20} />
    //                     Order Timeline
    //                 </h2>

    //                 <div className="relative">
    //                     <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-orange-200"></div>

    //                     <div className="space-y-4">
    //                         {timeline.map((event, index) => (
    //                             <div key={index} className="relative flex gap-3">
    //                                 <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${event.completed ? 'bg-orange-500' : 'bg-gray-300'
    //                                     }`}>
    //                                     {event.completed ? (
    //                                         <CheckCircle size={14} className="text-white" />
    //                                     ) : (
    //                                         <div className="w-2 h-2 bg-white rounded-full"></div>
    //                                     )}
    //                                 </div>
    //                                 <div className="flex-1 pb-4">
    //                                     <div className="mb-1">
    //                                         <h3 className={`font-semibold text-sm ${event.completed ? 'text-gray-900' : 'text-gray-400'}`}>
    //                                             {event.status}
    //                                         </h3>
    //                                         <span className="text-xs text-gray-500">{event.date} {event.time}</span>
    //                                     </div>
    //                                     <p className={`text-xs ${event.completed ? 'text-gray-600' : 'text-gray-400'}`}>
    //                                         {event.description}
    //                                     </p>
    //                                 </div>
    //                             </div>
    //                         ))}
    //                     </div>
    //                 </div>
    //             </div>

    //             {/* Refund Modal */}
    //             {showRefundModal && (
    //                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    //                     <div className="bg-white rounded-xl max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
    //                         <div className="flex items-center gap-3 mb-4">
    //                             <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
    //                                 <AlertCircle className="text-red-600" size={20} />
    //                             </div>
    //                             <div className="min-w-0">
    //                                 <h3 className="text-lg sm:text-xl font-bold text-gray-900">Process Refund</h3>
    //                                 <p className="text-xs sm:text-sm text-gray-500 truncate">Order {order.orderNumber}</p>
    //                             </div>
    //                         </div>

    //                         <div className="space-y-4">
    //                             <div>
    //                                 <label className="block text-sm font-medium text-gray-700 mb-2">Refund Amount</label>
    //                                 <div className="relative">
    //                                     <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
    //                                     <input
    //                                         type="number"
    //                                         value={refundAmount}
    //                                         onChange={(e) => setRefundAmount(e.target.value)}
    //                                         max={order.total}
    //                                         step="0.01"
    //                                         className="w-full pl-10 pr-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
    //                                     />
    //                                 </div>
    //                                 <p className="text-xs text-gray-500 mt-1">Maximum: ${order.total.toFixed(2)}</p>
    //                             </div>

    //                             <div>
    //                                 <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
    //                                 <select
    //                                     value={refundReason}
    //                                     onChange={(e) => setRefundReason(e.target.value)}
    //                                     className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
    //                                 >
    //                                     <option value="">Select a reason</option>
    //                                     <option value="Customer Request">Customer Request</option>
    //                                     <option value="Product Defect">Product Defect</option>
    //                                     <option value="Wrong Item Shipped">Wrong Item Shipped</option>
    //                                     <option value="Late Delivery">Late Delivery</option>
    //                                     <option value="Other">Other</option>
    //                                 </select>
    //                             </div>

    //                             <div>
    //                                 <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
    //                                 <textarea
    //                                     value={refundNotes}
    //                                     onChange={(e) => setRefundNotes(e.target.value)}
    //                                     className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none text-sm"
    //                                     rows={3}
    //                                     placeholder="Additional details..."
    //                                 ></textarea>
    //                             </div>
    //                         </div>

    //                         <div className="flex gap-3 mt-6">
    //                             <button
    //                                 onClick={() => setShowRefundModal(false)}
    //                                 className="flex-1 px-4 py-2 border border-orange-300 rounded-lg hover:bg-orange-50 text-sm transition-colors"
    //                             >
    //                                 Cancel
    //                             </button>
    //                             <button
    //                                 onClick={handleProcessRefund}
    //                                 className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm transition-colors"
    //                             >
    //                                 Process Refund
    //                             </button>
    //                         </div>
    //                     </div>
    //                 </div>
    //             )}
    //         </div>
    //     </div>
    // );

    // return (
    //     <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-3 sm:p-6">
    //         <div className="max-w-7xl mx-auto">
    //             {/* Header */}
    //             <div className="mb-4 sm:mb-6">
    //                 <button className="flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-3 sm:mb-4 transition-colors">
    //                     <ArrowLeft size={20} />
    //                     <span className="text-sm sm:text-base">Back to Orders</span>
    //                 </button>

    //                 <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-4 sm:p-6">
    //                     <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
    //                         <div className="flex-1">
    //                             <div className="flex items-start justify-between mb-3">
    //                                 <div>
    //                                     <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Order #{order.orderNumber}</h1>
    //                                     <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
    //                                         <span className="flex items-center gap-1">
    //                                             <Calendar size={14} className="sm:w-4 sm:h-4" />
    //                                             {order.date}
    //                                         </span>
    //                                         <span className="flex items-center gap-1">
    //                                             <Clock size={14} className="sm:w-4 sm:h-4" />
    //                                             {order.time}
    //                                         </span>
    //                                     </div>
    //                                 </div>

    //                                 {/* Status Badge - Mobile */}
    //                                 <div className="lg:hidden">
    //                                     <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-white text-xs font-medium ${currentStatus?.color}`}>
    //                                         {React.createElement(currentStatus?.icon || Package, { size: 12 })}
    //                                         {currentStatus?.label}
    //                                     </span>
    //                                 </div>
    //                             </div>

    //                             {/* Status Badge - Desktop */}
    //                             <div className="hidden lg:block mt-3">
    //                                 <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium ${currentStatus?.color}`}>
    //                                     {React.createElement(currentStatus?.icon || Package, { size: 16 })}
    //                                     {currentStatus?.label}
    //                                 </span>
    //                             </div>
    //                         </div>

    //                         {/* Action Buttons */}
    //                         <div className="flex flex-wrap gap-2 sm:gap-3">
    //                             <button
    //                                 onClick={handlePrint}
    //                                 className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-orange-300 rounded-lg hover:bg-orange-50 flex items-center justify-center gap-2 text-sm transition-colors"
    //                             >
    //                                 <Printer size={16} />
    //                                 <span className="hidden sm:inline">Print</span>
    //                             </button>
    //                             <button
    //                                 onClick={handleGenerateBill}
    //                                 className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-orange-300 rounded-lg hover:bg-orange-50 flex items-center justify-center gap-2 text-sm transition-colors">
    //                                 <Download size={16} />
    //                                 <span className="hidden sm:inline">Invoice</span>
    //                             </button>
    //                             <button
    //                                 onClick={() => setShowRefundModal(true)}
    //                                 className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 text-sm transition-colors"
    //                             >
    //                                 <RefreshCw size={16} />
    //                                 <span className="hidden sm:inline">Refund</span>
    //                             </button>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>

    //             {/* Main Content Grid */}
    //             <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
    //                 {/* Left Column - Order Management */}
    //                 <div className="lg:col-span-2 space-y-4 sm:space-y-6">
    //                     {/* Order Items */}
    //                     <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-4 sm:p-6">
    //                         <div className="flex items-center justify-between mb-4">
    //                             <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
    //                                 <ShoppingBag size={20} />
    //                                 Order Items
    //                             </h2>
    //                             <span className="text-xs sm:text-sm text-gray-500">{order.items.length} items</span>
    //                         </div>

    //                         {/* Items List - Scrollable on mobile */}
    //                         <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
    //                             {order.items.map((item) => (
    //                                 <div key={item.id} className="flex gap-3 sm:gap-4 pb-3 border-b border-orange-100 last:border-0">
    //                                     <img
    //                                         src={item.image}
    //                                         alt={item.name}
    //                                         className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover flex-shrink-0 bg-gray-100"
    //                                     />
    //                                     <div className="flex-1 min-w-0">
    //                                         <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{item.name}</h3>
    //                                         <p className="text-xs sm:text-sm text-gray-500">SKU: {item.sku}</p>
    //                                         <div className="flex items-center justify-between mt-2">
    //                                             <p className="text-xs sm:text-sm text-gray-600">
    //                                                 ${item.price.toFixed(2)} × {item.quantity}
    //                                             </p>
    //                                             <p className="font-semibold text-orange-600 text-sm sm:text-base">
    //                                                 ${item.total.toFixed(2)}
    //                                             </p>
    //                                         </div>
    //                                     </div>
    //                                 </div>
    //                             ))}
    //                         </div>

    //                         {/* Order Summary */}
    //                         <div className="border-t border-orange-200 mt-4 pt-4 space-y-2">
    //                             <div className="flex justify-between text-sm text-gray-600">
    //                                 <span>Subtotal</span>
    //                                 <span>${order.subtotal.toFixed(2)}</span>
    //                             </div>
    //                             <div className="flex justify-between text-sm text-gray-600">
    //                                 <span>Shipping</span>
    //                                 <span>${order.shipping.toFixed(2)}</span>
    //                             </div>
    //                             <div className="flex justify-between text-sm text-gray-600">
    //                                 <span>Tax</span>
    //                                 <span>${order.tax.toFixed(2)}</span>
    //                             </div>
    //                             <div className="flex justify-between text-sm text-orange-600">
    //                                 <span>Discount</span>
    //                                 <span>-${order.discount.toFixed(2)}</span>
    //                             </div>
    //                             <div className="flex justify-between text-base sm:text-lg font-bold text-gray-900 pt-2 border-t border-orange-200">
    //                                 <span>Total</span>
    //                                 <span className="text-orange-600">${order.total.toFixed(2)}</span>
    //                             </div>
    //                         </div>
    //                     </div>

    //                     {/* Status Management */}
    //                     <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-4 sm:p-6">
    //                         <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
    //                             <Package size={20} />
    //                             Update Status
    //                         </h2>

    //                         <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 mb-4">
    //                             {statusOptions.map((status) => {
    //                                 const Icon = status?.icon;
    //                                 return (
    //                                     <button
    //                                         key={status.value}
    //                                         onClick={() => handleStatusChange(status.value)}
    //                                         className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 text-sm ${orderStatus === status.value
    //                                                 ? `${status.color} text-white shadow-md`
    //                                                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    //                                             }`}
    //                                     >
    //                                         {/* <Icon size={14} /> */}
    //                                         <span className="hidden sm:inline">{status.label}</span>
    //                                         <span className="sm:hidden">{status.label.split(' ')[0]}</span>
    //                                     </button>
    //                                 );
    //                             })}
    //                         </div>

    //                         {/* Tracking Number */}
    //                         <div className="border-t border-orange-200 pt-4">
    //                             <label className="block text-sm font-medium text-gray-700 mb-2">Tracking Number</label>
    //                             <div className="flex gap-2 sm:gap-3">
    //                                 <input
    //                                     type="text"
    //                                     value={trackingNumber}
    //                                     onChange={(e) => setTrackingNumber(e.target.value)}
    //                                     disabled={!isEditingTracking}
    //                                     className="flex-1 px-3 sm:px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 text-sm"
    //                                     placeholder="Enter tracking number"
    //                                 />
    //                                 <button
    //                                     onClick={handleUpdateTracking}
    //                                     className="px-3 sm:px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2 text-sm transition-colors"
    //                                 >
    //                                     <Edit size={16} />
    //                                     <span className="hidden sm:inline">{isEditingTracking ? 'Save' : 'Edit'}</span>
    //                                 </button>
    //                             </div>
    //                         </div>
    //                     </div>

    //                     {/* Timeline - Desktop */}
    //                     <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-orange-100 p-6">
    //                         <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
    //                             <Truck size={20} />
    //                             Order Timeline
    //                         </h2>

    //                         <div className="relative">
    //                             <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-orange-200"></div>

    //                             <div className="space-y-6">
    //                                 {timeline.map((event, index) => (
    //                                     <div key={index} className="relative flex gap-4">
    //                                         <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${event.completed ? 'bg-orange-500' : 'bg-gray-300'
    //                                             }`}>
    //                                             {event.completed ? (
    //                                                 <CheckCircle size={16} className="text-white" />
    //                                             ) : (
    //                                                 <div className="w-2 h-2 bg-white rounded-full"></div>
    //                                             )}
    //                                         </div>
    //                                         <div className="flex-1 pb-6">
    //                                             <div className="flex justify-between items-start mb-1">
    //                                                 <h3 className={`font-semibold ${event.completed ? 'text-gray-900' : 'text-gray-400'}`}>
    //                                                     {event.status}
    //                                                 </h3>
    //                                                 <span className="text-sm text-gray-500">{event.date} {event.time}</span>
    //                                             </div>
    //                                             <p className={`text-sm ${event.completed ? 'text-gray-600' : 'text-gray-400'}`}>
    //                                                 {event.description}
    //                                             </p>
    //                                         </div>
    //                                     </div>
    //                                 ))}
    //                             </div>
    //                         </div>
    //                     </div>
    //                 </div>

    //                 {/* Right Column - Customer & Details */}
    //                 <div className="space-y-4 sm:space-y-6">
    //                     {/* Customer Info */}
    //                     <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-4 sm:p-6">
    //                         <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
    //                             <User size={20} />
    //                             Customer
    //                         </h2>

    //                         <div className="flex items-center gap-3 mb-4 pb-4 border-b border-orange-100">
    //                             <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
    //                                 {order.customer.avatar}
    //                             </div>
    //                             <div className="min-w-0">
    //                                 <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{order.customer.name}</h3>
    //                                 <p className="text-xs sm:text-sm text-gray-500">Customer</p>
    //                             </div>
    //                         </div>

    //                         <div className="space-y-3">
    //                             <a href={`mailto:${order.customer.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 transition-colors break-all">
    //                                 <Mail size={16} className="flex-shrink-0" />
    //                                 <span className="truncate">{order.customer.email}</span>
    //                             </a>
    //                             <a href={`tel:${order.customer.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 transition-colors">
    //                                 <Phone size={16} className="flex-shrink-0" />
    //                                 {order.customer.phone}
    //                             </a>
    //                         </div>

    //                         <button
    //                             onClick={handleViewProfile}
    //                             className="w-full mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm transition-colors">
    //                             View Profile
    //                         </button>
    //                     </div>

    //                     {/* Addresses */}
    //                     <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-4 sm:p-6">
    //                         <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
    //                             <MapPin size={20} />
    //                             Addresses
    //                         </h2>

    //                         <div className="space-y-4">
    //                             <div>
    //                                 <h3 className="text-sm font-semibold text-gray-700 mb-2">Shipping Address</h3>
    //                                 <div className="text-sm text-gray-600 space-y-1 bg-orange-50 p-3 rounded-lg">
    //                                     <p>{order.shippingAddress.street}</p>
    //                                     <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
    //                                     <p>{order.shippingAddress.country}</p>
    //                                 </div>
    //                             </div>

    //                             <div>
    //                                 <h3 className="text-sm font-semibold text-gray-700 mb-2">Billing Address</h3>
    //                                 <div className="text-sm text-gray-600 space-y-1 bg-gray-50 p-3 rounded-lg">
    //                                     <p>{order.billingAddress.street}</p>
    //                                     <p>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zip}</p>
    //                                     <p>{order.billingAddress.country}</p>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     </div>

    //                     {/* Payment Info */}
    //                     <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-4 sm:p-6">
    //                         <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
    //                             <CreditCard size={20} />
    //                             Payment
    //                         </h2>
    //                         <div className="space-y-3 text-sm">
    //                             <div className="flex justify-between">
    //                                 <span className="text-gray-600">Method</span>
    //                                 <span className="font-medium text-gray-900">{order.payment.method}</span>
    //                             </div>
    //                             <div className="flex justify-between">
    //                                 <span className="text-gray-600">Card</span>
    //                                 <span className="font-medium text-gray-900">{order.payment.cardType} •••• {order.payment.last4}</span>
    //                             </div>
    //                             <div className="flex justify-between items-start">
    //                                 <span className="text-gray-600">Transaction ID</span>
    //                                 <span className="font-mono text-xs text-gray-900 text-right break-all">{order.payment.transactionId}</span>
    //                             </div>
    //                         </div>
    //                     </div>

    //                     {/* Internal Notes */}
    //                     <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-4 sm:p-6">
    //                         <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
    //                             <MessageSquare size={20} />
    //                             Notes
    //                         </h2>
    //                         <textarea
    //                             value={notes}
    //                             onChange={(e) => setNotes(e.target.value)}
    //                             placeholder="Add internal notes..."
    //                             className="w-full px-3 sm:px-4 py-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none text-sm"
    //                             rows={3}
    //                         ></textarea>
    //                         <button
    //                             onClick={handleSaveNotes}
    //                             className="mt-3 w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm transition-colors">
    //                             Save Notes
    //                         </button>
    //                     </div>

    //                     {/* Quick Actions */}
    //                     <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-4 sm:p-6">
    //                         <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
    //                         <div className="space-y-2">
    //                             <button
    //                                 onClick={handleSendEmail}
    //                                 className="w-full px-4 py-2 border border-orange-300 rounded-lg hover:bg-orange-50 text-left flex items-center gap-2 text-sm transition-colors">
    //                                 <Mail size={16} />
    //                                 Send Email
    //                             </button>
    //                             <button
    //                                 onClick={handleDuplicateOrder}
    //                                 className="w-full px-4 py-2 border border-orange-300 rounded-lg hover:bg-orange-50 text-left flex items-center gap-2 text-sm transition-colors">
    //                                 <Package size={16} />
    //                                 Duplicate Order
    //                             </button>
    //                             <button className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-left flex items-center gap-2 text-sm transition-colors"
    //                                 onClick={handleCancelOrder}>
    //                                 <XCircle size={16} />
    //                                 Cancel Order
    //                             </button>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>

    //             {/* Timeline - Mobile */}
    //             <div className="lg:hidden mt-4 sm:mt-6 bg-white rounded-xl shadow-sm border border-orange-100 p-4 sm:p-6">
    //                 <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
    //                     <Truck size={20} />
    //                     Order Timeline
    //                 </h2>

    //                 <div className="relative">
    //                     <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-orange-200"></div>

    //                     <div className="space-y-4">
    //                         {timeline.map((event, index) => (
    //                             <div key={index} className="relative flex gap-3">
    //                                 <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${event.completed ? 'bg-orange-500' : 'bg-gray-300'
    //                                     }`}>
    //                                     {event.completed ? (
    //                                         <CheckCircle size={14} className="text-white" />
    //                                     ) : (
    //                                         <div className="w-2 h-2 bg-white rounded-full"></div>
    //                                     )}
    //                                 </div>
    //                                 <div className="flex-1 pb-4">
    //                                     <div className="mb-1">
    //                                         <h3 className={`font-semibold text-sm ${event.completed ? 'text-gray-900' : 'text-gray-400'}`}>
    //                                             {event.status}
    //                                         </h3>
    //                                         <span className="text-xs text-gray-500">{event.date} {event.time}</span>
    //                                     </div>
    //                                     <p className={`text-xs ${event.completed ? 'text-gray-600' : 'text-gray-400'}`}>
    //                                         {event.description}
    //                                     </p>
    //                                 </div>
    //                             </div>


    {/* Refund Modal */ }
    {
        showRefundModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                <div className="bg-card rounded-2xl max-w-md w-full p-6 shadow-2xl border border-border scale-in-center overflow-hidden">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                            <AlertCircle className="text-rose-500" size={24} />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-xl font-black text-foreground">Process Refund</h3>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Order {order.orderNumber}</p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Refund Amount</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">₹</span>
                                <input
                                    type="number"
                                    value={refundAmount}
                                    onChange={(e) => setRefundAmount(e.target.value)}
                                    max={order.total}
                                    step="0.01"
                                    className="w-full pl-8 pr-4 py-3 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary outline-none font-bold transition-all"
                                />
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-2 font-medium">Maximum: ₹{order.total.toFixed(2)}</p>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Reason</label>
                            <select
                                value={refundReason}
                                onChange={(e) => setRefundReason(e.target.value)}
                                className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary outline-none font-medium transition-all"
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
                            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Notes (Optional)</label>
                            <textarea
                                value={refundNotes}
                                onChange={(e) => setRefundNotes(e.target.value)}
                                className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary outline-none resize-none font-medium transition-all"
                                rows={3}
                                placeholder="Additional details..."
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                        <button
                            onClick={() => setShowRefundModal(false)}
                            className="flex-1 px-4 py-3 border border-border rounded-xl hover:bg-muted text-sm font-bold transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleProcessRefund}
                            className="flex-1 px-4 py-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 text-sm font-bold transition-all shadow-lg shadow-rose-500/20"
                        >
                            Process Refund
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    {/* Profile Modal */ }
    {
        showProfileModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                <div className="bg-card rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-border scale-in-center overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black text-foreground">Customer Profile</h2>
                        <button
                            onClick={() => setShowProfileModal(false)}
                            className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground"
                        >
                            <XCircle size={24} />
                        </button>
                    </div>

                    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                        {/* Basic Info */}
                        <div className="bg-muted/30 rounded-2xl p-6 border border-border/50">
                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Basic Information</h3>
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-4xl shadow-xl shadow-primary/30 rotate-3">
                                    {order.customer.avatar}
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <p className="text-2xl font-black text-foreground">{order.customer.name}</p>
                                        <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1">Verified Customer</p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 text-sm font-medium text-foreground bg-card p-3 rounded-xl border border-border shadow-soft">
                                            <Mail size={18} className="text-primary" />
                                            <span className="truncate">{order.customer.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm font-medium text-foreground bg-card p-3 rounded-xl border border-border shadow-soft">
                                            <Phone size={18} className="text-primary" />
                                            <span>{order.customer.phone}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end mt-8">
                        <button
                            onClick={() => setShowProfileModal(false)}
                            className="w-full sm:w-auto px-12 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95"
                        >
                            Close Profile
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            {/* The actual page content follows below ... */}
            <div className="min-h-screen bg-background text-foreground p-3 sm:p-6 transition-colors duration-300">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-4 sm:mb-6">
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-3 sm:mb-4 transition-colors"
                        >
                            <ArrowLeft size={20} />
                            <span className="text-sm sm:text-base">Back</span>
                        </button>

                        <div className="bg-card rounded-xl shadow-soft border-none p-4 sm:p-6">
                            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-2">Order #{order.orderNumber}</h1>
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={14} className="sm:w-4 sm:h-4" />
                                                    {order.date}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={14} className="sm:w-4 sm:h-4" />
                                                    {order.time}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Status Badge - Mobile */}
                                        <div className="lg:hidden">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-white text-[10px] font-bold uppercase ${currentStatus?.color} shadow-lg shadow-${currentStatus?.color.split('-')[1]}-500/20`}>
                                                {React.createElement(currentStatus?.icon || Package, { size: 12 })}
                                                {currentStatus?.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Status Badge - Desktop */}
                                    <div className="hidden lg:block mt-3">
                                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-xs font-bold uppercase tracking-widest ${currentStatus?.color} shadow-lg shadow-${currentStatus?.color.split('-')[1]}-500/20`}>
                                            {React.createElement(currentStatus?.icon || Package, { size: 16 })}
                                            {currentStatus?.label}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-2 sm:gap-3">
                                    <button
                                        onClick={handlePrint}
                                        className="flex-1 sm:flex-none px-4 py-2 border border-border rounded-lg bg-background hover:bg-muted flex items-center justify-center gap-2 text-sm font-bold transition-all hover:shadow-soft"
                                    >
                                        <Printer size={16} />
                                        <span className="hidden sm:inline">Print</span>
                                    </button>
                                    <button
                                        onClick={handleGenerateBill}
                                        className="flex-1 sm:flex-none px-4 py-2 border border-border rounded-lg bg-background hover:bg-muted flex items-center justify-center gap-2 text-sm font-bold transition-all hover:shadow-soft">
                                        <Download size={16} />
                                        <span className="hidden sm:inline">Invoice</span>
                                    </button>
                                    <button
                                        onClick={() => setShowRefundModal(true)}
                                        className="flex-1 sm:flex-none px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 flex items-center justify-center gap-2 text-sm font-bold transition-all shadow-lg shadow-rose-500/20"
                                    >
                                        <RefreshCw size={16} />
                                        <span className="hidden sm:inline">Refund</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* Left Column - Order Management */}
                        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                            {/* Order Items */}
                            <div className="bg-card rounded-xl shadow-soft border-none p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-black text-foreground flex items-center gap-2">
                                    <ShoppingBag size={20} className="text-primary" />
                                    Order Items
                                </h2>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{order.items.length} items</span>
                            </div>

                            {/* Items List - Scrollable on mobile */}
                            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex gap-3 sm:gap-4 pb-4 border-b border-border last:border-0 hover:bg-muted/30 p-2 rounded-lg transition-colors group">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover flex-shrink-0 bg-muted group-hover:scale-105 transition-transform"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-foreground text-sm sm:text-base truncate group-hover:text-primary transition-colors">{item.name}</h3>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">SKU: {item.sku}</p>
                                            <div className="flex items-center justify-between mt-3">
                                                <p className="text-xs font-bold text-muted-foreground">
                                                    ₹{item.price.toFixed(2)} × {item.quantity}
                                                </p>
                                                <p className="font-black text-primary text-sm sm:text-base">
                                                    ₹{item.total.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="border-t border-border mt-4 pt-4 space-y-3">
                                <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span className="text-foreground">₹{order.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                    <span>Shipping</span>
                                    <span className="text-foreground">₹{order.shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                    <span>Tax</span>
                                    <span className="text-foreground">₹{order.tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-rose-500 uppercase tracking-widest">
                                    <span>Discount</span>
                                    <span>-₹{order.discount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-base sm:text-xl font-black text-foreground pt-3 border-t-2 border-dashed border-border">
                                    <span>Total</span>
                                    <span className="text-primary font-black">₹{order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Status Management */}
                        <div className="bg-card rounded-xl shadow-soft border-none p-4 sm:p-6">
                            <h2 className="text-lg sm:text-xl font-black text-foreground mb-4 flex items-center gap-2">
                                <Package size={20} className="text-primary" />
                                Update Status
                            </h2>

                            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 mb-6">
                                {statusOptions.map((status) => {
                                    return (
                                        <button
                                            key={status.value}
                                            onClick={() => handleStatusChange(status.value)}
                                            className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 text-xs uppercase tracking-widest ${orderStatus === status.value
                                                ? `${status.color} text-white shadow-lg shadow-${status.color.split('-')[1]}-500/20 scale-105`
                                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                                }`}
                                        >
                                            <span>{status.label}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Tracking Number */}
                            <div className="border-t border-border pt-6">
                                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Tracking Number</label>
                                <div className="flex gap-2 sm:gap-3">
                                    <input
                                        type="text"
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                        disabled={!isEditingTracking}
                                        className="flex-1 px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary outline-none disabled:opacity-50 text-sm font-medium transition-all"
                                        placeholder="Enter tracking number"
                                    />
                                    <button
                                        onClick={handleUpdateTracking}
                                        className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20"
                                    >
                                        <Edit size={16} />
                                        <span>{isEditingTracking ? 'Save' : 'Edit'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Timeline - Desktop */}
                        <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-orange-100 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <Truck size={20} />
                                Order Timeline
                            </h2>

                            <div className="relative">
                                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-orange-200"></div>

                                <div className="space-y-6">
                                    {timeline.map((event, index) => (
                                        <div key={index} className="relative flex gap-4">
                                            <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${event.completed ? 'bg-orange-500' : 'bg-gray-300'
                                                }`}>
                                                {event.completed ? (
                                                    <CheckCircle size={16} className="text-white" />
                                                ) : (
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                )}
                                            </div>
                                            <div className="flex-1 pb-6">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className={`font-semibold ${event.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                                                        {event.status}
                                                    </h3>
                                                    <span className="text-sm text-gray-500">{event.date} {event.time}</span>
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
                    </div>

                    {/* Right Column - Customer & Details */}
                    <div className="space-y-4 sm:space-y-6">
                        {/* Customer Info */}
                        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-4 sm:p-6">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <User size={20} />
                                Customer
                            </h2>

                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-orange-100">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                    {order.customer.avatar}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{order.customer.name}</h3>
                                    <p className="text-xs sm:text-sm text-gray-500">Customer</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <a href={`mailto:${order.customer.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 transition-colors break-all">
                                    <Mail size={16} className="flex-shrink-0" />
                                    <span className="truncate">{order.customer.email}</span>
                                </a>
                                <a href={`tel:${order.customer.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 transition-colors">
                                    <Phone size={16} className="flex-shrink-0" />
                                    {order.customer.phone}
                                </a>
                            </div>

                            <button
                                onClick={handleViewProfile}
                                className="w-full mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm transition-colors">
                                View Profile
                            </button>
                        </div>

                        {/* Addresses */}
                        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-4 sm:p-6">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin size={20} />
                                Addresses
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Shipping Address</h3>
                                    <div className="text-sm text-gray-600 space-y-1 bg-orange-50 p-3 rounded-lg">
                                        <p>{order.shippingAddress.street}</p>
                                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                                        <p>{order.shippingAddress.country}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Billing Address</h3>
                                    <div className="text-sm text-gray-600 space-y-1 bg-gray-50 p-3 rounded-lg">
                                        <p>{order.billingAddress.street}</p>
                                        <p>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zip}</p>
                                        <p>{order.billingAddress.country}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-4 sm:p-6">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <CreditCard size={20} />
                                Payment
                            </h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Method</span>
                                    <span className="font-medium text-gray-900">{order.payment.method}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Card</span>
                                    <span className="font-medium text-gray-900">{order.payment.cardType} •••• {order.payment.last4}</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-gray-600">Transaction ID</span>
                                    <span className="font-mono text-xs text-gray-900 text-right break-all">{order.payment.transactionId}</span>
                                </div>
                            </div>
                        </div>

                        {/* Internal Notes */}
                        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-4 sm:p-6">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <MessageSquare size={20} />
                                Notes
                            </h2>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add internal notes..."
                                className="w-full px-3 sm:px-4 py-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none text-sm"
                                rows={3}
                            ></textarea>
                            <button
                                onClick={handleSaveNotes}
                                className="mt-3 w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm transition-colors">
                                Save Notes
                            </button>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-4 sm:p-6">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                            <div className="space-y-2">
                                <button
                                    onClick={handleSendEmail}
                                    className="w-full px-4 py-2 border border-orange-300 rounded-lg hover:bg-orange-50 text-left flex items-center gap-2 text-sm transition-colors">
                                    <Mail size={16} />
                                    Send Email
                                </button>
                                <button
                                    onClick={handleDuplicateOrder}
                                    className="w-full px-4 py-2 border border-orange-300 rounded-lg hover:bg-orange-50 text-left flex items-center gap-2 text-sm transition-colors">
                                    <Package size={16} />
                                    Duplicate Order
                                </button>
                                <button className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-left flex items-center gap-2 text-sm transition-colors"
                                    onClick={handleCancelOrder}>
                                    <XCircle size={16} />
                                    Cancel Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline - Mobile */}
                <div className="lg:hidden mt-4 sm:mt-6 bg-white rounded-xl shadow-sm border border-orange-100 p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Truck size={20} />
                        Order Timeline
                    </h2>

                    <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-orange-200"></div>

                        <div className="space-y-4">
                            {timeline.map((event, index) => (
                                <div key={index} className="relative flex gap-3">
                                    <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${event.completed ? 'bg-orange-500' : 'bg-gray-300'
                                        }`}>
                                        {event.completed ? (
                                            <CheckCircle size={14} className="text-white" />
                                        ) : (
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 pb-4">
                                        <div className="mb-1">
                                            <h3 className={`font-semibold text-sm ${event.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {event.status}
                                            </h3>
                                            <span className="text-xs text-gray-500">{event.date} {event.time}</span>
                                        </div>
                                        <p className={`text-xs ${event.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                                            {event.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Refund Modal */}
                {showRefundModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <AlertCircle className="text-red-600" size={20} />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Process Refund</h3>
                                    <p className="text-xs sm:text-sm text-gray-500 truncate">Order {order.orderNumber}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Refund Amount</label>
                                    <div className="relative">
                                        <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="number"
                                            value={refundAmount}
                                            onChange={(e) => setRefundAmount(e.target.value)}
                                            max={order.total}
                                            step="0.01"
                                            className="w-full pl-10 pr-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Maximum: ${order.total.toFixed(2)}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                                    <select
                                        value={refundReason}
                                        onChange={(e) => setRefundReason(e.target.value)}
                                        className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
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
                                        className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none text-sm"
                                        rows={3}
                                        placeholder="Additional details..."
                                    ></textarea>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowRefundModal(false)}
                                    className="flex-1 px-4 py-2 border border-orange-300 rounded-lg hover:bg-orange-50 text-sm transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleProcessRefund}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm transition-colors"
                                >
                                    Process Refund
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div >
        </>
    );
}
export default SingleOrderPage;