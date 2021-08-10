import { addCmd, send } from "@ursamu/core";
import { msgs } from "..";

export default () => {
  addCmd({
    name: "say",
    flags: "connected",
    pattern: /^(?:s[ay]*?\s+?|")(.*)/i,
    render: async (args, ctx) => {
      await send(
        ctx.player?.location || "",
        `${ctx.player?.name} says "${args[1]}"`,
        {
          type: "say",
          name: ctx.player?.name,
          id: ctx.player?._id,
          avatar: ctx.player?.data.avatar,
        }
      );

      delete ctx.data.token;

      msgs.create({
        created: Date.now(),
        data: {
          type: "say",
          name: ctx.player?.name,
          id: ctx.player?._id,
          avatar: ctx.player?.data.avatar,
        },
        id: ctx.player?.location || "-1",
        msg: `${ctx.player?.name} says "${args[1]}"`,
      });
    },
  });
};
