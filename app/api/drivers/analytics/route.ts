import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/User';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        // Get all drivers
        const drivers = await User.find({ role: 'driver' });

        if (!drivers || drivers.length === 0) {
            return NextResponse.json({
                success: true,
                analytics: {
                    totalDrivers: 0,
                    activeDrivers: 0,
                    newDriversThisMonth: 0,
                    totalEarnings: 0,
                    avgRating: 0,
                    topDrivers: [],
                }
            });
        }

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const analytics = {
            totalDrivers: drivers.length,
            activeDrivers: drivers.filter(d => d.driverDetails?.isAvailable).length,
            newDriversThisMonth: drivers.filter(d => new Date(d.createdAt) >= startOfMonth).length,
            totalEarnings: drivers.reduce((sum, d) => sum + (d.driverDetails?.earnings?.total || 0), 0),
            avgRating: (drivers.reduce((sum, d) => sum + (d.driverDetails?.stats?.rating || 0), 0) / drivers.length).toFixed(1),
            topDrivers: drivers
                .sort((a, b) => (b.driverDetails?.stats?.completedDeliveries || 0) - (a.driverDetails?.stats?.completedDeliveries || 0))
                .slice(0, 5)
                .map(d => ({
                    _id: d._id,
                    name: `${d.firstName} ${d.lastName}`,
                    totalDeliveries: d.driverDetails?.stats?.totalDeliveries || 0,
                    completedDeliveries: d.driverDetails?.stats?.completedDeliveries || 0,
                    rating: d.driverDetails?.stats?.rating || 0,
                    totalEarnings: d.driverDetails?.earnings?.total || 0,
                    vehicleType: d.driverDetails?.vehicleType,
                    status: d.driverDetails?.status
                })),
        };

        return NextResponse.json({
            success: true,
            analytics
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}
