import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { ChevronLeftIcon, DownloadIcon, UserIcon } from '../../icons';
import { useOrderService } from '../../apiservices/useOrderService';

// interface OrderItem {
//   id: string;
//   productId: string;
//   productName: string;
//   quantity: number;
//   price: number;
//   total: number;
//   image?: string;
//   name?: string;
//   mainImage?: string;
// }

// interface OrderStatus {
//   status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
//   timestamp: string;
//   note?: string;
// }

// interface Order {
//   id: string;
//   orderNumber: string;
//   customerName: string;
//   customerEmail: string;
//   customerPhone?: string;
//   status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
//   total: number;
//   subtotal: number;
//   tax: number;
//   shipping: number;
//   discount: number;
//   items: OrderItem[];
//   statusHistory: OrderStatus[];
//   createdAt: string;
//   updatedAt: string;
//   shippingAddress: {
//     street: string;
//     city: string;
//     state: string;
//     zipCode: string;
//     country: string;
//   };
//   billingAddress?: {
//     street: string;
//     city: string;
//     state: string;
//     zipCode: string;
//     country: string;
//   };
//   paymentMethod: string;
//   paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
//   notes?: string;
//   internalNotes?: string;
// }



const OrderDetails: React.FC = () => {
  const { getOrder, addInternalNote } = useOrderService();
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [newInternalNote, setNewInternalNote] = useState('');

  useEffect(() => {
    if (orderId) fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const data = await getOrder(orderId as string);
      setOrder(data.data);
    } catch {
      setOrder(null);
    }
    setLoading(false);
  };

  const handleAddInternalNote = async () => {
    if (!order || !newInternalNote.trim()) return;
    try {
      const updatedOrder = await addInternalNote(order.id as string, newInternalNote);
      setOrder(updatedOrder);
      setNewInternalNote('');
    } catch {
      // handle error
    }
  };

  const handleDownloadInvoice = async () => {
    // console.log("downloadInvoicedownloadInvoicedownloadInvoicedownloadInvoice");
    // // if (!order) return;
    // try {
    //   const blob = await downloadInvoice(order.id);
    //   const url = window.URL.createObjectURL(blob);
    //   const a = document.createElement('a');
    //   a.href = url;
    //   a.download = `invoice-${order.orderNumber}.pdf`;
    //   document.body.appendChild(a);
    //   a.click();
    //   a.remove();
    //   window.URL.revokeObjectURL(url);
    // } catch (error) {
    //   alert('Failed to download invoice');
    // }
  };

  if (loading) return <div>Loading...</div>;
  if (!order) return <div>Order not found</div>;

  // const getStatusColor = (status: Order['status']) => {
  //   const colors = {
  //     pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  //     processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  //     shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  //     delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  //     cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  //     returned: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
  //   };
  //   return colors[status];
  // };



  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/admin/orders"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Order {order.orderNumber}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadInvoice}
              className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <DownloadIcon className="w-5 h-5 mr-2" />
              Download Invoice
            </button>
            {/* <Link
              to={`/admin/orders/${orderId}/edit`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <PencilIcon className="w-5 h-5 mr-2" />
              Edit Order
            </Link> */}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          {/* <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Status</h2>
            <div className="flex items-center justify-between mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="ml-2">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
              </span>
              <select
                value={order.status}
                onChange={(e) => handleUpdateStatus(e.target.value as Order['status'])}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="returned">Returned</option>
              </select>
            </div>
  
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note for status update..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                rows={2}
              />
            </div>
          </div> */}

          {/* Order Items */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item : any) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <img
                    src={item.product?.mainImage || '/images/product/product-01.jpg'}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </h3>
                    {/* <p className="text-sm text-gray-500 dark:text-gray-400">
                      Quantity: {item.quantity}
                    </p> */}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatPrice(item.price)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Total: {formatPrice(item.total)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <UserIcon className="w-5 h-5 mr-2" />
              Customer Information
            </h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{order.customer?.fullName}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{order.customer?.email}</div>
                {order.customer?.phone && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">{order.customer?.phone}</div>
                )}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {/* <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <MapPinIcon className="w-5 h-5 mr-2" />
              Shipping Address
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <div>{order.shippingAddress.street}</div>
              <div>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</div>
              <div>{order.shippingAddress.country}</div>
            </div>
          </div> */}

          {/* Payment Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Payment Information
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Method:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                <span className={`text-sm font-medium ${order.paymentStatus === 'paid' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{formatPrice(order.subtotal)}</span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tax:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{formatPrice(order.tax)}</span>
                </div>
              )}
              {order.shipping > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Shipping:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{formatPrice(order.shipping)}</span>
                </div>
              )}
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Discount:</span>
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                <div className="flex justify-between">
                  <span className="text-base font-semibold text-gray-900 dark:text-white">Total:</span>
                  <span className="text-base font-semibold text-gray-900 dark:text-white">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Internal Notes */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Internal Notes</h2>
            {order.internalNotes && (
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 whitespace-pre-line">
                {order.internalNotes}
              </div>
            )}
            <div className="space-y-2">
              <textarea
                value={newInternalNote}
                onChange={(e) => setNewInternalNote(e.target.value)}
                placeholder="Add internal note..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                rows={3}
              />
              <button
                onClick={handleAddInternalNote}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails; 