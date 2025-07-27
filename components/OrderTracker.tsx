"use client";

import { GoogleMap, MarkerF, PolylineF } from "@react-google-maps/api";
import { useEffect, useMemo, useState } from "react";
import { useOrderSocket } from "@/hooks/useOrderSocket";
import { toast } from "@/components/ui/use-toast"; // or wherever your toast.ts lives

interface Props { orderId: string }

export default function OrderTracker({ orderId }: Props) {
  const msg = useOrderSocket(orderId);
  const [driver, setDriver] = useState<{ lat: number; lng: number } | null>(null);
  const [route, setRoute] = useState<{ lat: number; lng: number }[]>([]);

 useEffect(() => {
    if (!msg) return;

    switch (msg.type) {
      case "driver-location":
        setDriver({ lat: msg.lat, lng: msg.lng });
        break;
    //   case "route":
    //     setRoute(msg.points);
        // break;
      case "status":
        toast({
          title: "📦 Order Status Update",
          description: msg.value,
        });
        break;
    }
  }, [msg]);

  const center = useMemo(
    () => driver ?? route[0] ?? { lat: 0, lng: 0 },
    [driver, route],
  );

  return (
    <GoogleMap
      mapContainerClassName="h-64 w-full rounded"
      zoom={14}
      center={center}
    >
      {driver && <MarkerF position={driver} />}
      {route.length > 1 && (
        <PolylineF path={route} options={{ strokeColor: "#FF6600", strokeWeight: 4 }} />
      )}
    </GoogleMap>
  );
}
