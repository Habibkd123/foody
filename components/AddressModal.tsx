"use client";
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MapPin, Edit, Trash2, Loader2, Plus } from 'lucide-react';
import { useUserStore } from '@/lib/store/useUserStore';
import { useCartStore } from '@/lib/store/useCartStore';
import { useAddressQuery } from '@/hooks/useAddressQuery';
import { Address } from '@/types/global';
import DeliveryAddressPage from './AddAddressModal';

interface AddressModalProps {
    addressOpen: boolean;
    setAddressOpen: (open: boolean) => void;
    type?: string;
}

const AddressModal: React.FC<AddressModalProps> = ({ addressOpen, setAddressOpen, type }) => {
    const { user } = useUserStore();
    const {
        address: currentAddress,
        setAddress,
        setDistance
    } = useCartStore();

    const {
        addresses,
        isLoading: loading,
        addAddress,
        updateAddress,
        deleteAddress,
        patchDefaultFlag,
        isDeleting
    } = useAddressQuery(user?._id);

    const [showAddModal, setShowAddModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

    useEffect(() => {
        if (currentAddress) {
            setSelectedAddress(currentAddress);
        }
    }, [currentAddress]);

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371; // Earth's radius (km)
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const handleSaveAddress = async (val: Address) => {
        try {
            if (!user?._id) throw new Error("Login required");

            if (editingAddress) {
                const addressId = editingAddress._id;
                if (!addressId) throw new Error("Address ID not found");
                await updateAddress({ addressId, updates: val });
            } else {
                await addAddress(val);
            }

            setShowAddModal(false);
            setEditingAddress(null);
        } catch (error) {
            console.error("Error saving address:", error);
            alert("Error saving address");
        }
    };

    const handleDelete = async (addr: Address) => {
        if (!user?._id) return;
        const addressId = addr._id;
        if (!addressId) return;

        const confirmDelete = confirm(`Delete ${addr.label}?`);
        if (!confirmDelete) return;

        try {
            await deleteAddress(addressId);
            if (selectedAddress?._id === addressId) {
                setSelectedAddress(null);
            }
        } catch (error) {
            console.error("Error deleting address:", error);
            alert("Failed to delete address");
        }
    };

    const handleSelect = async (item: Address) => {
        setSelectedAddress(item);
        setAddress(item);

        const addressId = item._id;
        if (user?._id && addressId) {
            try {
                // Set as default on server
                await patchDefaultFlag({ addressId, isDefault: true });

                // Unset other defaults (frontend will be updated by invalidation)
                const others = (addresses || []).filter(a => a._id !== addressId && a.isDefault);
                for (const other of others) {
                    const otherId = other._id;
                    if (otherId) await patchDefaultFlag({ addressId: otherId, isDefault: false });
                }
            } catch (e) {
                console.error('Failed to persist default address', e);
            }
        }

        // Calculate distance if coordinates are available
        if (item.lat && item.lng) {
            const shopLat = 26.926; // TODO: replace with actual shop coordinates
            const shopLng = 75.823;
            const distance = calculateDistance(item.lat, item.lng, shopLat, shopLng);
            setDistance(distance);
        }

        setAddressOpen(false);
    };

    const list = addresses || [];

    return (
        <>
            <Sheet open={addressOpen} onOpenChange={setAddressOpen}>
                <SheetContent className="w-full sm:max-w-md p-4 overflow-y-auto" side="right">
                    <SheetHeader>
                        <SheetTitle className="text-lg sm:text-xl font-semibold">Select delivery address</SheetTitle>
                    </SheetHeader>

                    <div className="space-y-5 mt-4">
                        <Button
                            className="w-full bg-green-600 hover:bg-green-700 text-white gap-2 py-3 text-sm sm:text-base rounded-xl transition-all"
                            onClick={() => {
                                setEditingAddress(null);
                                setShowAddModal(true);
                            }}
                        >
                            <Plus className="w-4 h-4" /> Add new address
                        </Button>

                        {loading && (
                            <div className="flex flex-col justify-center items-center py-10 text-gray-500">
                                <Loader2 className="animate-spin h-8 w-8 mb-2" />
                                <span>Loading addresses...</span>
                            </div>
                        )}

                        {!loading && list.length === 0 && (
                            <div className="text-center text-gray-500 py-12 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-200">
                                <MapPin className="w-12 h-12 mx-auto text-gray-300" />
                                <p className="mt-3 font-medium text-sm sm:text-base">No saved addresses yet</p>
                                <p className="text-xs text-gray-400">Add an address to start ordering</p>
                            </div>
                        )}

                        <div className="space-y-3">
                            {list.map(addr => {
                                const id = addr._id;
                                const isSelected = selectedAddress?._id === id;

                                return (
                                    <div
                                        key={id}
                                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer group
                                        ${isSelected
                                                ? "border-green-600 bg-green-50 dark:bg-green-900/10"
                                                : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700"
                                            }`}
                                    >
                                        <div className="flex flex-col sm:flex-row justify-between gap-3">
                                            <div
                                                className="flex-1"
                                                onClick={() => handleSelect(addr)}
                                            >
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isSelected ? "bg-green-200 text-green-700" : "bg-gray-100 text-gray-600"
                                                        }`}>
                                                        {addr.label?.toUpperCase() || 'OTHER'}
                                                    </span>
                                                    {addr.isDefault && (
                                                        <span className="text-[10px] bg-blue-100 text-blue-600 font-bold px-2 py-0.5 rounded-full">
                                                            DEFAULT
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">{addr.name}</p>
                                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                    {addr.flatNumber ? `${addr.flatNumber}, ` : ''}
                                                    {addr.street || `${addr.area}, ${addr.city}`}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                                    <span className="opacity-70">📞</span> {addr.phone}
                                                </p>
                                            </div>

                                            <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={(e) => { e.stopPropagation(); setEditingAddress(addr); setShowAddModal(true); }}
                                                    className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    disabled={isDeleting}
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(addr); }}
                                                    className="h-8 w-8 text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {selectedAddress && (
                            <div className="p-4 rounded-xl border-t border-gray-100 bg-gray-50 dark:bg-gray-900/80 mt-6">
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Currently delivering to:</p>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">{selectedAddress.label}</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">{selectedAddress.area}, {selectedAddress.city}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>

            {showAddModal && (
                <DeliveryAddressPage
                    open={showAddModal}
                    userId={user?._id}
                    onClose={() => { setShowAddModal(false); setEditingAddress(null); }}
                    setShowAddModal={setShowAddModal}
                    handleAddAddress={handleSaveAddress}
                    editingAddress={editingAddress ?? undefined}
                />
            )}
        </>
    );
};

export default AddressModal;
