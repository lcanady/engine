import { Context, DB, DBObj, Next } from "@ursamu/core";

export default async (ctx: Context, next: Next) => {
  if (ctx.socket.cid && !ctx.player) {
    const player = (await DB.dbs.db.find<DBObj>({ _id: ctx.socket.cid }))[0];
    ctx.player = player;
  }
  next();
};
