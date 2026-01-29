import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/User';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const { id } = params;
        const { isOnline } = await request.json();

        const driver = await User.findByIdAndUpdate(
            id,
            {
                $set: {
                    'driverDetails.isAvailable': isOnline,
                },
            },
            { new: true }
        );

        if (!driver) {
            return NextResponse.json({
                success: false,
                message: 'Driver not found',
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            isOnline: driver.driverDetails?.isAvailable,
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message,
        }, { status: 500 });
    }
}
