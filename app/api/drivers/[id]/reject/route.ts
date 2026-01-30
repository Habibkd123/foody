import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/User';
import { sendDriverRejectionEmail } from '@/lib/email';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;
        const body = await request.json();
        const { reason } = body;

        const driver = await User.findOneAndUpdate(
            { _id: id, role: 'driver' },
            {
                $set: {
                    'driverDetails.status': 'rejected',
                    'driverDetails.rejectionReason': reason || 'Application rejected',
                }
            },
            { new: true }
        ).select('-password');

        if (!driver) {
            return NextResponse.json({
                success: false,
                message: 'Driver not found',
            }, { status: 404 });
        }

        await sendDriverRejectionEmail(driver.email, `${driver.firstName} ${driver.lastName}`, reason);

        return NextResponse.json({
            success: true,
            message: 'Driver rejected',
            data: driver,
        });

    } catch (error: any) {
        console.error('Failed to reject driver:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Failed to reject driver',
        }, { status: 500 });
    }
}
