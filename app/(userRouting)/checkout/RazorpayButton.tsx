"use client";
import { useEffect, useState } from "react";
import { useAuthStorage } from "@/hooks/useAuth";
import { useOrder } from "@/context/OrderContext";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

interface RazorpayButtonProps {
  totalAmount: number;
}

export default function RazorpayButton({ totalAmount }: RazorpayButtonProps) {
  const { user } = useAuthStorage();
  const { state } = useOrder();
  const [loading, setLoading] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const existing = document.querySelector('#razorpay-script');
    if (existing) { setScriptReady(true); return; }
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setScriptReady(true);
    script.onerror = () => setScriptReady(false);
    document.body.appendChild(script);
  }, []);

  const handlePay = async () => {
    if (!scriptReady) return;
    setLoading(true);

    try {
      // 1) Create Razorpay order on server
      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount, currency: 'INR' })
      });
      const orderData = await orderRes.json();
      if (!orderData?.success) throw new Error(orderData?.error || 'Failed to create Razorpay order');

      const order = orderData.order;

      // 2) Open Razorpay checkout
      const options: any = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Foody',
        description: 'Order Payment',
        order_id: order.id,
        prefill: {
          name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Customer',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        handler: async function (response: any) {
          console.log("newdatafor razarpay", response)
          // 3) Verify payment and create our order in DB
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              user: user?._id,
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
              method: 'razorpay',
              notes: state?.notes || '',
              address: state?.address?.area,
              deliveryLocation: { lat: (state as any)?.address?.lat, lng: (state as any)?.address?.lng },
              orderId: order.id,
            })
          });
          const verifyData = await verifyRes.json();
          console.log("newdatafor razarpay", verifyData)
          if (verifyData?.success) {
            // window.location.href = `/success?payment_id=${response.razorpay_payment_id}`;
          } else {
            alert(verifyData?.error || 'Payment verification failed');
          }
        },
        theme: { color: '#10b981' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e: any) {
      alert(e?.message || 'Unable to start Razorpay');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={loading || !scriptReady}
      className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 shadow-lg border-b border-orange-100 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex justify-center text-sm sm:text-base disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {loading ? 'Processing...' : 'Pay with Razorpay'}
    </button>
  );
}
