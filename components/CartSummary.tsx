// "use client";
// import React, { useState, useEffect } from "react";
// import { Button } from "./ui/button";
// import { Minus, Plus, Trash2 } from "lucide-react";
// import { useUserStore } from "@/lib/store/useUserStore";
// import { useCartStore } from "@/lib/store/useCartStore";
// import { Input } from "./ui/input";
// const coupons = [
//   {
//     id: 3,
//     title: "Free Delivery",
//     code: "FREEDEL",
//     description: "On orders above ₹500",
//     expiry: "2025-08-10",
//     color: "bg-gradient-to-r from-purple-400 to-pink-500",
//   },
// ];

// const donations = [
//   { id: 1, title: "Nice", amount: 20, emoji: "😊" },
//   { id: 2, title: "Awesome", amount: 30, emoji: "😍" },
//   { id: 3, title: "Superstar", amount: 50, emoji: "🤩" },
//   { id: 4, title: "Hero", amount: 80, emoji: "✨" },
// ];

// const CartSummary = ({ cartItems }: any) => {
//   const { user } = useUserStore();
//   const {
//     updateQuantity,
//     removeItem: removeFromCart,
//     setDeliveryCharge: setStoreDeliveryCharge,
//     setHandlingCharge: setStoreHandlingCharge,
//     setTip: setStoreTip,
//   } = useCartStore();
//   const [appliedCoupon, setAppliedCoupon] = useState("");
//   const [customCoupon, setCustomCoupon] = useState("");
//   const [includeDonation, setIncludeDonation] = useState(false);
//   const [showCustomTipInput, setShowCustomTipInput] = useState(false);
//   const [selectedTip, setSelectedTip] = useState<number>(0);
//   const [customTipValue, setCustomTipValue] = useState<string>("");
//   const [pincode, setPincode] = useState("");
//   const [deliveryAvailability, setDeliveryAvailability] = useState(false);
//   const getTotalPrice = () =>
//     cartItems.reduce((total: number, item: any) => total + item.price * item.quantity, 0);

//   const isFreeDelivery = getTotalPrice() >= 500 || appliedCoupon === "FREEDEL";
//   const deliveryCharge = isFreeDelivery ? 0 : 25;
//   const handlingCharge = 2;
//   const donationAmount = includeDonation ? 1 : 0;

//   useEffect(() => {
//     setStoreDeliveryCharge(deliveryCharge);
//     setStoreHandlingCharge(handlingCharge);
//     setStoreTip(selectedTip);
//   }, [deliveryCharge, handlingCharge, selectedTip, setStoreDeliveryCharge, setStoreHandlingCharge, setStoreTip]);

//   const grandTotal =
//     getTotalPrice() + deliveryCharge + handlingCharge + donationAmount + selectedTip;

//   const applyCoupon = () => {
//     const coupon = coupons.find((c) => c.code === customCoupon.toUpperCase());
//     if (coupon) {
//       setAppliedCoupon(coupon.code);
//       alert(`✅ Coupon ${coupon.code} applied successfully!`);
//     } else {
//       alert("❌ Invalid coupon code.");
//     }
//   };

//   const handleCustomTip = () => {
//     const parsed = parseInt(customTipValue);
//     if (!isNaN(parsed) && parsed >= 0) {
//       setSelectedTip(parsed);
//       setShowCustomTipInput(false);
//     } else {
//       alert("🚫 Invalid tip amount.");
//     }
//   };

//   const handlePincodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const value = event.target.value;
//     setPincode(value);

//     // Automatically check availability
//     if (value.length === 6) {
//       fetchDeliveryAvailability(value);
//     } else {
//       setDeliveryAvailability(false);
//     }
//   };

//   const fetchDeliveryAvailability = async (pincode: string) => {
//     if (!pincode || pincode.length !== 6) {
//       setDeliveryAvailability(false);
//       return;
//     }

//     try {
//       const response = await fetch(`/api/pincode/${pincode}`);
//       if (!response.ok) throw new Error("Pincode not found");

//       const data = await response.json();
//       setDeliveryAvailability(data.serviceable); // assuming your API returns { pincode, city, serviceable, ... }
//     } catch (err) {
//       console.error("Delivery check failed:", err);
//       setDeliveryAvailability(false);
//     }
//   };
//   const getEstimatedDeliveryDate = (daysToAdd = 2) => {
//     const today = new Date();
//     today.setDate(today.getDate() + daysToAdd);

//     return today.toLocaleDateString("en-IN", {
//       weekday: "short",
//       day: "numeric",
//       month: "short",
//     });
//   };

//   return (
//     <div className="max-w-md mx-auto px-2 border rounded-lg shadow-md bg-white">
//       {cartItems.map((item: any) => (
//         <div
//           key={String(item.id)}
//           className="flex items-center space-x-3 p-3 bg-orange-100 rounded-lg mt-2"
//         >
//           <img
//             src={item?.image || "/placeholder.svg"}
//             alt={item.name}
//             className="w-12 h-12 rounded-lg object-cover"
//           />
//           <div className="flex-1">
//             <h4 className="font-medium text-sm">{item.name}</h4>
//             <p className="text-orange-500 font-semibold">₹{item.price}</p>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Button
//               size="icon"
//               variant="outline"
//               className="h-8 w-8"
//               onClick={() => updateQuantity(item.id, item.quantity - 1)}
//             >
//               <Minus className="h-3 w-3" />
//             </Button>
//             <span className="w-8 text-center">{item.quantity}</span>
//             <Button
//               size="icon"
//               variant="outline"
//               className="h-8 w-8"
//               onClick={() => updateQuantity(item.id, item.quantity + 1)}
//             >
//               <Plus className="h-3 w-3" />
//             </Button>
//             <Button
//               size="icon"
//               variant="ghost"
//               className="h-8 w-8 text-red-500"
//               onClick={() => removeFromCart(item.id)}
//             >
//               <Trash2 className="h-3 w-3" />
//             </Button>
//           </div>
//         </div>
//       ))}

//       {/* Charges */}
//       <div className="space-y-2 mt-4">
//         <div className="flex justify-between">
//           <span>Items total</span>
//           <span>₹{getTotalPrice()}</span>
//         </div>
//         {!isFreeDelivery && (
//           <div className="flex justify-between">
//             <span>Delivery charge</span>
//             <span>₹{deliveryCharge}</span>
//           </div>
//         )}
//         <div className="flex justify-between">
//           <span>Handling charge</span>
//           <span>₹{handlingCharge}</span>
//         </div>
//         {includeDonation && (
//           <div className="flex justify-between">
//             <span>Donation</span>
//             <span>₹{donationAmount}</span>
//           </div>
//         )}
//         {selectedTip > 0 && (
//           <div className="flex justify-between">
//             <span>Tip</span>
//             <span>₹{selectedTip}</span>
//           </div>
//         )}
//       </div>
//       <div className="bg-gray-50 p-3 rounded-lg mb-4">
//         <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
//           Enter Pincode
//         </label>
//         <Input
//           id="pincode"
//           name="pincode"
//           type="text"
//           value={pincode}
//           onChange={handlePincodeChange}
//           className="mt-1 block w-full shadow-sm sm:text-sm"
//         />
//       </div>
//       <p className={`text-sm font-semibold ${deliveryAvailability ? "text-green-600" : "text-red-500"}`}>
//         {pincode.length === 6
//           ? deliveryAvailability
//             ? "✅ Delivery Available"
//             : "❌ Delivery Not Available"
//           : "Enter valid 6-digit pincode"}
//       </p>
//       {pincode.length === 6 && deliveryAvailability && (
//         <div className="bg-green-50 p-3 rounded-lg mb-4">
//           <p className="text-sm font-medium text-green-700">
//             🚚 Estimated Delivery: <strong>{getEstimatedDeliveryDate(2)}</strong>
//           </p>
//         </div>
//       )}

//       {/* Total */}
//       <div className="border-t pt-4 mt-4">
//         <div className="flex justify-between items-center mb-4">
//           <span className="font-semibold text-lg">Grand total:</span>
//           <span className="font-semibold text-lg">₹{grandTotal}</span>
//         </div>

//         {/* Coupon input */}
//         <div className="flex items-center gap-2">
//           <input
//             type="text"
//             placeholder="Enter coupon code"
//             value={customCoupon}
//             onChange={(e) => setCustomCoupon(e.target.value)}
//             className="border p-2 w-full rounded-md"
//           />
//           <button
//             onClick={applyCoupon}
//             className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//           >
//             Apply
//           </button>
//         </div>

//         {/* Donation */}
//         <div className="bg-yellow-50 p-3 rounded-lg mt-4">
//           <div className="flex justify-between items-center">
//             <div className="flex space-x-3">
//               <img
//                 src="https://cdn.grofers.com/assets/ui/icons/feeding_india_icon_v6.png"
//                 alt="Feeding India"
//                 className="w-10 h-10 rounded-full"
//               />
//               <div>
//                 <h4 className="font-semibold text-sm">Feeding India donation</h4>
//                 <p className="text-xs text-gray-600">
//                   Working towards a malnutrition-free India.
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-2">
//               <span className="text-sm font-semibold">₹1</span>
//               <input
//                 type="checkbox"
//                 checked={includeDonation}
//                 onChange={() => setIncludeDonation(!includeDonation)}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Tip Section */}
//         <div className="mt-4">
//           <h4 className="font-semibold mb-2">Tip your delivery partner</h4>
//           <p className="text-xs text-orange-600 mb-2">
//             Your kindness means a lot! 100% of your tip goes directly to them.
//           </p>
//           <div className="flex space-x-2 flex-wrap">
//             {donations.map((tip) => (
//               <Button
//                 key={tip.id}
//                 onClick={() => {
//                   setSelectedTip(tip.amount);
//                   setShowCustomTipInput(false);
//                 }}
//                 variant={selectedTip === tip.amount ? "destructiveBackground" : "outline"}
//                 size="sm"
//               >
//                 {tip.emoji} ₹{tip.amount}
//               </Button>
//             ))}
//             <Button variant="outline" size="sm" onClick={() => setShowCustomTipInput(true)}>
//               Custom
//             </Button>
//           </div>

//           {showCustomTipInput && (
//             <div className="flex items-center gap-2 mt-4">
//               <input
//                 type="number"
//                 placeholder="Enter custom tip amount"
//                 value={customTipValue}
//                 onChange={(e) => setCustomTipValue(e.target.value)}
//                 className="border p-2 w-full rounded-md"
//               />
//               <button
//                 onClick={handleCustomTip}
//                 className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
//               >
//                 Apply
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Cancellation Info */}
//         <div className="mt-6">
//           <h4 className="font-semibold text-sm mb-2">Cancellation Policy</h4>
//           <p className="text-xs text-gray-600">
//             Orders can't be cancelled once packed. Delays may be refunded.
//           </p>
//         </div>
//       </div>

//       {appliedCoupon && (
//         <div className="mt-4 text-green-600">
//           🎉 Applied Coupon: <strong>{appliedCoupon}</strong>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CartSummary;



"use client"

import React, { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useCartStore } from "@/lib/store/useCartStore"
import { Input } from "./ui/input"

const coupons = [{ code: "FREEDEL" }]

const donations = [
  { id: 1, amount: 20, emoji: "😊" },
  { id: 2, amount: 30, emoji: "😍" },
  { id: 3, amount: 50, emoji: "🤩" },
]

const CartSummary = ({ cartItems }: any) => {
  const {
    updateQuantity,
    removeItem,
    setDeliveryCharge,
    setHandlingCharge,
    setTip,
  } = useCartStore()

  const [customCoupon, setCustomCoupon] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState("")
  const [selectedTip, setSelectedTip] = useState(0)
  const [pincode, setPincode] = useState("")
  const [deliveryAvailability, setDeliveryAvailability] = useState(false)

  const itemsTotal = cartItems.reduce(
    (t: number, i: any) => t + i.price * i.quantity,
    0
  )

  const isFreeDelivery = itemsTotal >= 500 || appliedCoupon === "FREEDEL"
  const deliveryCharge = isFreeDelivery ? 0 : 25
  const handlingCharge = 2

  useEffect(() => {
    setDeliveryCharge(deliveryCharge)
    setHandlingCharge(handlingCharge)
    setTip(selectedTip)
  }, [deliveryCharge, handlingCharge, selectedTip])

  const grandTotal =
    itemsTotal + deliveryCharge + handlingCharge + selectedTip

  const applyCoupon = () => {
    if (customCoupon.toUpperCase() === "FREEDEL") {
      setAppliedCoupon("FREEDEL")
    }
  }

  return (
    <div className="space-y-5 pb-4">
      {/* CART ITEMS */}
      <div className="space-y-3">
        {cartItems.map((item: any) => (
          <div
            key={item.id}
            className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
          >
            <img
              src={item.image || "/placeholder.svg"}
              className="w-12 h-12 rounded-lg object-cover"
            />

            <div className="flex-1">
              <p className="text-sm font-medium leading-tight">
                {item.name}
              </p>
              <p className="text-xs text-orange-600 font-semibold">
                ₹{item.price}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8"
                onClick={() =>
                  updateQuantity(item.id, item.quantity - 1)
                }
              >
                <Minus className="h-3 w-3" />
              </Button>

              <span className="w-6 text-center text-sm">
                {item.quantity}
              </span>

              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8"
                onClick={() =>
                  updateQuantity(item.id, item.quantity + 1)
                }
              >
                <Plus className="h-3 w-3" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-red-500"
                onClick={() => removeItem(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* PRICE BREAKUP */}
      <div className="bg-white rounded-xl border p-4 space-y-2 text-sm">
        <Row label="Items total" value={`₹${itemsTotal}`} />
        {!isFreeDelivery && (
          <Row label="Delivery charge" value={`₹${deliveryCharge}`} />
        )}
        <Row label="Handling charge" value={`₹${handlingCharge}`} />
        {selectedTip > 0 && (
          <Row label="Tip" value={`₹${selectedTip}`} />
        )}
        <div className="border-t pt-3 flex justify-between font-semibold text-base">
          <span>Grand Total</span>
          <span>₹{grandTotal}</span>
        </div>
      </div>

      {/* PINCODE */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-sm font-medium mb-2">
          Check delivery availability
        </p>
        <Input
          placeholder="Enter 6 digit pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
        />
      </div>

      {/* COUPON */}
      <div className="flex gap-2">
        <Input
          placeholder="Coupon code"
          value={customCoupon}
          onChange={(e) => setCustomCoupon(e.target.value)}
        />
        <Button onClick={applyCoupon} variant="outline">
          Apply
        </Button>
      </div>

      {/* TIP */}
      <div>
        <p className="text-sm font-medium mb-2">
          Tip your delivery partner ❤️
        </p>
        <div className="flex gap-2">
          {donations.map((d) => (
            <Button
              key={d.id}
              size="sm"
              variant={selectedTip === d.amount ? "default" : "outline"}
              onClick={() => setSelectedTip(d.amount)}
            >
              {d.emoji} ₹{d.amount}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

const Row = ({ label, value }: any) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-600">{label}</span>
    <span>{value}</span>
  </div>
)

export default CartSummary
