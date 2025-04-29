import { config } from "dotenv";
config();

import ExpressServer from "./configs/server.js";
import { registerSocketServer } from "./src/io/io.js";

const server = new ExpressServer();
server.listen();
registerSocketServer(server);

