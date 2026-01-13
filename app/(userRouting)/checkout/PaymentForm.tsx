"use client";
import { useState, FormEvent, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useAuthStorage } from "@/hooks/useAuth";
import { useOrder } from "@/context/OrderContext";

interface PaymentFormProps {
  totalAmount: number;
}

export default function PaymentForm({ totalAmount }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuthStorage();
  const { state } = useOrder();
  const [message, setMessage] = useState<string | null>(null);
  const [user_id, setUserId] = useState('')
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    let result=   state.items;
    console.log("result", result.map((i: any) => ({
      product: i?.id,
      quantity: i.quantity,
      price: i.price,
    })))
    setUserId(user?._id)
  }, [user?._id])
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/success` },
      redirect: "if_required",
    });

    console.log("Payment Response:", error, paymentIntent);

    if (error) {
      setMessage(error.message || "An unexpected error occurred.");
      setIsLoading(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user:user_id,
          items: state.items.map((i: any) => ({
            product: i?.productId || String(i?.id).split(':')[0],
            quantity: i.quantity,
            price: i.price,
            variant: i.variant,
            addons: i.addons,
          })),
          total: totalAmount,
          tip: state?.tip || 0,
          deliveryCharge: state?.deliveryCharge || 0,
          handlingCharge: state?.handlingCharge || 0,
          donation: state?.donation || 0,
          couponCode: state?.couponCode || '',
          paymentId: paymentIntent.id,
          delivery: state?.address?.label || "No address provided",
          deliveryLocation: { lat: (state as any)?.address?.lat, lng: (state as any)?.address?.lng },
          notes: state?.notes || '',
          method: "card",
          orderId: paymentIntent.id,
          sessionId: paymentIntent.id,
        }),
      });

      if (!response.ok) {
        setMessage("Failed to save order. Please contact support.");
        setIsLoading(false);
        return;
      }

      window.location.href = "/success";
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4">
        <PaymentElement id="payment-element" options={{ layout: "accordion" }} />
      </div>

      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex justify-center"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
        ) : (
          "Pay now"
        )}
      </button>

      {message && (
        <div
          id="payment-message"
          className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
        >
          {message}
        </div>
      )}
    </form>
  );
}
