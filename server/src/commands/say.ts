import { addCmd, send } from "@ursamu/core";

export default () => {
  addCmd({
    name: "say",
    flags: "connected",
    pattern: /^(?:s[ay]*?\s+?|")([\s\S]+)/i,
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
    },
  });
};
