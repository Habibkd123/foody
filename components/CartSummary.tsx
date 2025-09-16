"use client";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartOrder, useOrder } from "@/context/OrderContext";
import { useAuthStorage } from "@/hooks/useAuth";
const coupons = [
  {
    id: 3,
    title: "Free Delivery",
    code: "FREEDEL",
    description: "On orders above ₹500",
    expiry: "2025-08-10",
    color: "bg-gradient-to-r from-purple-400 to-pink-500",
  },
];

const donations = [
  { id: 1, title: "Nice", amount: 20, emoji: "😊" },
  { id: 2, title: "Awesome", amount: 30, emoji: "😍" },
  { id: 3, title: "Superstar", amount: 50, emoji: "🤩" },
  { id: 4, title: "Hero", amount: 80, emoji: "✨" },
];

const CartSummary = ({ cartItems }: any) => {
  const { dispatch } = useOrder();
  const { addToCart, loading, error, removeFromCart, updateQuantity } = useCartOrder();
  const { user } = useAuthStorage()
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [customCoupon, setCustomCoupon] = useState("");
  const [includeDonation, setIncludeDonation] = useState(false);
  const [showCustomTipInput, setShowCustomTipInput] = useState(false);
  const [selectedTip, setSelectedTip] = useState<number>(0);
  const [customTipValue, setCustomTipValue] = useState<string>("");
  const getTotalPrice = () =>
    cartItems.reduce((total: number, item: any) => total + item.price * item.quantity, 0);

  const isFreeDelivery = getTotalPrice() >= 500 || appliedCoupon === "FREEDEL";
  const deliveryCharge = isFreeDelivery ? 0 : 25;
  const handlingCharge = 2;
  const donationAmount = includeDonation ? 1 : 0;

  useEffect(() => {
    dispatch({ type: "SET_DELIVERY_CHARGE", deliveryCharge });
    dispatch({ type: "SET_HANDLING_CHARGE", handlingCharge });
    dispatch({ type: "SET_TIP", tip: selectedTip });
  }, [deliveryCharge, handlingCharge, selectedTip, dispatch]);

  const grandTotal =
    getTotalPrice() + deliveryCharge + handlingCharge + donationAmount + selectedTip;

  const applyCoupon = () => {
    const coupon = coupons.find((c) => c.code === customCoupon.toUpperCase());
    if (coupon) {
      setAppliedCoupon(coupon.code);
      alert(`✅ Coupon ${coupon.code} applied successfully!`);
    } else {
      alert("❌ Invalid coupon code.");
    }
  };

  const handleCustomTip = () => {
    const parsed = parseInt(customTipValue);
    if (!isNaN(parsed) && parsed >= 0) {
      setSelectedTip(parsed);
      setShowCustomTipInput(false);
    } else {
      alert("🚫 Invalid tip amount.");
    }
  };


  return (
    <div className="max-w-md mx-auto px-2 border rounded-lg shadow-md bg-white">
      {cartItems.map((item: any) => (
        <div
          key={item.id}
          className="flex items-center space-x-3 p-3 bg-orange-100 rounded-lg mt-2"
        >
          <img
            src={item?.image || "/placeholder.svg"}
            alt={item.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h4 className="font-medium text-sm">{item.name}</h4>
            <p className="text-orange-500 font-semibold">₹{item.price}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
              onClick={() => updateQuantity(user?._id, item.id, item.quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
              onClick={() => updateQuantity(user?._id, item.id, item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-red-500"
              onClick={() => removeFromCart(user?._id, item.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}

      {/* Charges */}
      <div className="space-y-2 mt-4">
        <div className="flex justify-between">
          <span>Items total</span>
          <span>₹{getTotalPrice()}</span>
        </div>
        {!isFreeDelivery && (
          <div className="flex justify-between">
            <span>Delivery charge</span>
            <span>₹{deliveryCharge}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Handling charge</span>
          <span>₹{handlingCharge}</span>
        </div>
        {includeDonation && (
          <div className="flex justify-between">
            <span>Donation</span>
            <span>₹{donationAmount}</span>
          </div>
        )}
        {selectedTip > 0 && (
          <div className="flex justify-between">
            <span>Tip</span>
            <span>₹{selectedTip}</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-lg">Grand total:</span>
          <span className="font-semibold text-lg">₹{grandTotal}</span>
        </div>

        {/* Coupon input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Enter coupon code"
            value={customCoupon}
            onChange={(e) => setCustomCoupon(e.target.value)}
            className="border p-2 w-full rounded-md"
          />
          <button
            onClick={applyCoupon}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Apply
          </button>
        </div>

        {/* Donation */}
        <div className="bg-yellow-50 p-3 rounded-lg mt-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              <img
                src="https://cdn.grofers.com/assets/ui/icons/feeding_india_icon_v6.png"
                alt="Feeding India"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h4 className="font-semibold text-sm">Feeding India donation</h4>
                <p className="text-xs text-gray-600">
                  Working towards a malnutrition-free India.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold">₹1</span>
              <input
                type="checkbox"
                checked={includeDonation}
                onChange={() => setIncludeDonation(!includeDonation)}
              />
            </div>
          </div>
        </div>

        {/* Tip Section */}
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Tip your delivery partner</h4>
          <p className="text-xs text-orange-600 mb-2">
            Your kindness means a lot! 100% of your tip goes directly to them.
          </p>
          <div className="flex space-x-2 flex-wrap">
            {donations.map((tip) => (
              <Button
                key={tip.id}
                onClick={() => {
                  setSelectedTip(tip.amount);
                  setShowCustomTipInput(false);
                }}
                variant={selectedTip === tip.amount ? "destructiveBackground" : "outline"}
                size="sm"
              >
                {tip.emoji} ₹{tip.amount}
              </Button>
            ))}
            <Button variant="outline" size="sm" onClick={() => setShowCustomTipInput(true)}>
              Custom
            </Button>
          </div>

          {showCustomTipInput && (
            <div className="flex items-center gap-2 mt-4">
              <input
                type="number"
                placeholder="Enter custom tip amount"
                value={customTipValue}
                onChange={(e) => setCustomTipValue(e.target.value)}
                className="border p-2 w-full rounded-md"
              />
              <button
                onClick={handleCustomTip}
                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
              >
                Apply
              </button>
            </div>
          )}
        </div>

        {/* Cancellation Info */}
        <div className="mt-6">
          <h4 className="font-semibold text-sm mb-2">Cancellation Policy</h4>
          <p className="text-xs text-gray-600">
            Orders can't be cancelled once packed. Delays may be refunded.
          </p>
        </div>
      </div>

      {appliedCoupon && (
        <div className="mt-4 text-green-600">
          🎉 Applied Coupon: <strong>{appliedCoupon}</strong>
        </div>
      )}
    </div>
  );
};

export default CartSummary;
