import { addCmd, send } from "@ursamu/core";
import { db } from "..";
import { idle } from "../utils/utils";

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
        idle: idle(player.temp.lastCommand || Date.now()),
        doing: player.data.doing,
      }));

      send(ctx.id, "", {
        type: "who",
        list,
      });
    },
  });
};
