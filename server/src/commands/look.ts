import { addCmd, DBObj, flags, send } from "@ursamu/core";
import { db } from "..";
import { canEdit, name, target } from "../../utils/utils";

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
        tarName = name(ctx.player!, tar, true) + "\n\n-----\n\n";
        contents = await db.find({ location: tar._id });

        desc += tarName;
        desc += `\n\n${tar.description}`;
        if (contents.length) {
          desc += tar.flags.includes("room")
            ? "\n\nContents:"
            : "\n\nCarrying:";
          desc += contents
            .map((item) => "\n\n" + name(ctx.player!, item))
            .join("");
        }
      } else {
        desc = "I can't find that here.";
      }

      send(ctx.id, desc + "\n\n", {
        type: "look",
        avatar: tar?.data.avatar || "",
      });
    },
  });
};
