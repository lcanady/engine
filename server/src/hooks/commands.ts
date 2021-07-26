import { cmds, Context, DB, flags, send } from "@ursamu/core";
import { db } from "..";

export default async (ctx: Context) => {
  if (!ctx.data?.found) {
    try {
      for (const cmd of cmds) {
        const match = ctx.msg?.match(cmd.pattern);
        if (match) {
          if (ctx.player) {
            ctx.player.temp.lastCommand = Date.now();
            db.update({ _id: ctx.player._id }, ctx.player);
          }
          if (!cmd.flags || flags.check(ctx.player?.flags || "", cmd.flags)) {
            ctx.data.found = true;
            return await cmd.render(match, ctx);
          }
        }
      }

      if (!ctx.data.found && ctx.player && ctx.msg !== "")
        send(ctx.id, "Huh? Type 'help' for help.");
    } catch (error) {
      send(ctx.id, `Oops! You've found a bug! ${error.message}`);
    }
  }
};
