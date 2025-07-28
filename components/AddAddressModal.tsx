// // "use client";
// // import React, { useState } from "react";
// // import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
// // import { Input } from "@/components/ui/input";
// // import { Button } from "@/components/ui/button";
// // import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

// // const libraries: any = ["places"];
// // const center = { lat: 26.9124, lng: 75.7873 }; // Jaipur default

// // const AddAddressModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
// //     const { isLoaded } = useLoadScript({
// //         googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
// //         libraries,
// //     });

// //     const [marker, setMarker] = useState(center);
// //     const [form, setForm] = useState({
// //         label: "Home",
// //         house: "",
// //         area: "",
// //         name: "",
// //         phone: "",
// //     });

// //     if (!isLoaded) return <div className="p-4">Loading map...</div>;

// //     const handleMapClick = (e: google.maps.MapMouseEvent) => {
// //         if (e.latLng) {
// //             setMarker({
// //                 lat: e.latLng.lat(),
// //                 lng: e.latLng.lng(),
// //             });
// //         }
// //     };

// //     const handleSave = () => {
// //         console.log("Saved address:", { ...form, location: marker });
// //         onClose(); // Close the sheet
// //     };

// //     return (
// //         <Sheet open={open} onOpenChange={onClose}>
// //             <SheetContent side="top" className="h-[90vh] overflow-auto w-[80%] mx-auto mt-5 rounded-lg">
// //                 <SheetHeader>
// //                     <SheetTitle>Enter complete address</SheetTitle>
// //                 </SheetHeader>
// //                 <div className="grid grid-cols-2 gap-4">

// //                     <div className="h-[50vh] my-4 rounded-lg overflow-hidden">
// //                         <GoogleMap
// //                             zoom={16}
// //                             center={marker}
// //                             mapContainerClassName="w-full h-full"
// //                             onClick={handleMapClick}
// //                         >
// //                             <Marker position={marker} />
// //                         </GoogleMap>
// //                         <div className="p-4 border border-gray-200 rounded-lg bg-red-500">
// //                             <h1>Delivering your order to</h1>
// //                             <div className="flex items-center space-x-2">
// //                                 <div className="flex items-center space-x-2">
// //                                     <img src="https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=225/layout-engine/2024-01/image.png" style={{ width: "50px", height: "50px" }} />
// //                                 </div>
// //                                 <div className="space-y-1">
// //                                     <p>Suraj nagar</p>
// //                                     <p>Jaipur</p>
// //                                 </div>
// //                             </div>
// //                         </div>
// //                     </div>

// //                     <div className="space-y-4">
// //                         {/* Tag Buttons */}
// //                         <div className="flex space-x-2">
// //                             {["Home", "Work", "Hotel", "Other"].map((type) => (
// //                                 <Button
// //                                     key={type}
// //                                     variant={form.label === type ? "default" : "outline"}
// //                                     onClick={() => setForm((prev) => ({ ...prev, label: type }))}
// //                                 >
// //                                     {type}
// //                                 </Button>
// //                             ))}
// //                         </div>

// //                         <Input
// //                             placeholder="Flat / House no / Building name"
// //                             value={form.house}
// //                             onChange={(e) => setForm({ ...form, house: e.target.value })}
// //                         />
// //                         <Input
// //                             placeholder="Area / Sector / Locality"
// //                             value={form.area}
// //                             onChange={(e) => setForm({ ...form, area: e.target.value })}
// //                         />
// //                         <Input
// //                             placeholder="Your name"
// //                             value={form.name}
// //                             onChange={(e) => setForm({ ...form, name: e.target.value })}
// //                         />
// //                         <Input
// //                             placeholder="Your phone number"
// //                             value={form.phone}
// //                             onChange={(e) => setForm({ ...form, phone: e.target.value })}
// //                         />

// //                         <Button onClick={handleSave} className="w-full bg-green-600 text-white">
// //                             Save Address
// //                         </Button>
// //                     </div>
// //                 </div>

// //             </SheetContent>
// //         </Sheet>

// //     );
// // };

// // export default AddAddressModal;



// // "use client";
// // import React, { useEffect, useState } from "react";
// // import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
// // import { Input } from "@/components/ui/input";
// // import { Button } from "@/components/ui/button";
// // import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

// // const libraries: any = ["places"];
// // const defaultCenter = { lat: 26.9124, lng: 75.7873 }; // Jaipur

// // interface Address {
// //     label: string;
// //     house: string;
// //     area: string;
// //     name: string;
// //     phone: string;
// //     location: {
// //         lat: number;
// //         lng: number;
// //     };
// // }

// // interface AddAddressModalProps {
// //     open: boolean;
// //     onClose: () => void;
// //     onSave: (data: Address) => void;
// // }

// // const AddAddressModal: React.FC<AddAddressModalProps> = ({ open, onClose, onSave }) => {
// //     const mapRef = React.useRef<google.maps.Map | null>(null);

// //     const { isLoaded } = useLoadScript({
// //         googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
// //         libraries,
// //     });

// //     const [marker, setMarker] = useState(defaultCenter);
// //     const [form, setForm] = useState({
// //         label: "Home",
// //         house: "",
// //         area: "",
// //         name: "",
// //         phone: "",
// //     });

// //     useEffect(() => {
// //         if (open && mapRef.current) {
// //             google.maps.event.trigger(mapRef.current, "resize");
// //             mapRef.current.setCenter(marker);
// //         }
// //     }, [open]);

// //     const handleMapClick = (e: google.maps.MapMouseEvent) => {
// //         if (e.latLng) {
// //             setMarker({
// //                 lat: e.latLng.lat(),
// //                 lng: e.latLng.lng(),
// //             });
// //         }
// //     };

// //     const handleSave = () => {
// //         const payload: Address = {
// //             ...form,
// //             location: marker,
// //         };
// //         onSave(payload); // send data to parent
// //         onClose(); // close modal
// //     };

// //     if (!isLoaded) return <div className="p-4">Loading map...</div>;

// //     return (
// //         <Sheet open={open} onOpenChange={onClose}>
// //             <SheetContent side="top" className="h-[90vh] overflow-auto w-[80%] mx-auto mt-5 rounded-lg">


// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                     {/* Left: Map */}
// //                     <div className="h-[50vh] my-4 rounded-lg ">
// //                         <div className="w-full h-full relative order-1 mt-2">
// //                             <GoogleMap
// //                                 zoom={16}
// //                                 center={marker}
// //                                 mapContainerClassName="w-full h-full"
// //                                 onClick={handleMapClick}
// //                                 onLoad={(map) => {
// //                                     mapRef.current = map;
// //                                     setTimeout(() => {
// //                                         google.maps.event.trigger(map, "resize");
// //                                         map.setCenter(marker);
// //                                     }, 100);
// //                                 }}
// //                             >
// //                                 <Marker position={marker} />
// //                             </GoogleMap>
// //                         </div>

// //                         <div className="p-4 mt-4 border border-gray-200 rounded-lg bg-red-50 order-2">
// //                             <h1 className="font-semibold">Delivering your order to:</h1>
// //                             <div className="flex items-center space-x-2 mt-2">
// //                                 <img
// //                                     src="https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=225/layout-engine/2024-01/image.png"
// //                                     alt="Map location"
// //                                     className="w-12 h-12 object-cover rounded"
// //                                 />
// //                                 <div className="text-sm">
// //                                     <p className="font-medium">{form.area || "Selected Area"}</p>
// //                                     <p>Lat: {marker.lat.toFixed(4)}, Lng: {marker.lng.toFixed(4)}</p>
// //                                 </div>
// //                             </div>
// //                         </div>
// //                     </div>


// //                     {/* Right: Form */}
// //                     <div className="space-y-4">
// //                         {/* Label Buttons */}
// //                         <div className="flex space-x-2">
// //                             {["Home", "Work", "Hotel", "Other"].map((type) => (
// //                                 <Button
// //                                     key={type}
// //                                     variant={form.label === type ? "default" : "outline"}
// //                                     onClick={() => setForm((prev) => ({ ...prev, label: type }))}
// //                                 >
// //                                     {type}
// //                                 </Button>
// //                             ))}
// //                         </div>

// //                         <Input
// //                             placeholder="Flat / House no / Building name"
// //                             value={form.house}
// //                             onChange={(e) => setForm({ ...form, house: e.target.value })}
// //                         />
// //                         <Input
// //                             placeholder="Area / Sector / Locality"
// //                             value={form.area}
// //                             onChange={(e) => setForm({ ...form, area: e.target.value })}
// //                         />
// //                         <Input
// //                             placeholder="Your name"
// //                             value={form.name}
// //                             onChange={(e) => setForm({ ...form, name: e.target.value })}
// //                         />
// //                         <Input
// //                             placeholder="Your phone number"
// //                             value={form.phone}
// //                             onChange={(e) => setForm({ ...form, phone: e.target.value })}
// //                         />

// //                         <Button
// //                             onClick={handleSave}
// //                             className="w-full bg-green-600 text-white hover:bg-green-700"
// //                         >
// //                             Save Address
// //                         </Button>
// //                     </div>
// //                 </div>
// //             </SheetContent>
// //         </Sheet>
// //     );
// // };

// // export default AddAddressModal;


// "use client";
// import React, { useState } from 'react';
// import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
// import { Home, Briefcase, Hotel, MapPin, X, Navigation } from 'lucide-react';

// const mapContainerStyle = {
//     width: '100%',
//     height: '100%',
// };

// const center = {
//     lat: 26.9124,
//     lng: 75.7873,
// };

// const DeliveryAddressPage = () => {
//     const [isSheetOpen, setIsSheetOpen] = useState(true);
//     const [selectedAddressType, setSelectedAddressType] = useState('Home');
//     const [formData, setFormData] = useState({
//         flatNumber: '',
//         floor: '',
//         area: 'Suraj Nagar, Jhotwara, Jaipur',
//         landmark: '',
//         name: '',
//         phone: '7851974625',
//     });

//     const { isLoaded } = useLoadScript({
//         googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '', // Replace with your actual API key
//     });

//     const addressTypes = [
//         { id: 'Home', label: 'Home', icon: Home },
//         { id: 'Work', label: 'Work', icon: Briefcase },
//         { id: 'Hotel', label: 'Hotel', icon: Hotel },
//         { id: 'Other', label: 'Other', icon: MapPin },
//     ];

//     const handleInputChange = (field: string, value: string) => {
//         setFormData(prev => ({
//             ...prev,
//             [field]: value
//         }));
//     };

//     const handleSaveAddress = () => {
//         console.log('Saving address:', formData);
//         setIsSheetOpen(false);
//     };

//     if (!isLoaded) {
//         return (
//             <div className="h-screen flex items-center justify-center">
//                 <div className="text-lg">Loading maps...</div>
//             </div>
//         );
//     }

//     return (
//         <div className="relative h-screen w-full">


//             {/* Address Form Sheet */}
//             <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
//                 <SheetContent side="top" className="h-[95vh] rounded-t-2xl mt-5 w-[74%] mx-auto p-0">

//                     <div className='grid grid-cols-2 gap-4'>
//                         <div>
//                             <div className="relative h-[75vh]">
//                                 {/* Map Container */}
//                                 <div className="absolute inset-0 ronded-lg resize-y">
//                                     <GoogleMap
//                                         mapContainerStyle={mapContainerStyle}
//                                         zoom={16}
//                                         center={center}
//                                         options={{
//                                             disableDefaultUI: false,
//                                             zoomControl: true,
//                                             streetViewControl: false,
//                                             mapTypeControl: false,
//                                             fullscreenControl: false,
//                                         }}
//                                     >
//                                         <Marker
//                                             position={center}
//                                             icon={{
//                                                 url: "data:image/svg+xml;charset=UTF-8,%3csvg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='20' cy='20' r='20' fill='%23dc2626'/%3e%3ccircle cx='20' cy='20' r='8' fill='white'/%3e%3c/svg%3e",
//                                                 scaledSize: new window.google.maps.Size(40, 40),
//                                             }}
//                                         />
//                                     </GoogleMap>
//                                 </div>
//                                 {/* Search Bar */}
//                                 <div className="absolute top-4 left-4 right-4 z-10">
//                                     <div className="bg-red-50 rounded-lg shadow-lg p-4 flex items-center gap-3">
//                                         <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
//                                             <div className="w-3 h-3 bg-white rounded-full"></div>
//                                         </div>
//                                         <div className="flex-1">
//                                             <div className="text-sm text-gray-600">197, Sanjay Nagar A Rd, Sanjay Nagar A, Bal...</div>
//                                         </div>
//                                         <button className="p-1">
//                                             <X className="w-5 h-5 text-gray-400" />
//                                         </button>
//                                     </div>
//                                 </div>

//                                 {/* Current Location Button */}
//                                 <div className="absolute bottom-40 right-10  z-10">
//                                     <button className="bg-white rounded-full p-3 shadow-lg">
//                                         <Navigation className="w-6 h-6 text-gray-600" />
//                                     </button>
//                                 </div>

//                                 {/* Delivery Info Card */}
//                                 {/* <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-20">
//                                 <div className="p-4">
//                                     <div className="flex items-center justify-between mb-4">
//                                         <h3 className="text-lg font-semibold">Delivering your order to</h3>
//                                     </div>

//                                     <div className="flex items-start gap-3 mb-4">
//                                         <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1">
//                                             <div className="w-3 h-3 bg-white rounded-full"></div>
//                                         </div>
//                                         <div>
//                                             <div className="font-medium text-lg">Suraj Nagar</div>
//                                             <div className="text-gray-600 text-sm">Jhotwara, Jaipur</div>
//                                         </div>
//                                     </div>

//                                     <button
//                                         onClick={() => setIsSheetOpen(true)}
//                                         className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
//                                     >
//                                         Go to current location
//                                     </button>
//                                 </div>
//                             </div> */}

//                             </div>
//                             <div className='p-2'>
//                             <div className="px-4 py-2 mt-2 border border-gray-200 rounded-lg  bg-red-50 w-full ">
//                                 <h1 className="font-semibold">Delivering your order to:</h1>
//                                 <div className="flex items-center space-x-2 mt-2">
//                                     <img
//                                         src="https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=225/layout-engine/2024-01/image.png"
//                                         alt="Map location"
//                                         className="w-12 h-12 object-cover rounded"
//                                     />
//                                     {/* <div className="text-sm">
//                                     <p className="font-medium">{form.area || "Selected Area"}</p>
//                                     <p>Lat: {marker.lat.toFixed(4)}, Lng: {marker.lng.toFixed(4)}</p>
//                                 </div> */}
//                                     <div>
//                                         <div className="font-medium text-lg">Suraj Nagar</div>
//                                         <div className="text-gray-600 text-sm">Jhotwara, Jaipur</div>
//                                     </div>
//                                 </div>
//                             </div>
//                             </div>
//                         </div>
//                         <div className="space-y-2 p-4">
//                             <SheetHeader className="text-left pb-4">
//                                 <div className="flex items-center justify-between">
//                                     <SheetTitle className="text-xl font-semibold">Enter complete address</SheetTitle>
//                                     {/* <button
//                                         onClick={() => setIsSheetOpen(false)}
//                                         className="p-1"
//                                     >
//                                         <X className="w-6 h-6 text-gray-400" />
//                                     </button> */}
//                                 </div>
//                             </SheetHeader>
//                             {/* Save address as */}
//                             <div>
//                                 <label className="text-sm font-medium text-gray-700 mb-3 block">
//                                     Save address as *
//                                 </label>
//                                 <div className="flex gap-2">
//                                     {addressTypes.map((type) => {
//                                         const IconComponent = type.icon;
//                                         return (
//                                             <button
//                                                 key={type.id}
//                                                 onClick={() => setSelectedAddressType(type.id)}
//                                                 className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${selectedAddressType === type.id
//                                                     ? 'bg-orange-50 border-orange-200 text-orange-600'
//                                                     : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
//                                                     }`}
//                                             >
//                                                 <IconComponent className="w-4 h-4" />
//                                                 <span className="text-sm font-medium">{type.label}</span>
//                                             </button>
//                                         );
//                                     })}
//                                 </div>
//                             </div>

//                             {/* Flat/House number */}
//                             <div>
//                                 <Input
//                                     placeholder="Flat / House no / Building name *"
//                                     value={formData.flatNumber}
//                                     onChange={(e) => handleInputChange('flatNumber', e.target.value)}
//                                     className="w-full"
//                                 />
//                             </div>

//                             {/* Floor */}
//                             <div>
//                                 <Input
//                                     placeholder="Floor (optional)"
//                                     value={formData.floor}
//                                     onChange={(e) => handleInputChange('floor', e.target.value)}
//                                     className="w-full"
//                                 />
//                             </div>

//                             {/* Area */}
//                             <div>
//                                 <label className="text-sm font-medium text-gray-700 mb-2 block">
//                                     Area / Sector / Locality *
//                                 </label>
//                                 <div className="text-sm text-gray-900 p-3 bg-gray-50 rounded-lg border">
//                                     {formData.area}
//                                 </div>
//                             </div>

//                             {/* Landmark */}
//                             <div>
//                                 <Input
//                                     placeholder="Nearby landmark (optional)"
//                                     value={formData.landmark}
//                                     onChange={(e) => handleInputChange('landmark', e.target.value)}
//                                     className="w-full"
//                                 />
//                             </div>

//                             {/* Contact Details */}
//                             <div>
//                                 <p className="text-sm text-gray-600 mb-4">
//                                     Enter your details for seamless delivery experience
//                                 </p>

//                                 <div className="space-y-4">
//                                     <Input
//                                         placeholder="Your name *"
//                                         value={formData.name}
//                                         onChange={(e) => handleInputChange('name', e.target.value)}
//                                         className="w-full"
//                                     />

//                                     <Input
//                                         placeholder="Your phone number (optional)"
//                                         value={formData.phone}
//                                         onChange={(e) => handleInputChange('phone', e.target.value)}
//                                         className="w-full"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Save Button */}
//                             <div className="pt-4">
//                                 <Button
//                                     onClick={handleSaveAddress}
//                                     className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-medium"
//                                 >
//                                     Save Address
//                                 </Button>
//                             </div>
//                         </div>
//                     </div>
//                 </SheetContent>
//             </Sheet>
//         </div>
//     );
// };

// export default DeliveryAddressPage;
"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, Marker, useLoadScript, Autocomplete } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Home, Briefcase, Hotel, MapPin, Navigation, X } from 'lucide-react';

const libraries: any = ["places"];

const mapContainerStyle = {
    width: '100%',
    height: '100%',
};

const defaultCenter = {
    lat: 26.9124,
    lng: 75.7873,
};

const DeliveryAddressPage = () => {
    const [isSheetOpen, setIsSheetOpen] = useState(true);
    const [selectedAddressType, setSelectedAddressType] = useState('Home');
    const [formData, setFormData] = useState({
        flatNumber: '',
        floor: '',
        area: '',
        landmark: '',
        name: '',
        phone: '',
    });

    const [marker, setMarker] = useState(defaultCenter);
    const [address, setAddress] = useState('');
    const [distance, setDistance] = useState<number | null>(null);

    const autocompleteRef = useRef<any>(null);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries,
    });

    const addressTypes = [
        { id: 'Home', label: 'Home', icon: Home },
        { id: 'Work', label: 'Work', icon: Briefcase },
        { id: 'Hotel', label: 'Hotel', icon: Hotel },
        { id: 'Other', label: 'Other', icon: MapPin },
    ];

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const getAddressFromLatLng = useCallback((lat: number, lng: number) => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results?.length) {
                const formatted = results[0].formatted_address;
                setAddress(formatted);
                handleInputChange('area', formatted);
            }
        });
    }, []);

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setMarker({ lat, lng });
        getAddressFromLatLng(lat, lng);
    };

    const getUserLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            setMarker({ lat: userLat, lng: userLng });
            getAddressFromLatLng(userLat, userLng);
            const d = calculateDistance(userLat, userLng, defaultCenter.lat, defaultCenter.lng);
            setDistance(Number(d.toFixed(2)));
        }, (err) => {
            console.error("Geolocation error:", err.message);
        });
    };

    useEffect(() => {
        getUserLocation();
    }, []);

    const handleSaveAddress = () => {
        console.log("Saved address:", { ...formData, marker });
        setIsSheetOpen(false);
    };

    const handlePlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (!place.geometry) return;
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            setMarker({ lat, lng });
            getAddressFromLatLng(lat, lng);
        }
    };

    if (!isLoaded) return (
        <div className="flex items-center justify-center h-screen w-full">
            <div className="text-lg">Loading map...</div>
        </div>
    );

    return (
        <div className="relative h-screen w-full overflow-hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent 
                    side="top" 
                    className="h-[95vh] mt-2 sm:mt-5 w-[95%] sm:w-[90%] lg:w-[80%] xl:w-[74%] mx-auto p-0 rounded-t-2xl max-w-7xl"
                >
                    {/* Mobile Header */}
                    <div className="lg:hidden flex items-center justify-between p-4 border-b">
                        <h2 className="text-lg font-semibold">Enter Delivery Address</h2>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setIsSheetOpen(false)}
                            className="p-1"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Main Content */}
                    <div className="flex flex-col lg:grid lg:grid-cols-2 gap-0 lg:gap-4 h-full">
                        {/* Map Section */}
                        <div className="relative h-[40vh] sm:h-[45vh] lg:h-[75vh] order-1">
                            {/* Search Input */}
                            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-10">
                                <Autocomplete 
                                    onLoad={(ref) => (autocompleteRef.current = ref)} 
                                    onPlaceChanged={handlePlaceChanged}
                                >
                                    <input
                                        type="text"
                                        placeholder="Search for location"
                                        className="w-full p-2 sm:p-3 text-sm sm:text-base rounded-md border bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </Autocomplete>
                            </div>

                            {/* Google Map */}
                            <GoogleMap
                                mapContainerStyle={mapContainerStyle}
                                center={marker}
                                zoom={16}
                                onClick={handleMapClick}
                                options={{
                                    disableDefaultUI: true,
                                    zoomControl: true,
                                    gestureHandling: 'greedy',
                                }}
                            >
                                <Marker position={marker} />
                            </GoogleMap>

                            {/* Current Location Button */}
                            <button
                                onClick={getUserLocation}
                                className="absolute bottom-16 sm:bottom-20 lg:bottom-24 right-3 sm:right-6 z-10 bg-white p-2 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <Navigation className="text-gray-600 w-4 h-4 sm:w-5 sm:h-5" />
                            </button>

                            {/* Address Display Box */}
                            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 lg:left-4 lg:right-4">
                                <div className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg bg-red-50 shadow-lg">
                                    <h3 className="font-semibold text-sm sm:text-base mb-2">Delivering your order to:</h3>
                                    <div className="flex items-center space-x-2 sm:space-x-3">
                                        <img
                                            src="https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=225/layout-engine/2024-01/image.png"
                                            alt="Map location"
                                            className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-cover rounded flex-shrink-0"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <div className="font-medium text-sm sm:text-base lg:text-lg truncate">Suraj Nagar</div>
                                            <div className="text-gray-600 text-xs sm:text-sm truncate">Jhotwara, Jaipur</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="flex-1 lg:order-2 p-3 sm:p-4 lg:p-6 overflow-y-auto">
                            {/* Desktop Header */}
                            <div className="hidden lg:block">
                                <SheetHeader className="text-left pb-4 border-b mb-6">
                                    <SheetTitle className="text-xl xl:text-2xl font-semibold">
                                        Enter complete address
                                    </SheetTitle>
                                </SheetHeader>
                            </div>

                            {/* Mobile Header */}
                            <div className="lg:hidden mb-4">
                                <h3 className="text-lg font-semibold">Complete Address</h3>
                            </div>

                            <div className="space-y-4 sm:space-y-5">
                                {/* Address Type Selection */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-3 block">
                                        Save as *
                                    </label>
                                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
                                        {addressTypes.map(({ id, label, icon: Icon }) => (
                                            <button
                                                key={id}
                                                onClick={() => setSelectedAddressType(id)}
                                                className={`flex items-center justify-center sm:justify-start gap-2 px-3 py-2.5 sm:py-2 rounded-lg text-sm border transition-colors ${
                                                    selectedAddressType === id
                                                        ? 'bg-orange-50 text-orange-600 border-orange-200'
                                                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                                                }`}
                                            >
                                                <Icon className="w-4 h-4 flex-shrink-0" />
                                                <span className="truncate">{label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Form Inputs */}
                                <div className="space-y-3 sm:space-y-4">
                                    <Input 
                                        placeholder="Flat / House no / Building name *" 
                                        value={formData.flatNumber} 
                                        onChange={(e) => handleInputChange('flatNumber', e.target.value)}
                                        className="h-11 sm:h-12 text-sm sm:text-base"
                                    />
                                    <Input 
                                        placeholder="Floor (optional)" 
                                        value={formData.floor} 
                                        onChange={(e) => handleInputChange('floor', e.target.value)}
                                        className="h-11 sm:h-12 text-sm sm:text-base"
                                    />
                                    <Input 
                                        placeholder="Nearby landmark (optional)" 
                                        value={formData.landmark} 
                                        onChange={(e) => handleInputChange('landmark', e.target.value)}
                                        className="h-11 sm:h-12 text-sm sm:text-base"
                                    />
                                    <Input 
                                        placeholder="Your name *" 
                                        value={formData.name} 
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className="h-11 sm:h-12 text-sm sm:text-base"
                                    />
                                    <Input 
                                        placeholder="Your phone number *" 
                                        value={formData.phone} 
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        className="h-11 sm:h-12 text-sm sm:text-base"
                                        type="tel"
                                    />
                                </div>

                                {/* Save Button */}
                                <Button 
                                    onClick={handleSaveAddress} 
                                    className="w-full bg-green-600 hover:bg-green-700 text-white h-12 sm:h-14 text-base sm:text-lg font-medium mt-6 sm:mt-8 transition-colors"
                                >
                                    Save Address
                                </Button>
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default DeliveryAddressPage;