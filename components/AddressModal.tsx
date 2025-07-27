'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Search, ShoppingCart, Heart, Star, Filter, Grid, List, Trash2, Plus, Minus, X, Menu, MapPin } from 'lucide-react';
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import AddAddressModal from './AddAddressModal';

const AddressModal = ({ addressOpen, setAddressOpen }: any) => {
    const [showAddressModal, setShowAddressModal] = useState(false);

    return (
        <>
            <Sheet open={addressOpen} onOpenChange={setAddressOpen}>
                <SheetContent side="right" className="w-full sm:max-w-lg overflow-auto">
                    <SheetHeader>
                        <SheetTitle>Select delivery address</SheetTitle>
                    </SheetHeader>

                    {/* ADD NEW ADDRESS */}
                    <div className="p-3">
                        <Button className="w-full bg-green-600 text-white mb-4" onClick={() => setShowAddressModal(!showAddressModal)}>
                            + Add a new address
                        </Button>

                        {/* SAVED ADDRESSES MOCK */}
                        <div className="bg-gray-100 rounded-lg p-3 mb-2">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-bold text-black">Home</p>
                                    <p className="text-xs text-gray-600">Habib kd, 123 Main St, City, Country, Zip 1222<br />Suraj Nagar, Jhotwara, Jaipur</p>
                                </div>
                                <Button size="icon" variant="ghost" className="text-green-600">
                                    ✏️
                                </Button>
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
            {showAddressModal && (
                <AddAddressModal onSave={() => setShowAddressModal(false)} open={showAddressModal} onClose={() => setShowAddressModal(false)} />
            )}
        </>
    )
}

export default AddressModal



// "use client";
// import React, { useState } from "react";
// import AddAddressModal from "@/components/AddAddressModal"; // adjust the path

// const ParentComponent = ({ addressOpen, setAddressOpen }: any) => {
//   const [open, setOpen] = useState(false);
//   const [addresses, setAddresses] = useState<any[]>([]);

//   const handleSaveAddress = (newAddress: any) => {
//     setAddresses((prev) => [...prev, newAddress]);
//     setAddressOpen(true);
//     console.log("Address saved:", newAddress);
//   };

//   return (
//     <div className="p-6">
//       <button
//         onClick={() => setAddressOpen(true)}
//         className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
//       >
//         Add New Address
//       </button>

//       <AddAddressModal
//         open={addressOpen}
//         onClose={() => setAddressOpen(false)}
//         onSave={handleSaveAddress}
//       />

//       <div className="mt-6">
//         <h2 className="text-lg font-semibold mb-2">Saved Addresses:</h2>
//         {addresses.map((addr, index) => (
//           <div
//             key={index}
//             className="p-4 border rounded mb-3 bg-white shadow-sm"
//           >
//             <p><strong>{addr.label}</strong> - {addr.house}, {addr.area}</p>
//             <p>{addr.name} | {addr.phone}</p>
//             <p>Lat: {addr.location.lat}, Lng: {addr.location.lng}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ParentComponent;
