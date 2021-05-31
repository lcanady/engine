import { cmds, Context, DB, flags, send } from "@ursamu/core";

export default async (ctx: Context) => {
  if (!ctx.data?.found) {
    try {
      console.log(cmds);
      for (const cmd of cmds) {
        const match = ctx.msg?.match(cmd.pattern);
        if (match) {
          if (!cmd.flags || flags.check(ctx.player?.flags || "", cmd.flags)) {
            await cmd.render(match, ctx);
            ctx.data.found = true;
            if (ctx.player) {
              ctx.player.temp.lastCommand = Date.now();
              await DB.dbs.db.update({ _id: ctx.player._id }, ctx.player);
            }
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
