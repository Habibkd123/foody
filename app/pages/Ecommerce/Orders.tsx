import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { EyeIcon, DownloadIcon, PencilIcon } from '../../icons';
import { useOrderService } from '../../apiservices/useOrderService';

// interface OrderItem {
//   id: string;
//   productId: string;
//   productName: string;
//   quantity: number;
//   price: number;
//   total: number;
// }

// interface Order {
//   id: string;
//   orderNumber: string;
//   customerName: string;
//   customerEmail: string;
//   customerFullName: string;
//   status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
//   total: number;
//   items: OrderItem[];
//   createdAt: string;
//   updatedAt: string;
//   shippingAddress: string;
//   paymentMethod: string;
//   notes?: string;
// }

const Orders: React.FC = () => {
  const { getOrders } = useOrderService();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };


  const [searchTerm, setSearchTerm] = useState('');
  const selectedStatus = 'all';
  // const [selectedStatus, setSelectedStatus] = useState('all');
  // const [selectedDateRange, setSelectedDateRange] = useState('all');

  // const statusOptions = [
  //   { value: 'all', label: 'All Status' },
  //   { value: 'pending', label: 'Pending' },
  //   { value: 'processing', label: 'Processing' },
  //   { value: 'shipped', label: 'Shipped' },
  //   { value: 'delivered', label: 'Delivered' },
  //   { value: 'cancelled', label: 'Cancelled' },
  //   { value: 'returned', label: 'Returned' }
  // ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = () => {
    // const colors = {
    //   pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    //   processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    //   shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    //   delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    //   cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    //   returned: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    // };
    // return colors[status];

    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  };

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

  // const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
  //   try {
  //     const data = {
  //       status: newStatus
  //     }
  //     const updatedOrder = await OrderService.updateOrderStatus(orderId, data);
  //     setOrders(prev =>
  //       prev.map(order =>
  //         order.id === orderId ? { ...order, status: newStatus, updatedAt: new Date().toISOString() } : order
  //       )
  //     );
  //   } catch (err: any) {
  //     setError(err.message || 'Failed to update order status');
  //   }
  // };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Orders
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage customer orders, track shipments, and process returns
        </p>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search orders, customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Filters */}
          {/* <div className="flex gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div> */}
        </div>

        <div className="flex gap-2">
          <button className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200">
            <DownloadIcon className="w-5 h-5 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {order.orderNumber}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {order.items.length} items
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {order.customer?.fullName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {order.customer?.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {/* <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)} */}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
                        {"PAID"}
                      </span>
                      {/* <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                        className="text-xs border border-gray-300 dark:border-gray-600 rounded px-1 py-0.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      >
                        {statusOptions.slice(1).map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select> */}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatPrice(order.total)}
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(order.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </Link>
                      <button
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        title="Download Invoice"
                      >
                        <DownloadIcon className="w-4 h-4" />
                      </button>
                      <button
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        title="Edit Order"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No orders found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Orders</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{orders.length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">{orders.filter(o => o.status === 'pending').length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Processing</div>
          <div className="text-2xl font-bold text-blue-600">{orders.filter(o => o.status === 'processing').length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Delivered</div>
          <div className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'delivered').length}</div>
        </div>
      </div>
    </div>
  );
};

export default Orders; 