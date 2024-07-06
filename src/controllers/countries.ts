import fs from "fs";
import path from "path";
import { Request, Response } from "express";

import { GeoJson } from "../types/country";
import { getCountry, positionISS, Wgs84ToUtm } from "../helpFunc/country";

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
    const country = await getCountry();
    res.status(200).send(country).end();
  } catch (error) {
    res.status(500).send({ error }).end();
  }
};
export const getISSLocation = async (_req: Request, res: Response) => {
  try {
    const { x, y } = await positionISS();
    const zone = Math.floor((x + 180) / 6) + 1;
    const bandLetters = "CDEFGHJKLMNPQRSTUVWX";
    const index = Math.floor((y + 80) / 8);
    const { latitude, longitude } = Wgs84ToUtm(
      x,
      y,
      `${zone}${bandLetters.charAt(index)}`
    );
    res.status(200).send({ location: { latitude, longitude } }).end();
  } catch (error) {
    res.status(500).send({ error }).end();
  }
};
