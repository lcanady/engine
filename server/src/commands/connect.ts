import { addCmd, force, DB, DBObj, send, io, flags } from "@ursamu/core";
import { db } from "..";
import { join, login } from "../../utils/utils";

export default () => {
  addCmd({
    name: "connect",
    pattern: /^connect\s+(\w+)\s+(\w+)/i,
    flags: "!connected",
    render: async (args, ctx) => {
      // Check for player
      const regex = RegExp(args[1], "i");
      const player = (await db.find({ name: regex }))[0];
      if (player) {
        const token = await login(ctx.socket, args[1], args[2]);
        if (token) {
          await send(ctx.id, "> **Weclome to the game**!", { token });
          await force(ctx, "motd");
        } else {
          send(ctx.id, "Wrong Password. Permision denied.");
        }
      } else {
        send(ctx.id, "That name doesn't exist.");
      }
    },
  });
};
