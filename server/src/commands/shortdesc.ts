import { addCmd, send } from "@ursamu/core";
import { db } from "..";
import { canEdit, target } from "../utils/utils";

export default () => {
  addCmd({
    name: "@shortdesc",
    pattern: /^[@\+]?shortdesc\s+(.*)\s*=\s*(.*)/i,
    flags: "connected",
    render: async (args, ctx) => {
      const tar = await target(ctx.player!, args[1]);
      if (ctx.player && tar && canEdit(ctx.player, tar)) {
        if (args[2]) {
          tar.data.shortDesc = args[2];
        } else {
          delete tar.data.shortdesc;
        }

        await db.update({ _id: tar._id }, tar);
        await send(ctx.id, `Done. Shortdesc set for %ch${tar.name}%cn`);
      } else {
        send(ctx.id, "Permission denied.");
      }
    },
  });
};
