import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

import Order from '@/app/models/Order';
import Product from '@/app/models/Product';

async function updateOrderStatus(orderId: string, status: string, driverId?: string) {
    try {
        await connectDB();

        const order = await Order.findById(orderId).populate('items.product');
        if (!order) throw new Error('Order not found');

        if (status === 'assigned' && driverId) {
            order.rider = driverId;
        }

        // Map simplified statuses to Order model statuses if needed
        let finalStatus = status;
        if (status === 'picked_up') finalStatus = 'processing'; // Or 'shipped'
        if (status === 'delivered') finalStatus = 'delivered';

        order.status = finalStatus;
        await order.save();

        // Get restaurant ID from first product
        const restaurantId = order.items[0]?.product?.restaurantId;

        // Emit real-time notifications
        if (global.io) {
            const payload = {
                orderId: order._id,
                orderNumber: order.orderId,
                status: finalStatus,
                message: `Order #${order.orderId} status updated to ${finalStatus}`
            };

            // Notify Customer
            global.io.to(order.user.toString()).emit('orderStatusUpdate', payload);

            // Notify Restaurant
            if (restaurantId) {
                global.io.to(restaurantId.toString()).emit('orderStatusUpdate', payload);
            }
        }

        console.log(`Order ${orderId} updated to ${finalStatus}${driverId ? ` by driver ${driverId}` : ''}`);

        return { success: true, message: `Order marked as ${status.replace('_', ' ')}` };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string, action: string } }
) {
    const { id, action } = params;

    let result;
    if (action === 'accept') {
        const { driverId } = await request.json();
        result = await updateOrderStatus(id, 'assigned', driverId);
    } else if (action === 'pickup') {
        result = await updateOrderStatus(id, 'picked_up');
    } else if (action === 'delivered') {
        result = await updateOrderStatus(id, 'delivered');
    } else {
        return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
    }

    if (result.success) {
        return NextResponse.json(result);
    } else {
        return NextResponse.json(result, { status: 500 });
    }
}
