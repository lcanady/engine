import { addCmd, send } from "@ursamu/core";

export default () => {
  addCmd({
    name: "print",
    pattern: /^print\s+(.*)/i,
    flags: "connected",
    render: async (args, ctx) => {
      send(ctx.id, args[1]);
    },
  });
};
