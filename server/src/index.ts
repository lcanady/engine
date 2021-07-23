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
  conns,
  remConn,
  getSocket,
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
        if (!player.temp.lastCommand) {
          broadcastTo(player.location, `${player.name} has connected.`);
        }
        conns.push(socket);

        socket.cid = player._id;

        socket.join(ctx.id);
        socket.join(player._id!);
        socket.join(player.location);

        player.data.channels?.forEach((channel: string) =>
          socket.join(channel)
        );
        await send(socket.id, "", {
          type: "self",
          flags: player.flags,
          user: {
            name: player.name,
            flags: player.flags,
            id: player._id,
            avatar: player.data.avatar,
          },
        });

        const { tags } = flags.set(player.flags, {}, "connected");
        player.flags = tags;
        await db.update({ _id: player._id }, player);
      }
    }
    socket.on("disconnect", () => remConn(socket.cid || ""));
  });
});

setInterval(async () => {
  const players = await db.find({
    $where: function () {
      return this.flags.includes("player");
    },
  });

  if (players) {
    for (const player of players) {
      const diff = Math.round(
        (Date.now() - player.temp.lastCommand || Date.now()) / (1000 * 3600)
      );

      const conn = conns.find((conn) => conn.cid === player._id);

      if (
        diff &&
        player.temp.lastCommand &&
        !conn &&
        player.flags.includes("connected")
      ) {
        const { tags } = flags.set(player.flags, {}, "!connected");
        player.flags = tags;
        player.temp = {};
        db.update({ _id: player._id }, player);
        console.log(diff);
        broadcastTo(player.location, `${player.name} has disconnected.`);
      }
    }
  }
}, 60000);

server.listen(4201, () => console.log(intro));
