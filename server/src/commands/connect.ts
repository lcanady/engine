import { addCmd, force, DB, DBObj, send, io, flags } from "@ursamu/core";
import { db } from "..";
import { login } from "../../utils/utils";

export default () => {
  addCmd({
    name: "connect",
    pattern: /^connect\s+([\w\.@_-]+)\s+([\w\.@]+)/i,
    flags: "!connected",
    render: async (args, ctx) => {
      // Check for player
      const regex = RegExp(args[1], "i");

      const { token, player } = await login(ctx.socket, args[1], args[2]);
      if (player) {
        if (token) {
          ctx.player = player;
          await send(ctx.id, "> **Weclome to the game**!", { token });
          await force(ctx, "motd");
          await force(ctx, "look");
        } else {
          send(ctx.id, "Wrong Password. Permision denied.");
        }
      } else {
        send(ctx.id, "That name doesn't exist.");
      }
    },
  });
};
