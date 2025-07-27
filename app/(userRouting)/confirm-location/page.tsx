'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

const DEFAULT_LOCATION = {
  lat: 26.926, // Jaipur approx
  lng: 75.823,
};

export default function ConfirmLocationPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [address, setAddress] = useState('Ganpati Nagar, Jaipur, Rajasthan 302007, India');

  useEffect(() => {
    if (typeof window === 'undefined' || !window.google || !mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: location,
      zoom: 16,
      disableDefaultUI: true,
    });

    const marker = new window.google.maps.Marker({
      position: location,
      map,
      draggable: true,
    });

    const circle = new window.google.maps.Circle({
      strokeColor: '#FF5733',
      strokeOpacity: 0.3,
      strokeWeight: 2,
      fillColor: '#FF5733',
      fillOpacity: 0.15,
      map,
      center: location,
      radius: 80,
    });

    marker.addListener('dragend', () => {
      const newPos = marker.getPosition();
      if (newPos) {
        const newLocation = {
          lat: newPos.lat(),
          lng: newPos.lng(),
        };
        setLocation(newLocation);
        circle.setCenter(newLocation);
      }
    });
  }, [location]);

  const handleLocateMe = () => {
    if (!navigator.geolocation) return alert("Geolocation is not supported");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocation(coords);
      },
      () => alert("Could not retrieve your location")
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-4 bg-white">
      <div className="w-full max-w-4xl">
        {/* Map */}
        <div className="relative rounded-md overflow-hidden h-[350px]">
          <div ref={mapRef} className="w-full h-full" />
          <button
            onClick={handleLocateMe}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-4 py-2 rounded-full shadow-md text-sm hover:bg-orange-600 transition"
          >
            LOCATE ME
          </button>
        </div>

        {/* Address Summary */}
        <div className="mt-6 space-y-2 border-b pb-6">
          <p className="text-xs font-semibold text-gray-500">SELECT DELIVERY LOCATION</p>
          <div className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="w-4 h-4 text-orange-500" />
            <span>11</span>
          </div>
          <p className="text-gray-700 text-sm">{address}</p>
          <button className="text-orange-500 text-sm font-semibold mt-2 px-3 py-1 rounded bg-orange-100 hover:bg-orange-200">
            CHANGE
          </button>
        </div>

        {/* Confirm Button */}
        <div className="w-full flex justify-center mt-6">
          <button className="w-full max-w-md bg-orange-500 text-white font-semibold text-center py-3 rounded-full hover:bg-orange-600 transition">
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
}
