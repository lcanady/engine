import { addCmd, send } from "@ursamu/core";
import { Channel, channels } from "..";

export default () => {
  addCmd({
    name: "@ccreate",
    pattern: /^[@\+]?ccreate (.*)/i,
    flags: "connected staff+",
    render: async (args, ctx) => {
      const regex = new RegExp(args[1], "i");

      const chan = await channels.find({ name: regex });

      if (chan) return send(ctx.id, "That channel already exists.");
    },
  });
};
