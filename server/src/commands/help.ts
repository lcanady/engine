import { addCmd, cmds, send, textDB } from "@ursamu/core";

export default () => {
  addCmd({
    name: "help",
    pattern: /^[\+]?help(?:\s+(.*))?/i,
    flags: "connected",
    render: async (args, ctx) => {
      const topics = cmds.map((cmd) => {
        return {
          name: cmd.name,
          help: !!textDB.get("help")?.find((text) => text.name === cmd.name),
        };
      });
      send(ctx.id, "", { type: "helpTopics", topics });
    },
  });
};
