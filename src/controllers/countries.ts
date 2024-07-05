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
