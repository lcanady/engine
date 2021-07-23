import { addCmd, send } from "@ursamu/core";
import { db } from "..";
import { canEdit, target } from "../utils/utils";

export default () => {
  addCmd({
    name: "@name",
    pattern: /^[@\+]?name\s+(.*)\s*=\s*(.*)/i,
    flags: "connected",
    render: async (args, ctx) => {
      const tar = await target(ctx.player!, args[1]);
      if (tar) {
        if (canEdit(ctx.player!, tar)) {
          tar.name = args[2];
          console.log(args[2]);
          await db.update({ _id: tar._id }, tar);
          return send(ctx.id, "**Done**. Object name updated.");
        }
      }
      send(ctx.id, "Permission denied.");
    },
  });
};
