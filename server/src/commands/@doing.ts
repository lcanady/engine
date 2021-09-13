import { addCmd, send } from "@ursamu/core";
import { db } from "..";

export default () => {
  addCmd({
    name: "@doing",
    flags: "connected",
    pattern: /^[@\+]doing(?:\s+(.*))?/,
    render: async (args, ctx) => {
      if (ctx.player && args[1]) {
        ctx.player.data.doing = args[1];
        await send(ctx.id, `Done. %ch@doing%cn set.`);
      } else if (ctx.player && !args[1]) {
        ctx.player.data.doing = "";
        await send(ctx.id, "Done. %ch@doing%cn cleared.");
      }
      await db.update({ _id: ctx.player?._id }, ctx.player!);
    },
  });
};
