"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    TrendingUp,
    DollarSign,
    Package,
    Star,
    Users,
    Activity,
    Award,
    Navigation,
    Bike,
    Truck,
    Car
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function DriverAnalytics() {
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/drivers/analytics')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setAnalytics(data.analytics);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch analytics:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!analytics) return <div>No data available</div>;

    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Driver Fleet Analytics</h1>
                <p className="text-gray-500">Monitor performance and earnings for your delivery partners</p>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-lg transition-shadow border-none shadow-md bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Partners</CardTitle>
                        <Users className="w-4 h-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{analytics.totalDrivers}</div>
                        <p className="text-xs text-green-600 font-medium mt-1">
                            +{analytics.newDriversThisMonth} new this month
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow border-none shadow-md bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Active Now</CardTitle>
                        <Activity className="w-4 h-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{analytics.activeDrivers}</div>
                        <Progress
                            value={(analytics.activeDrivers / analytics.totalDrivers) * 100}
                            className="h-1 mt-3"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            {((analytics.activeDrivers / analytics.totalDrivers) * 100).toFixed(0)}% of fleet online
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow border-none shadow-md bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Fleet Earnings</CardTitle>
                        <DollarSign className="w-4 h-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">₹{analytics.totalEarnings.toLocaleString()}</div>
                        <p className="text-xs text-gray-500 mt-1">All-time lifetime value</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow border-none shadow-md bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Avg Fleet Rating</CardTitle>
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{analytics.avgRating}</div>
                        <div className="flex gap-1 mt-2">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className={`h-1 flex-1 rounded-full ${i <= Math.round(analytics.avgRating) ? 'bg-yellow-400' : 'bg-gray-100'}`} />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Top Performers Leaderboard */}
                <Card className="lg:col-span-2 border-none shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                        <div>
                            <CardTitle>Top Performing Partners</CardTitle>
                            <p className="text-xs text-gray-500 mt-1">Based on successful deliveries</p>
                        </div>
                        <Award className="w-6 h-6 text-orange-500" />
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-6">
                            {analytics.topDrivers?.map((driver: any, index: number) => (
                                <div key={driver._id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                                            ${index === 0 ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-400' :
                                                index === 1 ? 'bg-gray-100 text-gray-700 ring-2 ring-gray-400' :
                                                    'bg-orange-50 text-orange-700'}`}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{driver.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="outline" className="text-[10px] px-1 h-4 font-normal">
                                                    {driver.vehicleType === 'bike' ? <Bike className="w-3 h-3 mr-1" /> :
                                                        driver.vehicleType === 'car' ? <Car className="w-3 h-3 mr-1" /> :
                                                            <Truck className="w-3 h-3 mr-1" />}
                                                    {driver.vehicleType}
                                                </Badge>
                                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Navigation className="w-3 h-3" /> {driver.completedDeliveries} delivs
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">₹{driver.totalEarnings.toLocaleString()}</p>
                                        <div className="flex items-center justify-end gap-1 mt-1">
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 border-none" />
                                            <span className="text-xs font-semibold">{driver.rating}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(!analytics.topDrivers || analytics.topDrivers.length === 0) && (
                                <p className="text-center text-gray-500 py-8">No performance data yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Fleet Health / Distribution */}
                <Card className="border-none shadow-md">
                    <CardHeader className="border-b pb-4">
                        <CardTitle className="text-lg">Fleet Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Verification Status</span>
                                    <span className="font-medium text-orange-600">{analytics.totalDrivers} Total</span>
                                </div>
                                <div className="space-y-3 pt-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="flex items-center gap-2 text-gray-500">
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div> Approved
                                        </span>
                                        <span className="font-bold">75%</span>
                                    </div>
                                    <Progress value={75} className="h-1 bg-gray-100" />

                                    <div className="flex justify-between items-center text-xs">
                                        <span className="flex items-center gap-2 text-gray-500">
                                            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div> Pending
                                        </span>
                                        <span className="font-bold">20%</span>
                                    </div>
                                    <Progress value={20} className="h-1 bg-gray-100" />

                                    <div className="flex justify-between items-center text-xs">
                                        <span className="flex items-center gap-2 text-gray-500">
                                            <div className="w-3 h-3 bg-red-400 rounded-full"></div> On Hold
                                        </span>
                                        <span className="font-bold">5%</span>
                                    </div>
                                    <Progress value={5} className="h-1 bg-gray-100" />
                                </div>
                            </div>

                            <Card className="bg-orange-50 border-none">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className="bg-white p-2 rounded-xl shadow-sm">
                                        <Navigation className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600 font-medium">Daily Target</p>
                                        <p className="text-sm font-bold text-gray-900">85% Attendance</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
