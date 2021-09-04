import { addCmd, cmds, parser, send, textDB } from "@ursamu/core";
import e from "cors";
import { center, columns, repeat } from "../utils/utils";

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
          let topic =
            "%r" +
            center(
              `%cy<%ch<%cn%ch HELP ${help.name.toUpperCase()} %cy>%cn%cy>%cn`,
              ctx.data.width,
              "%cr=%ch-%cn"
            ) +
            "%r%r";

          topic += help.body + "%r";
          topic += repeat("%cr=%ch-%cn", ctx.data.width) + "%r";

          send(ctx.id, topic, {
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

        let help =
          "%r" +
          center(
            "%cy<%ch<%cn%ch HELP %cy>%cn%cy>%cn",
            ctx.data.width,
            "%cr=%ch-%cn"
          ) +
          "%r%r";

        const topicList = topics.map((topic) =>
          topic.help ? `${topic.name}` : `%ch%cr${topic.name}%cn`
        );
        help += "Help is available for the following topics:%r%r";
        help += columns(topicList, ctx.data.width, 4) + "%r";
        help += repeat("%cr=%ch-%cn", ctx.data.width) + "%r%r";
        help += "Type '%chhelp <topic>%cn' for more help.%r";

        await send(ctx.id, help, { type: "helpTopics", topics });
      }
    },
  });
};
