import { addCmd, send } from "@ursamu/core";

export default () => {
  addCmd({
    name: "pose",
    pattern: /^(pose\s+|:|;)(.*)/i,
    flags: "connected",
    render: async (args, ctx) => {
      switch (args[1].toLowerCase().trim()) {
        case "pose":
          return send(
            ctx.player?.location || "",
            ctx.player?.name + " " + args[2]
          );
        case ":":
          return send(
            ctx.player?.location || "",
            `${ctx.player?.name} ${args[2]}`
          );
        case ";":
          return send(
            ctx.player?.location || "",
            `${ctx.player?.name}${args[2]}`
          );
      }
    },
  });
};
