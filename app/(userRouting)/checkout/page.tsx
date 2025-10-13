
// "use client"
// import { useState } from "react";
// import { ChevronDown, CreditCard, Smartphone, Building, Wallet, Check, Star, Banknote, Globe } from "lucide-react";
// import { useOrder } from "@/context/OrderContext";
// import { useAuthStorage } from "@/hooks/useAuth";

// // Types
// interface DigitalWallet {
//   logo: string;
//   title: string;
//   isLinked: boolean;
// }

// interface Bank {
//   name: string;
//   color: string;
//   logo: string;
// }

// interface PaymentApp {
//   name: string;
//   color: string;
//   logo: string;
// }

// interface OrderItem {
//   name: string;
//   price: number;
//   quantity: number;
//   id: string;
// }

// interface Address {
//   label: string;
//   area: string;
// }

// interface OrderState {
//   address?: Address;
//   items?: OrderItem[];
//   tip?: number;
//   deliveryCharge?: number;
//   handlingCharge?: number;
//   donation?: number;
// }

// interface PaymentSectionProps {
//   id: string;
//   title: string;
//   icon: React.ReactNode;
//   children: React.ReactNode;
//   isActive: boolean;
//   disabled: boolean;
//   scrolled: boolean;
// }

// export default function PaymentPage() {
//   const [expanded, setExpanded] = useState<string>("wallets");
//   const { user } = useAuthStorage();
//   let { state } = useOrder();
//   console.log(state);
  

//   const toggle = (section: string) => setExpanded(expanded === section ? "" : section);
//   let totalAmount = state?.items?.reduce((t, i) => t + i.price * i.quantity, 0) + (state.tip || 0) + (state.deliveryCharge || 0) + (state.handlingCharge || 0) + (state.donation || 0);

//   const paymentApps: PaymentApp[] = [
//     { name: "Paytm", color: "bg-blue-500", logo: "https://b.zmtcdn.com/zpaykit/af07d421bc6da0f623672f3044a882901567742922.png" },
//     { name: "Google Pay", color: "bg-green-500", logo: "https://b.zmtcdn.com/zpaykit/81b0d98cd17e3900a6f29aeeb78649281567742742.png" },
//     { name: "PhonePe", color: "bg-orange-500", logo: "https://b.zmtcdn.com/zpaykit/cddd7915933e173e862363b300cb2e441567742836.png" },
//   ];

//   const PaymentSection: React.FC<PaymentSectionProps> = ({ id, title, icon, children, isActive, disabled, scrolled }) => (
//     <div className={`relative border-2 rounded-2xl overflow-hidden transition-all duration-500 ease-in-out transform hover:scale-[1.02] ${
//       isActive ? 'border-orange-400 shadow-2xl shadow-emerald-100' : 'border-gray-200 hover:border-gray-300'
//     }`}>
//       <div
//         onClick={() => toggle(id)}
//         className="relative cursor-pointer p-6 flex justify-between items-center bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-300"
//       >
//         <div className="flex items-center space-x-3">
//           <div className={`p-2 rounded-full transition-all duration-300 ${
//             isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'
//           }`}>
//             {icon}
//           </div>
//           <h2 className="text-xl font-bold text-gray-800">{title}</h2>
//         </div>
//         <div className={`transform transition-transform duration-300 ${
//           isActive ? 'rotate-180 text-emerald-600' : 'text-gray-400'
//         }`}>
//           <ChevronDown size={24} />
//         </div>
//       </div>
//       <div className={`overflow-${scrolled ? 'auto' : 'hidden'} transition-all duration-500 ease-in-out ${
//         isActive ? `${!scrolled ? 'max-h-96' : 'h-[70vh]'} opacity-100` : 'max-h-0 opacity-0'
//       }`}>
//         <div className="p-6 pt-0 bg-gradient-to-b from-white to-gray-50" aria-disabled={disabled}>
//           {children}
//         </div>
//       </div>
//     </div>
//   );

//   // Enhanced Stripe checkout function with multiple payment methods
//   const handleStripeCheckout = async (paymentMethod: string) => {
//     let products = state.items.map((item: any) => ({
//       product: item.id,
//       quantity: item.quantity,
//       price: item.price,
//     }));

//     const res = await fetch("/api/create-order", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ 
//         items: products, 
//         orderId: "YOUR_ORDER_ID_HERE",
//         total: totalAmount,
//         method: paymentMethod,
//         userId: user._id 
//       }),
//     });
    
//     const data = await res.json();
//     console.log(data);
    
//     if (data.url) {
//       window.location.href = data.url;
//     } else {
//       alert("Payment failed. Try again!");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-6">
//       <div className="max-w-6xl mx-auto">
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-800 mb-2">Secure Checkout</h1>
//           <p className="text-gray-600">Choose your preferred payment method</p>
//         </div>

//         <div className="flex flex-col lg:flex-row gap-8">
//           <div className="w-full lg:w-2/3 space-y-6">
      
//             {/* Credit/Debit Cards */}
//             <PaymentSection id="cards" disabled={false} scrolled={false} title="Credit or Debit Cards" icon={<CreditCard size={20} />} isActive={expanded === "cards"}>
//               <div className="space-y-6">
//               </div>
//             </PaymentSection>

//             {/* UPI Payment */}
//             <PaymentSection id="upi" disabled={false} scrolled={false} title="UPI Payment" icon={<Smartphone size={20} />} isActive={expanded === "upi"}>
//               <div className="space-y-6">
//                 <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg border-2 border-emerald-200">
//                   <input type="radio" defaultChecked className="w-5 h-5 text-emerald-600" />
//                   <span className="font-medium text-gray-700">Add new UPI ID</span>
//                 </div>
//                 <div className="flex justify-center space-x-6 mb-4">
//                   {paymentApps.map((app) => (
//                     <div key={app.name} className="text-center">
//                       <div className="w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center">
//                         <img src={app.logo} alt={app.name} className="w-full h-full" />
//                       </div>
//                       <span className="text-xs text-gray-600">{app.name}</span>
//                     </div>
//                   ))}
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="yourname@upi"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
//                 />
//                 <button 
//                   onClick={() => handleStripeCheckout('upi')}
//                   className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
//                 >
//                   Pay with UPI
//                 </button>
//                 <p className="text-sm text-gray-500 text-center">UPI ID format: name/phone@bankname</p>
//               </div>
//             </PaymentSection>


//             {/* Cash on Delivery */}
//             <PaymentSection id="Cash" title="Cash on Delivery" disabled={totalAmount > 100} scrolled={false} icon={<Banknote size={20} />} isActive={expanded === "Cash"}>
//               <div className="space-y-6">
//                 {totalAmount > 100 ? (
//                   <p className="text-sm text-gray-500 text-center">
//                     Cash on delivery is not applicable on first order with item total less than ₹100
//                   </p>
//                 ) : (
//                   <>
//                     <p className="text-sm text-gray-500 text-center">
//                       Please keep exact change handy to help us serve you better
//                     </p>
//                     <button 
//                       onClick={() => handleStripeCheckout('cash_on_delivery')}
//                       className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
//                     >
//                       Confirm Cash on Delivery
//                     </button>
//                   </>
//                 )}
//               </div>
//             </PaymentSection>
//           </div>

//           {/* Order Summary */}
//           <div className="w-full lg:w-1/3">
//             <div className="sticky top-6 bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-xl">
//               <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-6 text-white">
//                 <h2 className="text-2xl font-bold mb-2">Order Summary</h2>
//                 <div className="flex items-center">
//                   <Star className="text-yellow-300 mr-1" size={16} />
//                   <span className="text-sm">Secure & Fast Checkout</span>
//                 </div>
//               </div>
//               <div className="p-6 space-y-6">
//                 <div>
//                   <h3 className="font-semibold text-gray-800 mb-3">Delivery Address</h3>
//                   <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
//                     <p className="text-sm text-gray-600 leading-relaxed">
//                       <span className="font-medium text-gray-800">{state?.address?.label}:</span> {state?.address?.area}
//                     </p>
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="font-semibold text-gray-800 mb-3 flex items-center justify-between">
//                     My Cart <span className="text-sm bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">{state?.items?.length} items</span>
//                   </h3>
//                   <div className="space-y-2">
//                     {state?.items?.map((item, index) => (
//                       <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//                         <div>
//                           <p className="font-medium text-gray-800">{item.name}</p>
//                         </div>
//                         <span className="font-semibold text-gray-800">₹{item.price}</span>
//                       </div>
//                     ))}
//                     {state?.tip > 0 && (
//                       <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//                         <div><p className="font-medium text-gray-800">Tip</p></div>
//                         <span className="font-semibold text-gray-800">₹{state.tip}</span>
//                       </div>
//                     )}
//                     {state?.donation&&state?.donation > 0 && (
//                       <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//                         <div><p className="font-medium text-gray-800">Donation</p></div>
//                         <span className="font-semibold text-gray-800">₹{state.donation}</span>
//                       </div>
//                     )}
//                     {state?.deliveryCharge > 0 && (
//                       <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//                         <div><p className="font-medium text-gray-800">Delivery Charge</p></div>
//                         <span className="font-semibold text-gray-800">₹{state.deliveryCharge}</span>
//                       </div>
//                     )}
//                     {state?.handlingCharge > 0 && (
//                       <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//                         <div><p className="font-medium text-gray-800">Handling Charge</p></div>
//                         <span className="font-semibold text-gray-800">₹{state.handlingCharge}</span>
//                       </div>
//                     )}
//                   </div>

//                   <div className="border-t border-gray-200 mt-4 pt-4">
//                     <div className="flex justify-between items-center text-lg font-bold text-gray-800">
//                       <span>Total Amount</span>
//                       <span className="text-emerald-600">₹{totalAmount}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <button 
//                   onClick={() => handleStripeCheckout('card')}
//                   className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
//                 >
//                   Complete Payment
//                 </button>
//                 <p className="text-xs text-gray-500 text-center">🔒 Your payment information is secure and encrypted</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions, Appearance } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";
import { useAuthStorage } from "@/hooks/useAuth";
import { useOrder } from "@/context/OrderContext";
import { Star } from "lucide-react";
import RazorpayButton from "./RazorpayButton";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [gateway, setGateway] = useState<'stripe' | 'razorpay'>('stripe');
  const { state } = useOrder();

  const totalAmount =
    (state?.items?.reduce((t, i) => t + i.price * i.quantity, 0) || 0) +
    (state?.tip || 0) +
    (state?.deliveryCharge || 0) +
    (state?.handlingCharge || 0) +
    (state?.donation || 0);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Secure Checkout</h1>
          <p className="text-gray-600">Choose your preferred payment method</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {gateway === 'stripe' ? (
            clientSecret ? (
              <Elements stripe={stripePromise} options={options}>
                <PaymentForm totalAmount={totalAmount} />
              </Elements>
            ) : (
              <div className="p-6 rounded-2xl border-2 border-gray-200 bg-white">Preparing Stripe checkout...</div>
            )
          ) : (
            <div className="p-6 rounded-2xl border-2 border-gray-200 bg-white">
              <RazorpayButton totalAmount={totalAmount} />
            </div>
          )}

          {/* Order Summary */}
          <div className="w-full space-y-6">
            <div className="sticky top-6 bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-xl">
              <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">Order Summary</h2>
                <div className="flex items-center">
                  <Star className="text-yellow-300 mr-1" size={16} />
                  <span className="text-sm">Secure & Fast Checkout</span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Delivery Address</h3>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      <span className="font-medium text-gray-800">{state?.address?.label}:</span>{" "}
                      {state?.address?.area}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center justify-between">
                    My Cart{" "}
                    <span className="text-sm bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                      {state?.items?.length} items
                    </span>
                  </h3>
                  <div className="space-y-2">
                    {state?.items?.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <span className="font-semibold text-gray-800">₹{item.price}</span>
                      </div>
                    ))}

                    {state?.tip > 0 && (
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-800">Tip</p>
                        <span className="font-semibold text-gray-800">₹{state.tip}</span>
                      </div>
                    )}

                    {(state?.donation ?? 0) > 0 && (
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-800">Donation</p>
                        <span className="font-semibold text-gray-800">₹{state?.donation ?? 0}</span>
                      </div>
                    )}

                    {state?.deliveryCharge > 0 && (
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-800">Delivery Charge</p>
                        <span className="font-semibold text-gray-800">₹{state.deliveryCharge}</span>
                      </div>
                    )}

                    {state?.handlingCharge > 0 && (
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-800">Handling Charge</p>
                        <span className="font-semibold text-gray-800">₹{state.handlingCharge}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-200 mt-4 pt-4">
                    <div className="flex justify-between items-center text-lg font-bold text-gray-800">
                      <span>Total Amount</span>
                      <span className="text-emerald-600">₹{totalAmount}</span>
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
