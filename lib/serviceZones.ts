import type { Feature, Polygon } from "geojson";

export const SERVICE_ZONES: Feature<Polygon>[] = [
  {
    type: "Feature",
    properties: {
      name: "Zone 1",
      id: 101
    },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [80.9462, 26.8467],
          [80.9480, 26.8500],
          [80.9440, 26.8515],
          [80.9425, 26.8480],
          [80.9462, 26.8467] // Close the loop!
        ]
      ]
    }
  },
  {
    type: "Feature",
    properties: {
      name: "Zone 2",
      id: 102
    },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [80.9550, 26.8490],
          [80.9575, 26.8515],
          [80.9540, 26.8530],
          [80.9520, 26.8500],
          [80.9550, 26.8490]
        ]
      ]
    }
  }
];
