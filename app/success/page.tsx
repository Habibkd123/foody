"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  // Support Stripe (payment_intent) and Razorpay (payment_id)
  const paymentIntent = searchParams.get("payment_intent") || searchParams.get("payment_id");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!paymentIntent) return;
  
    fetch(`/api/orders/by-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({sessionId: paymentIntent }) // works for both Stripe payment_intent and Razorpay payment_id
    })
      .then(res => res.json())
      .then(data => {
        console.log("myData", data);
        if (data.success) {
          setOrder(data.data);
        } else {
          setError(data.error || "Order not found.");
        }
      })
      .catch(() => setError("Unable to load your order.")).finally(() => setLoading(false)) ;
  }, [paymentIntent]);
  
  if (loading) return <p className="text-center mt-10">Loading your order...</p>;

  if (!paymentIntent)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold text-red-600">Payment Error</h1>
        <p className="mt-4">Missing payment intent. Please contact support.</p>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold text-green-600">Payment Successful 🎉</h1>
      <p className="mt-4">Your Payment Intent ID: {paymentIntent}</p>
      {error && <p className="mt-2 text-red-500">{error}</p>}
      {order && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          <p>Order ID: {order?.orderId}</p>
          <p>Total: ₹{order?.total}</p>
        </div>
      )}
    </div>
  );
}
