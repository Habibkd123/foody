import React from 'react';
import { Home, Briefcase, Hotel, MapPin } from 'lucide-react';

export type AddressType = 'Home' | 'Work' | 'Hotel' | 'Other';

const types = [
  { id: 'Home', label: 'Home', icon: Home },
  { id: 'Work', label: 'Work', icon: Briefcase },
  { id: 'Hotel', label: 'Hotel', icon: Hotel },
  { id: 'Other', label: 'Other', icon: MapPin },
] as const;

interface AddressTypeSelectorProps {
  selected: AddressType;
  onSelect: (type: AddressType) => void;
}

export default function AddressTypeSelector({ selected, onSelect }: AddressTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-3">
      {types.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className={`flex items-center justify-center sm:justify-start gap-2 px-3 py-3 sm:py-2 rounded-xl text-sm border transition-colors ${
            selected === id
              ? 'bg-orange-50 text-orange-600 border-orange-200 shadow-sm'
              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
          }`}
        >
          <Icon className="w-5 h-5 flex-shrink-0" />
          <span className="truncate">{label}</span>
        </button>
      ))}
    </div>
  );
}
