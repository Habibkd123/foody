import React from 'react';
import { Input } from '@/components/ui/input';
import { Address } from '@/types/global';

type PartialAddress = Partial<Address> & {
  phone?: number | string;
};

interface AddressFormFieldsProps {
  value: PartialAddress;
  onChange: (updates: PartialAddress) => void;
}

export default function AddressFormFields({ value, onChange }: AddressFormFieldsProps) {
  return (
    <div className="space-y-2.5 sm:space-y-3">
      <Input
        placeholder="Flat / House no / Building name *"
        value={value?.street || ''}
        onChange={(e) => onChange({ street: e.target.value })}
        className="h-10"
      />

      <Input
        placeholder="Area *"
        value={value?.area || ''}
        onChange={(e) => onChange({ area: e.target.value })}
        className="h-10"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
        <Input
          placeholder="City *"
          value={value?.city || ''}
          onChange={(e) => onChange({ city: e.target.value })}
          className="h-10"
        />
        <Input
          placeholder="State *"
          value={value?.state || ''}
          onChange={(e) => onChange({ state: e.target.value })}
          className="h-10"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
        <Input
          placeholder="Zip Code *"
          value={value?.zipCode || ''}
          onChange={(e) => onChange({ zipCode: e.target.value })}
          className="h-10"
        />
        <Input
          placeholder="Landmark (Optional)"
          value={value?.landmark || ''}
          onChange={(e) => onChange({ landmark: e.target.value })}
          className="h-10"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
        <Input
          placeholder="Name *"
          value={value?.name || ''}
          onChange={(e) => onChange({ name: e.target.value })}
          className="h-10"
        />

        <Input
          placeholder="Phone Number *"
          type="number"
          value={value?.phone as any || ''}
          onChange={(e) => onChange({ phone: Number(e.target.value) })}
          className="h-10"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isDefault"
          checked={Boolean(value?.isDefault)}
          onChange={(e) => onChange({ isDefault: e.target.checked })}
          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
        />
        <label htmlFor="isDefault" className="text-sm text-gray-700">
          Set as default address
        </label>
      </div>
    </div>
  );
}
