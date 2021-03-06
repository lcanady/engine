import { conns, Context, Next, send, sign, verify } from "@ursamu/core";
import { login } from "../utils/utils";

export default async (ctx: Context, next: Next) => {
  if (ctx.data.token) {
    const player = await login(ctx, { token: ctx.data.token });
    ctx.socket.cid = player?._id;
    ctx.player = player;
    ctx.socket.join(player?._id || "");
    ctx.socket.join(player?.location || "");

    const conn = conns.find((conn) => conn.id === ctx.id);
    if (!conn) conns.push(ctx.socket);

    const token = await sign(ctx.player._id!, process.env.SECRET || "");
    await send(ctx.id, "", { token });
  }

  next();
};
