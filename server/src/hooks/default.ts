import { Context, io, Next, send, textDB } from "@ursamu/core";

export default (ctx: Context, next: Next) => {
  if (!ctx.data.found && ctx.player && ctx.msg !== "")
    send(ctx.id, "Huh? Type 'help' for help.");

  if (!ctx.data.found && !ctx.player && ctx.msg !== "")
    io.to(ctx.id).emit("login");
};
