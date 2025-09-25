// /app/api/stripe-webhook/route.ts
import Stripe from "stripe";
import { buffer } from "micro";
import Order from "@/app/models/Order";
import connectDB from "@/lib/mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-08-27.basil" });

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"]!;
    let event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
      console.log(err);
      return res.status(400).send(`Webhook error: ${err.message}`);
    }

    // Handle successful payment
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const orderId = session.metadata.orderId;
      await connectDB();
      await Order.findByIdAndUpdate(orderId, { status: "PAID", payment: session.id });
    }

    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
