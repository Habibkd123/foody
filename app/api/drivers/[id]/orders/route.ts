import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/app/models/Order';
import User from '@/app/models/User';
import Product from '@/app/models/Product';
import Delivery from '@/app/models/Delivery';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;

        // Query the database for orders assigned to this rider with active statuses
        const dbOrders = await Order.find({
            rider: id,
            status: { $in: ['assigned', 'processing', 'shipped'] }
        })
        .populate('user', 'firstName lastName phone addresses')
        .populate({
            path: 'items.product',
            select: 'name price restaurantId',
            populate: {
                path: 'restaurantId',
                select: 'restaurant'
            }
        })
        .populate('delivery', 'address status')
        .lean();

        let orderData = [];

        if (dbOrders && dbOrders.length > 0) {
            orderData = dbOrders.map((order: any) => {
                const customerName = order.user ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() : 'Customer';
                const customerPhone = order.user?.phone || 'No phone';
                const customerAddress = order.delivery?.address || 
                    (order.user?.addresses?.find((a: any) => a.isDefault)?.address) || 
                    (order.user?.addresses?.[0]?.address) || 
                    'No address';

                const firstProduct = order.items?.[0]?.product;
                const restaurantUser = firstProduct?.restaurantId;
                const restaurantName = restaurantUser?.restaurant?.name || 'Restaurant';
                const restaurantAddress = restaurantUser?.restaurant?.address || 'Restaurant Address';

                const itemsFormatted = order.items.map((item: any) => ({
                    name: item.product?.name || 'Item',
                    quantity: item.quantity || 1,
                    price: item.price || 0
                }));

                // Map DB status to dashboard status:
                // DB 'assigned' -> frontend 'assigned'
                // DB 'processing' -> frontend 'accepted'
                // DB 'shipped' -> frontend 'picked_up'
                let status = 'assigned';
                if (order.status === 'processing') status = 'accepted';
                if (order.status === 'shipped') status = 'picked_up';
                if (order.status === 'delivered') status = 'delivered';

                return {
                    _id: order._id.toString(),
                    orderNumber: order.orderId || `ORD-${order._id.toString().slice(-6).toUpperCase()}`,
                    customer: {
                        name: customerName,
                        phone: customerPhone,
                        address: customerAddress,
                    },
                    restaurant: {
                        name: restaurantName,
                        address: restaurantAddress,
                    },
                    items: itemsFormatted,
                    totalAmount: order.total || 0,
                    deliveryFee: 50, // default/calculated delivery fee
                    status: status,
                    distance: '3.2 km', // mock distance
                    estimatedTime: '15 mins', // mock ETA
                };
            });
        } else {
            // Mock data fallback if no active orders are found in DB
            orderData = [
                {
                    _id: 'mock_1',
                    orderNumber: 'ORD-2024-001',
                    customer: {
                        name: 'Rahul Kumar',
                        phone: '9876543210',
                        address: '123 Main Street, Sector 15, Delhi - 110001',
                    },
                    restaurant: {
                        name: 'Pizza Palace',
                        address: '456 Food Street, Connaught Place, Delhi',
                    },
                    items: [
                        { name: 'Margherita Pizza', quantity: 2 },
                        { name: 'Garlic Bread', quantity: 1 },
                    ],
                    totalAmount: 650,
                    deliveryFee: 50,
                    status: 'assigned',
                    distance: '3.2 km',
                    estimatedTime: '15 mins',
                },
            ];
        }

        return NextResponse.json({
            success: true,
            orders: orderData,
        });
    } catch (error: any) {
        console.error('Error in driver orders route:', error);
        return NextResponse.json({
            success: false,
            message: error.message,
        }, { status: 500 });
    }
}
