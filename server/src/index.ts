import {
  server,
  app,
  Config,
  DB,
  hooks,
  DBObj,
  Article,
  express,
  emitter,
  io,
  MUSocket,
  Context,
  send,
  textDB,
} from "@ursamu/core";
import path, { join } from "path";
import wikiRoutes from "./routes/wikiRoutes";
import charRoutes from "./routes/charRoutes";
import dotenv from "dotenv";
import commands from "./hooks/commands";
import auth from "./hooks/auth";
import defaults from "./hooks/default";
import "./lib/loadResources";
import "./lib/timers";
import { readFile } from "fs/promises";

dotenv.config();

const intro = `
██╗   ██╗██████╗ ███████╗ █████╗ ███╗   ███╗██╗   ██╗
██║   ██║██╔══██╗██╔════╝██╔══██╗████╗ ████║██║   ██║
██║   ██║██████╔╝███████╗███████║██╔████╔██║██║   ██║
██║   ██║██╔══██╗╚════██║██╔══██║██║╚██╔╝██║██║   ██║
╚██████╔╝██║  ██║███████║██║  ██║██║ ╚═╝ ██║╚██████╔╝
 ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝ ╚═════╝ 
The modern MU* Server
listening on port: ${process.env.PORT || 4201}
`.trim();

// Read the config directory.
export const config = new Config(path.resolve("../config/"));

// Handle routes.
app.use("/api/v1/wiki", wikiRoutes);
app.use("/api/v1/chars", charRoutes);

export interface Channel {
  name: string;
  header?: string;
  read?: string;
  write?: string;
  modify?: string;
  provate?: boolean;
}

// Assign DB references.
export const db = new DB<DBObj>(path.resolve(__dirname, "../../data/db.db"));
export const channels = new DB<Channel>(
  path.resolve(__dirname, "../../data/channels.db")
);
export const wiki = new DB<Article>(
  path.resolve(__dirname, "../../data/wiki.db")
);

export type Msg = {
  id: string;
  msg: string;
  created: number;
  data: { [key: string]: any };
};

export const msgs = new DB<Msg>(path.resolve(__dirname, "../../data/msgs.db"));

// load hooks.
hooks.use(auth, commands, defaults);

app.use("/uploads", express.static(join(__dirname, "uploads")));
app.use(express.static(path.resolve(__dirname, "../../client/build/")));

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../client/build/index.html"));
});

io.on("connect", async (socket: MUSocket) => {
  // send a connect message!
  socket.join(socket.id);

  socket.on("message", async (ctx: Context) => {
    ctx.socket = socket;
    ctx.id = socket.id;
    await hooks.execute(ctx);
  });
});

server.listen(4201, () => console.log(intro));
