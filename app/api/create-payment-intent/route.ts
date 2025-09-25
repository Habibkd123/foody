// app/api/create-payment-intent/route.js
import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/app/models/Order";
import Product from "@/app/models/Product";
import mongoose from "mongoose";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
    const { amount } = await req.json(); // get payment amount (in cents)
    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        automatic_payment_methods: { enabled: true },
    });

    return NextResponse
        .json({ clientSecret: paymentIntent.client_secret });
}
