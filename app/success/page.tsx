"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuthStorage } from "@/hooks/useAuth";
import { useCartOrder } from "@/context/OrderContext";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const paymentIntent =
    searchParams.get("payment_intent") || searchParams.get("payment_id");

  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [cartCleared, setCartCleared] = useState(false);
  const { user } = useAuthStorage();
  const { clearCart } = useCartOrder();

  useEffect(() => {
    if (!paymentIntent) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/by-session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: paymentIntent }),
        });

        const data = await res.json();
        console.log("Order data:", data);

        if (res.ok && data.success) setOrder(data.data);
        else setError(data.error || "Order not found.");
      } catch (err) {
        setError("Unable to load your order.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [paymentIntent]);

  // Clear the user's cart once after we have a successful order
  useEffect(() => {
    const run = async () => {
      try {
        if (order && user?._id && !cartCleared) {
          await clearCart(user._id);
          setCartCleared(true);
        }
      } catch {
        // ignore
      }
    };
    run();
  }, [order, user?._id, clearCart, cartCleared]);

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading your order...</p>;

  if (!paymentIntent)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-3xl font-bold text-red-600">Payment Error</h1>
        <p className="mt-4 text-gray-600">Missing payment intent. Please contact support.</p>
      </div>
    );

  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-orange-500 via-red-600 to-pink-600 shadow-lg border-b border-orange-100">
        <div className="max-w-8xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 group">
            <img
              src="/logoGro.png"
              className="w-10 h-10 rounded-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
              alt="logo"
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-200 via-yellow-300 to-pink-200 bg-clip-text text-transparent">
              Gro-Delivery
            </h1>
          </div>
        </div>
      </header>

      {/* Success content */}
      <main className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <h1 className="text-3xl font-bold text-green-600">Payment Successful 🎉</h1>
        <p className="mt-4 text-gray-700">Your Payment Intent ID: {paymentIntent}</p>

        {error && <p className="mt-2 text-red-500">{error}</p>}

        {order && (
          <div className="mt-6 bg-white shadow-md rounded-xl p-5 w-full max-w-md text-left">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Order Summary</h2>
            <p className="text-gray-600">Order ID: <span className="font-medium">{order?.orderId}</span></p>
            <p className="text-gray-600">Total: <span className="font-medium">₹{order?.total}</span></p>
            <div className="mt-4 flex gap-2">
              <Link href={`/feedback?orderId=${order?.orderId ?? ''}`}>
                <Button className="bg-orange-500 hover:bg-orange-600">Leave Feedback</Button>
              </Link>
              <Link href="/profile?tab=orders">
                <Button variant="outline">View Your Orders</Button>
              </Link>
            </div>
            {cartCleared && (
              <p className="text-xs text-emerald-600 mt-2">Your cart has been cleared.</p>
            )}
          </div>
        )}

        <Link href="/">
          <Button className="mt-6 bg-green-600 hover:bg-green-700 transition">
            Go Home
          </Button>
        </Link>
      </main>
    </div>
  );
}
