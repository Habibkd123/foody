import DashboardMetrics from "@/components/ecommerce/DashboardMetrics";
import LatestSignupsTable from "@/components/ecommerce/LatestSignupsTable";
import PageMeta from "@/components/common/PageMeta";

export default function Home() {

  return (
    <>
      <PageMeta
        title="Pedometer - Health is Life"
        description="Pedometer - Health is Life"
      />
      <div className="space-y-6">
        
        {/* Dashboard Metrics Cards */}
        <DashboardMetrics />
        
        {/* Latest Signups Table */}
        <LatestSignupsTable />
      </div>
    </>
  );
}
