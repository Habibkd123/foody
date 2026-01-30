import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/app/models/Order';

// Mock data - Replace with actual Order model
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;

        // TODO: Replace with actual 
        let orderData = await Order.find({ driver: id, status: { $in: ['assigned', 'picked_up'] } })

        if (!orderData) {
            orderData = [
                {
                    _id: '1',
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
        return NextResponse.json({
            success: false,
            message: error.message,
        }, { status: 500 });
    }
}
