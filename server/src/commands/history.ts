import { addCmd, send } from "@ursamu/core";
import { msgs } from "..";

export default () => {
  addCmd({
    name: "history",
    pattern: /^[\+@]?history(?:\/(\w+))?(?:\s+(\d+))?/i,
    flags: "connected",
    render: async (args, ctx) => {
      let msgList = (await msgs.find({ id: ctx.player?.location })) || [];
      let length = 0;

      if (args[1] && args[1].toLowerCase() === "all") {
        length = msgList.length;
      } else {
        length =
          parseInt(args[2] || "0", 10) <= msgList.length
            ? parseInt(args[2], 10)
            : msgList.length;
      }

      msgList = msgList.sort((a, b) => a.created - b.created);

      for (let msg of msgList) {
        await send(ctx.id, msg.msg, msg.data);
      }
    },
  });
};
