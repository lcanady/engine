import { addCmd, send } from "@ursamu/core";
import { db } from "..";
import { andList, canEdit, target } from "../utils/utils";

export default () => {
  addCmd({
    name: "page",
    pattern: /^[\+@]?p[age]*\s+(?:(.*)\s*=\s*)?([\s\S]+)/i,
    flags: "connected",
    render: async (args, ctx) => {
      const { player } = ctx;
      if (!player) return;

      const tars = (args[1] || player?.temp.lastPage || "").split(" ");
      const list = [];

      for (const item of tars) {
        const tar = await target(player, item);
        if (tar) list.push(tar);
      }

      const names = list.map(
        (item) =>
          `${item.name}${item.alias && "(" + item.alias.toUpperCase() + ")"}`
      );

      const msg = `To ${
        names.length > 1 ? "(" + andList(names) + ")" : andList(names)
      }, ${player.name}${
        player.alias && "(" + player.alias.toUpperCase() + ")"
      } pages: ${args[2]}`;

      for (const target of list) {
        await send(target._id!, msg);
      }
      player.temp.lastPage = tars.join(" ");
      await db.update({ _id: player._id }, player);
    },
  });
};
