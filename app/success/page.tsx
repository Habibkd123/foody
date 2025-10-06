"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/orders/by-session?sessionId=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOrder(data.data); // assuming backend returns order details here
          } else {
            setError(data.error || "Order not found.");
          }
        })
        .catch(() => setError("Unable to load your order."));
    }
  }, [sessionId]);

  if (!sessionId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold text-red-600">Payment Error</h1>
        <p className="mt-4">Missing session ID. Please contact support if you haven't received confirmation.</p>
        <a
          href="/"
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Go Home
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold text-green-600">
        Payment Successful 🎉
      </h1>
      <p className="mt-4">Your session ID is: {sessionId}</p>
      {error && <p className="mt-2 text-red-500">{error}</p>}
      {order && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          <p>Order ID: {order?.orderId}</p>
          <p>Total: ₹{order?.total}</p>
          {/* Add more summary details as needed */}
        </div>
      )}
      <a
        href="/"
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Go Home
      </a>
    </div>
  );
}
