import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/app/models/Order';
import User from '@/app/models/User';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const { id } = params;
        const { driverId } = await request.json();

        if (!driverId) {
            return NextResponse.json({
                success: false,
                message: 'Driver ID is required',
            }, { status: 400 });
        }

        // Check if order exists
        const order = await Order.findById(id);
        if (!order) {
            return NextResponse.json({
                success: false,
                message: 'Order not found',
            }, { status: 404 });
        }

        // Check if driver exists and is a driver
        const driver = await User.findOne({ _id: driverId, role: 'driver' });
        if (!driver) {
            return NextResponse.json({
                success: false,
                message: 'Driver not found or invalid role',
            }, { status: 404 });
        }

        // Update order with rider and status
        order.rider = driverId;
        order.status = 'processing'; // Or 'assigned' if you have that status
        await order.save();

        // Emit real-time notification to the driver
        if (global.io) {
            global.io.to(driverId).emit('newOrderAssignment', {
                orderId: order._id,
                orderNumber: order.orderId,
                message: 'A new order has been assigned to you!'
            });
        }

        // Optional: Update driver's online status or stats if needed
        // driver.driverDetails.isAvailable = false; // Maybe they can handle multiple?
        // await driver.save();

        return NextResponse.json({
            success: true,
            data: order,
            message: 'Driver assigned successfully',
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message,
        }, { status: 500 });
    }
}
