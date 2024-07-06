import bodyParser from "body-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import api from "./api";
import { getCountry, positionISS } from "./helpFunc/country";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const port = 3000;
app.use("/", api);

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });
io.on("connection", (socket) => {
  let curreCountry = "";
  console.log("connect");
  const interval = setInterval(async () => {
    const country = await getCountry();
    const { x, y } = await positionISS();
    io.emit("sendLocation", { x, y });
    if (curreCountry && country !== curreCountry) {
      io.emit("sendCountry", country);
      curreCountry = country;
    }
  }, 10000);
  socket.on("disconnect", () => clearInterval(interval));
});
httpServer.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
