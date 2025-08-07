"use client"
import { useState } from "react";
import { ChevronDown, CreditCard, Smartphone, Building, Wallet, Check, Star } from "lucide-react";
import { useOrder } from "@/context/OrderContext";
import { Input } from "@/components/ui/input";
import BankDropdown from "@/components/BankDropdown";

// Types
interface DigitalWallet {
  logo: string;
  title: string;
  isLinked: boolean;
}

interface Bank {
  name: string;
  color: string;
  logo: string;
}

interface PaymentApp {
  name: string;
  color: string;
  logo: string;
}

interface OrderItem {
  name: string;
  price: number;
}

interface Address {
  label: string;
  area: string;
}

interface OrderState {
  address?: Address;
  items?: OrderItem[];
  tip?: number;
  deliveryCharge?: number;
  handlingCharge?: number;
}

interface PaymentSectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive: boolean;
  disabled: boolean;
  scrolled: boolean;
}

// Mock data
const DigitalWallets: DigitalWallet[] = [
  {
    logo: "https://b.zmtcdn.com/payments/a759a08413ee3bf3183917f5a24172751688380614.png",
    title: "Mobikwik",
    isLinked: false,
  },

  {
    logo: "https://pnggallery.com/wp-content/uploads/font-awesome-5-brands-amazon-pay-logo-03.png",
    title: "Amazon Pay",
    isLinked: true,
  },
  {
    logo: "https://tse1.mm.bing.net/th/id/OIP.O9Ver5cFOmgNb4_Wu5OVZgHaF_?rs=1&pid=ImgDetMain&o=7&rm=3",
    title: "Freecharge",
    isLinked: false,
  },
];


export default function PaymentPage() {
  const [expanded, setExpanded] = useState<string>("wallets");
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [phone, setPhone] = useState<string>("");
  const isPhoneValid = /^\d{10}$/.test(phone);
  let { state } = useOrder()
  // const state = mockOrderState; // Using mock data instead of context
  const [selectedDigitalWallets, setSelectedDigitalWallets] = useState<DigitalWallet | null>(null);

  const toggle = (section: string) => setExpanded(expanded === section ? "" : section);
  let totalAmount = state?.items?.reduce((t, i) => t + i.price*i.quantity, 0) + (state.tip || 0) + (state.deliveryCharge || 0) + (state.handlingCharge || 0) + (state.donation || 0);
  const banks: Bank[] = [
    { name: "HDFC", color: "bg-red-500", logo: "🏦" },
    { name: "Kotak", color: "bg-blue-600", logo: "🏛️" },
    { name: "ICICI", color: "bg-orange-500", logo: "🏢" },
    { name: "SBI", color: "bg-blue-800", logo: "🏪" },
    { name: "Axis", color: "bg-purple-600", logo: "🏦" }
  ];


  const paymentApps: PaymentApp[] = [
    { name: "Paytm", color: "bg-blue-500", logo: "https://b.zmtcdn.com/zpaykit/af07d421bc6da0f623672f3044a882901567742922.png" },
    { name: "Google Pay", color: "bg-green-500", logo: "https://b.zmtcdn.com/zpaykit/81b0d98cd17e3900a6f29aeeb78649281567742742.png" },
    { name: "PhonePe", color: "bg-orange-500", logo: "https://b.zmtcdn.com/zpaykit/cddd7915933e173e862363b300cb2e441567742836.png" },
  ];

  const PaymentSection: React.FC<PaymentSectionProps> = ({ id, title, icon, children, isActive, disabled, scrolled }) => (
    <div className={`relative border-2 rounded-2xl overflow-hidden transition-all duration-500 ease-in-out transform hover:scale-[1.02] ${isActive ? 'border-orange-400 shadow-2xl shadow-emerald-100' : 'border-gray-200 hover:border-gray-300'
      }`}>
      <div
        onClick={() => toggle(id)}
        className="relative cursor-pointer  p-6 flex justify-between items-center bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-300"
      >
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full transition-all duration-300 ${isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'
            }`}>
            {icon}
          </div>
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>
        <div className={`transform transition-transform duration-300 ${isActive ? 'rotate-180 text-emerald-600' : 'text-gray-400'
          }`}>
          <ChevronDown size={24} />
        </div>
      </div>
      <div className={`overflow-${scrolled == true ? 'auto' : 'hidden'} transition-all duration-500 ease-in-out ${isActive ? `${!scrolled ? 'max-h-96' : 'h-[70vh]'} opacity-100` : 'max-h-0 opacity-0'
        }`}>
        <div className="p-6 pt-0 bg-gradient-to-b from-white to-gray-50" aria-disabled={disabled}>
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Secure Checkout</h1>
          <p className="text-gray-600">Choose your preferred payment method</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 space-y-6">
            <PaymentSection id="wallets" disabled={false} scrolled={true} title="Digital Wallets" icon={<Wallet size={20} />} isActive={expanded === "wallets"}>
              <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">


                {/* Wallets Row */}
                <div className="flex flex-wrap gap-4">
                  {DigitalWallets.map((wallet) => (
                    <div
                      key={wallet.title}
                      onClick={() => setSelectedDigitalWallets(wallet)}
                      className={`cursor-pointer w-40 p-4 rounded-lg border transition ${selectedDigitalWallets?.title === wallet.title
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-900 bg-white hover:border-gray-300"
                        }`}
                    >
                      <div className="flex flex-col items-center">
                        <img src={wallet.logo} alt={wallet.title} className="w-12 h-12 mb-2" />
                        <p className="text-sm font-semibold text-gray-800">{wallet.title}</p>
                        <p
                          className={`text-xs font-medium flex items-center mt-1 ${wallet.isLinked ? "text-green-600" : "text-orange-500"
                            }`}
                        >
                          <Check size={14} className="mr-1" />
                          {wallet.isLinked ? "LINKED" : "NOT LINKED"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Extra Info */}
                {selectedDigitalWallets && (
                  <div className="mt-6 border-t pt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Linking account is a one-time process. Next time, checkout will be a breeze!
                    </p>

                    {/* Email */}
                    <label className="block text-sm text-gray-600 mb-1">
                      Email linked with {selectedDigitalWallets?.title}
                    </label>
                    <input
                      type="email"
                      value={`user@${selectedDigitalWallets?.title.toLowerCase().replace(" ", "")}.com`}
                      // disabled
                      className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
                    />

                    {/* Phone Input */}
                    <div className="flex items-center mb-4">
                      <select
                        className="px-3 py-2 border border-gray-300 rounded-l-md bg-white text-gray-700"
                        disabled
                      >
                        <option value="+91">+91</option>
                      </select>
                      <Input
                        type="tel"
                        placeholder="Phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onFocus={(e) => e.target.scrollIntoView({ block: 'nearest', behavior: 'smooth' })}

                      />
                    </div>
                    {/* {!isPhoneValid && phone !== "" && (
                      <p className="text-red-500 text-sm mb-2">Enter valid phone number</p>
                    )} */}

                    {/* Submit */}
                    <button
                      className={`w-full py-2 rounded-md text-white text-sm ${isPhoneValid
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-300 cursor-not-allowed"
                        }`}
                      disabled={!isPhoneValid}
                    >
                      Continue
                    </button>
                  </div>
                )}
              </div>
            </PaymentSection>

            <PaymentSection id="cards" disabled={false} scrolled={true} title="Credit or Debit Cards" icon={<CreditCard size={20} />} isActive={expanded === "cards"}>
              <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg border-2 border-emerald-200">
                  <input type="radio" defaultChecked className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-gray-700">Add Debit / Credit / ATM Card</span>
                </div>
                <div className="grid gap-4">
                  <input
                    type="text"
                    placeholder="Name on Card"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Nickname for card (Optional)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                  Secure Checkout
                </button>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-3">We accept all major cards</p>
                  <div className="flex justify-center space-x-4">
                    {["VISA", "MC", "AMEX", "RUPAY"].map((card) => (
                      <div key={card} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">
                        {card}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PaymentSection>

            <PaymentSection id="netbanking" disabled={false} scrolled={true} title="Net Banking" icon={<Building size={20} />} isActive={expanded === "netbanking"}>
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {banks.map((bank) => (
                    <div
                      key={bank.name}
                      onClick={() => setSelectedBank(bank.name)}
                      className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${selectedBank === bank.name
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-200 hover:border-gray-300"
                        }`}
                    >
                      <div className={`w-10 h-10 ${bank.color} rounded-lg mx-auto mb-2 flex items-center justify-center text-white text-lg`}>
                        {bank.logo}
                      </div>
                      <p className="font-medium text-gray-700 text-center">{bank.name}</p>
                      {selectedBank === bank.name && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                          <Check size={14} className="text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {/* <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                  <option value="">Choose from all banks</option>
                  {indianBanks.map((bank) => (
                    <option key={bank.name} value={bank.name}>
                      {bank.name}
                    </option>
                  ))}
                </select> */}
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                  <BankDropdown />
                </div>

              </div>
            </PaymentSection>

            <PaymentSection id="upi" disabled={false} scrolled={false} title="UPI Payment" icon={<Smartphone size={20} />} isActive={expanded === "upi"}>
              <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg border-2 border-emerald-200">
                  <input type="radio" defaultChecked className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-gray-700">Add new UPI ID</span>
                </div>
                <div className="flex justify-center space-x-6 mb-4">
                  {paymentApps.map((app) => (
                    <div key={app.name} className="text-center">
                      <div className="w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center">
                        <img src={app.logo} alt={app.name} className="w-full h-full" />
                      </div>
                      <span className="text-xs text-gray-600">{app.name}</span>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="yourname@upi"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                  Pay with UPI
                </button>
                <p className="text-sm text-gray-500 text-center">UPI ID format: name/phone@bankname</p>
              </div>
            </PaymentSection>
            <PaymentSection id="Cash" title="Cash" disabled={totalAmount > 100 ? true : false} scrolled={false} icon={<Smartphone size={20} />} isActive={expanded === "Cash"}>
              <div className="space-y-6">

                {totalAmount > 100 ?
                  <p className="text-sm text-gray-500 text-center">Cash on delivery is not applicable on first order with item total less than ₹100</p> :
                  <p className="text-sm text-gray-500 text-center">Please keep exact change handy to help us serve you better</p>}
              </div>
            </PaymentSection>
          </div>

          <div className="w-full lg:w-1/3">
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
                      <span className="font-medium text-gray-800">{state?.address?.label}:</span> {state?.address?.area}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center justify-between">
                    My Cart <span className="text-sm bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">{state?.items?.length} items</span>
                  </h3>
                  <div className="space-y-2">
                    {state?.items?.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">{item.name}</p>
                        </div>
                        <span className="font-semibold text-gray-800">₹{item.price}</span>
                      </div>
                    ))}
                    {state.tip > 0 && <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">Tip</p>
                      </div>
                      <span className="font-semibold text-gray-800">₹{state.tip}</span>
                    </div>}
                    {state && state.donation && state.donation > 0 && <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">Donation</p>
                      </div>
                      <span className="font-semibold text-gray-800">₹{state.donation}</span>
                    </div>}
                    {state.deliveryCharge > 0 && <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">Delivery Charge</p>
                      </div>
                      <span className="font-semibold text-gray-800">₹{state.deliveryCharge}</span>
                    </div>}
                    {state.handlingCharge > 0 && <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">Handling Charge</p>
                      </div>
                      <span className="font-semibold text-gray-800">₹{state.handlingCharge}</span>
                    </div>}

                  </div>

                  <div className="border-t border-gray-200 mt-4 pt-4">
                    <div className="flex justify-between items-center text-lg font-bold text-gray-800">
                      <span>Total Amount</span>
                      <span className="text-emerald-600">
                        ₹{totalAmount}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                  Complete Payment
                </button>
                <p className="text-xs text-gray-500 text-center">🔒 Your payment information is secure and encrypted</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}