import { Context, Next, send } from "@ursamu/core";
import e from "cors";
import { cmsg } from "../utils/utils";

export default async (ctx: Context, next: Next) => {
  if (ctx.player) {
    const chan = ctx.player.data.channels?.find((chan) =>
      ctx.msg?.match(new RegExp("^" + chan.alias, "i"))
    );

    if (chan) {
      let msg = ctx.msg?.split(" ");
      msg?.shift();
      let rtrn = msg?.join(" ").trim() || "";

      if (/^off$/.test(rtrn.trim()) && ctx.socket.rooms.has(chan._id)) {
        await send(
          chan._id,
          await cmsg(chan._id, ctx.player, ":has left this channel.")
        );
        return await ctx.socket.leave(chan._id);
      } else if (/^on$/.test(rtrn.trim()) && !ctx.socket.rooms.has(chan._id)) {
        await ctx.socket.join(chan._id);
        return await send(
          chan._id,
          await cmsg(chan._id, ctx.player, ":has joined this channel.")
        );
      }

      return await send(chan._id, await cmsg(chan._id, ctx.player, rtrn));
    }
  }

  next();
};
