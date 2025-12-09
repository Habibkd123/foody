


"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, Marker, useLoadScript, Autocomplete } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Home, Briefcase, Hotel, MapPin, Navigation } from 'lucide-react';
import { shops } from './Shops';
import { useCartOrder } from '@/context/OrderContext';
import { useAuthStorage } from '@/hooks/useAuth';
import { Address } from '@/types/global';
import AddressTypeSelector from '@/components/address/AddressTypeSelector';
import AddressFormFields from '@/components/address/AddressFormFields';
import StickySaveBar from '@/components/address/StickySaveBar';

const libraries: any = ["places"];

const mapContainerStyle = {
    width: '100%',
    height: '100%',
};

const defaultCenter = {
    lat: 26.926,
    lng: 75.823,
};

const addressTypes = [
    { id: 'Home', label: 'Home', icon: Home },
    { id: 'Work', label: 'Work', icon: Briefcase },
    { id: 'Hotel', label: 'Hotel', icon: Hotel },
    { id: 'Other', label: 'Other', icon: MapPin },
];

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
    editingAddress
}) => {

    const { setDistance, updateAddress, loading } = useCartOrder();
    const { user } = useAuthStorage();

    // Local state for the address being edited/created
    const [localAddress, setLocalAddress] = useState<Partial<Address>>({
        street: '',
        area: '',
        city: '',
        state: '',
        zipCode: '',
        landmark: '',
        name: user?.firstName || '',
        phone: Number(user?.phone) || 0,
        isDefault: false,
        lat: undefined,
        lng: undefined,
    });

    const [searchText, setSearchText] = useState("");
    const [selectedAddressType, setSelectedAddressType] = useState('Home');
    const [marker, setMarker] = useState(defaultCenter);
    const [closestShop, setClosestShop] = useState<{ name: string, distance: number } | null>(null);
    const autocompleteRef = useRef<any>(null);
    const [openSearchMode, setOpenSearchMode] = useState(false);
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyAQODjSc_eWcBWoIdk7trMzl98oRHF9HFs",
        libraries,
    });

    // Initialize form when editing an address
    useEffect(() => {
        if (editingAddress) {
            setLocalAddress({
                street: editingAddress.street || '',
                area: editingAddress.area || '',
                city: editingAddress.city || '',
                state: editingAddress.state || '',
                zipCode: editingAddress.zipCode || '',
                landmark: editingAddress.landmark || '',
                name: editingAddress.name || user?.firstName || '',
                phone: editingAddress.phone || Number(user?.phone) || 0,
                isDefault: editingAddress?.isDefault || false,
                lat: editingAddress?.lat,
                lng: editingAddress?.lng,
            });

            setSelectedAddressType(editingAddress.label || 'Home');

            if (editingAddress?.lat && editingAddress?.lng) {
                setMarker({ lat: editingAddress?.lat, lng: editingAddress?.lng });
            }

            // Set search text to formatted address
            const formattedAddress = `${editingAddress?.street || ''} ${editingAddress?.area || ''} ${editingAddress?.city || ''}`.trim();
            setSearchText(formattedAddress);
        } else {
            // Reset form for new address
            setLocalAddress({
                street: '',
                area: '',
                city: '',
                state: '',
                zipCode: '',
                landmark: '',
                name: user?.firstName || '',
                phone: Number(user?.phone) || 0,
                isDefault: false,
                lat: undefined,
                lng: undefined,
            });
            setSelectedAddressType('Home');
            setSearchText('');
            setMarker(defaultCenter);
            getUserLocation(); // Get current location for new addresses
        }
    }, [editingAddress, user, open]);

    const getAddressFromLatLng = useCallback((lat: number, lng: number) => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results?.length) {
                const addressComponents = results[0].address_components;

                const parsedAddress: Partial<Address> = {
                    street: "",
                    area: "",
                    city: "",
                    state: "",
                    zipCode: "",
                };

                addressComponents.forEach((component: any) => {
                    if (component.types.includes("street_number")) {
                        parsedAddress.street = `${component.long_name} ${parsedAddress.street || ""}`;
                    }
                    if (component.types.includes("route")) {
                        parsedAddress.street = `${parsedAddress.street || ""} ${component.long_name}`;
                    }
                    if (component.types.includes("sublocality") || component.types.includes("locality")) {
                        parsedAddress.area = component.long_name;
                    }
                    if (component.types.includes("administrative_area_level_2")) {
                        parsedAddress.city = component.long_name;
                    }
                    if (component.types.includes("administrative_area_level_1")) {
                        parsedAddress.state = component.long_name;
                    }
                    if (component.types.includes("postal_code")) {
                        parsedAddress.zipCode = component.long_name;
                    }
                });

                updateLocalAddress({
                    ...parsedAddress,
                    lat,
                    lng,
                });
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
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                setMarker({ lat: userLat, lng: userLng });
                getAddressFromLatLng(userLat, userLng);
                const d = calculateDistance(userLat, userLng, defaultCenter.lat, defaultCenter.lng);
                setDistance(Number(d.toFixed(2)));
            }, (err) => {
                console.error("Geolocation error:", err.message);
                // Fallback to default center if geolocation fails
                setMarker(defaultCenter);
            });
        }
    };

    // Update local address state
    const updateLocalAddress = (updates: Partial<Address>) => {
        setLocalAddress(prev => ({
            ...prev,
            ...updates
        }));
    };

    // const handlePlaceChanged = () => {
    //     if (autocompleteRef.current) {
    //         const place = autocompleteRef.current.getPlace();
    //         if (!place.geometry) return;

    //         const lat = place.geometry.location.lat();
    //         const lng = place.geometry.location.lng();
    //         setMarker({ lat, lng });
    //         setSearchText(place.formatted_address || place.name || ""); 

    //         // Extract address components from the place result
    //         let streetNumber = '';
    //         let route = '';
    //         let locality = '';
    //         let administrativeAreaLevel1 = '';
    //         let postalCode = '';
    //         let sublocalityLevel1 = '';
    //         let sublocalityLevel2 = '';

    //         place.address_components.forEach((component: google.maps.GeocoderAddressComponent) => {
    //             const types = component.types;
    //             if (types.includes('street_number')) {
    //                 streetNumber = component.long_name;
    //             }
    //             if (types.includes('route')) {
    //                 route = component.long_name;
    //             }
    //             if (types.includes('locality')) {
    //                 locality = component.long_name;
    //             } else if (types.includes('administrative_area_level_1')) {
    //                 administrativeAreaLevel1 = component.long_name;
    //             } else if (types.includes('postal_code')) {
    //                 postalCode = component.long_name;
    //             } else if (types.includes('sublocality_level_1')) {
    //                 sublocalityLevel1 = component.long_name;
    //             } else if (types.includes('sublocality_level_2')) {
    //                 sublocalityLevel2 = component.long_name;
    //             }
    //         });

    //         const area = sublocalityLevel2 || sublocalityLevel1 || locality;
    //         const street = streetNumber && route ? `${streetNumber} ${route}` : route;

    //         // Update local address with the extracted components
    //         updateLocalAddress({
    //             address : place.formatted_address || place.name || "", 
    //             street: street || '',
    //             area: area || '',
    //             city: locality || '',
    //             state: administrativeAreaLevel1 || '',
    //             zipCode: postalCode || '',
    //             landmark: place.name || '',
    //             lat,
    //             lng,
    //         });
    //     }
    // };
    const handlePlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (!place.geometry) return;

            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            setMarker({ lat, lng });
            setSearchText(place.formatted_address || place.name || "");

            // Initialize address components
            let addressComponents = {
                streetNumber: '',
                route: '',
                area: '',
                city: '',
                state: '',
                zipCode: '',
                landmark: ''
            };

            // Extract address components
            place.address_components.forEach((component: google.maps.GeocoderAddressComponent) => {
                const types = component.types;

                if (types.includes('street_number')) {
                    addressComponents.streetNumber = component.long_name;
                }
                if (types.includes('route')) {
                    addressComponents.route = component.long_name;
                }
                if (types.includes('sublocality_level_1') || types.includes('sublocality')) {
                    addressComponents.area = component.long_name;
                }
                if (types.includes('locality')) {
                    addressComponents.city = component.long_name;
                }
                if (types.includes('administrative_area_level_1')) {
                    addressComponents.state = component.long_name;
                }
                if (types.includes('postal_code')) {
                    addressComponents.zipCode = component.long_name;
                }
                // Additional check for area if not found in sublocality
                if (!addressComponents.area && types.includes('neighborhood')) {
                    addressComponents.area = component.long_name;
                }
            });

            // Construct street address
            const street = [addressComponents.streetNumber, addressComponents.route]
                .filter(Boolean)
                .join(' ');

            // If area is still empty, try to use neighborhood or locality
            if (!addressComponents.area) {
                addressComponents.area = addressComponents.city;
            }

            // Update local address with all components
            updateLocalAddress({
                street: street || '',
                area: addressComponents.area || '',
                city: addressComponents.city || '',
                state: addressComponents.state || '',
                zipCode: addressComponents.zipCode || '',
                landmark: place.name || '',
                lat,
                lng,
                address: place.formatted_address || ''
            });

            // Calculate distance to update closest shop
            if (lat && lng) {
                const distances = shops.map(shop => {
                    const d = calculateDistance(
                        lat,
                        lng,
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

    const validateAddress = (): boolean => {
        if (!localAddress.area?.trim()) {
            alert('Area is required');
            return false;
        }
        if (!localAddress.city?.trim()) {
            alert('City is required');
            return false;
        }
        if (!localAddress.state?.trim()) {
            alert('State is required');
            return false;
        }
        if (!localAddress.name?.trim()) {
            alert('Name is required');
            return false;
        }
        if (!localAddress.phone) {
            alert('Phone number is required');
            return false;
        }
        return true;
    };

    const handleSaveAddress = async () => {
        if (!validateAddress()) return;

        try {
            // Create the address object first
            const addressToSave: Address = {
                ...localAddress as Address,
                label: selectedAddressType,
            };

            // Check if editing or adding new
            if (editingAddress) {
                // Update existing address
                await updateAddress(user?._id || "", editingAddress._id || "", addressToSave);
            } else {
                // Add new address
                await handleAddAddress(addressToSave);
            }

            // Close modal after successful save
            onClose();
        } catch (error) {
            console.error('Error saving address:', error);
            alert('Failed to save address. Please try again.');
        }
    };

    if (!isLoaded) return (
        <div className="flex items-center justify-center h-screen w-full">
            <div className="text-lg">Loading map...</div>
        </div>
    );

    return (
        <div className="relative h-screen w-full overflow-auto">

            {/* Modal for location search with map */}
            <Sheet open={openSearchMode} onOpenChange={setOpenSearchMode}>
                <SheetContent side="top" className="h-[95vh] mt-2 sm:mt-5 w-[95%] sm:w-[90%] lg:w-[80%] xl:w-[74%] mx-auto p-0 rounded-t-2xl max-w-7xl pb-[env(safe-area-inset-bottom)]">
                    <div className="relative h-full w-full">
                        {/* Global styles for Google Maps Autocomplete dropdown */}
                        <style dangerouslySetInnerHTML={{__html: `
                            .pac-container {
                                z-index: 9999 !important;
                                position: absolute !important;
                            }
                            .pac-item {
                                cursor: pointer !important;
                                z-index: 9999 !important;
                                pointer-events: auto !important;
                            }
                            .pac-item:hover {
                                background-color: #ebf2ff !important;
                            }
                        `}} />
                        
                        {/* Search Input */}
                        <div 
                            className="absolute top-4 left-4 right-4 z-[9999]"
                            style={{ zIndex: 9999 }}
                        >
                            <Autocomplete
                                onLoad={(autocomplete) => {
                                    autocompleteRef.current = autocomplete;
                                }}
                                onPlaceChanged={() => {
                                    handlePlaceChanged();
                                    setOpenSearchMode(false); // Close modal after selection
                                }}
                                fields={['address_components', 'geometry', 'formatted_address', 'name']}
                                types={['address']}
                            >
                                <Input
                                    type="text"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    placeholder="Search for a location"
                                    className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-lg focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                                    id="search-location-modal"
                                    autoFocus
                                />
                            </Autocomplete>
                        </div>

                        {/* Map Container with pointer events disabled when searching */}
                        <div 
                            style={{ 
                                pointerEvents: searchText ? 'none' : 'auto',
                                width: '100%',
                                height: '100%'
                            }}
                        >
                            <GoogleMap
                                mapContainerStyle={mapContainerStyle}
                                center={marker}
                                zoom={16}
                                onClick={(e) => {
                                    if (!searchText && e.latLng) {
                                        const lat = e.latLng.lat();
                                        const lng = e.latLng.lng();
                                        setMarker({ lat, lng });
                                        getAddressFromLatLng(lat, lng);
                                        setOpenSearchMode(false); // Close modal after clicking map
                                    }
                                }}
                                options={{
                                    disableDefaultUI: true,
                                    zoomControl: true,
                                    gestureHandling: searchText ? 'none' : 'greedy',
                                    draggable: !searchText,
                                }}
                            >
                                <Marker position={marker} />
                            </GoogleMap>
                        </div>

                        {/* Navigation Button */}
                        <button
                            onClick={getUserLocation}
                            className="absolute bottom-24 right-6 z-[10000] bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                            style={{ zIndex: 10000, pointerEvents: 'auto' }}
                        >
                            <Navigation className="text-gray-600 w-5 h-5" />
                        </button>

                        {/* Close Button */}
                        <button
                            onClick={() => setOpenSearchMode(false)}
                            className="absolute top-4 right-4 z-[10000] bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                            style={{ zIndex: 10000, pointerEvents: 'auto' }}
                        >
                            <span className="text-gray-600 text-xl">×</span>
                        </button>
                    </div>
                </SheetContent>
            </Sheet>
            <Sheet open={open} onOpenChange={setShowAddModal}>
                <SheetContent
                    side="top"
                    className="h-[95vh] mt-2 sm:mt-5 w-[95%] sm:w-[90%] lg:w-[80%] xl:w-[74%] mx-auto p-0 rounded-t-2xl max-w-7xl pb-[env(safe-area-inset-bottom)]"
                >
                    <div className="flex flex-col lg:grid lg:grid-cols-2 gap-0 lg:gap-4 h-full">
                        {/* Map Section */}
                        <div className="relative h-[50vh] sm:h-[45vh] lg:h-[95vh] order-1">
                            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-10">
                                {/* <Autocomplete
                                    onLoad={(autocomplete) => {
                                        autocompleteRef.current = autocomplete;
                                    }}
                                    onPlaceChanged={handlePlaceChanged}
                                    fields={['address_components', 'geometry', 'formatted_address', 'name']}
                                    types={['address']}
                                >
                                    <Input
                                        type="text"
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        placeholder="Search for a location"
                                        className="w-full p-2 border rounded"
                                        id="search-location"
                                    />
                                </Autocomplete> */}
                                <input
                                    type="text"
                                    value={searchText}
                                    onClick={() => setOpenSearchMode(true)}  // ✅ open on click
                                    onFocus={() => setOpenSearchMode(true)}  // ✅ open on focus
                                    onChange={(e) => {
                                        setSearchText(e.target.value);
                                        if (e.target.value.trim() !== "" && e.target.value.length > 2) {
                                            setOpenSearchMode(true);
                                        }
                                    }}
                                    placeholder="Search for a location..."
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-orange-400 placeholder:text-gray-400 cursor-pointer"
                                    id="search-location"
                                    readOnly
                                />

                            </div>

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

                            <button
                                onClick={getUserLocation}
                                className="absolute bottom-16 sm:bottom-20 lg:bottom-24 right-3 sm:right-6 z-10 bg-white p-2 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <Navigation className="text-gray-600 w-4 h-4 sm:w-5 sm:h-5" />
                            </button>

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
                                                {localAddress?.area || 'Select location'}
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
                            <SheetHeader className="mb-4">
                                <SheetTitle>
                                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                                </SheetTitle>
                            </SheetHeader>

                            <div className="space-y-4 sm:space-y-5 pb-28">
                                {/* Address Type Selection */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-3 block">Save as *</label>
                                    <AddressTypeSelector selected={selectedAddressType as any} onSelect={(t:any) => setSelectedAddressType(t)} />
                                </div>

                                {/* Form Inputs */}
                                <AddressFormFields value={localAddress as any} onChange={updateLocalAddress as any} />

                                {/* Sticky Save Button (mobile-friendly) */}
                                <StickySaveBar
                                    onClick={handleSaveAddress}
                                    disabled={loading || !localAddress?.area || !localAddress?.city || !localAddress?.state || !localAddress?.name}
                                    loading={loading}
                                    editMode={Boolean(editingAddress)}
                                />
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            {/* End of modal container */}
        </div>
    );
};

export default DeliveryAddressPage;
