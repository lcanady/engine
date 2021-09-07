import { Context, DBObj, force, Next, send } from "@ursamu/core";
import { db } from "..";

export default async (ctx: Context, next: Next) => {
  const contents = await db.find({ location: ctx.player?.location });
  const exits = contents
    .filter((items: DBObj) => items.flags.includes("exit"))
    .map((exit) => {
      exit.name = exit.name.replace(/;/g, "|");
      return exit;
    });

  for (const exit of exits) {
    const match = ctx.msg?.match(new RegExp(exit.name, "gi"));

    if (match && ctx.player) {
      const room = (await db.get(exit.data.to)) as DBObj;
      const room2 = (await db.get(ctx.player.location)) as DBObj;
      await send(
        ctx.player.location,
        `${ctx.player.name} leaves for %ch${room!.name}%cn`
      );
      ctx.player.location = exit.data.to;
      ctx.socket.join(ctx.player.location);
      await db.update({ _id: ctx.player._id }, ctx.player);
      await send(
        ctx.player.location,
        `${ctx.player.name} arrives from %ch${room2!.name}%cn`
      );
      return await force(ctx, "look");
    }
  }

  next();
};
