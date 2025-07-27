"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, CreditCard, Smartphone, Building, Wallet, Check, Star } from "lucide-react";

export default function PaymentPage() {
  const [expanded, setExpanded] = useState("wallets");
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedBank, setSelectedBank] = useState<null>(null);

  const toggle = (section:any) => {
    setExpanded(expanded === section ? null : section);
  };

  const banks = [
    { name: "HDFC", color: "bg-red-500", logo: "🏦" },
    { name: "Kotak", color: "bg-blue-600", logo: "🏛️" },
    { name: "ICICI", color: "bg-orange-500", logo: "🏢" },
    { name: "SBI", color: "bg-blue-800", logo: "🏪" },
    { name: "Axis", color: "bg-purple-600", logo: "🏦" }
  ];

  let paymentApps = [
    { name: "Paytm", color: "bg-blue-500", logo: "https://b.zmtcdn.com/zpaykit/af07d421bc6da0f623672f3044a882901567742922.png" },
    { name: "Google Pay", color: "bg-green-500", logo: "https://b.zmtcdn.com/zpaykit/81b0d98cd17e3900a6f29aeeb78649281567742742.png" },
    { name: "PhonePe", color: "bg-orange-500", logo: "https://b.zmtcdn.com/zpaykit/cddd7915933e173e862363b300cb2e441567742836.png" },
  ]
  const PaymentSection = ({ id, title, icon, children, isActive } : any) => (
    <div className={`relative border-2 rounded-2xl overflow-hidden transition-all duration-500 ease-in-out transform hover:scale-[1.02] ${
      isActive ? 'border-orange-400 shadow-2xl shadow-emerald-100' : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 to-blue-50/50 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      <div
        onClick={() => toggle(id)}
        className="relative cursor-pointer p-6 flex justify-between items-center bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-300"
      >
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full transition-all duration-300 ${
            isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'
          }`}>
            {icon}
          </div>
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>
        <div className={`transform transition-transform duration-300 ${
          isActive ? 'rotate-180 text-emerald-600' : 'text-gray-400'
        }`}>
          <ChevronDown size={24} />
        </div>
      </div>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
        isActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="p-6 pt-0 bg-gradient-to-b from-white to-gray-50">
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
          {/* Left Side: Payment Methods */}
          <div className="w-full lg:w-2/3 space-y-6">
            
            {/* Wallets */}
            <PaymentSection
              id="wallets"
              title="Digital Wallets"
              icon={<Wallet size={20} />}
              isActive={expanded === "wallets"}
            >
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      M
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-800">Mobikwik</p>
                      <p className="text-orange-600 font-medium flex items-center">
                        <Check size={16} className="mr-1" />
                        LINKED
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white transform hover:scale-110 transition-transform duration-200">
                    <Check size={16} />
                  </div>
                </div>
              </div>
            </PaymentSection>

            {/* Credit/Debit Cards */}
            <PaymentSection
              id="cards"
              title="Credit or Debit Cards"
              icon={<CreditCard size={20} />}
              isActive={expanded === "cards"}
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg border-2 border-emerald-200">
                  <input type="radio" defaultChecked className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-gray-700">Add Debit / Credit / ATM Card</span>
                </div>
                
                <div className="grid gap-4">
                  <input 
                    type="text" 
                    placeholder="Name on Card" 
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 text-gray-700 placeholder-gray-400"
                  />
                  <input 
                    type="text" 
                    placeholder="Card Number" 
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 text-gray-700 placeholder-gray-400"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="MM/YY" 
                      className="p-4 border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 text-gray-700 placeholder-gray-400"
                    />
                    <input 
                      type="text" 
                      placeholder="CVV" 
                      className="p-4 border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 text-gray-700 placeholder-gray-400"
                    />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Nickname for card (Optional)" 
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 text-gray-700 placeholder-gray-400"
                  />
                </div>
                
                <button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                  Secure Checkout
                </button>
                
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-3">We accept all major cards</p>
                  <div className="flex justify-center space-x-4">
                    {['VISA', 'MC', 'AMEX', 'RUPAY'].map((card) => (
                      <div key={card} className="px-3 py-1 bg-gray-100 rounded-md text-xs font-medium text-gray-600">
                        {card}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PaymentSection>

            {/* Netbanking */}
            <PaymentSection
              id="netbanking"
              title="Net Banking"
              icon={<Building size={20} />}
              isActive={expanded === "netbanking"}
            >
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {banks.map((bank) => (
                    <div 
                      key={bank.name}
                      onClick={() => setSelectedBank(bank?.name)}
                      className={`relative cursor-pointer p-6 border-2 rounded-xl text-center transition-all duration-300 transform hover:scale-105 ${
                        selectedBank === bank.name 
                          ? 'border-emerald-400 bg-emerald-50 shadow-lg' 
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      <div className={`w-10 h-10 ${bank.color} rounded-lg mx-auto mb-2 flex items-center justify-center text-white text-lg`}>
                        {bank.logo}
                      </div>
                      <p className="font-medium text-gray-700">{bank.name}</p>
                      {selectedBank === bank.name && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                          <Check size={14} className="text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <select className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 text-gray-700 bg-white">
                  <option value="">Choose from all banks</option>
                  <option value="other">Other Banks</option>
                </select>
              </div>
            </PaymentSection>

            {/* UPI */}
            <PaymentSection
              id="upi"
              title="UPI Payment"
              icon={<Smartphone size={20} />}
              isActive={expanded === "upi"}
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg border-2 border-emerald-200">
                  <input type="radio" defaultChecked className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-gray-700">Add new UPI ID</span>
                </div>
                
                <div className="flex justify-center space-x-6 mb-4">
                  {paymentApps.map((app) => (
                    <div key={app.name} className="text-center">
                      <div className={`w-12 h-12  rounded-xl mx-auto mb-2 flex items-center justify-center text-white font-bold`}>
                        <img src={app.logo} alt={app.name} className="w-full h-full" />
                      </div>
                      <span className="text-xs text-gray-600">{app.name}</span>
                    </div>
                  ))}
                </div>
                
                <input
                  type="text"
                  placeholder="yourname@upi"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 text-gray-700 placeholder-gray-400"
                />
                
                <button className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                  Pay with UPI
                </button>
                
                <p className="text-sm text-gray-500 text-center">
                  UPI ID format: name/phone@bankname
                </p>
              </div>
            </PaymentSection>
          </div>

          {/* Right Side: Order Summary */}
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
                      <span className="font-medium text-gray-800">Work:</span> Floor 919, 123 Main St, 
                      Sanjay, Suraj Nagar, Jhotwara, Jaipur - 302012
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center justify-between">
                    My Cart 
                    <span className="text-sm bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">2 items</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">Product 1</p>
                        <p className="text-sm text-gray-500">3 x 75g</p>
                      </div>
                      <span className="font-semibold text-gray-800">₹54</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">Rolling Papers</p>
                        <p className="text-sm text-gray-500">Thins Pre-Rolled</p>
                      </div>
                      <span className="font-semibold text-gray-800">₹25</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 mt-4 pt-4">
                    <div className="flex justify-between items-center text-lg font-bold text-gray-800">
                      <span>Total Amount</span>
                      <span className="text-emerald-600">₹79</span>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-orange-500 to-orange-400 hover:from-emerald-700 hover:to-emerald-800 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                  Complete Payment
                </button>
                
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    🔒 Your payment information is secure and encrypted
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}