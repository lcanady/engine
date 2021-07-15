import { addCmd, send } from "@ursamu/core";
import { db } from "..";
import { name } from "../../utils/utils";

export default () => {
  addCmd({
    name: "@update",
    pattern: /^@update/,
    flags: "connected",

    render: async (args, ctx) => {
      let contents = await db.find({ location: ctx.player!.location });

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
          idle: item.temp.lastCommand,
        });
      }

      await send(ctx.id, "", {
        type: "contents",
        contents: items,
        noUpdate: true,
      });
    },
  });
};
