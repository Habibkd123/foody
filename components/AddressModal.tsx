"use client";
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import AddAddressModal from './AddAddressModal';
import { MapPin } from 'lucide-react';
import { useOrder } from '@/context/OrderContext';

// Dummy addresses for now
const dummyAddresses = [
    {
        label: "Home",
        name: "John Doe",
        area: "Block A, Sector 21",
        phone: "9876543210",
        marker: { lat: 28.6139, lng: 77.2090 },
        distance: "2km"
    },
    {
        label: "Work",
        name: "John Office",
        area: "Cyber City, Gurugram",
        phone: "9123456789",
        distance: "3km",
        marker: { lat: 28.5045, lng: 77.3281 },
    },
];

const AddressModal = ({ addressOpen, setAddressOpen, type }: any) => {
    const { dispatch } = useOrder();
    const [showAddModal, setShowAddModal] = useState(false);
    const [addresses, setAddresses] = useState(dummyAddresses);
    const [selectedAddress, setSelectedAddress] = useState<any>(null);

    const handleAddAddress = (newAddress: any) => {
        setAddresses((prev: any) => [...prev, newAddress]);
        setShowAddModal(false);
    };

    const handleSelectedAddress = (item: any) => {
        setSelectedAddress(item)
        dispatch({ type: "SET_ADDRESS", address: item });
        dispatch({ type: "SET_DISTANCE", distance: item?.distance });
        setAddressOpen(false)
    }

    return (
        <>
            <Sheet open={addressOpen} onOpenChange={setAddressOpen}>
                <SheetContent side="right" className="w-full sm:max-w-lg overflow-auto">
                    <SheetHeader>
                        <SheetTitle>Select delivery address</SheetTitle>
                    </SheetHeader>

                    <div className="p-3 space-y-4">
                        <Button className="w-full bg-green-600 text-white" onClick={() => setShowAddModal(true)}>
                            + Add a new address
                        </Button>

                        {addresses.map((addr, index) => (
                            <div
                                key={index}
                                onClick={() => handleSelectedAddress(addr)}
                                className={`rounded-lg p-3 cursor-pointer transition border ${selectedAddress === addr
                                    ? "border-green-600 bg-green-50"
                                    : "border-gray-300 bg-white"
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-bold text-black">{addr.label}</p>
                                        <p className="text-sm text-gray-700">{addr.name}, {addr.area}</p>
                                        <p className="text-sm text-gray-500">📍 Lat: {addr?.marker?.lat}, Lng: {addr?.marker?.lng}</p>
                                        <p className="text-sm text-gray-600">📞 {addr.phone}</p>
                                    </div>
                                    <MapPin className="text-green-600 mt-1" />
                                </div>
                            </div>
                        ))}

                        {selectedAddress && (
                            <div className="mt-4 p-4 border rounded bg-green-100 text-green-900">
                                <p className="font-semibold">Selected Address:</p>
                                <p>{selectedAddress.label} - {selectedAddress.name}, {selectedAddress.area}</p>
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>

            {showAddModal && (
                <AddAddressModal
                    open={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    setShowAddModal={setShowAddModal}
                    handleAddAddress={handleAddAddress}
                />
            )}
        </>
    );
};

export default AddressModal;
