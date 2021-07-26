import { addCmd, send } from "@ursamu/core";
import { db } from "..";
import { target } from "../utils/utils";

export default () => {
  addCmd({
    name: "aalias",
    pattern: /^[@\+]alias\s+(.*)\s*=\s*(\w+)/i,
    flags: "connected",
    render: async (args, ctx) => {
      const tar = await target(ctx.player!, args[1]);
      const exists =
        (await db.find({
          $where: function () {
            if (
              this.alias === args[2].toLowerCase() ||
              this.name.toLowerCase() === args[2].toLowerCase()
            ) {
              return true;
            }

            return false;
          },
        })) || [];

      if (exists.length === 0) {
        if (tar) {
          tar.alias = args[2].toLowerCase();
          await db.update({ _id: tar._id }, tar);
          await send(
            ctx.id,
            `Alias (${args[2].toUpperCase()}) for ${tar.name} set.`
          );
        } else {
          await send(ctx.id, "I can't find that.");
        }
      } else {
        await send(ctx.id, "That alias is unavaliable.");
      }
    },
  });
};
