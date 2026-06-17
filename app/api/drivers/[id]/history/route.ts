import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/app/models/Order';
import Product from '@/app/models/Product';
import User from '@/app/models/User';
import Delivery from '@/app/models/Delivery';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;

        // Query the database for orders assigned to this rider that are delivered or cancelled
        const dbOrders = await Order.find({
            rider: id,
            status: { $in: ['delivered', 'cancelled', 'canceled'] }
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
        .sort({ updatedAt: -1 })
        .lean();

        const formattedOrders = dbOrders.map((order: any) => {
            const customerAddress = order.delivery?.address || 
                (order.user?.addresses?.find((a: any) => a.isDefault)?.address) || 
                (order.user?.addresses?.[0]?.address) || 
                'No address';

            const firstProduct = order.items?.[0]?.product;
            const restaurantUser = firstProduct?.restaurantId;
            const restaurantName = restaurantUser?.restaurant?.name || 'Restaurant';

            return {
                _id: order._id.toString(),
                orderNumber: order.orderId || `ORD-${order._id.toString().slice(-6).toUpperCase()}`,
                date: new Date(order.updatedAt || order.createdAt).toLocaleString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                restaurant: restaurantName,
                deliveryAddress: customerAddress,
                amount: order.total || 0,
                deliveryFee: 50, // default fee per delivery
                status: order.status === 'delivered' ? 'delivered' : 'cancelled'
            };
        });

        return NextResponse.json({
            success: true,
            orders: formattedOrders,
        });
    } catch (error: any) {
        console.error('Error fetching driver history:', error);
        return NextResponse.json({
            success: false,
            message: error.message,
        }, { status: 500 });
    }
}
