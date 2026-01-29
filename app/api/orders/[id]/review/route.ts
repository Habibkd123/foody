import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/app/models/Order';
import OrderReview from '@/app/models/OrderReview';
import User from '@/app/models/User';
import mongoose from 'mongoose';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const body = await request.json();
        const { id } = params;
        const {
            userId,
            restaurantRating,
            restaurantComment,
            driverRating,
            driverComment
        } = body;

        if (!userId || !restaurantRating) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        const order = await Order.findById(id).populate('items.product');
        if (!order) {
            return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
        }

        if (order.status !== 'delivered') {
            return NextResponse.json({ success: false, message: 'Order must be delivered before reviewing' }, { status: 400 });
        }

        // Get restaurant ID from the first product
        const restaurantId = order.items[0]?.product?.restaurantId;
        if (!restaurantId) {
            return NextResponse.json({ success: false, message: 'Restaurant not found for this order' }, { status: 400 });
        }

        // Create the review
        const review = await OrderReview.create({
            user: userId,
            order: id,
            restaurant: restaurantId,
            driver: order.rider || undefined,
            restaurantRating,
            restaurantComment,
            driverRating,
            driverComment
        });

        // Award Loyalty Points to User
        const userToUpdate = await User.findById(userId);
        if (userToUpdate) {
            userToUpdate.loyaltyPoints = (userToUpdate.loyaltyPoints || 0) + 10;
            await userToUpdate.save();
        }

        // Update Restaurant Stats
        const restaurant = await User.findById(restaurantId);
        if (restaurant && restaurant.restaurant) {
            const currentReviews = restaurant.restaurant.reviews || 0;
            const currentRating = restaurant.restaurant.rating || 5;

            // Basic moving average: (oldRate * oldReviews + newRate) / (oldReviews + 1)
            const newRating = ((currentRating * currentReviews) + restaurantRating) / (currentReviews + 1);

            restaurant.restaurant.reviews = currentReviews + 1;
            restaurant.restaurant.rating = Number(newRating.toFixed(1));
            await restaurant.save();
        }

        // Update Driver Stats if applicable
        if (order.rider && driverRating) {
            const driver = await User.findById(order.rider);
            if (driver && driver.driverDetails) {
                const currentReviews = driver.driverDetails.stats?.reviews || 0;
                const currentRating = driver.driverDetails.stats?.rating || 5;

                const newRating = ((currentRating * currentReviews) + driverRating) / (currentReviews + 1);

                if (!driver.driverDetails.stats) driver.driverDetails.stats = {};
                driver.driverDetails.stats.reviews = currentReviews + 1;
                driver.driverDetails.stats.rating = Number(newRating.toFixed(1));
                await driver.save();
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Review submitted successfully',
            data: review
        });

    } catch (error: any) {
        console.error('Review submission error:', error);
        if (error.code === 11000) {
            return NextResponse.json({ success: false, message: 'You have already reviewed this order' }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const review = await OrderReview.findOne({ order: params.id });
        return NextResponse.json({ success: true, data: review });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
