// "use client"
// import React, { useState, useEffect } from 'react';
// import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import { MapPin, Edit, Trash2, Loader2, Plus } from 'lucide-react';
// import { useCartOrder } from '@/context/OrderContext';
// import { useAuthStorage } from '@/hooks/useAuth';
// import { Address } from '@/types/global';
// import DeliveryAddressPage from './AddAddressModal';

// interface AddressModalProps {
//     addressOpen: boolean;
//     setAddressOpen: (open: boolean) => void;
//     type?: string;
// }

// const AddressModal: React.FC<AddressModalProps> = ({ addressOpen, setAddressOpen, type }) => {
//     const { 
//         address, 
//         setDistance, 
//         addAddress, 
//         updateAddress, 
//         deleteAddress,
//         getAddresses,
//         loading 
//     } = useCartOrder();

//     const [showAddModal, setShowAddModal] = useState(false);
//     const [editingAddress, setEditingAddress] = useState<Address | null>(null);
//     const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
//     const [isDeleting, setIsDeleting] = useState<string | null>(null);
//     const [addresses, setAddresses] = useState<Address[]>([]);
//     const { user } = useAuthStorage();

//     // Load addresses when modal opens
//     useEffect(() => {
//         if (addressOpen && user?._id) {
//             handleGetAllAddress();
//         }
//     }, [addressOpen, user?._id]);

//     // Set selected address from current address
//     useEffect(() => {
//         if (address && !Array.isArray(address)) {
//             setSelectedAddress(address);
//         }
//     }, [address]);

//     const handleGetAllAddress = async () => {
//         if (!user?._id) return;
//         try {
//             let result = await getAddresses(user?._id);
//             console.log("result", result);
//             setAddresses(result !== undefined ? result : []);
//         } catch (error) {
//             console.error('Error loading addresses:', error);
//             setAddresses([]);
//         }
//     };

//     const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
//         const R = 6371; // Earth's radius (km)
//         const dLat = deg2rad(lat2 - lat1);
//         const dLon = deg2rad(lon2 - lon1);
//         const a = 
//             Math.sin(dLat/2) * Math.sin(dLat/2) +
//             Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
//             Math.sin(dLon/2) * Math.sin(dLon/2);
//         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//         return R * c;
//     };

//     const deg2rad = (deg: number): number => {
//         return deg * (Math.PI/180);
//     };

//     const handleAddAddress = async (newAddress: Address) => {
//         try {
//             if (!user?._id) {
//                 throw new Error("User not logged in");
//             }

//             let savedAddress: Address;
//             console.log("newAddress", newAddress);
//             if (editingAddress) {
//                 // Update existing address
//                 const addressId = editingAddress._id 
//                 if (!addressId) throw new Error("Address ID not found");
//                 // @ts-ignore
//                 savedAddress = await updateAddress(user?._id, addressId, newAddress);
//             } else {
//                 // Add new address
//                 // @ts-ignore
//                 savedAddress = await addAddress(user?._id, newAddress);
//             }

//             // Refresh the addresses list
//             await handleGetAllAddress();

//             setShowAddModal(false);
//             setEditingAddress(null);

//             // Auto-select the new/updated address if it's marked as default
//             if (savedAddress?.isDefault) {
//                 setSelectedAddress(savedAddress);
//                 setAddressOpen(false);
//             }
//         } catch (error) {
//             console.error('Error saving address:', error);
//             alert('Failed to save address. Please try again.');
//         }
//     };

//     // Minimal update for default flag using PATCH API
//     const patchDefaultFlag = async (userId: string, addressId: string, isDefault: boolean) => {
//         await fetch(`/api/users/${userId}/addresses`, {
//             method: 'PATCH',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ addressId, isDefault }),
//         });
//     };

//     const handleSelectAddress = async (selected: Address) => {
//         setSelectedAddress(selected);

//         // Persist selection: make this the only default on server
//         try {
//             if (!user?._id) return;
//             const selectedId = selected._id as string;
//             // Toggle selected as default via PATCH (no required fields needed)
//             await patchDefaultFlag(user._id, selectedId, true);

//             // Load all addresses and unset default for others
//             const list: any[] = await getAddresses(user._id);
//             const updates: Promise<any>[] = [];
//             for (const addr of list) {
//                 if ((addr._id !== selectedId) && addr.isDefault) {
//                     updates.push(patchDefaultFlag(user._id, addr._id, false));
//                 }
//             }
//             if (updates.length) await Promise.allSettled(updates);

//             // Refresh local list
//             await handleGetAllAddress();
//         } catch (e) {
//             console.error('Failed to persist selected address', e);
//         }

//         // Calculate distance if coordinates are available
//         if (selected.lat && selected.lng) {
//             const shopLat = 26.926; // TODO: replace with actual shop coordinates
//             const shopLng = 75.823;
//             const distance = calculateDistance(
//                 selected.lat,
//                 selected.lng,
//                 shopLat,
//                 shopLng
//             );
//             setDistance(distance);
//         }

//         setAddressOpen(false);
//     };

//     const handleEditAddress = (address: Address) => {
//         setEditingAddress(address);
//         setShowAddModal(true);
//     };

//     const handleDeleteAddress = async (address: Address) => {
//         console.log("address",address)
//         if (!user?._id) return;

//         const addressId = address._id 
//         if (!addressId) return;

//         const confirmDelete = window.confirm(`Are you sure you want to delete the address: ${address?.label} - ${address?.name}?`);
//         if (!confirmDelete) return;

//         setIsDeleting(addressId);

//         try {
//             await deleteAddress(user?._id, addressId);

//             // Refresh addresses list
//             await handleGetAllAddress();

//             // If deleted address was selected, clear selection
//             if ((selectedAddress?._id ) === addressId) {
//                 setSelectedAddress(null);
//             }
//         } catch (error) {
//             console.error('Error deleting address:', error);
//             alert('Failed to delete address. Please try again.');
//         } finally {
//             setIsDeleting(null);
//         }
//     };

//     const handleAddNewAddress = () => {
//         setEditingAddress(null);
//         setShowAddModal(true);
//     };

//     // Use local addresses state instead of the address from context
//     const addressList = addresses.length > 0 ? addresses : (Array.isArray(address) ? address : address ? [address] : []);
//     return (
//         <>
//             <Sheet open={addressOpen} onOpenChange={setAddressOpen}>
//                 <SheetContent side="right" className="w-full sm:max-w-lg overflow-auto">
//                     <SheetHeader>
//                         <SheetTitle>Select delivery address</SheetTitle>
//                     </SheetHeader>

//                     <div className="p-3 space-y-4">
//                         {/* Add New Address Button */}
//                         <Button 
//                             className="w-full bg-green-600 hover:bg-green-700 text-white" 
//                             onClick={handleAddNewAddress}
//                             disabled={loading}
//                         >
//                             <Plus className="w-4 h-4 mr-2" />
//                             Add a new address
//                         </Button>

//                         {/* Loading State */}
//                         {loading && (
//                             <div className="flex items-center justify-center py-8">
//                                 <Loader2 className="w-6 h-6 animate-spin mr-2" />
//                                 <span>Loading addresses...</span>
//                             </div>
//                         )}

//                         {/* No Addresses State */}
//                         {!loading && addressList.length === 0 && (
//                             <div className="text-center py-8 text-gray-500">
//                                 <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
//                                 <p className="text-lg font-medium mb-2">No addresses found</p>
//                                 <p className="text-sm">Add your first delivery address to get started</p>
//                             </div>
//                         )}

//                         {/* Address List */}
//                         <div className="space-y-3">
//                             {addressList.map((addr: any) => {
//                                 const addressId = addr._id || addr.id || '';
//                                 const isSelected = (selectedAddress?._id ) === addressId;

//                                 return (
//                                     <div
//                                         key={addressId}
//                                         className={`rounded-lg p-4 cursor-pointer transition-all border-2 ${
//                                             isSelected
//                                                 ? "border-green-600 bg-green-50"
//                                                 : "border-gray-200 bg-white hover:border-gray-300"
//                                         }`}
//                                     >
//                                         <div className="flex items-start justify-between">
//                                             <div 
//                                                 className="flex-1 mr-3"
//                                                 onClick={() => handleSelectAddress(addr)}
//                                             >
//                                                 <div className="flex items-center space-x-2 mb-2">
//                                                     <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                                                         {addr?.label}
//                                                     </span>
//                                                     {addr?.isDefault && (
//                                                         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                                                             Default
//                                                         </span>
//                                                     )}
//                                                 </div>

//                                                 <p className="font-semibold text-gray-900">{addr?.name}</p>

//                                                 <div className="text-sm text-gray-700 space-y-1">
//                                                     <p>{addr?.street || addr?.flatNumber}{addr?.floor && `, Floor ${addr.floor}`}</p>
//                                                     <p>{addr?.area}, {addr?.city}</p>
//                                                     <p>{addr?.state} {addr?.zipCode}</p>
//                                                     {addr?.landmark && <p>Near {addr?.landmark}</p>}
//                                                 </div>

//                                                 <p className="text-sm text-gray-600 mt-2">📞 {addr?.phone}</p>

//                                                 {addr?.lat && addr?.lng && (
//                                                     <p className="text-xs text-gray-500 mt-1">
//                                                         📍 {addr?.lat.toFixed(6)}, {addr?.lng.toFixed(6)}
//                                                     </p>
//                                                 )}
//                                             </div>

//                                             {/* Action Buttons */}
//                                             <div className="flex flex-col space-y-2">
//                                                 <button
//                                                     onClick={(e) => {
//                                                         e.stopPropagation();
//                                                         handleEditAddress(addr);
//                                                     }}
//                                                     className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
//                                                     title="Edit address"
//                                                 >
//                                                     <Edit className="w-4 h-4" />
//                                                 </button>

//                                                 <button
//                                                     onClick={(e) => {
//                                                         e.stopPropagation();
//                                                         handleDeleteAddress(addr);
//                                                     }}
//                                                     disabled={isDeleting === addressId}
//                                                     className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
//                                                     title="Delete address"
//                                                 >
//                                                     {isDeleting === addressId ? (
//                                                         <Loader2 className="w-4 h-4 animate-spin" />
//                                                     ) : (
//                                                         <Trash2 className="w-4 h-4" />
//                                                     )}
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>

//                         {/* Selected Address Summary */}
//                         {selectedAddress && (
//                             <div className="mt-6 p-4 border rounded-lg bg-green-50 border-green-200">
//                                 <p className="font-semibold text-green-900 mb-2">Selected Address:</p>
//                                 <div className="text-green-800">
//                                     <p className="font-medium">{selectedAddress?.label} - {selectedAddress?.name}</p>
//                                     <p className="text-sm">{selectedAddress?.area}, {selectedAddress?.city}</p>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </SheetContent>
//             </Sheet>

//             {/* Add/Edit Address Modal */}
//             {showAddModal && (
//                 <DeliveryAddressPage
//                     open={showAddModal}
//                     userId={user?._id}
//                     onClose={() => {
//                         setShowAddModal(false);
//                         setEditingAddress(null);
//                     }}
//                     setShowAddModal={setShowAddModal}
//                     handleAddAddress={handleAddAddress}
//                     editingAddress={editingAddress || undefined}
//                 />
//             )}
//         </>
//     );
// };

// export default AddressModal;



"use client";
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MapPin, Edit, Trash2, Loader2, Plus } from 'lucide-react';
import { useCartOrder } from '@/context/OrderContext';
import { useAuthStorage } from '@/hooks/useAuth';
import { Address } from '@/types/global';
import DeliveryAddressPage from './AddAddressModal';

interface AddressModalProps {
    addressOpen: boolean;
    setAddressOpen: (open: boolean) => void;
    type?: string;
}

const AddressModal: React.FC<AddressModalProps> = ({ addressOpen, setAddressOpen, type }) => {

    const {
        address, setDistance, addAddress, updateAddress, deleteAddress,
        getAddresses, loading
    } = useCartOrder();

    const [showAddModal, setShowAddModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const { user } = useAuthStorage();

    useEffect(() => {
        if (addressOpen && user?._id) handleGetAllAddress();
    }, [addressOpen, user?._id]);

    useEffect(() => {
        if (address && !Array.isArray(address)) {
            setSelectedAddress(address);
        }
    }, [address]);

    const handleGetAllAddress = async () => {
        if (!user?._id) return;
        try {
            let result = await getAddresses(user?._id);
            setAddresses(result ?? []);
        } catch {
            setAddresses([]);
        }
    };

    const handleAddAddress = async (val: Address) => {
        try {
            if (!user?._id) throw new Error("Login required");

            let updated;
            if (editingAddress) {
                const addressId = editingAddress._id
                if (!addressId) throw new Error("Address ID not found");
                updated = await updateAddress(user._id, addressId, val);
            } else {
                updated = await addAddress(user._id, val);
            }

            await handleGetAllAddress();
            setShowAddModal(false);
            setEditingAddress(null);
        } catch {
            alert("Error saving address");
        }
    };

    const handleDeleteAddress = async (addr: Address) => {
        if (!user?._id) return;
        const confirmDelete = confirm(`Delete ${addr.label}?`);
        if (!confirmDelete) return;
const addressId = addr._id 
        if (!addressId) return;

        // const confirmDelete = window.confirm(`Are you sure you want to delete the address: ${address?.label} - ${address?.name}?`);
        if (!confirmDelete) return;
        setIsDeleting(addressId);
        await deleteAddress(user._id, addressId);
        await handleGetAllAddress();
        if (selectedAddress?._id === addr._id) setSelectedAddress(null);
        setIsDeleting(null);
    };

    const handleSelect = (item: Address) => {
        setSelectedAddress(item);
        setAddressOpen(false);
    };

    const list = addresses.length ? addresses : [];

    return (
        <>
            <Sheet open={addressOpen} onOpenChange={setAddressOpen}>

                <SheetContent className="w-full sm:max-w-md p-4 overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle className="text-lg sm:text-xl font-semibold">Select delivery address</SheetTitle>
                    </SheetHeader>

                    <div className="space-y-5 mt-4">

                        <Button
                            className="w-full bg-green-600 text-white gap-2 py-3 text-sm sm:text-base"
                            onClick={() => {
                                setEditingAddress(null);
                                setShowAddModal(true);
                            }}
                        >
                            <Plus className="w-4 h-4" /> Add new address
                        </Button>

                        {loading && (
                            <div className="flex justify-center items-center py-10">
                                <Loader2 className="animate-spin h-6 w-6 mr-2" /> Loading...
                            </div>
                        )}

                        {!loading && list.length === 0 && (
                            <div className="text-center text-gray-500 py-10">
                                <MapPin className="w-12 h-12 mx-auto text-gray-300" />
                                <p className="mt-3 font-medium text-sm sm:text-base">No saved addresses yet</p>
                            </div>
                        )}

                        {list.map(addr => (
                            <div
                                key={addr._id}
                                className={`p-4 rounded-xl border-2 transition-all cursor-pointer
                ${selectedAddress?._id === addr._id
                                        ? "border-green-600 bg-green-50"
                                        : "border-gray-200 hover:border-gray-400"
                                    }`}
                            >
                                <div className="flex flex-col sm:flex-row justify-between gap-3">

                                    {/* Address text */}
                                    <div
                                        className="flex-1"
                                        onClick={() => handleSelect(addr)}
                                    >
                                        <p className="text-sm sm:text-base font-semibold">{addr.label}</p>
                                        <p className="text-sm text-gray-700">{addr.name}</p>
                                        <p className="text-xs sm:text-sm text-gray-600">{addr.area}, {addr.city}</p>
                                        <p className="text-xs text-gray-500 mt-1">📞 {addr.phone}</p>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex gap-2 justify-end">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setEditingAddress(addr); setShowAddModal(true); }}
                                            className="p-2 hover:bg-blue-100 rounded-md"
                                        >
                                            <Edit className="w-4 h-4 text-blue-600" />
                                        </button>

                                        <button
                                            disabled={isDeleting === addr._id}
                                            onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addr); }}
                                            className="p-2 hover:bg-red-100 rounded-md disabled:opacity-50"
                                        >
                                            {isDeleting === addr._id
                                                ? <Loader2 className="animate-spin w-4 h-4" />
                                                : <Trash2 className="w-4 h-4 text-red-600" />
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {selectedAddress && (
                            <div className="p-4 rounded-xl border bg-green-100 text-green-900 text-sm sm:text-base">
                                Selected: <strong>{selectedAddress.label}</strong>
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
                    handleAddAddress={handleAddAddress}
                    editingAddress={editingAddress ?? undefined}
                />
            )}
        </>
    );
};

export default AddressModal;
