import { addCmd, DBObj, send } from "@ursamu/core";
import { db } from "..";
import { andList, canEdit, pose, target } from "../utils/utils";

export default () => {
  addCmd({
    name: "page",
    pattern: /^[\+@]?p[age]*\s+(?:(.*)\s*=\s*)?(.*)?/i,
    flags: "connected",
    render: async (args, ctx) => {
      const { player } = ctx;
      if (!player) return;

      const msg = args[2] ? args[2] : ":pages you!";
      let tars = args[1] === undefined ? player.temp.lastPage : args[1];
      const list = [];

      for (const item of tars.split(" ") || []) {
        const tar = await target(player, item);
        if (tar) list.push(tar);
      }

      const names = list.map(
        (item) =>
          `${item.name}${
            item.alias ? "(" + item.alias.toUpperCase() + ")" : ""
          }`
      );

      //Name(ALIAS)
      const nameAlias = (obj: DBObj) =>
        `${obj.name}${obj.alias ? "(" + obj.alias.toUpperCase() + ")" : ""}`;

      // From afar Name(ALIAS) pages: <text>
      const singularFrom = (name: string, msg: string) =>
        `From afar, ${pose(name, msg, "pages")}`;

      // To Name2(ALIAS), Name(ALIAS) pages: <tet>
      const singularTo = (name: string, name2: string, msg: string) =>
        `Long distance to ${name2}, ${pose(
          `${/^[;":"].*/.test(msg) ? name : "You"}`,
          msg,
          `${/^[;":"].*/.test(msg) ? "pages" : "page"}`
        )}`;

      // To (Name(ALIAS), Name2(ALIAS), Name3(ALIAS)) Name(ALIAS) pages: <Text>
      const pluralTo = (name: string, names: string[], msg: string) =>
        `Long distance to (${names.join(", ").trim()}) ${pose(
          name,
          msg,
          "pages"
        )}`;

      let msgFrom = "";
      let msgTo = "";

      if (list.length === 1) {
        msgFrom = singularFrom(nameAlias(ctx.player!), msg);

        if (args[2]) {
          msgTo = singularTo(nameAlias(ctx.player!), names[0], msg);
        } else {
          msgTo = `You paged ${names[0]}.`;
        }
      } else if (list.length > 1) {
        msgFrom = pluralTo(nameAlias(ctx.player!), names, msg);
      } else {
        await send(ctx.id, "No one to page!");
      }

      // Send to targets
      for (const target of list) {
        await send(target._id!, msgFrom);
      }

      // send to enactor
      await send(ctx.id, msgTo);

      player.temp.lastPage = tars;
      console.log(player.temp.lastPage);
      await db.update({ _id: player._id }, player);
    },
  });
};
