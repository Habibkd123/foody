// import Stripe from "stripe";
// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";
// import Order from "@/app/models/Order";
// import Product from "@/app/models/Product";
// import mongoose from "mongoose";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2025-08-27.basil",
// });

// export async function POST(req: NextRequest) {
//   try {
//     const { items, orderId, userId, total, method } = await req.json();

//     if (!items || items.length === 0) {
//       return NextResponse.json({ error: "No items provided" }, { status: 400 });
//     }

//     await connectDB();

//     // Fetch product details for each item
//     const itemsWithDetails = await Promise.all(
//       items.map(async (item: any) => {
//         const objectId = new mongoose.Types.ObjectId(item.product);
//         const product = await Product.findById(objectId).lean();
//         if (!product) throw new Error(`Product not found: ${item.product}`);
//         return { ...item, product };
//       })
//     );

//     // Prepare Stripe line items
//     const line_items = itemsWithDetails.map((item: any) => ({
//       price_data: {
//         currency: "inr",
//         product_data: {
//           name: item.product.name,
//         },
//         unit_amount: Math.round(item.product.price * 100), // in paise
//       },
//       quantity: item.quantity || 1,
//     }));

//     // Create Stripe checkout session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: [method],
//       mode: "payment",
//       line_items,
//       success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
//       metadata: { orderId },
//     });

//     // Save order in DB
//     const order = new Order({
//       user: userId,
//       orderId,
//       items: itemsWithDetails.map((item: any) => ({
//         product: item.product._id,
//         quantity: item.quantity,
//         price: item.product.price,
//       })),
//       total,
//       method,
//       paymentId: session.id,
//       status: "pending",
//     });

//     await order.save();

//     return NextResponse.json({ url: session.url });
//   } catch (error: any) {
//     console.error("Stripe POST error:", error);
//     return NextResponse.json({ error: error.message || error }, { status: 500 });
//   }
// }


import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/app/models/Order";
import Product from "@/app/models/Product";
import mongoose from "mongoose";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { items, orderId, userId, total, method } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    await connectDB();

    // Fetch product details for each item
    const itemsWithDetails = await Promise.all(
      items.map(async (item: any) => {
        const objectId = new mongoose.Types.ObjectId(item.product);
        const product = await Product.findById(objectId).lean();
        if (!product) throw new Error(`Product not found: ${item.product}`);
        return { ...item, product };
      })
    );

    // Stripe line items
    const line_items = itemsWithDetails.map((item: any) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.product.name,
        },
        unit_amount: Math.round(item.product.price * 100), // paise
      },
      quantity: item.quantity || 1,
    }));

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      payment_method_types: [method || "card"], // fallback to card
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      metadata: { orderId: String(orderId), userId: String(userId) },
    });

    // Save order in DB
    const order = new Order({
      user: userId,
      orderId,
      items: itemsWithDetails.map((item: any) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      total,
      method,
      paymentId: session.id,
      status: "pending",
    });

    await order.save();

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe POST error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

