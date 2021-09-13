import { addCmd, parser, send } from "@ursamu/core";
import { db } from "..";
import {
  canSee,
  center,
  header,
  idleColor,
  name,
  repeat,
} from "../utils/utils";

export default () => {
  addCmd({
    name: "who",
    pattern: /^who/i,
    flags: "connected",
    render: async (args, ctx) => {
      const players = await db.find({
        $where: function () {
          return this.flags.includes("connected");
        },
      });

      const list = players.map((player) => ({
        name: player.name,
        idle: idleColor(ctx.player?.temp.lastCommand),
        doing: player.data.doing,
      }));

      let output = header("Online Characters", ctx.data.width);
      output +=
        "%r" +
        "  NAME".padEnd(26) +
        "ALIAS".padEnd(11) +
        "IDLE".padEnd(11) +
        "DOING %ch%cx(use: @doing <message> to set.)%cn%r" +
        repeat("%cb--%cn", ctx.data.width) +
        "%r";
      output +=
        players
          .filter((player) => canSee(ctx.player!, player))
          .map((target) => {
            const doing = target.data.doing || "";
            const alias = target.alias || "";
            let tag = "  ";
            if (target.flags.includes("immortal")) tag = "%ch%cy*%cn%b";
            return (
              tag +
              name(ctx.player!, target).substr(0, 23) +
              repeat(
                " ",
                23 -
                  parser.stripSubs("telnet", name(ctx.player!, target)).length
              ) +
              "%b" +
              alias.substr(0, 10).padEnd(10) +
              "%b" +
              idleColor(target.temp.lastCommand) +
              repeat(
                " ",
                10 -
                  parser.stripSubs("telnet", idleColor(target.temp.lastCommand))
                    .length
              ) +
              "%b" +
              doing.substr(
                0,
                ctx.data.width - 50 - parser.stripSubs("telnet", doing).length
              )
            );
          })
          .join("%r") +
        "%r" +
        repeat("%cb--%cn", ctx.data.width) +
        "%r" +
        center(
          `%ch${
            players.filter((player) => canSee(ctx.player!, player)).length
          }%cn visible players online.`,
          ctx.data.width,
          "  "
        ) +
        "%r" +
        repeat("%cb=%ch-%cn", ctx.data.width);

      send(ctx.id, output, {
        type: "who",
        list,
      });
    },
  });
};
