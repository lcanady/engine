import { addCmd, send } from "@ursamu/core";
import { msgs } from "..";

export default () => {
  addCmd({
    name: "pose",
    pattern: /^(pose\s+|:|;)([\s\S]+)/i,
    flags: "connected",
    render: async (args, ctx) => {
      let msg = "";
      switch (args[1].toLowerCase().trim()) {
        case "pose":
          msg = ctx.player?.name + " " + args[2];
          break;
        case ":":
          msg = `${ctx.player?.name} ${args[2]}`;
          break;
        case ";":
          msg = `${ctx.player?.name}${args[2]}`;
          break;
      }

      send(ctx.player?.location || "", msg, {
        type: "pose",
        name: ctx.player?.name,
        id: ctx.player?._id,
        avatar: ctx.player?.data.avatar,
      });

      delete ctx.data.token;

      msgs.create({
        created: Date.now(),
        data: {
          type: "pose",
          name: ctx.player?.name,
          id: ctx.player?._id,
          avatar: ctx.player?.data.avatar,
        },
        id: ctx.player?.location || "-1",
        msg: msg,
      });
    },
  });
};
