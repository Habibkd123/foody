"use client";

import { AddressAutofill } from "@mapbox/search-js-react";

interface Props {
  onSelect: (v: { label: string; lat: number; lng: number }) => void;
}

export default function AddressAutocomplete({ onSelect }: Props) {
  const handleRetrieve = (ev: any) => {
    const feat = ev.features?.[0];
    if (!feat) return;
    onSelect({
      label: feat.properties.full_address,
      lat: feat.geometry.coordinates[1],
      lng: feat.geometry.coordinates[0],
    });
  };

  return (
    <AddressAutofill
      accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN!}
      onRetrieve={handleRetrieve}
    >
      <input
        placeholder="Type delivery address"
        autoComplete="street-address"
        className="w-full border p-2 rounded"
      />
    </AddressAutofill>
  );
}
