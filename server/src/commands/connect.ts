import { addCmd, force, DB, DBObj, send, io, flags, conns } from "@ursamu/core";
import { db } from "..";
import { login } from "../utils/utils";

export default () => {
  addCmd({
    name: "connect",
    pattern: /^connect\s+([\w\.@_-]+)\s+([\w\.@]+)/i,
    flags: "!connected",
    render: async (args, ctx) => {
      // Check for player
      const regex = RegExp(args[1], "i");

      const player = await login(ctx.socket, {
        name: args[1],
        password: args[2],
      });
      if (player) {
        ctx.player = player;
        await send(ctx.id, "> **Weclome to the game**!");
        await force(ctx, "motd");
        await force(ctx, "look");
      } else {
        send(ctx.id, "Wrong Password. Permision denied.");
      }
    },
  });
};
