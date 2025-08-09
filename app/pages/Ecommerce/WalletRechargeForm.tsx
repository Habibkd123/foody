import React, { useState } from 'react';
import { PlusIcon, UserIcon } from '../../icons';

interface User {
  id: string;
  name: string;
  email: string;
  currentBalance: number;
}

const WalletRechargeForm: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock users data
  const [users] = useState<User[]>([
    {
      id: 'user-1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      currentBalance: 1250.75
    },
    {
      id: 'user-2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      currentBalance: 0
    },
    {
      id: 'user-3',
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      currentBalance: 500.00
    },
    {
      id: 'user-4',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      currentBalance: 750.25
    }
  ]);

  const selectedUserData = users.find(user => user.id === selectedUser);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser || !amount || parseFloat(amount) <= 0) {
      alert('Please fill in all required fields with valid values.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    
    // Reset form
    setSelectedUser('');
    setAmount('');
    setDescription('');
    
    alert('Wallet credit added successfully!');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Add Wallet Credit
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Add credit to a user's wallet balance
        </p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select User <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Choose a user...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email}) - Balance: {formatPrice(user.currentBalance)}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected User Info */}
            {selectedUserData && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {selectedUserData.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedUserData.email}
                    </div>
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      Current Balance: {formatPrice(selectedUserData.currentBalance)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Credit Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Enter the amount to add to the user's wallet
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Reason for adding credit (optional)"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Summary */}
            {selectedUserData && amount && parseFloat(amount) > 0 && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Transaction Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">User:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedUserData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Current Balance:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatPrice(selectedUserData.currentBalance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Credit Amount:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">+{formatPrice(parseFloat(amount))}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                    <div className="flex justify-between font-medium">
                      <span className="text-gray-900 dark:text-white">New Balance:</span>
                      <span className="text-blue-600 dark:text-blue-400">
                        {formatPrice(selectedUserData.currentBalance + parseFloat(amount))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setSelectedUser('');
                  setAmount('');
                  setDescription('');
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !selectedUser || !amount || parseFloat(amount) <= 0}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add Credit
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Information */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            Important Information
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Credits are added immediately to the user's wallet</li>
            <li>• The transaction will be recorded in the wallet history</li>
            <li>• Users will receive a notification about the credit</li>
            <li>• This action cannot be undone automatically</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WalletRechargeForm; 