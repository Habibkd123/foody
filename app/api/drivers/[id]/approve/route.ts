import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/User';
import { sendDriverApprovalEmail } from '@/lib/email';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;

        const driver = await User.findOneAndUpdate(
            { _id: id, role: 'driver' },
            {
                $set: {
                    'driverDetails.status': 'approved',
                    'driverDetails.isVerified': true,
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

        await sendDriverApprovalEmail(driver.email, `${driver.firstName} ${driver.lastName}`);

        return NextResponse.json({
            success: true,
            message: 'Driver approved successfully',
            data: driver,
        });

    } catch (error: any) {
        console.error('Failed to approve driver:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Failed to approve driver',
        }, { status: 500 });
    }
}
