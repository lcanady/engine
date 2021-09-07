import { addCmd, flags, send } from "@ursamu/core";
import { db } from "..";
import { canEdit, name, set, target } from "../utils/utils";

export default () => {
  addCmd({
    name: "@set",
    pattern: /^[@\+]?set\s+(.*)\s*=\s*(.*)/i,
    flags: "connected",
    render: async (args, ctx) => {
      const flgs = args[2].split(" ");
      const tar = await target(ctx.player!, args[1]);

      for (const flg of flgs) {
        const flgname = flg.startsWith("!") ? flg.slice(1) : flg;
        const flgObj = flags.exists(flgname);
        if (flgObj && tar && ctx.player && canEdit(ctx.player, tar)) {
          const { tags } = flags.set(tar.flags, {}, flg);
          tar.flags = tags;
          db.update({ _id: tar._id }, tar);

          await send(
            ctx.id,
            `Done. %ch${flgname.toUpperCase()}%cn ${
              flg.startsWith("!") ? "removed from" : "added to"
            } %ch${name(ctx.player, tar).trim()}%cn`
          );
        } else {
          send(ctx.id, "Permssion denied.");
        }
      }
    },
  });
};
