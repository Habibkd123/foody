"use client";
import { OrderProvider } from "@/context/OrderContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <OrderProvider>{children}</OrderProvider>;
}


// Wrap root layout.tsx:

// import Providers from "./providers";
// export default function RootLayout({ children }) {
//   return (
//     <html>
//       <body>
//         <Providers>{children}</Providers>
//       </body>
//     </html>
//   );
// }




// const CheckoutBtn = () => {
//   const { state } = useOrder();
//   const ready = !!state.address && state.items.length > 0;

//   const handleCheckout = async () => {
//     const res = await fetch("/api/orders", {
//       method: "POST",
//       body: JSON.stringify(state),
//     });
//     const data = await res.json();
//     router.push(`/orders/${data.id}`);
//   };

//   return (
//     <button
//       disabled={!ready}
//       onClick={handleCheckout}
//       className={`w-full py-3 rounded ${
//         ready ? "bg-orange-500 text-white" : "bg-gray-300 text-gray-500"
//       }`}
//     >
//       Place Order
//     </button>
//   );
// };
