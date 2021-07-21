import { addCmd, DBObj, flags, send } from "@ursamu/core";
import { db } from "..";
import { canEdit, idle, name, target } from "../../utils/utils";

export default () => {
  addCmd({
    name: "look",
    pattern: /^l[ook]*?(?:\s+?(.*))?/i,
    flags: "connected",
    render: async (args, ctx) => {
      let desc = "";
      let tarName = "";

      const tar = await target(ctx.player!, args[1] || "here");
      let contents: DBObj[] = [];
      if (tar) {
        tarName = name(ctx.player!, tar, true) + "\n\n";
        contents = await db.find({ location: tar._id });
        contents = contents.filter((item) =>
          (item.flags.includes("player") && item.flags.includes("connected")) ||
          !item.flags.includes("player")
            ? true
            : false
        );
        let items = [];
        for (let item of contents) {
          items.push({
            name: name(ctx.player!, item),
            id: item._id,
            desc: item.description,
            shortdesc: item.data.shortdesc,
            avatar: item.data.avatar,
            flags: item.flags,
            idle: idle(item.temp.lastCommand),
          });
        }

        await send(ctx.id, "", {
          type: "look",
          desc: tar.description,
          name: name(ctx.player!, tar),
          avatar: tar.data.avatar,
          items,
          flags: tar.flags,
        });
      } else {
        await send(ctx.id, "I don't see that here.");
      }
    },
  });
};
