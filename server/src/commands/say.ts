import { addCmd, send } from "@ursamu/core";

export default () => {
  addCmd({
    name: "say",
    flags: "connected",
    pattern: /^(?:s[ay]*?\s+?|")(.*)/i,
    render: async (args, ctx) => {
      await send(
        ctx.player?.location || "",
        `${ctx.player?.name} says "${args[1]}"`
      );
    },
  });
};
