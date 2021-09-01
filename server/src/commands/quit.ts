import { addCmd, flags, io, remConn, send } from "@ursamu/core";
import { db } from "..";

export default () => {
  addCmd({
    name: "quit",
    flags: "connected",
    pattern: /^quit/i,
    render: async (args, ctx) => {
      const { tags } = flags.set(ctx.player?.flags || "", {}, "!connected");
      ctx.player!.flags = tags;
      db.update({ _id: ctx.player?._id }, ctx.player!);
      await send(ctx.id, "See You Space Cowboy...");
      io.to(ctx.id).emit("quit");
      remConn(ctx.id);
      send(ctx.player?.location!, `${ctx.player?.name} has disconnected.`);
      ctx.socket.disconnect();
    },
  });
};
