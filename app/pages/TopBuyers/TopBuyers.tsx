import { UserCircle2Icon } from "lucide-react";
import { useSalesService } from "../../apiservices/useSalesService";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";

const TopBuyers = () => {
    const { loading, topBuyers, API_URL } = useSalesService();
    return (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-white/[0.05]">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Top Buyers
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Customers with highest spending
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <UserCircle2Icon className="text-blue-600 size-10 ml-0 dark:text-blue-400" />
                    <span>{ Array.isArray(topBuyers) && topBuyers?.length} top customers</span>
                </div>
            </div>

            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            <TableCell
                                isHeader
                                className="px-6 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Customer
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
                                Total Spent
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Orders
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    {loading ?
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            <TableRow>
                                <TableCell className="h-24 text-center">
                                    <span className="text-gray-500 dark:text-gray-400">Loading...</span>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                        : Array.isArray(topBuyers) && topBuyers?.length > 0 ?
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {topBuyers?.map((buyer, index) => (
                                    <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                                        <TableCell className="px-6 py-4 text-start">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 overflow-hidden rounded-full">
                                                  {!buyer.user.avatar||buyer.user.avatar.endsWith("default-avatar.jpg") ? (
                                                  <UserCircle2Icon className="text-blue-600 size-10 ml-0 dark:text-blue-400" />
                                                   
                                                  ) : (
                                                    <img
                                                    width={40}
                                                    height={40}
                                                    src={API_URL + "uploads/profile/" + buyer.user.avatar}
                                                    alt={buyer.user.firstName + " " + buyer.user.lastName}
                                                    className="w-full h-full object-cover"
                                                />
                                                  )}
                                                </div>
                                                <div>
                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        {buyer.user.firstName + " " + buyer.user.lastName}
                                                    </span>
                                                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                        Customer #{buyer.user._id}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-4 text-start">
                                            <span className="text-gray-600 text-theme-sm dark:text-gray-300">
                                                {buyer.user.email}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-4 py-4 text-start">
                                            <span className="font-semibold text-green-600 dark:text-green-400">
                                                ${buyer.total.toLocaleString()}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-4 py-4 text-start">
                                            <span className="text-gray-600 text-theme-sm dark:text-gray-300">
                                                {buyer.count} orders
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody> :
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                <TableRow>
                                    <TableCell className="h-24 text-center">
                                        <span className="text-gray-500 dark:text-gray-400">No data available</span>
                                    </TableCell>
                                </TableRow>
                            </TableBody>}
                </Table>
            </div>
        </div>
    );
};

export default TopBuyers;
