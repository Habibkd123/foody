"use client";
import { useState, FormEvent } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useAuthStorage } from "@/hooks/useAuth";
import { useOrder } from "@/context/OrderContext";

export default function PaymentForm({totalAmount}:any) {
  const stripe = useStripe();
  const elements = useElements();
 const { user } = useAuthStorage()
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
 const { dispatch, state } = useOrder();
// in PaymentForm.jsx
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  if (!stripe || !elements) return;
  setIsLoading(true);
  const { error, paymentIntent } = await stripe.confirmPayment({
    elements,
    confirmParams: { return_url: `${window.location.origin}/success` },
    redirect: "if_required"
  });
console.log("ddddddddd", error, paymentIntent)
  if (error) {
    setMessage(error.message || "An unexpected error occurred.");
    setIsLoading(false);
    return;
  }

  // If paymentIntent status is succeeded, save order
  if (paymentIntent?.status === "succeeded") {
    // Call backend order save API
    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: user?.id,
        items: state.items.map((i:any) => ({ product: i.product, quantity: i.quantity, price: i.price })),
        total: totalAmount,
        paymentId: paymentIntent.id,
        delivery: state?.address?.label,
        method: "card",
        orderId: paymentIntent.id
      })
    });
    // Redirect or show confirmation UI on success
  }
  setIsLoading(false);
};


  const paymentElementOptions = { layout: "accordion" };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <button disabled={isLoading || !stripe || !elements} id="submit"   className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
