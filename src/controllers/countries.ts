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
