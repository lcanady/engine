import { addCmd, flags, send } from "@ursamu/core";
import { db } from "..";
import { name, target } from "../utils/utils";

export default () => {
  addCmd({
    name: "@desc",
    flags: "connected",
    pattern: /^@?desc\s+(.*)\s*=\s*(.*)/i,
    render: async (args, ctx) => {
      const tar = await target(ctx.player!, args[1]);
      if (tar && ctx.player) {
        if (
          ctx.player?._id === tar.owner ||
          flags.check(ctx.player?.flags || "", "wizard+")
        ) {
          tar.description = args[2];
          await db.update({ _id: tar._id }, tar);
          await send(
            ctx.id,
            `Description for ${name(ctx.player, tar, true)} updated.`
          );
        } else {
          await send(ctx.id, "Permission denied.");
        }
      } else {
        send(ctx.id, "I can't find that player.");
      }
    },
  });
};
