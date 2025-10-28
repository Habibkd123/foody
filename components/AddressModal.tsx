// "use client";
// import React, { useState } from 'react';
// import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import AddAddressModal from './AddAddressModal';
// import { MapPin } from 'lucide-react';
// import { useOrder } from '@/context/OrderContext';
// import { useAuthStorage } from '@/hooks/useAuth';
// // Dummy addresses for now
// const dummyAddresses = [
//     {
//         label: "Home",
//         name: "John Doe",
//         area: "Block A, Sector 21",
//         phone: "9876543210",
//         marker: { lat: 28.6139, lng: 77.2090 },
//         distance: "2km"
//     },
//     {
//         label: "Work",
//         name: "John Office",
//         area: "Cyber City, Gurugram",
//         phone: "9123456789",
//         distance: "3km",
//         marker: { lat: 28.5045, lng: 77.3281 },
//     },
// ];

// const AddressModal = ({ addressOpen, setAddressOpen, type }: any) => {
//     const { dispatch } = useOrder();
//     const [showAddModal, setShowAddModal] = useState(false);
//     const [addresses, setAddresses] = useState(dummyAddresses);
//     const [selectedAddress, setSelectedAddress] = useState<any>(null);
//     const { user } = useAuthStorage()
//     const handleAddAddress = (newAddress: any) => {
//         setAddresses((prev: any) => [...prev, newAddress]);
//         setShowAddModal(false);
//     };

//     const handleSelectedAddress = (item: any) => {
//         setSelectedAddress(item)
//         dispatch({ type: "SET_ADDRESS", address: item });
//         dispatch({ type: "SET_DISTANCE", distance: item?.distance });
//         setAddressOpen(false)
//     }

//     return (
//         <>
//             <Sheet open={addressOpen} onOpenChange={setAddressOpen}>
//                 <SheetContent side="right" className="w-full sm:max-w-lg overflow-auto">
//                     <SheetHeader>
//                         <SheetTitle>Select delivery address</SheetTitle>
//                     </SheetHeader>

//                     <div className="p-3 space-y-4">
//                         <Button className="w-full bg-green-600 text-white" onClick={() => setShowAddModal(true)}>
//                             + Add a new address
//                         </Button>

//                         {addresses.map((addr, index) => (
//                             <div
//                                 key={index}
//                                 onClick={() => handleSelectedAddress(addr)}
//                                 className={`rounded-lg p-3 cursor-pointer transition border ${selectedAddress === addr
//                                     ? "border-green-600 bg-green-50"
//                                     : "border-gray-300 bg-white"
//                                     }`}
//                             >
//                                 <div className="flex items-start justify-between">
//                                     <div>
//                                         <p className="font-bold text-black">{addr.label}</p>
//                                         <p className="text-sm text-gray-700">{addr.name}, {addr.area}</p>
//                                         <p className="text-sm text-gray-500">📍 Lat: {addr?.marker?.lat}, Lng: {addr?.marker?.lng}</p>
//                                         <p className="text-sm text-gray-600">📞 {addr.phone}</p>
//                                     </div>
//                                     <MapPin className="text-green-600 mt-1" />
//                                 </div>
//                             </div>
//                         ))}

//                         {selectedAddress && (
//                             <div className="mt-4 p-4 border rounded bg-green-100 text-green-900">
//                                 <p className="font-semibold">Selected Address:</p>
//                                 <p>{selectedAddress.label} - {selectedAddress.name}, {selectedAddress.area}</p>
//                             </div>
//                         )}
//                     </div>
//                 </SheetContent>
//             </Sheet>

//             {showAddModal && (
//                 <AddAddressModal
//                     open={showAddModal}
//                     userId={user?.userId}
//                     onClose={() => setShowAddModal(false)}
//                     setShowAddModal={setShowAddModal}
//                     handleAddAddress={handleAddAddress}
//                 />
//             )}
//         </>
//     );
// };

// export default AddressModal;


// "use client";
// import React, { useState, useEffect } from 'react';
// import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import { MapPin, Edit, Trash2, Loader2, Plus } from 'lucide-react';
// import { useCartOrder } from '@/context/OrderContext';
// import { useAuthStorage } from '@/hooks/useAuth';
// import { Address } from '@/types/global';
// import DeliveryAddressPage from './AddAddressModal';
// import { array } from 'zod';

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
//     const { user } = useAuthStorage();

//     // Load addresses when modal opens
//     useEffect(() => {
//         if (addressOpen && user?._id) {
//             getAddresses(user?._id);
//         }
//     }, [addressOpen, user?._id, getAddresses]);

//     // Set selected address from current address
//     useEffect(() => {
//         if (address) {
//             setSelectedAddress(address);
//         }
//     }, [address]);

//     const handleAddAddress = async (newAddress: Address) => {
//         try {
//             if (!user?._id) {
//                 throw new Error("User not logged in");
//             }

//             let savedAddress: Address;
            
//             if (editingAddress) {
//                 // Update existing address
//                 const addressId = editingAddress._id || editingAddress.id;
//                 if (!addressId) throw new Error("Address ID not found");
                
//                 savedAddress = await updateAddress(user?._id, addressId, newAddress);
//             } else {
//                 // Add new address
//                 savedAddress = await addAddress(user?._id, newAddress);
//             }

//             setShowAddModal(false);
//             setEditingAddress(null);
            
//             // Auto-select the new/updated address if it's marked as default
//             if (savedAddress.isDefault) {
//                 setSelectedAddress(savedAddress);
//                 setAddressOpen(false);
//             }
//         } catch (error) {
//             console.error('Error saving address:', error);
//             // Error is handled in the DeliveryAddressPage component
//         }
//     };

//     const handleSelectAddress = (address: Address) => {
//         setSelectedAddress(address);
        
//         // Calculate distance if coordinates are available
//         if (address.lat && address.lng && address?.lat && address?.lng) {
//             const lat1 = address.lat;
//             const lon1 = address.lng;
//             const lat2 = address.lat;
//             const lon2 = address.lng;
//             const radius = 6371; // Earth's radius (km)

//             const dLat = deg2rad(lat2-lat1);
//             const dLon = deg2rad(lon2-lon1);

//             const a = 
//                 Math.sin(dLat/2) * Math.sin(dLat/2) +
//                 Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
//                 Math.sin(dLon/2) * Math.sin(dLon/2);
            
//             const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//             const distance = radius * c;

//             setDistance(distance);
//         }
        
//         function deg2rad(deg: number) {
//             return deg * (Math.PI/180);
//         }
//         setAddressOpen(false);
//     };

//     const handleEditAddress = (address: Address) => {
//         setEditingAddress(address);
//         setShowAddModal(true);
//     };

//     const handleDeleteAddress = async (address: Address) => {
//         if (!user?._id) return;
        
//         const addressId = address._id || address.id;
//         if (!addressId) return;

//         const confirmDelete = window.confirm(`Are you sure you want to delete the address: ${address?.label} - ${address?.name}?`);
//         if (!confirmDelete) return;

//         setIsDeleting(addressId);
        
//         try {
//             await deleteAddress(user?._id, addressId);
            
//             // If deleted address was selected, clear selection
//             if ((selectedAddress?._id || selectedAddress?.id) === addressId) {
//                 setSelectedAddress(null);
//             }
//         } catch (error) {
//             console.error('Error deleting address:', error);
//             alert('Failed to delete address. Please try again.');
//         } finally {
//             setIsDeleting(null);
//         }
//     };
//     const handleGetAllAddress=async()=>{
//         if (!user?._id) return;
//        let result= await getAddresses(user?._id);
//        console.log("result",result)
//        setAddresses(result);
//     }
// useEffect(()=>{
//     handleGetAllAddress();
// },[])
//     const handleAddNewAddress = () => {
//         setEditingAddress(null);
//         setShowAddModal(true);
//     };
// console.log("addresses",address)
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
//                         {!loading && address?.length === 0 && (
//                             <div className="text-center py-8 text-gray-500">
//                                 <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
//                                 <p className="text-lg font-medium mb-2">No addresses found</p>
//                                 <p className="text-sm">Add your first delivery address to get started</p>
//                             </div>
//                         )}

//                         {/* Address List */}
//                         <div className="space-y-3">
//                             {Array.isArray(address)?address.map((address:any) => {
//                                 const addressId = address._id || address.id || '';
//                                 const isSelected = (selectedAddress?._id || selectedAddress?.id) === addressId;
                                
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
//                                                 onClick={() => handleSelectAddress(address)}
//                                             >
//                                                 <div className="flex items-center space-x-2 mb-2">
//                                                     <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                                                         {address?.label}
//                                                     </span>
//                                                     {address?.isDefault && (
//                                                         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                                                             Default
//                                                         </span>
//                                                     )}
//                                                 </div>
                                                
//                                                 <p className="font-semibold text-gray-900">{address?.name}</p>
                                                
//                                                 <div className="text-sm text-gray-700 space-y-1">
//                                                     <p>{address?.flatNumber}{address?.floor && `, Floor ${address.floor}`}</p>
//                                                     <p>{address?.area}, {address?.city}</p>
//                                                     <p>{address?.state} {address?.zipCode || address?.pincode}</p>
//                                                     {address?.landmark && <p>Near {address?.landmark}</p>}
//                                                 </div>
                                                
//                                                 <p className="text-sm text-gray-600 mt-2">📞 {address?.phone}</p>
                                                
//                                                 {address?.lat && address?.lng && (
//                                                     <p className="text-xs text-gray-500 mt-1">
//                                                         📍 {address?.lat.toFixed(6)}, {address?.lng.toFixed(6)}
//                                                     </p>
//                                                 )}
//                                             </div>
                                            
//                                             {/* Action Buttons */}
//                                             <div className="flex flex-col space-y-2">
//                                                 <button
//                                                     onClick={(e) => {
//                                                         e.stopPropagation();
//                                                         handleEditAddress(address);
//                                                     }}
//                                                     className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
//                                                     title="Edit address"
//                                                 >
//                                                     <Edit className="w-4 h-4" />
//                                                 </button>
                                                
//                                                 <button
//                                                     onClick={(e) => {
//                                                         e.stopPropagation();
//                                                         handleDeleteAddress(address);
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
//                             }):<>
//                              <div
//                                         className={`rounded-lg p-4 cursor-pointer transition-all border-2 ${
//                                             "border-gray-200 bg-white hover:border-gray-300"
//                                         }`}
//                                     >
//                                         <div className="flex items-start justify-between">
//                                             <div 
//                                                 className="flex-1 mr-3"
//                                                 onClick={() => handleSelectAddress(address)}
//                                             >
//                                                 <div className="flex items-center space-x-2 mb-2">
//                                                     <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                                                         {address?.label}
//                                                     </span>
//                                                     {address?.isDefault && (
//                                                         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                                                             Default
//                                                         </span>
//                                                     )}
//                                                 </div>
                                                
//                                                 <p className="font-semibold text-gray-900">{address?.name}</p>
                                                
//                                                 <div className="text-sm text-gray-700 space-y-1">
//                                                     <p>{address?.flatNumber}{address?.floor && `, Floor ${address.floor}`}</p>
//                                                     <p>{address?.area}, {address?.city}</p>
//                                                     <p>{address?.state} {address?.zipCode || address?.pincode}</p>
//                                                     {address?.landmark && <p>Near {address?.landmark}</p>}
//                                                 </div>
                                                
//                                                 <p className="text-sm text-gray-600 mt-2">📞 {address?.phone}</p>
                                                
//                                                 {address?.lat && address?.lng && (
//                                                     <p className="text-xs text-gray-500 mt-1">
//                                                         📍 {address?.lat.toFixed(6)}, {address?.lng.toFixed(6)}
//                                                     </p>
//                                                 )}
//                                             </div>
                                            
//                                             {/* Action Buttons */}
//                                             <div className="flex flex-col space-y-2">
//                                                 <button
//                                                     onClick={(e) => {
//                                                         e.stopPropagation();
//                                                         handleEditAddress(address);
//                                                     }}
//                                                     className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
//                                                     title="Edit address"
//                                                 >
//                                                     <Edit className="w-4 h-4" />
//                                                 </button>
                                                
//                                                 <button
//                                                     onClick={(e) => {
//                                                         e.stopPropagation();
//                                                         handleDeleteAddress(address);
//                                                     }}
//                                                     // disabled={isDeleting === addressId}
//                                                     className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
//                                                     title="Delete address"
//                                                 >
//                                                     {isDeleting ? (
//                                                         <Loader2 className="w-4 h-4 animate-spin" />
//                                                     ) : (
//                                                         <Trash2 className="w-4 h-4" />
//                                                     )}
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
                            
//                             </>}
//                         </div>

//                         {/* Selected Address Summary */}
//                         {selectedAddress && (
//                             <div className="mt-6 p-4 border rounded-lg bg-green-50 border-green-200">
//                                 <p className="font-semibold text-green-900 mb-2">Selected Address:</p>
//                                 <div className="text-green-800">
//                                     <p className="font-medium">{selectedAddress?.label} - {selectedAddress?.name}</p>
//                                     <p className="text-sm">{selectedAddress?.area}, {selectedAddress&&selectedAddress?.city}</p>
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
//                     userId={user?.userId}
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
        address, // This should be addresses (array)
        setDistance, 
        addAddress, 
        updateAddress, 
        deleteAddress,
        getAddresses,
        loading 
    } = useCartOrder();
    
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const { user } = useAuthStorage();

    // Load addresses when modal opens
    useEffect(() => {
        if (addressOpen && user?._id) {
            handleGetAllAddress();
        }
    }, [addressOpen, user?._id]);

    // Set selected address from current address
    useEffect(() => {
        if (address && !Array.isArray(address)) {
            setSelectedAddress(address);
        }
    }, [address]);

    const handleGetAllAddress = async () => {
        if (!user?._id) return;
        try {
            let result = await getAddresses(user?._id);
            console.log("result", result);
            setAddresses(result !== undefined ? result : []);
        } catch (error) {
            console.error('Error loading addresses:', error);
            setAddresses([]);
        }
    };

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371; // Earth's radius (km)
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

    const deg2rad = (deg: number): number => {
        return deg * (Math.PI/180);
    };

    const handleAddAddress = async (newAddress: Address) => {
        try {
            if (!user?._id) {
                throw new Error("User not logged in");
            }

            let savedAddress: Address;
            console.log("newAddress", newAddress);
            if (editingAddress) {
                // Update existing address
                const addressId = editingAddress._id 
                if (!addressId) throw new Error("Address ID not found");
                // @ts-ignore
                savedAddress = await updateAddress(user?._id, addressId, newAddress);
            } else {
                // Add new address
                // @ts-ignore
                savedAddress = await addAddress(user?._id, newAddress);
            }

            // Refresh the addresses list
            await handleGetAllAddress();
            
            setShowAddModal(false);
            setEditingAddress(null);
            
            // Auto-select the new/updated address if it's marked as default
            if (savedAddress?.isDefault) {
                setSelectedAddress(savedAddress);
                setAddressOpen(false);
            }
        } catch (error) {
            console.error('Error saving address:', error);
            alert('Failed to save address. Please try again.');
        }
    };

    const handleSelectAddress = (address: Address) => {
        setSelectedAddress(address);
        
        // Calculate distance if coordinates are available
        if (address.lat && address.lng) {
            // You'll need to define your reference point (shop location)
            // For now, using a default center - replace with actual shop coordinates
            const shopLat = 26.926; // Replace with actual shop latitude
            const shopLng = 75.823; // Replace with actual shop longitude
            
            const distance = calculateDistance(
                address.lat,
                address.lng,
                shopLat,
                shopLng
            );
            
            setDistance(distance);
        }
        
        setAddressOpen(false);
    };

    const handleEditAddress = (address: Address) => {
        setEditingAddress(address);
        setShowAddModal(true);
    };

    const handleDeleteAddress = async (address: Address) => {
        console.log("address",address)
        if (!user?._id) return;
        
        const addressId = address._id 
        if (!addressId) return;

        const confirmDelete = window.confirm(`Are you sure you want to delete the address: ${address?.label} - ${address?.name}?`);
        if (!confirmDelete) return;

        setIsDeleting(addressId);
        
        try {
            await deleteAddress(user?._id, addressId);
            
            // Refresh addresses list
            await handleGetAllAddress();
            
            // If deleted address was selected, clear selection
            if ((selectedAddress?._id ) === addressId) {
                setSelectedAddress(null);
            }
        } catch (error) {
            console.error('Error deleting address:', error);
            alert('Failed to delete address. Please try again.');
        } finally {
            setIsDeleting(null);
        }
    };

    const handleAddNewAddress = () => {
        setEditingAddress(null);
        setShowAddModal(true);
    };

    // Use local addresses state instead of the address from context
    const addressList = addresses.length > 0 ? addresses : (Array.isArray(address) ? address : address ? [address] : []);
    return (
        <>
            <Sheet open={addressOpen} onOpenChange={setAddressOpen}>
                <SheetContent side="right" className="w-full sm:max-w-lg overflow-auto">
                    <SheetHeader>
                        <SheetTitle>Select delivery address</SheetTitle>
                    </SheetHeader>
                    
                    <div className="p-3 space-y-4">
                        {/* Add New Address Button */}
                        <Button 
                            className="w-full bg-green-600 hover:bg-green-700 text-white" 
                            onClick={handleAddNewAddress}
                            disabled={loading}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add a new address
                        </Button>

                        {/* Loading State */}
                        {loading && (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                                <span>Loading addresses...</span>
                            </div>
                        )}

                        {/* No Addresses State */}
                        {!loading && addressList.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <p className="text-lg font-medium mb-2">No addresses found</p>
                                <p className="text-sm">Add your first delivery address to get started</p>
                            </div>
                        )}

                        {/* Address List */}
                        <div className="space-y-3">
                            {addressList.map((addr: any) => {
                                const addressId = addr._id || addr.id || '';
                                const isSelected = (selectedAddress?._id ) === addressId;
                                
                                return (
                                    <div
                                        key={addressId}
                                        className={`rounded-lg p-4 cursor-pointer transition-all border-2 ${
                                            isSelected
                                                ? "border-green-600 bg-green-50"
                                                : "border-gray-200 bg-white hover:border-gray-300"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div 
                                                className="flex-1 mr-3"
                                                onClick={() => handleSelectAddress(addr)}
                                            >
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                        {addr?.label}
                                                    </span>
                                                    {addr?.isDefault && (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <p className="font-semibold text-gray-900">{addr?.name}</p>
                                                
                                                <div className="text-sm text-gray-700 space-y-1">
                                                    <p>{addr?.street || addr?.flatNumber}{addr?.floor && `, Floor ${addr.floor}`}</p>
                                                    <p>{addr?.area}, {addr?.city}</p>
                                                    <p>{addr?.state} {addr?.zipCode}</p>
                                                    {addr?.landmark && <p>Near {addr?.landmark}</p>}
                                                </div>
                                                
                                                <p className="text-sm text-gray-600 mt-2">📞 {addr?.phone}</p>
                                                
                                                {addr?.lat && addr?.lng && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        📍 {addr?.lat.toFixed(6)}, {addr?.lng.toFixed(6)}
                                                    </p>
                                                )}
                                            </div>
                                            
                                            {/* Action Buttons */}
                                            <div className="flex flex-col space-y-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditAddress(addr);
                                                    }}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                    title="Edit address"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteAddress(addr);
                                                    }}
                                                    disabled={isDeleting === addressId}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                                                    title="Delete address"
                                                >
                                                    {isDeleting === addressId ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Selected Address Summary */}
                        {selectedAddress && (
                            <div className="mt-6 p-4 border rounded-lg bg-green-50 border-green-200">
                                <p className="font-semibold text-green-900 mb-2">Selected Address:</p>
                                <div className="text-green-800">
                                    <p className="font-medium">{selectedAddress?.label} - {selectedAddress?.name}</p>
                                    <p className="text-sm">{selectedAddress?.area}, {selectedAddress?.city}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>

            {/* Add/Edit Address Modal */}
            {showAddModal && (
                <DeliveryAddressPage
                    open={showAddModal}
                    userId={user?._id}
                    onClose={() => {
                        setShowAddModal(false);
                        setEditingAddress(null);
                    }}
                    setShowAddModal={setShowAddModal}
                    handleAddAddress={handleAddAddress}
                    editingAddress={editingAddress || undefined}
                />
            )}
        </>
    );
};

export default AddressModal;