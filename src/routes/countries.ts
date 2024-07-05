import { getCountries, getCountryISS } from "../controllers/countries";
import { Router } from "express";

const router = Router();
router.get("/getCountries", getCountries);
router.get("/getCountryISS", getCountryISS);

export default router;
