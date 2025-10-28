import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import Badge from "../components/ui/badge/Badge";
import { Dropdown } from "../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../components/ui/dropdown/DropdownItem";
import { HorizontaLDots } from "../icons";
import { useUsersService } from "../apiservices/useUserService";
import { UserCircle2Icon } from "lucide-react";
import { useAuthService } from "../apiservices/useAuthService";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar: string;
  phone: string;
  address?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  isNotificationOn: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  fullName: string;
  walletBalance: {
    _id: string;
    userId: string;
    balance: number;
    currency: string;
    isActive: boolean;
    totalCredits: number;
    totalDebits: number;
    lowBalanceThreshold: number;
    autoRechargeEnabled: boolean;
    transactions: any[];
    createdAt: string;
    updatedAt: string;
    transactionCount: number;
    isLowBalance: boolean;
    lastTransaction: any;
    id: string;
  } | null;
  id: string;
  friendshipStatus: string;
  isSender: boolean;
}

export default function Users() {
  const { getUsers } = useUsersService();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [usersData, setUsersData] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const usersPerPage = 10;
  let API_URL = useAuthService().API_URL;
  useEffect(() => {
    setLoading(true);

    getUsers()
      .then((response: any) => {
        // The API returns { data: User[], total: number, page: number, limit: number }
        setUsersData(response.data.users);
        console.log("response.data", response.data);
        setTotalPages(Math.ceil(response.data.pagination.total / usersPerPage));
        setError(null);
      })
      .catch((error:any) => {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users");
        setUsersData([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status: string) => {
    return status === "Active" ? (
      <Badge color="success">{status}</Badge>
    ) : (
      <Badge color="error">{status}</Badge>
    );
  };

  const handleActionClick = (userId: string) => {
    setOpenDropdown(openDropdown === userId ? null : userId);
  };

  const handleEdit = (userId: string) => {
    console.log("Edit user:", userId);
    setOpenDropdown(null);
    navigate(`/profile/${userId}`);
  };

  const handleDelete = (userId: string) => {
    console.log("Delete user:", userId);
    setOpenDropdown(null);
  };


  return (
    <>
      <PageMeta
        title="Users | Pedometer"
        description="Manage all users in the platform"
      />
      <PageBreadcrumb pageTitle="Users" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            All Users
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {loading ? "Loading..." : `Total Users: ${usersData.length}`}
          </div>
        </div>

        <div className="overflow-x-auto">
          {error && (
            <div className="text-red-500 mb-4">{error}</div>
          )}
          {loading ? (
            <div className="text-gray-500 text-center py-8">Loading users...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell className="px-5 py-4 sm:px-6 text-start font-medium text-gray-800 dark:text-white/90">
                    User
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start font-medium text-gray-800 dark:text-white/90">
                    Email
                  </TableCell>
                  {/* <TableCell className="px-4 py-3 text-start font-medium text-gray-800 dark:text-white/90">
                    Role
                  </TableCell> */}
                  <TableCell className="px-4 py-3 text-start font-medium text-gray-800 dark:text-white/90">
                    Status
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start font-medium text-gray-800 dark:text-white/90">
                    Wallet Balance
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start font-medium text-gray-800 dark:text-white/90">
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {usersData.map((user) => (
                  <TableRow key={user?._id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        {user?.avatar && !user?.avatar.endsWith("default-avatar.jpg") ? (

                          <div className="w-10 h-10 overflow-hidden rounded-full">
                            <img
                              width={40}
                              height={40}
                              src={API_URL + "uploads/profile/" + user?.avatar}
                              alt={user?.firstName + " " + user?.lastName}
                              className="w-full h-full object-cover"
                            />

                          </div>) : (
                          <UserCircle2Icon className="text-blue-600 size-10 ml-0 dark:text-blue-400" />
                        )}
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {user?.firstName} {user?.lastName}
                          </span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                            ID: {user?._id}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {user?.email}
                    </TableCell>
                    {/* <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {user?.role}
                    </TableCell> */}
                    <TableCell className="px-4 py-3 text-start">
                      {getStatusBadge(user?.isActive ? "Active" : "Inactive")}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <span className={`font-medium ${user?.walletBalance?.balance && user?.walletBalance.balance > 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-500 dark:text-gray-400'
                        }`}>
                        ${user?.walletBalance?.balance?.toFixed(2) ?? '0.00'}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <div className="relative">
                        <button
                          onClick={() => handleActionClick(user?._id)}
                          className="dropdown-toggle flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
                        >
                          <HorizontaLDots className="h-4 w-4" />
                        </button>
                        <Dropdown
                          isOpen={openDropdown === user?._id}
                          onClose={() => setOpenDropdown(null)}
                          className="min-w-[120px]"
                        >
                          <DropdownItem
                            onClick={() => handleEdit(user?._id)}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/[0.05]"
                          >
                            <>
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              View
                            </>
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => handleDelete(user?._id)}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                          >
                            <>
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </>
                          </DropdownItem>
                        </Dropdown>
                      </div>
                    </TableCell>
                  </TableRow>

                ))}
                {usersData.length === 0 && (
                  <TableRow>
                    <TableCell className="text-center"
                    //  colSpan={6}
                    >
                      No users found
                    </TableCell>
                  </TableRow>
                )}
                {/* Pagination */}
                {usersData.length > 0 && (
                  <tr>
                    <td colSpan={6} className="py-4">
                      <div className="flex justify-between items-center">
                        <button
                          className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                        <span className="text-gray-700">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                          onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </>
  );
} 