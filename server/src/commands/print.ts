import { addCmd, parser, send } from "@ursamu/core";

export default () => {
  addCmd({
    name: "print",
    pattern: /^(?:print|th[ink]*)\s+(.*)/i,
    flags: "connected",
    render: async (args, ctx) => {
      await send(
        ctx.id,
        (await parser.run({ data: ctx.data, msg: args[1], scope: {} })) || ""
      );
    },
  });
};
