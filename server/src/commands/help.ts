import { addCmd, cmds, send, textDB } from "@ursamu/core";
import e from "cors";

export default () => {
  addCmd({
    name: "help",
    pattern: /^[\+]?help(?:\s+(.*))?/i,
    flags: "connected",
    render: async (args, ctx) => {
      if (args[1]) {
        const help = textDB
          .get("help")
          ?.find((text) => text.name === args[1].toLowerCase());
        if (help) {
          send(ctx.id, "", {
            type: "helpTopic",
            help: {
              title: help.name,
              category: help.category,
              body: help.body,
            },
          });
        } else {
          send(ctx.id, "I can't find help on that topic.");
        }
      } else {
        const topics = cmds.map((cmd) => {
          return {
            name: cmd.name,
            help: !!textDB.get("help")?.find((text) => text.name === cmd.name),
          };
        });
        send(ctx.id, "", { type: "helpTopics", topics });
      }
    },
  });
};
