import {
  getCountries,
  getCountryISS,
  getISSLocation,
} from "../controllers/countries";
import { Router } from "express";

const router = Router();
router.get("/getCountries", getCountries);

export default router;
