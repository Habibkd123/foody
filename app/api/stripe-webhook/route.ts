// /app/api/stripe-webhook/route.ts
import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import Order from "@/app/models/Order";
import connectDB from "@/lib/mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-08-27.basil" });

export async function POST(request: NextRequest) {
  try {
    const sig = request.headers.get("stripe-signature");

    if (!sig) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    const buf = await request.arrayBuffer();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        Buffer.from(buf),
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json(
        { error: `Webhook error: ${err.message}` },
        { status: 400 }
      );
    }

    // Handle successful payment
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        await connectDB();
        await Order.findByIdAndUpdate(orderId, {
          status: "PAID",
          paymentId: session.id,
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
