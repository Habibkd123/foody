import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import OrderReview from '@/app/models/OrderReview';
import Order from '@/app/models/Order';
import User from '@/app/models/User';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const reviews = await OrderReview.find({})
            .populate('user', 'firstName lastName email')
            .populate('restaurant', 'restaurant.name')
            .populate('driver', 'firstName lastName')
            .populate('order', 'orderId')
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ success: true, data: reviews });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, message: 'Review ID required' }, { status: 400 });
        }

        await OrderReview.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: 'Review deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
