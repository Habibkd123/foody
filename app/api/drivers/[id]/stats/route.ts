import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/User';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;
        const driver = await User.findById(id);

        if (!driver || driver.role !== 'driver') {
            return NextResponse.json({
                success: false,
                message: 'Driver not found',
            }, { status: 404 });
        }

        const stats = {
            todayEarnings: driver.driverDetails?.earnings?.today || 0,
            weekEarnings: driver.driverDetails?.earnings?.thisWeek || 0,
            monthEarnings: driver.driverDetails?.earnings?.thisMonth || 0,
            totalDeliveries: driver.driverDetails?.stats?.totalDeliveries || 0,
            completedToday: driver.driverDetails?.stats?.completedToday || 0,
            rating: driver.driverDetails?.stats?.rating || 5.0,
            reviews: driver.driverDetails?.stats?.reviews || 0,
        };

        return NextResponse.json({
            success: true,
            stats,
            isOnline: driver.driverDetails?.isAvailable || false,
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message,
        }, { status: 500 });
    }
}
