import { Context, Next } from "@ursamu/core";
import { db } from "..";

export default async (ctx: Context, next: Next) => {
  if (ctx.socket.cid && !ctx.player) {
    const player = (await db.find({ _id: ctx.socket.cid }))[0];
    ctx.player = player;
  }
  next();
};
