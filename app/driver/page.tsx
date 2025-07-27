"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("/", { path: "/api/socket" });

export default function DriverPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    socket.on("order-assigned", (o) => setOrders((prev) => [...prev, o]));
  }, []);

  useEffect(() => {
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setCoords({ lat, lng });
        socket.emit("driver-location", { lat, lng, orderId: orders[0]?.id });
      },
      console.error,
      { enableHighAccuracy: true, maximumAge: 5_000 },
    );
    return () => navigator.geolocation.clearWatch(id);
  }, [orders]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Driver Console</h1>
      {orders.map((o) => (
        <div key={o.id} className="border p-4 rounded bg-gray-50">
          <p>Order {o.id}</p>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded"
            onClick={() => socket.emit("status", { id: o.id, v: "out_for_delivery" })}
          >
            Start Delivery
          </button>
        </div>
      ))}
      {coords && <p className="text-sm text-gray-500">GPS: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</p>}
    </div>
  );
}
