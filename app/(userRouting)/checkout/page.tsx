
"use client";
import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions, Appearance } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";
import { useAuthStorage } from "@/hooks/useAuth";
import { useOrder, useCartOrder } from "@/context/OrderContext";
import { useAddress } from "@/context/AddressContext";
import { Star } from "lucide-react";
import RazorpayButton from "./RazorpayButton";
import NotificationBanner from "@/components/NotificationBanner";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [gateway, setGateway] = useState<'stripe' | 'razorpay'>('stripe');
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const { state, dispatch } = useOrder();
  const { user } = useAuthStorage();
  const { loadCart, getAddresses } = useCartOrder();
  const { defaultAddress, loadAddresses } = useAddress();

  // Ensure cart and address are loaded on refresh
  useEffect(() => {
    if (user?._id) {
      loadCart(user._id);
      getAddresses(user._id);
      loadAddresses(user._id);
    }
  }, [user?._id, loadCart, getAddresses, loadAddresses]);

  const itemsSubtotal = state?.items?.reduce((t, i) => t + i.price * i.quantity, 0) || 0;
  const totalItemsQty = state?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  const discountAmount = Number(state?.discountAmount || 0);
  const payableItemsSubtotal = Math.max(0, itemsSubtotal - discountAmount);

  const totalAmount =
    payableItemsSubtotal +
    (state?.tip || 0) +
    (state?.deliveryCharge || 0) +
    (state?.handlingCharge || 0) +
    (state?.donation || 0);

  const primaryProductId = state?.items?.[0]?.productId || (state?.items?.[0]?.id ? String(state.items[0].id).split(':')[0] : undefined);

  const applyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setCouponLoading(true);
    setCouponError(null);

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          cartTotal: itemsSubtotal,
          userId: user?._id,
          productId: primaryProductId,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        setCouponError(data?.error || 'Failed to apply coupon');
        return;
      }
      const nextDiscount = Number(data?.data?.discount || 0);
      dispatch({ type: 'SET_COUPON', couponCode: code, discountAmount: nextDiscount });
    } catch (e: any) {
      setCouponError(e?.message || 'Failed to apply coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const clearCoupon = () => {
    dispatch({ type: 'CLEAR_COUPON' });
    setCouponError(null);
  };

  const effectiveAddress = (state?.address as any) || (defaultAddress as any) || null;
  const addrLabel = effectiveAddress?.label || 'Selected';
  const addrLines: string[] = [];
  if (effectiveAddress) {
    const name = effectiveAddress?.name;
    const phone = effectiveAddress?.phone;
    const line1 = [effectiveAddress?.street || effectiveAddress?.flatNumber, effectiveAddress?.floor ? `Floor ${effectiveAddress.floor}` : '']
      .filter(Boolean).join(', ');
    const line2 = [effectiveAddress?.area, effectiveAddress?.city].filter(Boolean).join(', ');
    const line3 = [effectiveAddress?.state, effectiveAddress?.zipCode].filter(Boolean).join(' ');
    const landmark = effectiveAddress?.landmark ? `Near ${effectiveAddress.landmark}` : '';
    if (name) addrLines.push(`${name}${phone ? ` · ${phone}` : ''}`);
    if (line1) addrLines.push(line1);
    if (line2) addrLines.push(line2);
    if (line3) addrLines.push(line3);
    if (landmark) addrLines.push(landmark);
  }

  useEffect(() => {
    // Fetch active payment gateway from settings
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data?.data?.paymentGateway === 'razorpay') setGateway('razorpay');
        else setGateway('stripe');
      })
      .catch(() => setGateway('stripe'));

    if (!totalAmount || totalAmount < 50) {
      setClientSecret("");
      return;
    }

    if (gateway === 'stripe') {
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(totalAmount * 100), // convert ₹ to paise
          currency: "inr",
        }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
        .catch((err) => console.error("Error creating payment intent:", err));
    }
  }, [totalAmount, gateway]);

  const appearance: Appearance = {
    theme: "stripe",
    variables: { colorPrimary: "#50667c" },
  };

  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 px-3 sm:px-6 py-5 sm:py-10">
      {/* ✅ HEADER */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 shadow-sm px-3 sm:px-6 py-3 sm:py-4 rounded-2xl mb-6 sm:mb-10">
         <div className="flex items-center gap-2 group">
            <img
              src="/logoGro.png"
              className="w-10 h-10 rounded-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
              alt="logo"
            />
            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text">
              Gro-Delivery
            </h1>
          </div>
        <div className="text-white/90 text-sm sm:text-base">
          <span className="font-semibold">Need help?</span> support@gostay.com
        </div>
      </header>

      {/* Notifications for checkout */}
      <div className="max-w-6xl mx-auto mb-6">
        <NotificationBanner location="checkout" />
      </div>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Secure Checkout</h2>
          <p className="text-gray-600 text-sm sm:text-base">Choose your preferred payment method</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {gateway === 'stripe' ? (
            clientSecret ? (
              <Elements stripe={stripePromise} options={options}>
                <PaymentForm totalAmount={totalAmount} />
              </Elements>
            ) : (
              <div className="p-4 sm:p-6 rounded-2xl border-2 border-gray-200 bg-white">Preparing Stripe checkout...</div>
            )
          ) : (
            <div className="p-4 sm:p-6 rounded-2xl border-2 border-gray-200 bg-white">
              <RazorpayButton totalAmount={totalAmount} />
            </div>
          )}

          {/* Order Summary */}
          <div className="w-full space-y-6">
            <div className="lg:sticky lg:top-6 bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-xl">
              <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-4 sm:p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">Order Summary</h2>
                <div className="flex items-center">
                  <Star className="text-yellow-300 mr-1" size={16} />
                  <span className="text-sm">Secure & Fast Checkout</span>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Kitchen Notes</h3>
                  <div className="text-xs text-gray-500 mb-2">Examples: Less spicy, No onion, Extra sauce</div>
                  <textarea
                    value={state?.notes || ''}
                    onChange={(e) => dispatch({ type: 'SET_NOTES', notes: e.target.value })}
                    rows={3}
                    placeholder="Add any special instructions for the kitchen"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Delivery Address</h3>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    {effectiveAddress ? (
                      <div className="text-sm text-gray-700 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800">{addrLabel}</span>
                          {effectiveAddress?.isDefault && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Default</span>
                          )}
                        </div>
                        {addrLines.map((l, i) => (
                          <p key={i}>{l}</p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No address selected yet.</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center justify-between">
                    My Cart
                    <span className="text-sm bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                      {totalItemsQty} items
                    </span>
                  </h3>

                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Coupon</h3>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Enter coupon code"
                        className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800"
                      />
                      <button
                        onClick={applyCoupon}
                        disabled={couponLoading || !couponInput.trim() || !primaryProductId}
                        className="w-full sm:w-auto rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
                        type="button"
                      >
                        {couponLoading ? 'Applying...' : 'Apply'}
                      </button>
                      {!!state?.couponCode && (
                        <button
                          onClick={clearCoupon}
                          type="button"
                          className="w-full sm:w-auto rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    {couponError && (
                      <div className="mt-2 text-sm text-red-600">{couponError}</div>
                    )}
                    {!!state?.couponCode && !couponError && (
                      <div className="mt-2 text-sm text-emerald-700">
                        Applied: <span className="font-semibold">{String(state.couponCode).toUpperCase()}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    {state?.items?.map((item, index) => {
                      const lineTotal = (item.price * item.quantity).toFixed(2);
                      return (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <p className="font-medium text-gray-800">{item.name} × {item.quantity}</p>
                          <span className="font-semibold text-gray-800">₹{lineTotal}</span>
                        </div>
                      );
                    })}

                    {state?.tip > 0 && (
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-800">Tip</p>
                        <span className="font-semibold text-gray-800">₹{Number(state.tip).toFixed(2)}</span>
                      </div>
                    )}

                    {(state?.donation ?? 0) > 0 && (
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-800">Donation</p>
                        <span className="font-semibold text-gray-800">₹{Number(state?.donation ?? 0).toFixed(2)}</span>
                      </div>
                    )}

                    {state?.deliveryCharge > 0 && (
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-800">Delivery Charge</p>
                        <span className="font-semibold text-gray-800">₹{Number(state.deliveryCharge).toFixed(2)}</span>
                      </div>
                    )}

                    {state?.handlingCharge > 0 && (
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-800">Handling Charge</p>
                        <span className="font-semibold text-gray-800">₹{Number(state.handlingCharge).toFixed(2)}</span>
                      </div>
                    )}

                    {discountAmount > 0 && (
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-800">Discount</p>
                        <span className="font-semibold text-emerald-700">-₹{discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-200 mt-4 pt-4">
                    <div className="flex justify-between items-center text-lg font-bold text-gray-800">
                      <span>Total Amount</span>
                      <span className="text-emerald-600">₹{totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  🔒 Your payment information is secure and encrypted
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
