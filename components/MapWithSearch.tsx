"use client";

import React, { useState } from "react";
import Autocomplete from "react-google-autocomplete";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: 28.6139, // New Delhi latitude
  lng: 77.2090, // New Delhi longitude
};

export default function LocationSearchMap() {
  const [selectedLocation, setSelectedLocation] = useState(null);
let apiKey =process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY||""
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey, // 🔥 Replace with your key
    libraries: ["places"],
  });

  const onPlaceSelected = (place:any) => {
    if (!place.geometry) return;

    const location = place.geometry.location;
    setSelectedLocation({
      lat: location.lat(),
      lng: location.lng(),
    });
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Select Location</h2>

      <Autocomplete
        apiKey={apiKey} // 🔥 Replace here too
        onPlaceSelected={onPlaceSelected}
        options={{
          types: ["geocode"],
          componentRestrictions: { country: "in" }, // Optional: limit to India
        }}
        placeholder="Search for location..."
        className="w-full p-2 border rounded-md shadow-md"
      />

      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={selectedLocation || defaultCenter}
          zoom={selectedLocation ? 14 : 5}
        >
          {selectedLocation && <Marker position={selectedLocation} />}
        </GoogleMap>
      )}
    </div>
  );
}
