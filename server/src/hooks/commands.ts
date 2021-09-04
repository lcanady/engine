import { cmds, Context, DB, flags, Next, send } from "@ursamu/core";
import e from "cors";
import { db } from "..";

export default async (ctx: Context, next: Next) => {
  try {
    for (const cmd of cmds) {
      const match = ctx.msg?.match(cmd.pattern);
      if (match) {
        if (ctx.player) {
          ctx.player.temp.lastCommand = Date.now();
          db.update({ _id: ctx.player._id }, ctx.player);
        }

        if (
          !cmd.flags ||
          flags.check(ctx.player?.flags || "", cmd.flags) ||
          cmd.name === "quit"
        ) {
          return await cmd.render(match, ctx);
        } else {
          return next();
        }
      }
    }
  } catch (error) {
    send(ctx.id, `Oops! You've found a bug! ${error.message}`);
  }

  next();
};
