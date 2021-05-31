import {
  server,
  MUSocket,
  app,
  DB,
  dbrefs,
  loaddir,
  hooks,
  io,
} from "@ursamu/core";
import path from "path";
import wikiRoutes from "./routes/wikiRoutes";
import charRoutes from "./routes/charRoutes";
import dotenv from "dotenv";
import cors from "cors";
import commands from "./hooks/commands";

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

// Handle routes.

app.use("/api/v1/wiki", wikiRoutes);
app.use("/api/v1/chars", charRoutes);

// Assign DB references.
DB.attach("db", new DB(path.resolve(__dirname, "../../data/db.db")));
DB.attach("wiki", new DB(path.resolve(__dirname, "../../data/wiki.db")));

// load hooks.
hooks.use(commands);

// Initialize the dbref system.
dbrefs.init();

// load plugins
(async () => {
  await loaddir(path.join(__dirname, "./plugins/"));
  await loaddir(path.join(__dirname, "./commands/"));
})();

io.on("connect", (socket: MUSocket) => {
  socket.send({ msg: "Welcome to the game@!!!", data: {} });
});

server.listen(4201, () => console.log(intro));
