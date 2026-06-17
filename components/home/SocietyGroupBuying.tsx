"use client"

import React, { useState, useEffect } from "react"
import { Users, Truck, Check, MapPin, Building, ShieldCheck, ArrowRight, X } from "lucide-react"
import { useCartStore } from "@/lib/store/useCartStore"
import { useUserStore } from "@/lib/store/useUserStore"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

export default function SocietyGroupBuying() {
  const [isOpen, setIsOpen] = useState(false)
  const [joined, setJoined] = useState(false)
  const [selectedSociety, setSelectedSociety] = useState("Greenwood Heights")
  
  const { setDeliveryCharge, setAddress, address } = useCartStore()
  const { user } = useUserStore()

  // Track if current address matches society group
  useEffect(() => {
    if (address?.label === "Greenwood Heights Group") {
      setJoined(true)
    } else {
      setJoined(false)
    }
  }, [address])

  const handleJoinGroup = () => {
    const groupAddress: any = {
      userId: user?._id || "",
      name: user?.name || "Society Member",
      phone: 9876543210,
      city: "Mumbai",
      state: "Maharashtra",
      label: `${selectedSociety} Group`,
      street: `Tower B, ${selectedSociety}`,
      area: "Powai",
      landmark: "Opposite Hiranandani Gardens",
      zipCode: "400076",
      flatNumber: "402",
      floor: "4th",
      lat: 19.1196,
      lng: 72.9051,
      isDefault: false
    }

    setAddress(groupAddress)
    setDeliveryCharge(0)
    setJoined(true)
    alert(`Success! You have joined the ${selectedSociety} Group Order. Delivery charge is now ₹0!`)
  }

  const handleLeaveGroup = () => {
    setAddress(undefined)
    setDeliveryCharge(30) // Fallback standard delivery
    setJoined(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Visual Banner */}
      <div 
        onClick={() => setIsOpen(true)}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 sm:p-8 text-white shadow-xl cursor-pointer hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 group"
      >
        {/* Background blobs */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition duration-500" />
        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-teal-400/20 rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
              <Users className="w-8 h-8 text-teal-100" />
            </div>
            <div className="space-y-1">
              <span className="bg-teal-500/30 text-teal-100 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/10">
                Society Group Buying Active
              </span>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                Order with your neighbors, pay ₹0 delivery!
              </h3>
              <p className="text-teal-100/80 text-sm font-medium">
                Active Group Order running in <span className="font-bold underline">{selectedSociety}</span>. Join to unlock free delivery.
              </p>
            </div>
          </div>
          
          <Button 
            className="bg-white text-emerald-800 font-bold hover:bg-teal-50 px-6 py-5 rounded-xl flex items-center gap-2 self-start md:self-auto shadow-md whitespace-nowrap"
            type="button"
          >
            {joined ? "View Group Status" : "Join Group Order"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Drawer */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md p-6 overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-xl font-bold flex items-center gap-2">
              <Building className="w-5 h-5 text-primary" />
              Society Group Buying
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-6">
            {/* Society Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Select Your Society</label>
              <select 
                value={selectedSociety}
                onChange={(e) => {
                  setSelectedSociety(e.target.value)
                  if (joined) handleLeaveGroup()
                }}
                className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 font-bold text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Greenwood Heights">Greenwood Heights (Powai)</option>
                <option value="Shanti Vihar">Shanti Vihar (Andheri)</option>
                <option value="Royal Residency">Royal Residency (Bandra)</option>
              </select>
            </div>

            {/* Active Thermometer Progress Bar */}
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-850 p-4 rounded-2xl space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-700 dark:text-gray-300">Society Order Progress</span>
                <span className="font-black text-emerald-600">₹3,800 / ₹5,000</span>
              </div>
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: "76%" }} />
              </div>
              <p className="text-[11px] text-gray-500 font-medium">
                ⏳ Greenwood Heights needs ₹1,200 more in group purchases to trigger free consolidated delivery.
              </p>
            </div>

            {/* Neighbor Orders List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-500 uppercase">Neighbor Activities</h4>
              <div className="space-y-2">
                {[
                  { flat: "Flat 402 (You)", status: joined ? "Joined Group" : "Not Joined", icon: true, joined },
                  { flat: "Flat 305", status: "Joined • Fresh Vegetables & Fruits", icon: true, joined: true },
                  { flat: "Flat 102", status: "Joined • Dairy & Bread", icon: true, joined: true },
                  { flat: "Flat 501", status: "Joined • Flour & Groceries", icon: true, joined: true },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${item.joined ? "bg-emerald-50 text-emerald-600" : "bg-gray-50 text-gray-400"}`}>
                        <Building className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">{item.flat}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{item.status}</p>
                      </div>
                    </div>
                    {item.joined && <Check className="w-4 h-4 text-emerald-600" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated Live SVG Map Tracking */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-500 uppercase">Consolidated Route Map</h4>
              <div className="relative border rounded-2xl bg-slate-900 overflow-hidden h-40">
                <svg className="w-full h-full" viewBox="0 0 300 150">
                  {/* Streets / Paths */}
                  <path 
                    d="M 20 75 Q 75 25 150 75 T 280 75" 
                    fill="none" 
                    stroke="#334155" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                  />
                  <path 
                    d="M 20 75 Q 75 25 150 75 T 280 75" 
                    fill="none" 
                    stroke="#10b981" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                    strokeDasharray="6 6"
                    className="animate-[dash_10s_linear_infinite]"
                    style={{
                      strokeDashoffset: 10
                    }}
                  />

                  {/* Society Buildings */}
                  <g transform="translate(40, 40)">
                    <rect x="0" y="0" width="16" height="20" rx="3" fill="#64748b" />
                    <text x="8" y="14" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">A</text>
                  </g>
                  <g transform="translate(140, 75)">
                    <rect x="-8" y="-10" width="16" height="20" rx="3" fill="#10b981" />
                    <text x="0" y="4" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">B</text>
                  </g>
                  <g transform="translate(240, 35)">
                    <rect x="0" y="0" width="16" height="20" rx="3" fill="#64748b" />
                    <text x="8" y="14" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">C</text>
                  </g>

                  {/* Delivery Truck Icon */}
                  <g className="animate-[truckMove_12s_ease-in-out_infinite]">
                    <rect x="-10" y="-6" width="14" height="10" rx="2" fill="#e11d48" />
                    <rect x="4" y="-3" width="6" height="7" rx="1" fill="#e11d48" />
                    <circle cx="-5" cy="6" r="2.5" fill="#fff" />
                    <circle cx="5" cy="6" r="2.5" fill="#fff" />
                  </g>
                </svg>

                {/* Animated CSS */}
                <style>{`
                  @keyframes dash {
                    to {
                      stroke-dashoffset: -100;
                    }
                  }
                  @keyframes truckMove {
                    0% { transform: translate(20px, 75px); }
                    33% { transform: translate(65px, 50px); }
                    66% { transform: translate(140px, 75px); }
                    100% { transform: translate(250px, 50px); }
                  }
                `}</style>
                
                <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center justify-between">
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    Consolidated truck route active
                  </span>
                  <span className="text-[9px] text-gray-400">ETA 6:30 PM</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t space-y-2">
              {joined ? (
                <Button 
                  onClick={handleLeaveGroup}
                  variant="outline"
                  className="w-full border-red-200 text-red-600 font-bold hover:bg-red-50 hover:text-red-700 py-3 rounded-xl"
                  type="button"
                >
                  Leave Group Order
                </Button>
              ) : (
                <Button 
                  onClick={handleJoinGroup}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-600/10 flex items-center justify-center gap-2"
                  type="button"
                >
                  <Users className="w-4 h-4" />
                  Join {selectedSociety} Group Order
                </Button>
              )}
              
              <div className="flex items-center gap-2 p-3 bg-emerald-50/50 rounded-xl text-[11px] text-emerald-800 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>By joining, you agree to drop-off deliveries at the tower lobby gate.</span>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
