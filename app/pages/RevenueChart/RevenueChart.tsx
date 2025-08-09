import { useSalesService } from "../../apiservices/useSalesService";
import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

export function RevenueChart() {
    const { loading, monthlySales } = useSalesService();
    console.log("monthlymonthlySalesSales", Array.isArray(monthlySales) ? monthlySales.map((item) => item.monthName) : []);
    const options: ApexOptions = {
        legend: {
            show: false,
        },
        colors: ["#EA6D16"],
        chart: {
            fontFamily: "Outfit, sans-serif",
            height: 300,
            type: "line",
            toolbar: {
                show: false,
            },
        },
        stroke: {
            curve: "smooth",
            width: 3,
        },
        fill: {
            type: "gradient",
            gradient: {
                opacityFrom: 0.55,
                opacityTo: 0,
            },
        },
        markers: {
            size: 0,
            strokeColors: "#fff",
            strokeWidth: 2,
            hover: {
                size: 6,
            },
        },
        grid: {
            xaxis: {
                lines: {
                    show: false,
                },
            },
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            enabled: true,
            y: {
                formatter: (val: number) => `$${val.toLocaleString()}`,
            },
        },
        xaxis: {
            type: "category",
            categories: Array.isArray(monthlySales) ? monthlySales.map((item) => item.monthName) : [],
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            tooltip: {
                enabled: false,
            },
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: "12px",
                    colors: ["#6B7280"],
                },
                formatter: (val: number) => `$${val.toLocaleString()}`,
            },
            title: {
                text: "",
                style: {
                    fontSize: "0px",
                },
            },
        },
    };

    const series = [
        {
            name: "Revenue",
            data: Array.isArray(monthlySales) ? monthlySales.map((item) => item.total) : [],
        },
    ];

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Last 6 Months Revenue
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Monthly revenue performance
                </p>
            </div>
            <div className="max-w-full overflow-x-auto custom-scrollbar">
                <div className="min-w-[600px]">
                    {!loading && Array.isArray(monthlySales) && monthlySales.length > 0 ? (
                        <Chart options={options} series={series} type="area" height={300} />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                            <div className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                No data to show. Please select a different time range.
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
