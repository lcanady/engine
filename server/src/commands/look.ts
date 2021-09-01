import { addCmd, DBObj, send } from "@ursamu/core";
import { db } from "..";
import { idle, name, target } from "../utils/utils";

interface TextDescParts {
  tarName: string;
  desc: string;
  items: Item[];
  flags: string;
}

interface Item {
  name: string;
  id: string;
  desc: string;
  shortdesc: string;
  avatar: string;
  flags: string;
  idle: string;
}

export default () => {
  const textDesc = ({ tarName, desc, items, flags }: TextDescParts) => {
    return `${tarName}\n${desc}\n\n${
      flags.includes("room") ? "contents:" : "Carrying:"
    }\n${items
      .filter((item) => item.flags.includes("connected"))
      .map((item) => item.name)
      .join("\n")}`;
  };

  addCmd({
    name: "look",
    pattern: /^l[ook]*?(?:\s+?(.*))?/i,
    flags: "connected",
    render: async (args, ctx) => {
      let tarName = "";

      const tar = await target(ctx.player!, args[1] || "here");
      let contents: DBObj[] = [];
      if (tar) {
        tarName = name(ctx.player!, tar, true);
        contents = await db.find({ location: tar._id });
        contents = contents.filter((item) =>
          (item.flags.includes("player") && item.flags.includes("connected")) ||
          !item.flags.includes("player")
            ? true
            : false
        );
        let items: Item[] = [];
        for (let item of contents) {
          items.push({
            name: name(ctx.player!, item),
            id: item._id!,
            desc: item.description,
            shortdesc: item.data.shortdesc,
            avatar: item.data.avatar,
            flags: item.flags,
            idle: idle(item.temp.lastCommand || Date.now()),
          });
        }

        await send(
          ctx.id,
          textDesc({
            tarName,
            desc: tar.description,
            items,
            flags: tar.flags,
          })
        );

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
