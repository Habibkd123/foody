'use client';

import React, { useState } from 'react';
import { MapPin, X } from 'lucide-react';

const LocationSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [locationInput, setLocationInput] = useState('');

  return (
    <div className="relative z-150 ">
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm px-2 py-2 gap-2 rounded-md flex items-center  border border-gray-300 hover:border-orange-400"
      >
        <span className="text-green-600 font-semibold">⚡ Delivery in 5 mins</span>
        <span className="text-gray-500">|</span>
        <span className="text-orange-500 font-medium">Select Location</span>
      </button>

      {/* Popup */}
      {isOpen && (
        <div className="absolute top-2  right-0 w-80 bg-white shadow-lg border border-gray-200 rounded-md z-50 animate-fade-in">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-sm font-semibold">Select a location for delivery</h2>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <div className="p-4 space-y-2">
            <p className="text-sm text-gray-600">
              Choose your address location to see product availability and delivery options
            </p>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
