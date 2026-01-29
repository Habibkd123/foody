import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/User';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        // Find all users with role 'driver' who are approved and available
        const availableDrivers = await User.find({
            role: 'driver',
            'driverDetails.status': 'approved',
            'driverDetails.isAvailable': true
        }).select('firstName lastName phone driverDetails.vehicleType driverDetails.vehicleNumber driverDetails.currentLocation');

        return NextResponse.json({
            success: true,
            data: availableDrivers,
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message,
        }, { status: 500 });
    }
}
