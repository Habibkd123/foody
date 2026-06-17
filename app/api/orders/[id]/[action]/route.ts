import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/app/models/Order';
import Product from '@/app/models/Product';
import User from '@/app/models/User';
import { declineOrderAssignment, clearOrderSkipCache } from '@/lib/dispatch';

async function updateOrderStatus(orderId: string, status: string, driverId?: string) {
    try {
        await connectDB();

        const order = await Order.findById(orderId).populate('items.product');
        if (!order) throw new Error('Order not found');

        // Accept Order Action
        if (status === 'assigned' && driverId) {
            order.rider = driverId;
            
            // Set driver availability to false (occupied)
            const driver = await User.findById(driverId);
            if (driver && driver.role === 'driver') {
                if (!driver.driverDetails) driver.driverDetails = {};
                driver.driverDetails.isAvailable = false;
                await driver.save();
                console.log(`[Action API] Rider ${driver.firstName} is now occupied (isAvailable = false)`);
            }
        }

        // Map simplified statuses to DB Order statuses
        let finalStatus = status;
        if (status === 'assigned') finalStatus = 'processing';
        if (status === 'picked_up') finalStatus = 'shipped';
        
        // Deliver Order Action
        if (status === 'delivered') {
            finalStatus = 'delivered';
            
            // Update driver earnings & completion count
            if (order.rider) {
                const driver = await User.findById(order.rider);
                if (driver && driver.role === 'driver') {
                    if (!driver.driverDetails) driver.driverDetails = {};
                    if (!driver.driverDetails.earnings) {
                        driver.driverDetails.earnings = { today: 0, thisWeek: 0, thisMonth: 0, total: 0 };
                    }
                    if (!driver.driverDetails.stats) {
                        driver.driverDetails.stats = { totalDeliveries: 0, completedDeliveries: 0, rating: 5, reviews: 0 };
                    }

                    const fee = 50; // Earn ₹50 per delivery
                    driver.driverDetails.earnings.today = (driver.driverDetails.earnings.today || 0) + fee;
                    driver.driverDetails.earnings.thisWeek = (driver.driverDetails.earnings.thisWeek || 0) + fee;
                    driver.driverDetails.earnings.thisMonth = (driver.driverDetails.earnings.thisMonth || 0) + fee;
                    driver.driverDetails.earnings.total = (driver.driverDetails.earnings.total || 0) + fee;

                    driver.driverDetails.stats.totalDeliveries = (driver.driverDetails.stats.totalDeliveries || 0) + 1;
                    driver.driverDetails.stats.completedDeliveries = (driver.driverDetails.stats.completedDeliveries || 0) + 1;
                    
                    // Driver is available again
                    driver.driverDetails.isAvailable = true;

                    await driver.save();
                    console.log(`[Action API] Rider ${driver.firstName} has successfully delivered. Credited ₹${fee}. Available again.`);
                }
                
                // Clear skipped driver memory registry
                clearOrderSkipCache(orderId);
            }
        }

        order.status = finalStatus as any;
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
    { params }: { params: Promise<{ id: string, action: string }> }
) {
    const { id, action } = await params;

    let result;
    if (action === 'accept') {
        const { driverId } = await request.json();
        result = await updateOrderStatus(id, 'assigned', driverId);
    } else if (action === 'decline') {
        const { driverId } = await request.json();
        await declineOrderAssignment(id, driverId);
        result = { success: true, message: 'Order declined, routing to next driver' };
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
