"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    GoogleMap,
    Marker,
    useLoadScript,
    Autocomplete,
} from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Navigation, Search, MapPin, Loader2, ArrowLeft, Home, Briefcase, LocateFixed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { shops } from "./Shops";
import { useCartStore } from "@/lib/store/useCartStore";
import { useUserStore } from "@/lib/store/useUserStore";
import { Address } from "@/types/global";
import AddressTypeSelector from "@/components/address/AddressTypeSelector";
import AddressFormFields from "@/components/address/AddressFormFields";

const libraries: "places"[] = ["places"];

const mapContainerStyle = {
    width: "100%",
    height: "100%",
};

const defaultCenter = {
    lat: 26.926,
    lng: 75.823,
};

// Custom styles for Google Maps Autocomplete dropdown
const googleMapsStyles = `
  .pac-container {
    z-index: 10000 !important;
    border-radius: 12px;
    margin-top: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    border: 1px solid #f3f4f6;
    font-family: inherit;
    font-size: 14px;
  }
  .pac-item {
    padding: 12px 16px;
    cursor: pointer;
    border-top: 1px solid #f9fafb;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .pac-item:hover {
    background-color: #f3f4f6;
  }
  .pac-icon {
    display: none; 
  }
  .pac-item-query {
    font-size: 15px;
    font-weight: 600;
    color: #111827;
  }
  span.pac-matched {
    color: #f97316;
  }
`;

interface DeliveryAddressPageProps {
    handleAddAddress: (address: Address) => Promise<void>;
    onClose: () => void;
    open: boolean;
    setShowAddModal: (show: boolean) => void;
    userId?: string;
    editingAddress?: Address;
}

const DeliveryAddressPage: React.FC<DeliveryAddressPageProps> = ({
    handleAddAddress,
    onClose,
    open,
    setShowAddModal,
    userId,
    editingAddress,
}) => {
    const { user } = useUserStore();
    const [loading, setLoading] = useState(false);

    const [localAddress, setLocalAddress] = useState<Partial<Address>>({
        street: "",
        area: "",
        city: "",
        state: "",
        zipCode: "",
        landmark: "",
        name: user?.name || `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
        phone: user?.phone ? parseInt(user.phone) : 0,
        isDefault: false,
    });

    const [searchText, setSearchText] = useState("");
    const [selectedAddressType, setSelectedAddressType] = useState("Home");
    const [marker, setMarker] = useState(defaultCenter);
    const autocompleteRef = useRef<any>(null);
    const [showFullMapModal, setShowFullMapModal] = useState(false); // New state for full map modal

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries,
    });

    // Initialize data if editing
    useEffect(() => {
        if (editingAddress) {
            setLocalAddress(editingAddress);
            setSelectedAddressType(editingAddress.label || "Home");
            if (editingAddress.lat && editingAddress.lng) {
                setMarker({ lat: editingAddress.lat, lng: editingAddress.lng });
            }
        }
    }, [editingAddress]);

    /* ---------------- LOCATION HELPERS ---------------- */

    const getAddressFromLatLng = useCallback((lat: number, lng: number) => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results?.[0]) {
                const components = results[0].address_components;
                const parsed: any = {};

                setSearchText(results[0].formatted_address);

                components.forEach((c: any) => {
                    if (c.types.includes("route")) parsed.street = c.long_name;
                    if (c.types.includes("sublocality") || c.types.includes("locality"))
                        parsed.area = c.long_name;
                    if (c.types.includes("administrative_area_level_2"))
                        parsed.city = c.long_name;
                    if (c.types.includes("administrative_area_level_1"))
                        parsed.state = c.long_name;
                    if (c.types.includes("postal_code")) parsed.zipCode = c.long_name;
                });

                setLocalAddress((p) => ({ ...p, ...parsed, lat, lng, address: results[0].formatted_address }));
            }
        });
    }, []);

    const getUserLocation = () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition((pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            setMarker({ lat, lng });
            getAddressFromLatLng(lat, lng);
        }, (err) => console.error(err));
    };

    /* ---------------- AUTOCOMPLETE ---------------- */

    const handlePlaceChanged = () => {
        const place = autocompleteRef.current?.getPlace();
        if (!place?.geometry) return;

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        setMarker({ lat, lng });
        setSearchText(place.formatted_address || "");

        getAddressFromLatLng(lat, lng);
        setShowFullMapModal(false); // Close full map modal on selection
    };

    /* ---------------- SAVE ---------------- */

    const handleSave = async () => {
        if (!localAddress.area || !localAddress.city || !localAddress.state) {
            alert("Please select a valid location on the map.");
            return;
        }

        setLoading(true);
        try {
            await handleAddAddress({
                ...(localAddress as Address),
                userId: user?._id || userId || "",
                label: selectedAddressType,
            });
            setShowAddModal(false);
            onClose();
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
        }
    };

    if (!isLoaded)
        return <div className="h-[100dvh] w-full flex items-center justify-center bg-gray-50"><span className="animate-pulse flex items-center gap-2"><Loader2 className="animate-spin" /> Loading Maps...</span></div>;

    /* ---------------- UI ---------------- */

    return (
        <Sheet open={open} onOpenChange={setShowAddModal}>
            <style>{googleMapsStyles}</style>

            {/* ---------------- FULL SCREEN MAP MODAL (MOBILE) ---------------- */}
            <Dialog open={showFullMapModal} onOpenChange={setShowFullMapModal}>
                <DialogContent className="h-[100dvh] max-w-[100vw] w-full p-0 border-none rounded-none overflow-hidden z-[1000]">
                    <div className="flex flex-col h-full w-full relative bg-gray-50">
                        {/* Search Header */}
                        <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent">
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="h-10 w-10 rounded-full bg-white shadow-md hover:bg-gray-100"
                                    onClick={() => setShowFullMapModal(false)}
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-800" />
                                </Button>
                                <div className="flex-1 bg-white rounded-xl shadow-lg flex items-center px-4 h-11">
                                    <Autocomplete
                                        onLoad={(a) => (autocompleteRef.current = a)}
                                        onPlaceChanged={handlePlaceChanged}
                                        className="w-full"
                                    >
                                        <div className="flex items-center w-full">
                                            <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                            <input
                                                autoFocus
                                                type="text"
                                                value={searchText}
                                                onChange={(e) => setSearchText(e.target.value)}
                                                placeholder="Search address or landmark..."
                                                className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400 h-full"
                                            />
                                        </div>
                                    </Autocomplete>
                                </div>
                            </div>
                        </div>

                        {/* Full Map */}
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={marker}
                            zoom={17}
                            onClick={(e) =>
                                e.latLng &&
                                getAddressFromLatLng(e.latLng.lat(), e.latLng.lng())
                            }
                            options={{ disableDefaultUI: true, zoomControl: false }}
                        >
                            <Marker position={marker} animation={window.google.maps.Animation.DROP} />
                        </GoogleMap>

                        {/* Bottom Controls */}
                        <div className="absolute bottom-6 left-4 right-4 flex items-center justify-between pointer-events-none">
                            <span className="bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg pointer-events-auto">
                                {searchText ? (searchText.length > 25 ? searchText.substring(0, 25) + "..." : searchText) : "Tap map to select"}
                            </span>
                            <div className="flex flex-col gap-3 pointer-events-auto">
                                <Button
                                    size="icon"
                                    className="h-12 w-12 rounded-full bg-white shadow-xl hover:bg-gray-50 text-blue-600 border border-gray-100"
                                    onClick={getUserLocation}
                                >
                                    <LocateFixed className="w-6 h-6" />
                                </Button>
                                <Button
                                    className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-6 h-12 shadow-xl shadow-orange-600/20 font-semibold"
                                    onClick={() => setShowFullMapModal(false)}
                                >
                                    Confirm Location
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>


            <SheetContent
                side="bottom"
                className="h-[100dvh] max-h-[100dvh] w-full p-0 border-none sm:rounded-none overflow-hidden outline-none bg-gray-50"
            >
                <div className="flex flex-col lg:grid lg:grid-cols-[1.2fr_0.8fr] h-full w-full bg-gray-50">

                    {/* LEFT: MAP PREVIEW SECTION */}
                    <div className="relative h-[25vh] lg:h-full lg:order-1 w-full bg-gray-200">
                        {/* Map Preview Overlay - Click to Expand */}
                        <div
                            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/5 lg:hidden cursor-pointer"
                            onClick={() => setShowFullMapModal(true)}
                        >
                            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transform active:scale-95 transition-transform">
                                <MapPin className="w-4 h-4 text-orange-600" />
                                <span className="text-sm font-semibold text-gray-800">Tap to Change Location</span>
                            </div>
                        </div>

                        {/* Desktop Search Bar */}
                        <div className="hidden lg:block absolute top-6 left-6 right-6 z-20 max-w-md">
                            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-2">
                                <Autocomplete
                                    onLoad={(a) => (autocompleteRef.current = a)}
                                    onPlaceChanged={handlePlaceChanged}
                                >
                                    <div className="relative flex items-center">
                                        <Search className="absolute left-4 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={searchText}
                                            onChange={(e) => setSearchText(e.target.value)}
                                            placeholder="Search for your delivery location..."
                                            className="w-full pl-12 pr-4 py-3 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 font-medium"
                                        />
                                        <div className="h-6 w-[1px] bg-gray-200 mx-2"></div>
                                        <Button variant="ghost" size="icon" onClick={getUserLocation} className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 mr-1">
                                            <LocateFixed className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </Autocomplete>
                            </div>
                        </div>

                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={marker}
                            zoom={16}
                            options={{ disableDefaultUI: true, zoomControl: false }}
                        >
                            <Marker position={marker} />
                        </GoogleMap>
                    </div>

                    {/* RIGHT: FORM SECTION */}
                    <div className="flex-1 flex flex-col bg-white rounded-t-3xl lg:rounded-none shadow-[0_-10px_40px_rgba(0,0,0,0.1)] lg:shadow-none lg:border-l relative z-20 -mt-6 lg:mt-0 lg:order-2 h-full">

                        {/* Header with Search Trigger */}
                        <div className="px-6 pt-6 pb-2">
                            <div
                                onClick={() => setShowFullMapModal(true)}
                                className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-100 transition-colors mb-6"
                            >
                                <Search className="w-5 h-5 text-orange-500" />
                                <div className="flex-1">
                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">Delivery Location</p>
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                        {searchText || "Search for address..."}
                                    </p>
                                </div>
                                <Button variant="ghost" size="icon" className="text-gray-400">
                                    <ArrowLeft className="w-4 h-4 rotate-180" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 pb-28 custom-scrollbar">

                            {/* Visual Address Confirmation */}
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="bg-orange-50 p-2 rounded-lg">
                                        <MapPin className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900">Confirm Address Details</h2>
                                </div>
                                <p className="text-sm text-gray-500 leading-relaxed pl-1">
                                    Ensure the pin on the map is accurate for faster delivery.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block flex items-center gap-2">
                                        <Home className="w-3 h-3" /> Save Address As
                                    </label>
                                    <AddressTypeSelector
                                        selected={selectedAddressType as any}
                                        onSelect={setSelectedAddressType as any}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 block flex items-center gap-2">
                                        <Briefcase className="w-3 h-3" /> Complete Address
                                    </label>
                                    <AddressFormFields
                                        value={localAddress as any}
                                        onChange={setLocalAddress as any}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sticky Save Bar */}
                        <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-4 lg:p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-30 pb-safe">
                            <Button
                                onClick={handleSave}
                                disabled={loading}
                                className="w-full h-12 text-base font-bold bg-gray-900 hover:bg-black text-white rounded-xl shadow-xl hover:shadow-2xl shadow-gray-200 transition-all transform active:scale-[0.98]"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2"><Loader2 className="animate-spin w-5 h-5" /> Saving Address...</span>
                                ) : (
                                    "Save Address"
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default DeliveryAddressPage;
