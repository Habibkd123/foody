import React, { useState } from 'react';
import { EyeIcon, DownloadIcon, PlusIcon, MinusIcon } from '../../icons';

interface WalletTransaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: 'credit' | 'debit';
  amount: number;
  balance: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
  reference?: string;
}

interface UserWallet {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  balance: number;
  lastTransaction: string;
  totalTransactions: number;
  isActive: boolean;
}

const WalletManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'wallets' | 'transactions'>('wallets');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Mock data for user wallets
  const [userWallets] = useState<UserWallet[]>([
    {
      id: '1',
      userId: 'user-1',
      userName: 'John Doe',
      userEmail: 'john.doe@example.com',
      balance: 1250.75,
      lastTransaction: '2024-01-20T14:30:00Z',
      totalTransactions: 15,
      isActive: true
    },
    {
      id: '2',
      userId: 'user-2',
      userName: 'Jane Smith',
      userEmail: 'jane.smith@example.com',
      balance: 0,
      lastTransaction: '2024-01-18T09:15:00Z',
      totalTransactions: 8,
      isActive: true
    },
    {
      id: '3',
      userId: 'user-3',
      userName: 'Mike Johnson',
      userEmail: 'mike.johnson@example.com',
      balance: 500.00,
      lastTransaction: '2024-01-19T16:45:00Z',
      totalTransactions: 12,
      isActive: false
    }
  ]);

  // Mock data for wallet transactions
  const [transactions] = useState<WalletTransaction[]>([
    {
      id: '1',
      userId: 'user-1',
      userName: 'John Doe',
      userEmail: 'john.doe@example.com',
      type: 'credit',
      amount: 1000.00,
      balance: 1250.75,
      description: 'Wallet recharge via credit card',
      status: 'completed',
      createdAt: '2024-01-20T14:30:00Z',
      reference: 'TXN-2024-001'
    },
    {
      id: '2',
      userId: 'user-1',
      userName: 'John Doe',
      userEmail: 'john.doe@example.com',
      type: 'debit',
      amount: 99.99,
      balance: 250.75,
      description: 'Purchase: Wireless Bluetooth Headphones',
      status: 'completed',
      createdAt: '2024-01-20T15:45:00Z',
      reference: 'ORD-2024-001'
    },
    {
      id: '3',
      userId: 'user-2',
      userName: 'Jane Smith',
      userEmail: 'jane.smith@example.com',
      type: 'credit',
      amount: 500.00,
      balance: 500.00,
      description: 'Wallet recharge via PayPal',
      status: 'completed',
      createdAt: '2024-01-18T09:15:00Z',
      reference: 'TXN-2024-002'
    },
    {
      id: '4',
      userId: 'user-2',
      userName: 'Jane Smith',
      userEmail: 'jane.smith@example.com',
      type: 'debit',
      amount: 500.00,
      balance: 0,
      description: 'Purchase: Premium Cotton T-Shirt',
      status: 'completed',
      createdAt: '2024-01-18T10:30:00Z',
      reference: 'ORD-2024-002'
    },
    {
      id: '5',
      userId: 'user-3',
      userName: 'Mike Johnson',
      userEmail: 'mike.johnson@example.com',
      type: 'credit',
      amount: 750.00,
      balance: 500.00,
      description: 'Wallet recharge via bank transfer',
      status: 'pending',
      createdAt: '2024-01-19T16:45:00Z',
      reference: 'TXN-2024-003'
    }
  ]);

  const filteredWallets = userWallets.filter(wallet =>
    wallet.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wallet.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || transaction.status === selectedStatus;
    const matchesType = selectedType === 'all' || transaction.type === selectedType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    return type === 'credit' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
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

  const getTotalBalance = () => {
    return userWallets.reduce((total, wallet) => total + wallet.balance, 0);
  };

  const getTotalTransactions = () => {
    return transactions.length;
  };

  const getPendingTransactions = () => {
    return transactions.filter(t => t.status === 'pending').length;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Wallet Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage user wallets and view transaction history
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Balance</div>
          <div className="text-2xl font-bold text-green-600">{formatPrice(getTotalBalance())}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Wallets</div>
          <div className="text-2xl font-bold text-blue-600">{userWallets.filter(w => w.isActive).length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Transactions</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{getTotalTransactions()}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Transactions</div>
          <div className="text-2xl font-bold text-yellow-600">{getPendingTransactions()}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('wallets')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'wallets'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              User Wallets
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'transactions'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Transaction History
            </button>
          </nav>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder={activeTab === 'wallets' ? "Search users..." : "Search transactions..."}
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

          {activeTab === 'transactions' && (
            <div className="flex gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200">
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Credit
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200">
            <DownloadIcon className="w-5 h-5 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'wallets' ? (
        /* User Wallets Table */
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Transactions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Last Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredWallets.map((wallet) => (
                  <tr key={wallet.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {wallet.userName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {wallet.userEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatPrice(wallet.balance)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {wallet.totalTransactions} transactions
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(wallet.lastTransaction)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        wallet.isActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {wallet.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                          <PlusIcon className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                          <MinusIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Transaction History Table */
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
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
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {transaction.userName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {transaction.userEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(transaction.type)}`}>
                        {transaction.type === 'credit' ? '+' : '-'} {transaction.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        transaction.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}{formatPrice(transaction.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatPrice(transaction.balance)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(transaction.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        {transaction.reference && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {transaction.reference}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {((activeTab === 'wallets' && filteredWallets.length === 0) || 
        (activeTab === 'transactions' && filteredTransactions.length === 0)) && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No {activeTab === 'wallets' ? 'wallets' : 'transactions'} found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default WalletManagement; 