export interface ISSMessage {
  message: "success";
  timestamp: number;
  iss_position: {
    latitude: string;
    longitude: string;
  };
}

export interface GeoJson {
  type: "FeatureCollection";
  features: [
    {
      type: "Feature";
      id: string;
      properties: {
        name: string;
      };
      geometry: {
        type: "Polygon";
        coordinates: number[][][];
      };
    }
  ];
}
