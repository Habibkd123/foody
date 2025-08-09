import {
  UserCircleIcon,
  TaskIcon,
  GridIcon,
  PieChartIcon,
} from "../../icons";
import { useDashboardService } from "../../apiservices/useDashboardService";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

export default function DashboardMetrics() {
    const { data, loading, error } = useDashboardService();
  
    if (error) return <p className="text-red-500">Error: {error}</p>;
  

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        {[1, 2, 3, 4].map((i) => (
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      {/* <!-- Users Card Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl dark:bg-blue-900/20">
          <UserCircleIcon className="text-blue-600 size-6 dark:text-blue-400" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Users
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data?.totalUsers || 0}
            </h4>
          </div>
          <Link to="/users" className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
            Learn more
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
      {/* <!-- Users Card End --> */}

      {/* <!-- Missions Card Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl dark:bg-green-900/20">
          <TaskIcon className="text-green-600 size-6 dark:text-green-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Missions
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data?.totalMissions || 0}
            </h4>
          </div>

          <Link to="/missions" className="text-success-600 dark:text-success-400 flex items-center gap-1">
            Learn more
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
      {/* <!-- Missions Card End --> */}

      {/* <!-- Maps Card Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl dark:bg-purple-900/20">
          <GridIcon className="text-purple-600 size-6 dark:text-purple-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Maps
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data?.totalMaps || 0}
            </h4>
          </div>

          <Link to="/maps" className="text-error-600 dark:text-error-400 flex items-center gap-1">
            Learn more
            <ArrowRight className="size-4" />
          </Link> 
        </div>
      </div>
      {/* <!-- Maps Card End --> */}

      {/* <!-- Products Card Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl dark:bg-orange-900/20">
          <PieChartIcon className="text-orange-600 size-6 dark:text-orange-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Products
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data?.totalProducts || 0}
            </h4>
          </div>

          <Link to="/admin/products" className="text-success-600 dark:text-success-400 flex items-center gap-1">
            Learn more
            <ArrowRight className="size-4 text-success-600 dark:text-success-400" />
          </Link>
        </div>
      </div>
      {/* <!-- Products Card End --> */}
    </div>
  );
} 