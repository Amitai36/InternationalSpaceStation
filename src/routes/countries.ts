import {
  getCountries,
  getCountryISS,
  getISSLocation,
} from "../controllers/countries";
import { Router } from "express";

const router = Router();
router.get("/getCountries", getCountries);
router.get("/getCountryISS", getCountryISS);
router.get("/getISSLocation", getISSLocation);

export default router;
