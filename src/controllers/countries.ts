import fs from "fs";
import path from "path";
import { Request, Response } from "express";
import * as turf from "@turf/turf";
import axios from "axios";
import { ISSMessage, GeoJson } from "../types/country";
import proj4 from "proj4";

const geoJsonPath = path.join(__dirname, "../data/countries.geojson");
const geoJson: GeoJson = JSON.parse(fs.readFileSync(geoJsonPath, "utf8"));

export const getCountries = async (_req: Request, res: Response) => {
  try {
    res.send().json(geoJson.features.map((feature) => feature.properties.name));
  } catch (error) {
    res.status(500).send({ error }).end();
  }
};

export const getCountryISS = async (_req: Request, res: Response) => {
  try {
    const featureCollection = turf.featureCollection(geoJson.features);
    const response = await axios.get<ISSMessage>(
      "http://api.open-notify.org/iss-now.json"
    );
    const y = response.data.iss_position.latitude;
    const x = response.data.iss_position.longitude;
    const point = turf.point([+x, +y]);
    console.log(point);
    let country = "Ocean";
    for (const feature of featureCollection.features) {
      if (turf.booleanPointInPolygon(point, feature)) {
        console.log("name");
        country = feature.properties.name;
        break;
      }
    }
    res.status(200).send(country).end();
  } catch (error) {
    res.status(500).send({ error }).end();
  }
};
export const getISSLocation = async (_req: Request, res: Response) => {
  try {
    const response = await axios.get<ISSMessage>(
      "http://api.open-notify.org/iss-now.json"
    );
    const y = +response.data.iss_position.latitude;
    const x = +response.data.iss_position.longitude;
    const zone = Math.floor((x + 180) / 6) + 1;
    const { latitude, longitude } = Wgs84ToUtm(x, y, zone);
    console.log();
    res.status(200).send({ location: { latitude, longitude } }).end();
  } catch (error) {
    res.status(500).send({ error }).end();
  }
};

function Wgs84ToUtm(easting: number, northing: number, zone: number) {
  const utmProjection = `+proj=utm +zone=${zone} +datum=WGS84 +no_defs`;
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
