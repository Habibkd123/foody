"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, Marker, useLoadScript, Autocomplete } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Home, Briefcase, Hotel, MapPin, Navigation, X } from 'lucide-react';
import { shops } from './Shops';
import { useAddress } from '@/context/AddressContext';
import { useOrder } from '@/context/OrderContext';

const libraries: any = ["places"];

const mapContainerStyle = {
    width: '100%',
    height: '100%',
};

const defaultCenter = {
    lat: 26.926, // Jaipur
    lng: 75.823,
};

const DeliveryAddressPage = ({handleAddAddress,onClose,open,setShowAddModal}:any) => {
    // const [isSheetOpen, setIsSheetOpen] = useState(true);
     const { dispatch, state } = useOrder();
    const { address, setAddress,distance,setDistance } = useAddress();
    console.log('address', address);
    const [selectedAddressType, setSelectedAddressType] = useState('Home');

    const [marker, setMarker] = useState(defaultCenter);
    // const [distance, setDistance] = useState<number | null>(null);
    const [closestShop, setClosestShop] = useState<{ name: string, distance: number } | null>(null);

    const autocompleteRef = useRef<any>(null);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyAQODjSc_eWcBWoIdk7trMzl98oRHF9HFs",
        libraries,
    });

    const addressTypes = [
        { id: 'Home', label: 'Home', icon: Home },
        { id: 'Work', label: 'Work', icon: Briefcase },
        { id: 'Hotel', label: 'Hotel', icon: Hotel },
        { id: 'Other', label: 'Other', icon: MapPin },
    ];

    const getAddressFromLatLng = useCallback((lat: number, lng: number) => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results?.length) {
                const formatted = results[0].formatted_address;
                setAddress({ area: formatted });
            }
        });
    }, [setAddress]);

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
        console.log("Saved address:", { ...address, marker });
        handleAddAddress({ ...address, marker ,distance});
        onClose();
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

    useEffect(() => {
        if (marker.lat && marker.lng) {
            const distances = shops.map(shop => {
                const d = calculateDistance(
                    marker.lat,
                    marker.lng,
                    shop.location.latitude,
                    shop.location.longitude
                );
                return { ...shop, distance: d };
            });

            const nearest = distances.reduce((prev, curr) =>
                curr.distance < prev.distance ? curr : prev
            );

            setClosestShop({
                name: nearest.name,
                distance: Number(nearest.distance.toFixed(2))
            });
        }
    }, [marker]);

    if (!isLoaded) return (
        <div className="flex items-center justify-center h-screen w-full">
            <div className="text-lg">Loading map...</div>
        </div>
    );

    return (
        <div className="relative h-screen w-full overflow-auto">
            <Sheet open={open} onOpenChange={setShowAddModal}>
                <SheetContent
                    side="top"
                    className="h-[95vh] mt-2 sm:mt-5 w-[95%] sm:w-[90%] lg:w-[80%] xl:w-[74%] mx-auto p-0 rounded-t-2xl max-w-7xl"
                >
                    {/* Mobile Header */}
                    <div className="lg:hidden flex items-center justify-between p-4 border-b">
                        <h2 className="text-lg font-semibold">Enter Delivery Address</h2>
                    </div>

                    {/* Main Content */}
                    <div className="flex flex-col lg:grid lg:grid-cols-2 gap-0 lg:gap-4 h-full">
                        {/* Map Section */}
                        <div className="relative h-[40vh] sm:h-[45vh] lg:h-[95vh] order-1">
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

                            {/* Address Display Box - Fixed positioning */}
                            <div className="absolute bottom-12 sm:bottom-2 left-2 sm:left-4 right-2 sm:right-4 lg:left-4 lg:right-4 lg:w-[calc(100%-2rem)]">
                                <div className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg bg-red-50 shadow-lg">
                                    <h3 className="font-semibold text-sm sm:text-base mb-2">Delivering your order to:</h3>
                                    <div className="flex items-center space-x-2 sm:space-x-3">
                                        <img
                                            src="https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=225/layout-engine/2024-01/image.png"
                                            alt="Map location"
                                            className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-cover rounded flex-shrink-0"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <div className="font-medium text-sm sm:text-base lg:text-lg truncate">
                                                {address.area || 'Select location'}
                                            </div>
                                            {closestShop && (
                                                <div className="text-xs sm:text-sm text-green-700 font-medium">
                                                    Closest Shop: {closestShop.name} ({closestShop.distance} km)
                                                </div>
                                            )}
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
                                                className={`flex items-center justify-center sm:justify-start gap-2 px-3 py-2.5 sm:py-2 rounded-lg text-sm border transition-colors ${selectedAddressType === id
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
                                        value={address.flatNumber}
                                        onChange={(e) => setAddress({  flatNumber: e.target.value })}
                                        className="h-11 sm:h-12 text-sm sm:text-base"
                                    />
                                    <Input
                                        placeholder="Floor (optional)"
                                        value={address.floor}
                                        onChange={(e) => setAddress({  floor: e.target.value })}
                                        className="h-11 sm:h-12 text-sm sm:text-base"
                                    />
                                    <Input
                                        placeholder="Nearby landmark (optional)"
                                        value={address.landmark}
                                        onChange={(e) => setAddress({  landmark: e.target.value })}
                                        className="h-11 sm:h-12 text-sm sm:text-base"
                                    />
                                    <Input
                                        placeholder="Your name *"
                                        value={address.name}
                                        onChange={(e) => setAddress({  name: e.target.value })}
                                        className="h-11 sm:h-12 text-sm sm:text-base"
                                    />
                                    <Input
                                        placeholder="Your phone number *"
                                        value={address.phone}
                                        onChange={(e) => setAddress({  phone: e.target.value })}
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

// "use client";
// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { GoogleMap, Marker, useLoadScript, Autocomplete } from "@react-google-maps/api";
// import { shops } from "./Shops";

// const libraries: ("places" | "geometry")[] = ["places", "geometry"];
// const mapContainerStyle = {
//     width: "100%",
//     height: "100%",
// };

// const defaultCenter = {
//     lat: 28.6139,
//     lng: 77.2090,
// }; // Delhi (you can adjust)

// function calculateDistance(lat1: any, lon1: any, lat2: any, lon2: any) {
//     const R = 6371;
//     const dLat = (lat2 - lat1) * (Math.PI / 180);
//     const dLon = (lon2 - lon1) * (Math.PI / 180);
//     const a =
//         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//         Math.cos(lat1 * (Math.PI / 180)) *
//         Math.cos(lat2 * (Math.PI / 180)) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c;
// }

// const DeliveryAddressPage = () => {
//     const [marker, setMarker] = useState(defaultCenter);
//     const [address, setAddress] = useState("");
//     const [distance, setDistance] = useState(0);
//     const [shopsWithDistance, setShopsWithDistance]: any = useState([]);
//     const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

//     const { isLoaded } = useLoadScript({
//         googleMapsApiKey: "AIzaSyAQODjSc_eWcBWoIdk7trMzl98oRHF9HFs",
//         libraries,
//     });

//     const getAddressFromLatLng = useCallback((lat: any, lng: any) => {
//         if (!window.google?.maps) return;
//         const geocoder = new window.google.maps.Geocoder();
//         geocoder.geocode({ location: { lat, lng } }, (results, status) => {
//             if (status === "OK" && results?.length) {
//                 const formatted = results[0].formatted_address;
//                 setAddress(formatted);
//             }
//         });
//     }, []);

//     // Get user's current location and mark it
//     const getUserLocation = () => {
//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 const userLat = position.coords.latitude;
//                 const userLng = position.coords.longitude;
//                 setMarker({ lat: userLat, lng: userLng });
//                 getAddressFromLatLng(userLat, userLng);
//                 const d = calculateDistance(
//                     userLat,
//                     userLng,
//                     defaultCenter.lat,
//                     defaultCenter.lng
//                 );
//                 setDistance(Number(d.toFixed(2)));
//             },
//             (err) => {
//                 console.error("Geolocation error:", err.message);
//             }
//         );
//     };

//     useEffect(() => {
//         getUserLocation();
//     }, []);

//     // Update shops' distance from user's marker
//     useEffect(() => {
//         if (marker?.lat && marker?.lng) {
//             const userLat = marker.lat;
//             const userLng = marker.lng;
//             const distanceList = shops.map((shop) => {
//                 const d = calculateDistance(
//                     userLat,
//                     userLng,
//                     shop.location.latitude,
//                     shop.location.longitude
//                 );
//                 return {
//                     ...shop,
//                     distance: Number(d.toFixed(2)),
//                 };
//             });
//             setShopsWithDistance(distanceList);
//         }
//     }, [marker]);

//     // When user clicks the map, update marker and address
//     const handleMapClick = (e: any) => {
//         if (!e.latLng) return;
//         const lat = e.latLng.lat();
//         const lng = e.latLng.lng();
//         setMarker({ lat, lng });
//         getAddressFromLatLng(lat, lng);
//     };

//     // Place changed from autocomplete
//     const handlePlaceChanged = () => {
//         if (autocompleteRef.current) {
//             const place = autocompleteRef?.current?.getPlace();
//             if (!place.geometry) return;
//             const lat = place?.geometry?.location?.lat() ?? 0;
//             const lng = place?.geometry?.location?.lng() ?? 0;
//             setMarker({ lat, lng });
//             getAddressFromLatLng(lat, lng);
//         }
//     };

//     if (!isLoaded) {
//         return <div>Loading Map...</div>;
//     }

//     return (
//         <div style={{ width: "100vw", height: "100vh" }}>
//             {/* Autocomplete Search */}
//             <div style={{ position: "absolute", top: 20, left: 30, zIndex: 2, width: "50%" }}>
//                 <Autocomplete
//                     onLoad={(ref) => {
//                         if (autocompleteRef) {
//                             autocompleteRef.current = ref;
//                         }
//                     }}
//                     onPlaceChanged={handlePlaceChanged}
//                 >
//                     <input
//                         type="text"
//                         placeholder="Search for a location"
//                         style={{
//                             width: "100%",
//                             padding: "10px",
//                             borderRadius: "8px",
//                             border: "1px solid #ddd",
//                             fontSize: "16px",
//                         }}
//                     />
//                 </Autocomplete>
//             </div>

//             {/* Google Map */}
//             <GoogleMap
//                 mapContainerStyle={mapContainerStyle}
//                 center={marker}
//                 zoom={13}
//                 onClick={handleMapClick}
//                 options={{
//                     disableDefaultUI: true,
//                     zoomControl: true,
//                     gestureHandling: "greedy",
//                 }}
//             >
//                 <Marker position={marker} />
//             </GoogleMap>

//             {/* Info & Shops List */}
//             <div
//                 style={{
//                     position: "absolute",
//                     bottom: 0,
//                     width: "100%",
//                     background: "#fff",
//                     padding: "20px",
//                     boxShadow: "0px -1px 8px rgba(0,0,0,0.09)",
//                 }}
//             >
//                 <h4>Selected Address:</h4>
//                 <div>{address || "Select a place on the map"}</div>
//                 {distance !== null && (
//                     <div>Distance from default center: {distance} km</div>
//                 )}

//                 <h4 style={{ marginTop: "20px" }}>Shops & their distance from you:</h4>
//                 <ul>
//                     {shopsWithDistance.map((shop: any) => (
//                         <li key={shop.shopId}>
//                             <b>{shop.name}</b> — {shop.distance} km
//                         </li>
//                     ))}
//                 </ul>

//                 <button onClick={getUserLocation} style={{
//                     marginTop: "10px",
//                     padding: "8px 18px",
//                     borderRadius: "6px",
//                     border: "none",
//                     background: "#009578",
//                     color: "#fff"
//                 }}>
//                     Use My Current Location
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default DeliveryAddressPage;
