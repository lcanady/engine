import {
  server,
  app,
  Config,
  DB,
  loaddir,
  hooks,
  DBObj,
  Article,
  io,
  MUSocket,
  Context,
  verify,
  flags,
  send,
  textDB,
  broadcastTo,
} from "@ursamu/core";
import path from "path";
import wikiRoutes from "./routes/wikiRoutes";
import charRoutes from "./routes/charRoutes";
import dotenv from "dotenv";
import commands from "./hooks/commands";
import auth from "./hooks/auth";
import { readFile } from "fs/promises";
import { Dirent, PathLike } from "fs";

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

// Assign DB references.
export const db = new DB<DBObj>(path.resolve(__dirname, "../../data/db.db"));
export const wiki = new DB<Article>(
  path.resolve(__dirname, "../../data/wiki.db")
);

// load hooks.
hooks.use(auth, commands);

// load plugins
(async () => {
  await loaddir(path.join(__dirname, "./commands/"));
  await loaddir(
    path.join(__dirname, "../text/"),
    async (file: Dirent, path: PathLike) => {
      const text = await readFile(`${path}/${file.name}`, { encoding: "utf8" });
      textDB.set("text", [
        { name: file.name.split(".")[0], category: "text", body: text },
      ]);
    }
  );
  await loaddir(path.join(__dirname, "./plugins/"));
})();

io.on("connect", (socket: MUSocket) => {
  socket.on("message", async (ctx: Context) => {
    if (ctx.data.token && !socket.cid) {
      const decoded = await verify(ctx.data.token, process.env.SECRET || "");
      const player = await db.get(decoded.id);
      if (player) {
        socket.cid = player._id;
        socket.join(ctx.id);

        socket.join(player._id!);

        await broadcastTo(player.location, `${player.name} has reconnected.`);
        socket.join(player.location);

        player.data.channels?.forEach((channel: string) =>
          socket.join(channel)
        );
        await send(socket.id, "", {
          type: "self",
          id: player._id,
          flags: player.flags,
        });
        await send(socket.id, "", { loggedIn: true });

        const { tags } = flags.set(player.flags, {}, "connected");
        player.flags = tags;
        await db.update({ _id: player._id }, player);
        socket.send({ msg: "Reconnected!", data: {} });
      }
    }
  });

  socket.on("disconnect", async () => {
    if (socket.cid) {
      const player = await db.get(socket.cid);
      if (player) {
        await broadcastTo(player.location, `${player.name} has disconnected.`);
        const { tags } = flags.set(player.flags, {}, "!connected");
        player.flags = tags;
        db.update({ _id: player._id }, player);
      }
    }
  });
});

server.listen(4201, () => console.log(intro));
