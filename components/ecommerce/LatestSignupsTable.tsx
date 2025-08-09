
"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "../ui/badge";
import { UserCircleIcon, EnvelopeIcon, CalenderIcon } from "../../icons";
import { UserCircle2Icon } from "lucide-react";


// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Helper function to get time ago
const getTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return '1 day ago';
  return `${diffInDays} days ago`;
};

export default function LatestSignupsTable({ data}: any) {


  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-white/[0.05]">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Latest Signups
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Recently registered users
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <UserCircleIcon className="size-4" />
          <span>{data?.length || 0} new users</span>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-6 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                User
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Email
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Role
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Signup Date
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {data&&data?.map((user, index) => (
              <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                <TableCell className="px-6 py-4 text-start">
                  <div className="flex items-center gap-3">
                    {user.avatar && !user.avatar.endsWith("default-avatar.jpg") ? (

                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <img
                          width={40}
                          height={40}
                          src={API_URL + "uploads/profile/" + user.avatar}
                          alt={user.User}
                          className="w-full h-full object-cover"
                        />

                      </div>) : (
                      <UserCircle2Icon className="text-blue-600 size-10 ml-0 dark:text-blue-400" />
                    )}
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {user.User}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {getTimeAgo(user["Signup Date"])}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-4 text-start">
                  <div className="flex items-center gap-2">
                    <EnvelopeIcon className="size-4 text-gray-400" />
                    <span className="text-gray-600 text-theme-sm dark:text-gray-300">
                      {user.Email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-4 text-start">
                  <span className="text-gray-600 text-theme-sm dark:text-gray-300">
                    {user.Role}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-4 text-start">
                  <div className="flex items-center gap-2">
                    <CalenderIcon className="size-4 text-gray-400" />
                    <span className="text-gray-600 text-theme-sm dark:text-gray-300">
                      {/* {formatDate(user["Signup Date"])} */}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-4 text-start">
                  <Badge
                    size="sm"
                    color={
                      user.Status === "Active"
                        ? "success"
                        : user.Status === "Verified"
                          ? "info"
                          : "warning"
                    }
                  >
                    {user.Status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 