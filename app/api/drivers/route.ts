import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/User';

// GET all drivers
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const drivers = await User.find({ role: 'driver' })
            .select('-password')
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: drivers,
            count: drivers.length,
        });

    } catch (error: any) {
        console.error('Failed to fetch drivers:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Failed to fetch drivers',
        }, { status: 500 });
    }
}
