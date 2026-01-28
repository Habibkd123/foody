type GeoJSONPosition = [number, number];

type GeoJSONPolygon = {
  type: "Polygon";
  coordinates: GeoJSONPosition[][];
};

type GeoJSONFeature<G> = {
  type: "Feature";
  properties: Record<string, any>;
  geometry: G;
};

export const SERVICE_ZONES: GeoJSONFeature<GeoJSONPolygon>[] = [
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
