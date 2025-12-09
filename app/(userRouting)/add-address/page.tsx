'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Home, Briefcase, LocateIcon } from 'lucide-react';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';

export default function AddAddressPage() {
  const [house, setHouse] = useState('');
  const [apartment, setApartment] = useState('');
  const [landmark, setLandmark] = useState('');
  const [addressType, setAddressType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [pinnedArea, setPinnedArea] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { loaded } = useGoogleMaps();

  useEffect(() => {
    if (!loaded || !inputRef.current) return;
    const ac = new (window as any).google.maps.places.Autocomplete(inputRef.current, {
      fields: ['formatted_address', 'name', 'geometry'],
    });
    ac.addListener('place_changed', () => {
      const place = ac.getPlace();
      const formatted = place.formatted_address || '';
      const name = place.name || '';
      const loc = place.geometry?.location;
      setFullAddress(formatted);
      setPinnedArea(name || formatted.split(',')[0] || '');
      if (loc) setCoords({ lat: loc.lat(), lng: loc.lng() });
    });
  }, [loaded]);

  const handleSubmit = () => {
    if (!house.trim()) {
      alert('Please enter house/flat number');
      return;
    }

    const addressPayload = {
      house,
      apartment,
      landmark,
      type: addressType,
      pinnedArea,
      fullAddress,
      coords,
    };

    console.log('Submitting address:', addressPayload);
    // Save to backend or context here
    // router.push('/checkout') or wherever next
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:py-10 max-w-2xl mx-auto">
      {/* Back Arrow */}
      <button className="mb-4 text-orange-600">&larr; Back</button>

      {/* Header Location */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-2 mb-2">
        <MapPin className="text-orange-600 mt-1" />
        <div>
          <h2 className="font-bold text-lg">{pinnedArea}</h2>
          <p className="text-sm text-gray-600">{fullAddress}</p>
        </div>
      </div>

      {/* Alert */}
      <div className="text-orange-800 text-sm bg-orange-100 border border-orange-300 rounded-md p-3 mb-6">
        A detailed address will help our Delivery Partner reach your door step easily.
      </div>

      {/* Input Fields */}
      <div className="space-y-6">
        <input
          ref={inputRef}
          placeholder="Search address"
          className="border-b w-full py-2 focus:outline-none"
          value={fullAddress}
          onChange={(e) => setFullAddress(e.target.value)}
        />
        <input
          placeholder="House / Flat / Floor No."
          className="border-b w-full py-2 focus:outline-none"
          value={house}
          onChange={(e) => setHouse(e.target.value)}
        />
        <input
          placeholder="Apartment / Road / Area (optional)"
          className="border-b w-full py-2 focus:outline-none"
          value={apartment}
          onChange={(e) => setApartment(e.target.value)}
        />
        <input
          placeholder="Landmark, Additional Info, etc. (optional)"
          className="border-b w-full py-2 focus:outline-none"
          value={landmark}
          onChange={(e) => setLandmark(e.target.value)}
        />
        <button
          onClick={async () => {
            if (!('geolocation' in navigator)) return;
            navigator.geolocation.getCurrentPosition(async (pos) => {
              const lat = pos.coords.latitude;
              const lng = pos.coords.longitude;
              setCoords({ lat, lng });
              if ((window as any).google?.maps) {
                const geocoder = new (window as any).google.maps.Geocoder();
                geocoder.geocode({ location: { lat, lng } }, (res: any, status: any) => {
                  if (status === 'OK' && res?.[0]) {
                    setFullAddress(res[0].formatted_address);
                    setPinnedArea(res[0].address_components?.[1]?.long_name || res[0].formatted_address.split(',')[0] || '');
                  }
                });
              }
            });
          }}
          className="w-full border rounded-md py-2 text-sm text-gray-700 flex items-center justify-center gap-2"
        >
          <LocateIcon className="w-4 h-4" /> Use my location
        </button>
      </div>

      {/* Address Type Tags */}
      <div className="flex justify-between mt-8 text-center text-sm text-gray-700">
        {(['Home', 'Work', 'Other'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setAddressType(type)}
            className={`flex-1 py-3 border-t-2 ${
              addressType === type ? 'border-orange-500 font-bold' : 'border-transparent'
            } transition`}
          >
            {type === 'Home' ? <Home className="mx-auto mb-1 w-5 h-5" /> : null}
            {type === 'Work' ? <Briefcase className="mx-auto mb-1 w-5 h-5" /> : null}
            {type === 'Other' ? <LocateIcon className="mx-auto mb-1 w-5 h-5" /> : null}
            {type}
          </button>
        ))}
      </div>

      {/* Save Button */}
      <button
        onClick={handleSubmit}
        className="mt-8 w-full bg-orange-500 text-white py-3 rounded-full font-semibold hover:bg-orange-600 transition"
      >
        SAVE AND PROCEED
      </button>
    </div>
  );
}
