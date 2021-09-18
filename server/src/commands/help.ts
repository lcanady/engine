import { addCmd, cmds, parser, send, textDB } from "@ursamu/core";
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

          topic += help.body.trim() + "%r%r";
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
          const entry = textDB
            .get("help")
            ?.find((text) => text.name === cmd.name);
          return {
            name: cmd.name,
            help: !!entry,
            category: entry?.category ? entry.category : "misc",
            visible: !cmd.hidden,
            desc: entry?.desc ? entry.desc : "",
          };
        });

        const files =
          textDB
            .get("help")
            ?.filter((file) => !cmds.find((cmd) => cmd.name === file.name))
            .map((file) => ({
              name: file.name,
              help: true,
              category: file?.category ? file.category : "misc",
              visible: file?.visible,
              desc: file?.desc || "",
            })) || [];
        const combined = [...files, ...topics];

        const totalTopics = combined
          .map((top) => (top.help ? top.name : `%ch%cr${top.name}%cn`))
          .sort((a, b) =>
            parser
              .stripSubs("telnet", a)
              .localeCompare(parser.stripSubs("telnet", b))
          );
        const categories = [
          ...new Set(combined.map((top) => top.category)),
        ].sort((a, b) => a.localeCompare(b));

        let help =
          "%r" +
          center(
            "%cy<%ch<%cn%ch HELP %cy>%cn%cy>%cn",
            ctx.data.width,
            "%cr=%ch-%cn"
          ) +
          "%r%rHelp is available for the following topics:%r%r";

        for (const cat of categories) {
          help += center(
            `%cy<%ch<%cn%ch ${cat} %cy>%cn%cy>%cn`,
            ctx.data.width,
            "%cr-%cr-%cn"
          );
          help +=
            "%r" +
            columns(
              combined
                .filter((topic) => topic.category === cat && topic.visible)
                .map((itm) => {
                  const width =
                    Math.floor(
                      ctx.data.width / (ctx.data.width >= 78 ? 2 : 1)
                    ) - (ctx.data.width >= 78 ? 2 : 0);
                  let output = itm.help
                    ? `%ch${itm.name.toUpperCase()}%cn`
                    : `%ch%cr${itm.name.toUpperCase()}%cn `;

                  output =
                    output +
                    ".".repeat(15 - parser.stripSubs("telnet", output).length);
                  output += itm.desc
                    ? itm.desc.substr(0, width - 15)
                    : ".".repeat(width - 15);
                  return output;
                }),
              ctx.data.width,
              ctx.data.width >= 78 ? 2 : 1,
              "|"
            ) +
            "%r";
        }
        help += "%rType '%chhelp <topic>%cn' for more help.%r";
        help += repeat("%cr=%ch-%cn", ctx.data.width);

        await send(ctx.id, help, { type: "helpTopics", topics });
      }
    },
  });
};
