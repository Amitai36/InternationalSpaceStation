import express from "express";

import countries from "./routes/countries";
const app = express();

app.use("/countries", countries);
export default app;
