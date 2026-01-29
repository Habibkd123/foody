"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, Marker, useLoadScript, Autocomplete } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Navigation } from 'lucide-react';
import { shops } from './Shops';
import { useCartStore } from '@/lib/store/useCartStore';
import { useUserStore } from '@/lib/store/useUserStore';
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
    const { setDistance } = useCartStore();
    const { user } = useUserStore();
    const [loading, setLoading] = useState(false);

    // Local state for the address being edited/created
    const [localAddress, setLocalAddress] = useState<Partial<Address>>({
        street: '',
        area: '',
        city: '',
        state: '',
        zipCode: '',
        landmark: '',
        name: user?.name || (user?.firstName || "") + (user?.lastName ? ` ${user?.lastName}` : ""),
        phone: user?.phone ? parseInt(user.phone) : 0,
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
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries,
    });

    // Initialize form when editing an address
    useEffect(() => {
        if (editingAddress) {
            setLocalAddress({
                ...editingAddress,
                name: editingAddress.name || user?.name || (user?.firstName || "") + (user?.lastName ? ` ${user?.lastName}` : "") || '',
                phone: editingAddress.phone || (user?.phone ? parseInt(user?.phone || '0') : 0),
            });

            setSelectedAddressType(editingAddress.label || 'Home');

            if (editingAddress?.lat && editingAddress?.lng) {
                setMarker({ lat: editingAddress?.lat, lng: editingAddress?.lng });
            }

            const formattedAddress = `${editingAddress?.street || ''} ${editingAddress?.area || ''} ${editingAddress?.city || ''}`.trim();
            setSearchText(formattedAddress);
        } else {
            setLocalAddress({
                street: '',
                area: '',
                city: '',
                state: '',
                zipCode: '',
                landmark: '',
                name: user?.name || (user?.firstName || "") + (user?.lastName ? ` ${user?.lastName}` : ""),
                phone: user?.phone ? parseInt(user?.phone || '0') : 0,
                isDefault: false,
                lat: undefined,
                lng: undefined,
            });
            setSelectedAddressType('Home');
            setSearchText('');
            setMarker(defaultCenter);
            getUserLocation();
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

                updateLocalAddress({ ...parsedAddress, lat, lng });
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
                setMarker(defaultCenter);
            });
        }
    };

    const updateLocalAddress = (updates: Partial<Address>) => {
        setLocalAddress(prev => ({ ...prev, ...updates }));
    };

    const handlePlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (!place.geometry) return;

            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            setMarker({ lat, lng });
            setSearchText(place.formatted_address || place.name || "");

            let addressComponents = {
                streetNumber: '',
                route: '',
                area: '',
                city: '',
                state: '',
                zipCode: '',
                landmark: ''
            };

            place.address_components.forEach((component: google.maps.GeocoderAddressComponent) => {
                const types = component.types;
                if (types.includes('street_number')) addressComponents.streetNumber = component.long_name;
                if (types.includes('route')) addressComponents.route = component.long_name;
                if (types.includes('sublocality_level_1') || types.includes('sublocality')) addressComponents.area = component.long_name;
                if (types.includes('locality')) addressComponents.city = component.long_name;
                if (types.includes('administrative_area_level_1')) addressComponents.state = component.long_name;
                if (types.includes('postal_code')) addressComponents.zipCode = component.long_name;
                if (!addressComponents.area && types.includes('neighborhood')) addressComponents.area = component.long_name;
            });

            const street = [addressComponents.streetNumber, addressComponents.route].filter(Boolean).join(' ');
            if (!addressComponents.area) addressComponents.area = addressComponents.city;

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

            if (lat && lng) {
                const distances = shops.map(shop => {
                    const d = calculateDistance(lat, lng, shop.location.latitude, shop.location.longitude);
                    return { ...shop, distance: d };
                });
                const nearest = distances.reduce((prev, curr) => curr.distance < prev.distance ? curr : prev);
                setClosestShop({ name: nearest.name, distance: Number(nearest.distance.toFixed(2)) });
            }
        }
    };

    useEffect(() => {
        if (marker.lat && marker.lng) {
            const distances = shops.map(shop => {
                const d = calculateDistance(marker.lat, marker.lng, shop.location.latitude, shop.location.longitude);
                return { ...shop, distance: d };
            });
            const nearest = distances.reduce((prev, curr) => curr.distance < prev.distance ? curr : prev);
            setClosestShop({ name: nearest.name, distance: Number(nearest.distance.toFixed(2)) });
        }
    }, [marker]);

    const handleSave = async () => {
        if (!localAddress.area?.trim() || !localAddress.city?.trim() || !localAddress.state?.trim() || !localAddress.name?.trim() || !localAddress.phone) {
            alert('Please fill all required fields');
            return;
        }

        try {
            setLoading(true);
            const addressToSave: Address = {
                ...localAddress as Address,
                userId: user?._id || userId || "",
                label: selectedAddressType,
            };
            await handleAddAddress(addressToSave);
            onClose();
        } catch (error) {
            console.error('Error saving address:', error);
            alert('Failed to save address');
        } finally {
            setLoading(false);
        }
    };

    if (!isLoaded) return <div className="flex items-center justify-center h-screen w-full">Loading map...</div>;

    return (
        <div className="relative h-screen w-full overflow-auto">
            <Sheet open={openSearchMode} onOpenChange={setOpenSearchMode}>
                <SheetContent side="top" className="h-[95vh] mt-2 sm:mt-5 w-[95%] sm:w-[90%] lg:w-[80%] xl:w-[74%] mx-auto p-0 rounded-t-2xl max-w-7xl">
                    <div className="relative h-full w-full">
                        <style dangerouslySetInnerHTML={{
                            __html: `
                            .pac-container { z-index: 9999 !important; position: absolute !important; }
                            .pac-item { cursor: pointer !important; z-index: 9999 !important; pointer-events: auto !important; }
                            .pac-item:hover { background-color: #ebf2ff !important; }
                        `}} />
                        <div className="absolute top-4 left-4 right-4 z-[9999]">
                            <Autocomplete
                                onLoad={(autocomplete) => { autocompleteRef.current = autocomplete; }}
                                onPlaceChanged={() => { handlePlaceChanged(); setOpenSearchMode(false); }}
                                fields={['address_components', 'geometry', 'formatted_address', 'name']}
                                types={['address']}
                            >
                                <Input
                                    type="text"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    placeholder="Search for a location"
                                    className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-lg"
                                    autoFocus
                                />
                            </Autocomplete>
                        </div>
                        <div style={{ pointerEvents: searchText ? 'none' : 'auto', width: '100%', height: '100%' }}>
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
                                        setOpenSearchMode(false);
                                    }
                                }}
                                options={{ disableDefaultUI: true, zoomControl: true, gestureHandling: searchText ? 'none' : 'greedy', draggable: !searchText }}
                            >
                                <Marker position={marker} />
                            </GoogleMap>
                        </div>
                        <button onClick={getUserLocation} className="absolute bottom-24 right-6 z-[10000] bg-white p-3 rounded-full shadow-lg">
                            <Navigation className="text-gray-600 w-5 h-5" />
                        </button>
                    </div>
                </SheetContent>
            </Sheet>

            <Sheet open={open} onOpenChange={setShowAddModal}>
                <SheetContent side="top" className="h-[95vh] mt-2 sm:mt-5 w-[95%] sm:w-[90%] lg:w-[80%] xl:w-[74%] mx-auto p-0 rounded-t-2xl max-w-7xl">
                    <div className="flex flex-col lg:grid lg:grid-cols-2 gap-0 lg:gap-4 h-full">
                        <div className="relative h-[50vh] sm:h-[45vh] lg:h-[95vh] order-1">
                            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-10">
                                <input
                                    type="text"
                                    value={searchText}
                                    onClick={() => setOpenSearchMode(true)}
                                    placeholder="Search for a location..."
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-orange-400 cursor-pointer"
                                    readOnly
                                />
                            </div>
                            <GoogleMap
                                mapContainerStyle={mapContainerStyle}
                                center={marker}
                                zoom={16}
                                onClick={handleMapClick}
                                options={{ disableDefaultUI: true, zoomControl: true, gestureHandling: 'greedy' }}
                            >
                                <Marker position={marker} />
                            </GoogleMap>
                            <button onClick={getUserLocation} className="absolute bottom-16 sm:bottom-20 lg:bottom-24 right-3 sm:right-6 z-10 bg-white p-2 sm:p-3 rounded-full shadow-lg">
                                <Navigation className="text-gray-600 w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <div className="absolute bottom-12 sm:bottom-2 left-2 sm:left-4 right-2 sm:right-4">
                                <div className="px-3 py-2 border rounded-lg bg-red-50 shadow-lg">
                                    <h3 className="font-semibold text-sm mb-2">Delivering your order to:</h3>
                                    <div className="flex items-center space-x-2">
                                        <div className="min-w-0 flex-1">
                                            <div className="font-medium text-sm truncate">{localAddress?.area || 'Select location'}</div>
                                            {closestShop && <div className="text-xs text-green-700 font-medium">{closestShop.name} ({closestShop.distance} km)</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 lg:order-2 p-3 sm:p-4 lg:p-6 overflow-y-auto">
                            <SheetHeader className="mb-4">
                                <SheetTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</SheetTitle>
                            </SheetHeader>
                            <div className="space-y-4 sm:space-y-5 pb-28">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-3 block">Save as *</label>
                                    <AddressTypeSelector selected={selectedAddressType as any} onSelect={(t: any) => setSelectedAddressType(t)} />
                                </div>
                                <AddressFormFields value={localAddress as any} onChange={updateLocalAddress as any} />
                                <StickySaveBar
                                    onClick={handleSave}
                                    disabled={loading || !localAddress?.area || !localAddress?.city || !localAddress?.state || !localAddress?.name}
                                    loading={loading}
                                    editMode={Boolean(editingAddress)}
                                />
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default DeliveryAddressPage;
