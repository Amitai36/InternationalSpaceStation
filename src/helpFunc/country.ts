import fs from "fs";
import path from "path";
import proj4 from "proj4";
import axios from "axios";
import * as turf from "@turf/turf";

import { GeoJson, ISSMessage } from "../types/country";

const geoJsonPath = path.join(__dirname, "../data/countries.geojson");
const geoJson: GeoJson = JSON.parse(fs.readFileSync(geoJsonPath, "utf8"));

export const positionISS = async () => {
  const response = await axios.get<ISSMessage>(
    "http://api.open-notify.org/iss-now.json"
  );
  const y = response.data.iss_position.latitude;
  const x = response.data.iss_position.longitude;
  return { x: +x, y: +y };
};

export const getCountry = async () => {
  const featureCollection = turf.featureCollection(geoJson.features);
  const { x, y } = await positionISS();
  const point = turf.point([x, y]);
  let country = "Ocean";
  for (const feature of featureCollection.features) {
    if (turf.booleanPointInPolygon(point, feature)) {
      country = feature.properties.name;
      break;
    }
  }
  return country;
};
export function Wgs84ToUtm(easting: number, northing: number, zone: string) {
  const utmProjection = `+proj=utm +zone=${zone} ${
    zone.includes("H") ? "+south" : ""
  } +datum=WGS84 +no_defs`;
  const wgs84Projection = "+proj=longlat +datum=WGS84 +no_defs";

  const geoCrs = "EPSG:4326";
  const utmCrs = "EPSG:326" + (Math.floor((easting + 180) / 6) % 60) + 1;
  proj4.defs(utmCrs, utmProjection);
  proj4.defs(geoCrs, wgs84Projection);
  const wgs84Coords = proj4(geoCrs, utmCrs, [easting, northing]);
  return {
    longitude: wgs84Coords[0],
    latitude: wgs84Coords[1],
  };
}
