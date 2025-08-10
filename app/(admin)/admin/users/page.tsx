
"use client";
import React, { useEffect } from 'react'
import { UserCheck } from 'lucide-react';

const StatusBadge = ({ status }: any) => (
  <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
    {status}
  </span>
);
// User Avatar Component
const UserAvatar = ({ user }: any) => (
  <div className="flex items-center">
    <div className="flex-shrink-0 h-10 w-10">
      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
        <span className="text-sm font-medium text-blue-600">{user.avatar}</span>
      </div>
    </div>
    <div className="ml-4">
      <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{user.daysAgo}</div>
    </div>
  </div>
);

// Table Row Component
const TableRow = ({ user }: any) => (
  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
    <td className="px-6 py-4 whitespace-nowrap">
      <UserAvatar user={user} />
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900 dark:text-white">{user.email}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className="text-sm text-gray-700 dark:text-gray-300">{user.role}</span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900 dark:text-white">{new Date(user.createdAt).toLocaleDateString()}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <StatusBadge status={user.status||'Active'} />
    </td>
  </tr>
);

// Latest Signups Table Component
const LatestSignupsTable = ({user}:any) => {
  // const recentSignups = [
  //   {
  //     id: 1,
  //     name: 'Khijar Na',
  //     email: 'khijr@gmail.com',
  //     role: 'user',
  //     signupDate: 'Jul 18, 2025',
  //     status: 'Active',
  //     avatar: 'KN',
  //     daysAgo: '22 days ago'
  //   },
  //   {
  //     id: 2,
  //     name: 'opi0 kd03',
  //     email: 'kd03@gmail.com',
  //     role: 'user',
  //     signupDate: 'Jul 18, 2025',
  //     status: 'Active',
  //     avatar: 'OK',
  //     daysAgo: '22 days ago'
  //   },
  //   {
  //     id: 3,
  //     name: 'op klop',
  //     email: 'kd010@gmail.com',
  //     role: 'user',
  //     signupDate: 'Jul 18, 2025',
  //     status: 'Active',
  //     avatar: 'OK',
  //     daysAgo: '22 days ago'
  //   }
  // ];

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
            <span>{user?.length} new users</span>
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
            {Array.isArray(user) && user.map((user:any) => (
              <TableRow key={user._id} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
const page = () => {
  const [user, setUser] = React.useState(null);
  // This is where you can fetch data or perform any other logic if needed
  const getUserData = async () => {
    try {
      const result = await fetch("/api/auth", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data = await result.json();
      console.log("Fetched user data:", data);
      if (data.success) {
        setUser(data.users);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
     
    }
  }
  useEffect(() => {
    getUserData();
  }, []);
  return (
    <div className='p-5'>
      <LatestSignupsTable user={user} />
    </div>
  )
}

export default page
