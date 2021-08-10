import { Context, io, Next, send, verify } from "@ursamu/core";
import { db } from "..";
import { login } from "../utils/utils";

export default async (ctx: Context, next: Next) => {
  if (ctx.data.token && !ctx.socket.cid) {
    if (!(await login(ctx.socket, { token: ctx.data.token }))) {
      io.to(ctx.socket.id).emit("login");
    }
  } else if (!ctx.socket.cid && !ctx.data.found) {
    io.to(ctx.socket.id).emit("login");
  }

  if (ctx.socket.cid && !ctx.player) {
    const player = (await db.find({ _id: ctx.socket.cid }))[0];
    ctx.player = player;
  }
  next();
};
