'use client';

import React, { useCallback, useRef, useState, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';

import { GoogleMap, Marker, useLoadScript, Autocomplete } from "@react-google-maps/api";
import { useCartStore } from '@/lib/store/useCartStore';
import { Address } from '@/types/global';
const libraries: any = ["places"];

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 26.926, // Jaipur
  lng: 75.823,
};

interface MarkerPosition {
  lat: number;
  lng: number;
}

const LocationSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [marker, setMarker] = useState<MarkerPosition>(defaultCenter);
  const [closestShop, setClosestShop] = useState<{ name: string, distance: number } | null>(null);
  const [currentLocationAddress, setCurrentLocationAddress] = useState<string>('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [geoError, setGeoError] = useState<string | null>(null);

  const { setAddress, setDistance, address: storeAddress, distance: storeDistance } = useCartStore();
  const autocompleteRef = useRef<any>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAQODjSc_eWcBWoIdk7trMzl98oRHF9HFs",
    libraries,
  });

  const getAddressFromLatLng = useCallback((lat: number, lng: number) => {
    if (!window.google) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results?.length) {
        const formatted = results[0].formatted_address;
        setCurrentLocationAddress(formatted);

        setAddress({
          userId: '',
          label: formatted,
          flatNumber: results[0].address_components.find(comp => comp.types.includes('street_number'))?.long_name || '',
          floor: results[0].address_components.find(comp => comp.types.includes('subpremise'))?.long_name || '',
          landmark: results[0].address_components.find(comp => comp.types.includes('route'))?.long_name || '',
          name: '',
          phone: 0,
          street: formatted,
          lat,
          lng,
          area: results[0].address_components.find(comp =>
            comp.types.includes('sublocality_level_1') ||
            comp.types.includes('locality')
          )?.long_name || '',
          city: results[0].address_components.find(comp => comp.types.includes('locality'))?.long_name || '',
          state: results[0].address_components.find(comp => comp.types.includes('administrative_area_level_1'))?.long_name || '',
          zipCode: results[0].address_components.find(comp => comp.types.includes('postal_code'))?.long_name || '',
        } as Address);
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



  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setMarker({ lat, lng });
        setLocationInput(place.formatted_address || '');

        setAddress({
          userId: '',
          street: place.formatted_address || '',
          flatNumber: place.address_components.find((comp: any) => comp.types.includes('street_number'))?.long_name || '',
          floor: place.address_components.find((comp: any) => comp.types.includes('subpremise'))?.long_name || '',
          landmark: place.address_components.find((comp: any) => comp.types.includes('route'))?.long_name || '',
          name: '',
          phone: 0,
          label: place.formatted_address || '',
          lat,
          lng,
          area: place.name || '',
          city: '',
          state: '',
          zipCode: '',
        } as Address);

        // Calculate distance from default center
        const distance = calculateDistance(lat, lng, defaultCenter.lat, defaultCenter.lng);
        setDistance(distance);

        setIsOpen(false);
      }
    }
  };

  const getUserLocation = useCallback(() => {
    setIsLoadingLocation(true);

    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        setMarker({ lat: userLat, lng: userLng });
        getAddressFromLatLng(userLat, userLng);

        const distance = calculateDistance(userLat, userLng, defaultCenter.lat, defaultCenter.lng);
        setDistance(distance);

        setIsLoadingLocation(false);
      },
      (error) => {
        // console.error("Geolocation error:", error.message);
        setIsLoadingLocation(false);

        // @ts-ignore
        let errorMessage = "Unable to retrieve your location";

        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = "Location access was denied. Using default location.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = "Location information is unavailable. Using default location.";
        } else if (error.code === error.TIMEOUT) {
          errorMessage = "The request to get your location timed out. Using default location.";
        }

        // Show error message to user (you can use a toast notification here)
        console.warn(errorMessage);

        // Fallback to default center
        setMarker(defaultCenter);
        getAddressFromLatLng(defaultCenter.lat, defaultCenter.lng);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  }, [getAddressFromLatLng, setDistance]);

  const useCurrentLocation = () => {
    getUserLocation();
    setIsOpen(false);
  };

  useEffect(() => {
    // Only get user location if no address is already set
    if (!storeAddress && isLoaded) {
      getUserLocation();
    }
  }, [isLoaded, storeAddress, getUserLocation]);

  const displayAddress = storeAddress?.street || currentLocationAddress || 'Select Location';
  const truncatedAddress = displayAddress.length > 30
    ? displayAddress.substring(0, 30) + '...'
    : displayAddress;

  return (
    <div className="relative z-150 max-w-2xl">
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm px-2 py-2 gap-2 rounded-md flex items-center border border-gray-300 hover:border-orange-400"
        disabled={isLoadingLocation}
      >
        {/* <span className="text-green-600 font-semibold">⚡ Delivery in 5 mins</span> */}
        {/* <span className="text-gray-500">|</span> */}
        <span className="text-orange-500 font-medium">
          {isLoadingLocation ? 'Getting location...' : truncatedAddress}
        </span>
      </button>

      {/* Popup */}
      {isOpen && (
        <div className="absolute top-2 right-0 w-80 bg-white shadow-lg border border-gray-200 rounded-md z-50 animate-fade-in">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-sm font-semibold">Select a location for delivery</h2>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="p-4 space-y-3">
            <p className="text-sm text-gray-600">
              Choose your address location to see product availability and delivery options
            </p>

            {/* Use Current Location Button */}
            <button
              onClick={useCurrentLocation}
              className="w-full flex items-center gap-2 p-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md border border-blue-200"
              disabled={isLoadingLocation}
            >
              <MapPin className="w-4 h-4" />
              {isLoadingLocation ? 'Getting current location...' : 'Use current location'}
            </button>

            {/* Search Input */}
            <div className="relative">
              {isLoaded && (
                <Autocomplete
                  onLoad={(ref) => (autocompleteRef.current = ref)}
                  onPlaceChanged={handlePlaceChanged}
                >
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search for area or street name"
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-400"
                    />
                  </div>
                </Autocomplete>
              )}
            </div>

            {/* Current Address Display */}
            {currentLocationAddress && (
              <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
                Current: {currentLocationAddress}
              </div>
            )}

            {/* Distance Display */}
            {storeDistance && (
              <div className="text-xs text-green-600">
                Distance from store: {storeDistance.toFixed(2)} km
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;