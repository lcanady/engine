import { Context, Next, send } from "@ursamu/core";
import { cmsg } from "../utils/utils";

export default async (ctx: Context, next: Next) => {
  if (ctx.player) {
    const chan = ctx.player.data.channels?.find((chan) =>
      ctx.msg?.match(new RegExp(chan.alias, "i"))
    );

    if (chan) {
      let msg = ctx.msg?.split(" ");
      msg?.shift();
      let rtrn = msg?.join(" ").trim() || "";

      return await send(chan._id, await cmsg(chan._id, ctx.player, rtrn));
    }
  }

  next();
};
