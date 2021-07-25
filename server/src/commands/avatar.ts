import { addCmd, addText, DB, flags, send } from "@ursamu/core";
import { db } from "..";
import { target } from "../utils/utils";

export default () => {
  addCmd({
    name: "@avatar",
    pattern: /^[@\+]?av[atar]*\s+(\w+)\s*=\s*(.*)/i,
    flags: "connected",
    render: async (args, ctx) => {
      const tar = await target(ctx.player!, args[1]);
      if (tar) {
        if (
          tar.owner === ctx.player?._id ||
          flags.check(ctx.player?.flags || "", "wizard+")
        ) {
          tar.data.avatar = args[2];
          db.update({ _id: tar._id }, tar);
          send(ctx.id, `Done. ${tar.name}'s avatar image has been set! `);
        } else {
          send(ctx.id, "I can't find that.");
        }
      } else {
        send(ctx.id, "I can't find that.");
      }
    },
  });
};
