import bodyParser from "body-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

const httpServer = createServer();
const socket = new Server(httpServer, {});
socket.on("connection", (socket) => {
  console.log(socket);
});
import api from "./api";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const port = 3000;
app.use("/", api);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
httpServer.listen(3001, () => console.log("connected"));
