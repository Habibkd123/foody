"use client";

import { useEffect, useRef } from "react";
import { AddressAutofill } from "@mapbox/search-js-react";

interface Props {
  onSelect: (v: { label: string; lat: number; lng: number }) => void;
}

export default function AddressAutocomplete({ onSelect }: Props) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const handleRetrieve = (ev: any) => {
      const feat = ev.features?.[0];
      if (!feat) return;
      onSelect({
        label: feat.properties.full_address,
        lat: feat.geometry.coordinates[1],
        lng: feat.geometry.coordinates[0],
      });
    };

    // Mapbox Custom Element
    const autofill = new AddressAutofill({
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN!,
    });
    autofill.addEventListener("retrieve", handleRetrieve);
    autofill.attachTo(ref.current);

    return () => {
      autofill.removeEventListener("retrieve", handleRetrieve);
    };
  }, [onSelect]);

  return (
    <input
      ref={ref}
      placeholder="Type delivery address"
      autoComplete="street-address"
      className="w-full border p-2 rounded"
    />
  );
}
