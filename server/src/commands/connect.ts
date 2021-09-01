import { addCmd, force, send, conns, sign, hooks } from "@ursamu/core";
import { login } from "../utils/utils";

export default () => {
  addCmd({
    name: "connect",
    pattern: /^connect\s+([\w\.@_-]+)\s+([\w\.@]+)/i,
    flags: "!connected",
    render: async (args, ctx) => {
      // Check for player
      const regex = RegExp(args[1], "i");

      const player = await login(ctx, {
        name: args[1],
        password: args[2],
      });

      ctx.socket.cid = player?._id;
      ctx.player = player;
      ctx.socket.join(player?._id || "");
      ctx.socket.join(player?.location || "");

      const token = await sign(player?._id!, process.env.SECRET || "").catch(
        (err) => console.log(err)
      );

      conns.push(ctx.socket);
      await send(ctx.socket.id, "", {
        type: "self",
        id: player?._id,
        flags: player?.flags,
        token,
      });
      if (ctx.player) {
        await force(ctx, "motd");
        await force(ctx, "look");
      } else {
        send(ctx.id, "Wrong Password. Permision denied.");
      }
    },
  });
};
