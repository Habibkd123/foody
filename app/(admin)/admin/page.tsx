


"use client";
import React, { useState, useEffect } from 'react';
import {
  User,
  CheckSquare,
  Map,
  Clock,
  UserCheck,
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Sun,
  Moon,
  LogOut,
  BarChart3,
  Users,
  MapPin,
  DollarSign,
  Shield
} from 'lucide-react';
import { useSidebar } from '@/context/SidebarContext';




// Stats Card Component
const StatsCard = ({ stat }: any) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
    <div className="flex items-center space-x-4">
      <div className={`p-3 rounded-lg ${stat.color} transition-transform duration-300 hover:scale-110`}>
        <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
        <button className={`flex items-center space-x-1 mt-2 text-sm ${stat.linkColor} hover:underline transition-colors duration-200`}>
          <span>{stat.linkText}</span>
          <ArrowRight className="h-3 w-3 transition-transform duration-200 hover:translate-x-1" />
        </button>
      </div>
    </div>
  </div>
);

// Stats Grid Component
const StatsGrid = () => {
  const dashboardStats = [
    {
      title: 'Users',
      value: '95',
      icon: User,
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
      linkText: 'Learn more',
      linkColor: 'text-blue-600'
    },
    {
      title: 'Missions',
      value: '47',
      icon: CheckSquare,
      color: 'bg-green-100',
      iconColor: 'text-green-600',
      linkText: 'Learn more',
      linkColor: 'text-green-600'
    },
    {
      title: 'Maps',
      value: '8',
      icon: Map,
      color: 'bg-purple-100',
      iconColor: 'text-purple-600',
      linkText: 'Learn more',
      linkColor: 'text-red-600'
    },
    {
      title: 'Products',
      value: '10',
      icon: Clock,
      color: 'bg-orange-100',
      iconColor: 'text-orange-600',
      linkText: 'Learn more',
      linkColor: 'text-green-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {dashboardStats.map((stat, index) => (
        <StatsCard key={index} stat={stat} />
      ))}
    </div>
  );
};

// User Avatar Component
const UserAvatar = ({ user }: any) => (
  <div className="flex items-center">
    <div className="flex-shrink-0 h-10 w-10">
      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
        <span className="text-sm font-medium text-blue-600">{user?.avatar}</span>
      </div>
    </div>
    <div className="ml-4">
      <div className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{user?.daysAgo}</div>
    </div>
  </div>
);

// Status Badge Component
const StatusBadge = ({ status }: any) => (
  <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
    {status}
  </span>
);

// Table Row Component
const TableRow = ({ user }: any) => (
  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
    <td className="px-6 py-4 whitespace-nowrap">
      <UserAvatar user={user} />
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900 dark:text-white">{user?.email}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className="text-sm text-gray-700 dark:text-gray-300">{user?.role}</span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900 dark:text-white">{user?.signupDate}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <StatusBadge status={user?.status} />
    </td>
  </tr>
);

// Latest Signups Table Component
const LatestSignupsTable = () => {
  const recentSignups = [
    {
      id: 1,
      name: 'Khijar Na',
      email: 'khijr@gmail.com',
      role: 'user',
      signupDate: 'Jul 18, 2025',
      status: 'Active',
      avatar: 'KN',
      daysAgo: '22 days ago'
    },
    {
      id: 2,
      name: 'opi0 kd03',
      email: 'kd03@gmail.com',
      role: 'user',
      signupDate: 'Jul 18, 2025',
      status: 'Active',
      avatar: 'OK',
      daysAgo: '22 days ago'
    },
    {
      id: 3,
      name: 'op klop',
      email: 'kd010@gmail.com',
      role: 'user',
      signupDate: 'Jul 18, 2025',
      status: 'Active',
      avatar: 'OK',
      daysAgo: '22 days ago'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Latest Signups</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Recently registered users</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <UserCheck className="h-4 w-4" />
            <span>10 new users</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Signup Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {recentSignups.map((user) => (
              <TableRow key={user?.id} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main Dashboard Component
const MainDashboard = ({ activeTab }: any) => (
  <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">

    {activeTab === 'dashboard' && (
      <div className="animate-fadeIn">
        <StatsGrid />
        <LatestSignupsTable />
      </div>
    )}

    {activeTab !== 'dashboard' && (
      <div className="flex items-center justify-center h-96 animate-fadeIn">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            This section is under development.
          </p>
        </div>
      </div>
    )}
  </main>
);

// Main App Component
export default function RockerDashboard() {
  const { isExpanded, isMobile } = useSidebar();
  const [activeTab, setActiveTab] = useState('dashboard');

  return (

    <MainDashboard activeTab={activeTab} />

  );
}