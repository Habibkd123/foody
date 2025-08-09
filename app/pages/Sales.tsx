import {
  // ArrowDownIcon,
  // ArrowUpIcon,
  UserCircleIcon,
  TaskIcon,
  GridIcon,
  DollarLineIcon,
  ShoppingCartIcon,
} from "../icons";
// import Badge from "../components/ui/badge/Badge";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { useSalesService } from "../apiservices/useSalesService";
import TopProduct from "./TopProducts/TopProduct";
import { RevenueChart } from "./RevenueChart/RevenueChart";
import TopBuyers from "./TopBuyers/TopBuyers";
import { Link } from "react-router";
import { ArrowRightIcon } from "lucide-react";


function SalesMetrics() {
  const { data, loading } = useSalesService();
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 md:gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 animate-pulse">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-xl dark:bg-gray-700"></div>
            <div className="mt-5">
              <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded dark:bg-gray-700"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 md:gap-6">
      {/* Total Sales Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl dark:bg-green-900/20">
          <DollarLineIcon className="text-green-600 size-6 dark:text-green-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Sales
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              ${data?.totalSales?.total?.toLocaleString() || '0'}
            </h4>
          </div>
          {/* <Badge color="success">
            <ArrowUpIcon />
            12.5%
          </Badge> */}
        </div>
      </div>

      {/* Total Products Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl dark:bg-blue-900/20">
          <ShoppingCartIcon className="text-blue-600 size-6 dark:text-blue-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Products
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data?.totalProducts || 0}
            </h4>
          </div>
          <Link to="/admin/products">
          <div className="flex items-center text-blue-600 align-center  gap-2">
             <span>learn more</span><ArrowRightIcon className="size-5" />
          </div>
          </Link>
        </div>
      </div>

      {/* Total Maps Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl dark:bg-purple-900/20">
          <GridIcon className="text-purple-600 size-6 dark:text-purple-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Maps
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data?.totalMaps || 0}
            </h4>
          </div>
          <Link to="/maps">
          <div className="flex items-center text-purple-600 align-center  gap-2">
             <span>learn more</span><ArrowRightIcon className="size-5" />
          </div>
          </Link>
        </div>
      </div>

      {/* Total Users Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl dark:bg-orange-900/20">
          <UserCircleIcon className="text-orange-600 size-6 dark:text-orange-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Users
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data?.totalUsers || 0}
            </h4>
          </div>
          <Link to="/users">
          <div className="flex items-center text-orange-600 align-center  gap-2">
             <span>learn more</span><ArrowRightIcon className="size-5" />
          </div>
          </Link>
        </div>
      </div>

      {/* Total Missions Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl dark:bg-indigo-900/20">
          <TaskIcon className="text-indigo-600 size-6 dark:text-indigo-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Missions
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data?.totalMissions || 0}
            </h4>
          </div>
          <Link to="/missions">
          <div className="flex items-center text-indigo-600 align-center  gap-2">
             <span>learn more</span><ArrowRightIcon className="size-5" />
          </div>
          </Link>
        </div>
      </div>
    </div>
  );
}


export default function Sales() {
  
  return (
    <>
      <PageMeta
        title="Sales | Pedometer"
        description="Sales analytics and performance metrics"
      />
      <PageBreadcrumb pageTitle="Sales" />

      <div className="space-y-6">
        {/* Sales Metrics Cards */}
        <SalesMetrics   />

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RevenueChart />
          <TopProduct />
        </div>

        {/* Top Buyers Table */}
        <TopBuyers />
      </div>
    </>
  );
} 