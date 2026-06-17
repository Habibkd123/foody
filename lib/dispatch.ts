import connectDB from '@/lib/mongodb';
import Order from '@/app/models/Order';
import User from '@/app/models/User';
import Product from '@/app/models/Product';

// In-memory registry to track drivers who declined or timed out for a specific order
const orderSkippedDrivers = new Map<string, string[]>();

/**
 * Calculates the distance between two coordinates in kilometers using the Haversine formula.
 */
export function calculateHaversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Attempts to automatically assign the closest available driver to an order.
 * Runs in the background and loops if the assigned driver declines or times out.
 */
export async function dispatchOrder(orderId: string, skippedDriverIds: string[] = []): Promise<boolean> {
    try {
        await connectDB();

        // 1. Fetch Order and populate first product
        const order = await Order.findById(orderId).populate('items.product');
        if (!order) {
            console.log(`[Dispatcher] Order ${orderId} not found.`);
            return false;
        }

        // Only dispatch if order is in paid/preparing state (unassigned)
        if (order.status !== 'paid' && order.status !== 'processing' && order.status !== 'assigned') {
            console.log(`[Dispatcher] Order ${order.orderId} is in status ${order.status}. Skipping dispatch.`);
            return false;
        }

        const firstItem = order.items?.[0];
        if (!firstItem || !firstItem.product) {
            console.log(`[Dispatcher] Order ${orderId} has no products.`);
            return false;
        }

        // 2. Fetch Restaurant location details
        const product = await Product.findById(firstItem.product._id || firstItem.product);
        if (!product || !product.restaurantId) {
            console.log(`[Dispatcher] Product or restaurant ID not found for order ${orderId}.`);
            return false;
        }

        const restaurantUser = await User.findById(product.restaurantId);
        if (!restaurantUser || !restaurantUser.restaurant || !restaurantUser.restaurant.location) {
            console.log(`[Dispatcher] Restaurant details or location missing for order ${orderId}.`);
            return false;
        }

        const restLat = restaurantUser.restaurant.location.lat;
        const restLng = restaurantUser.restaurant.location.lng;

        if (restLat === undefined || restLng === undefined) {
            console.log(`[Dispatcher] Restaurant coordinates are undefined for order ${orderId}.`);
            return false;
        }

        // Update in-memory registry of skipped drivers for this order
        const currentSkips = orderSkippedDrivers.get(orderId) || [];
        const combinedSkips = Array.from(new Set([...currentSkips, ...skippedDriverIds]));
        orderSkippedDrivers.set(orderId, combinedSkips);

        // 3. Find all online, available, and approved drivers not in skip list
        const availableDrivers = await User.find({
            role: 'driver',
            'driverDetails.status': 'approved',
            'driverDetails.isAvailable': true,
            _id: { $nin: combinedSkips }
        });

        if (availableDrivers.length === 0) {
            console.log(`[Dispatcher] No available drivers found for order ${order.orderId}. Re-pushing to open board in DB...`);
            // Reset rider so order appears on public Job Board
            order.rider = null;
            await order.save();
            return false;
        }

        // 4. Calculate distances and sort drivers by proximity
        const driversWithDistance = availableDrivers.map(driver => {
            const driverLat = driver.driverDetails?.currentLocation?.latitude;
            const driverLng = driver.driverDetails?.currentLocation?.longitude;
            let distance = Infinity;

            if (driverLat !== undefined && driverLng !== undefined) {
                distance = calculateHaversine(restLat, restLng, driverLat, driverLng);
            }
            return { driver, distance };
        })
        .filter(d => d.distance <= 15) // Max 15km delivery partner reach
        .sort((a, b) => a.distance - b.distance);

        if (driversWithDistance.length === 0) {
            console.log(`[Dispatcher] Drivers are online but all are beyond 15km limit for order ${order.orderId}.`);
            order.rider = null;
            await order.save();
            return false;
        }

        const closestRider = driversWithDistance[0].driver;
        const riderDistance = driversWithDistance[0].distance;

        console.log(`[Dispatcher] Assigning order ${order.orderId} to closest rider: ${closestRider.firstName} (${riderDistance.toFixed(2)} km away)`);

        // 5. Update order rider and status to assigned
        order.rider = closestRider._id as any;
        order.status = 'assigned';
        await order.save();

        // 6. Broadcast Real-Time Assignment to the specific Rider via Socket.io
        const io = (global as any).io;
        if (io) {
            io.to(closestRider._id.toString()).emit('newOrderAssignment', {
                orderId: order._id,
                orderNumber: order.orderId,
                restaurantName: restaurantUser.restaurant.name,
                restaurantAddress: restaurantUser.restaurant.address,
                totalAmount: order.total,
                itemsCount: order.items.length,
                distance: `${riderDistance.toFixed(1)} km`,
                estimatedTime: `${Math.ceil(riderDistance * 4 + 5)} mins`, // mock ETA based on distance
                timeout: 30 // 30 seconds to accept
            });
            console.log(`[Dispatcher] Dispatched socket notification to rider ${closestRider._id}`);
        }

        // 7. Schedule 30-Second Timeout for driver bid lock
        setTimeout(async () => {
            try {
                const checkOrder = await Order.findById(orderId);
                // Check if the order is still assigned to this rider (meaning they didn't accept or decline it yet)
                if (
                    checkOrder &&
                    checkOrder.status === 'assigned' &&
                    checkOrder.rider &&
                    checkOrder.rider.toString() === closestRider._id.toString()
                ) {
                    console.log(`[Dispatcher] Rider ${closestRider.firstName} timed out (30s). Re-dispatching order ${checkOrder.orderId}...`);
                    await declineOrderAssignment(orderId, closestRider._id.toString());
                }
            } catch (timeoutErr) {
                console.error('[Dispatcher] Error in 30s timeout handler:', timeoutErr);
            }
        }, 30000);

        return true;
    } catch (error) {
        console.error('[Dispatcher] Error during auto-assignment:', error);
        return false;
    }
}

/**
 * Handles rider declining an order (or timing out).
 * Adds them to the skip list, resets order status, and triggers re-dispatching.
 */
export async function declineOrderAssignment(orderId: string, driverId: string): Promise<void> {
    try {
        await connectDB();

        console.log(`[Dispatcher] Rider ${driverId} declined/timed out order ${orderId}. Re-routing...`);

        // Add to in-memory skipped list
        const currentSkips = orderSkippedDrivers.get(orderId) || [];
        if (!currentSkips.includes(driverId)) {
            currentSkips.push(driverId);
            orderSkippedDrivers.set(orderId, currentSkips);
        }

        // Reset order status in DB to processing/paid so it is eligible for re-dispatch
        const order = await Order.findById(orderId);
        if (order && order.status === 'assigned' && order.rider?.toString() === driverId) {
            order.rider = null;
            order.status = 'processing';
            await order.save();
        }

        // Re-run matching algorithm to assign the next closest rider
        await dispatchOrder(orderId, currentSkips);
    } catch (error) {
        console.error('[Dispatcher] Error declining order assignment:', error);
    }
}

/**
 * Clears the order skip cache once delivery starts or order is finished.
 */
export function clearOrderSkipCache(orderId: string): void {
    orderSkippedDrivers.delete(orderId);
}
