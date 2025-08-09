import React, { useState } from 'react';
import { PlusIcon, DownloadIcon } from '../../icons';

interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  balance: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
  reference?: string;
}

const UserWallet: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'recharge'>('overview');
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('credit_card');

  // Mock user wallet data
  const [walletBalance] = useState(1250.75);
  const [isRecharging, setIsRecharging] = useState(false);

  // Mock transaction history
  const [transactions] = useState<WalletTransaction[]>([
    {
      id: '1',
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
      type: 'credit',
      amount: 500.00,
      balance: 350.74,
      description: 'Wallet recharge via PayPal',
      status: 'completed',
      createdAt: '2024-01-18T09:15:00Z',
      reference: 'TXN-2024-002'
    },
    {
      id: '4',
      type: 'debit',
      amount: 150.00,
      balance: 250.74,
      description: 'Purchase: Premium Cotton T-Shirt',
      status: 'completed',
      createdAt: '2024-01-18T10:30:00Z',
      reference: 'ORD-2024-002'
    },
    {
      id: '5',
      type: 'credit',
      amount: 750.00,
      balance: 400.74,
      description: 'Wallet recharge via bank transfer',
      status: 'pending',
      createdAt: '2024-01-19T16:45:00Z',
      reference: 'TXN-2024-003'
    }
  ]);

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

  const handleRecharge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rechargeAmount || parseFloat(rechargeAmount) <= 0) return;

    setIsRecharging(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsRecharging(false);
    setRechargeAmount('');
    setActiveTab('overview');
    
    // In a real app, you would update the wallet balance here
    alert('Recharge request submitted successfully!');
  };

  const getTotalCredits = () => {
    return transactions
      .filter(t => t.type === 'credit' && t.status === 'completed')
      .reduce((total, t) => total + t.amount, 0);
  };

  const getTotalDebits = () => {
    return transactions
      .filter(t => t.type === 'debit' && t.status === 'completed')
      .reduce((total, t) => total + t.amount, 0);
  };

  const getPendingAmount = () => {
    return transactions
      .filter(t => t.status === 'pending')
      .reduce((total, t) => total + t.amount, 0);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          My Wallet
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your wallet balance and view transaction history
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Overview
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
            <button
              onClick={() => setActiveTab('recharge')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'recharge'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Recharge Wallet
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Balance Card */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-medium mb-2">Current Balance</h2>
                <div className="text-3xl font-bold">{formatPrice(walletBalance)}</div>
                <p className="text-blue-100 mt-2">Available for purchases</p>
              </div>
              <button
                onClick={() => setActiveTab('recharge')}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Recharge
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Credits</div>
              <div className="text-2xl font-bold text-green-600">{formatPrice(getTotalCredits())}</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Spent</div>
              <div className="text-2xl font-bold text-red-600">{formatPrice(getTotalDebits())}</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</div>
              <div className="text-2xl font-bold text-yellow-600">{formatPrice(getPendingAmount())}</div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Transactions</h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'credit' ? (
                          <PlusIcon className="w-4 h-4 text-green-600" />
                        ) : (
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {transaction.description}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(transaction.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        transaction.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}{formatPrice(transaction.amount)}
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('transactions')}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                View all transactions →
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Transaction History</h2>
            <button className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200">
              <DownloadIcon className="w-5 h-5 mr-2" />
              Export
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Transaction
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
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {transaction.description}
                          </div>
                          {transaction.reference && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {transaction.reference}
                            </div>
                          )}
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'recharge' && (
        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Recharge Your Wallet</h2>
            
            <form onSubmit={handleRecharge} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount to Recharge
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(e.target.value)}
                    placeholder="0.00"
                    min="1"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Method
                </label>
                <select
                  value={selectedPaymentMethod}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Current Balance:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatPrice(walletBalance)}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600 dark:text-gray-400">Recharge Amount:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {rechargeAmount ? formatPrice(parseFloat(rechargeAmount) || 0) : '$0.00'}
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 mt-2 pt-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-gray-900 dark:text-white">New Balance:</span>
                    <span className="text-blue-600 dark:text-blue-400">
                      {rechargeAmount ? formatPrice(walletBalance + (parseFloat(rechargeAmount) || 0)) : formatPrice(walletBalance)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isRecharging || !rechargeAmount || parseFloat(rechargeAmount) <= 0}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                {isRecharging ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Recharge Wallet'
                )}
              </button>
            </form>

            <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
              <p>• Recharge amounts are processed immediately</p>
              <p>• You can use your wallet balance for all purchases</p>
              <p>• Refunds are credited back to your wallet</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserWallet; 