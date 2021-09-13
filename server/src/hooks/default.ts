import { Context, io, send } from "@ursamu/core";

export default (ctx: Context) => {
  if (ctx.player && ctx.msg?.trim()) {
    send(ctx.id, "Huh? Type 'help' for help.");
  }

  if (!ctx.player && ctx.msg !== "") io.to(ctx.id).emit("login");
};
