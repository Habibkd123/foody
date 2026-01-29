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
        const { latitude, longitude, heading, speed } = await request.json();

        if (!latitude || !longitude) {
            return NextResponse.json({ success: false, message: 'Coordinates required' }, { status: 400 });
        }

        // Update driver's current location and last updated timestamp
        await User.findByIdAndUpdate(id, {
            $set: {
                'driverDetails.currentLocation': {
                    latitude,
                    longitude,
                    heading,
                    speed,
                    updatedAt: new Date(),
                },
            },
        });

        // Broadcast location update if Socket.io is available
        if (global.io) {
            global.io.to(`track_${id}`).emit('locationUpdate', {
                driverId: id,
                latitude,
                longitude,
                heading,
                speed,
                timestamp: new Date()
            });
        }

        return NextResponse.json({ success: true, message: 'Location updated' });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
