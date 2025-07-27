import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";
import { SERVICE_ZONES } from "./serviceZones";

export function inServiceArea(lat: number, lng: number) {
  const p = point([lng, lat]);
  return SERVICE_ZONES.some((zone) => booleanPointInPolygon(p, zone));
}

// Usage in Checkout
// const handlePick = (v: { label: string; lat: number; lng: number }) => {
//   if (!inServiceArea(v.lat, v.lng)) {
//     toast.error("Out of delivery range!");
//     return;
//   }
//   dispatch({ type: "SET_ADDRESS", address: v });
// };
