import { addCmd, DBObj, send } from "@ursamu/core";
import { db } from "..";
import { createEntity, name } from "../utils/utils";

export default () => {
  addCmd({
    name: "@dig",
    flags: "staff+|builder",
    pattern: /^@dig(?:\/(\w+))?\s+(.*)\s*=\s*([^\,]+)(?:,(.*))?/i,
    render: async (args, ctx) => {
      let toRoom: DBObj, toExit: DBObj, fromExit: DBObj;
      let fromRoom: DBObj | void = await db.get(ctx.player?.location || "");

      // Create the new room.
      toRoom = await createEntity(args[2], "room", { owner: ctx.player?._id });
      send(
        ctx.id,
        `Done. New room created: %ch${name(ctx.player!, toRoom)}%cn`
      );

      if (args[3]) {
        toExit = await createEntity(args[3], "exit", {
          owner: ctx.player?._id,
          location: ctx.player?.location,
          data: {
            to: toRoom._id,
          },
        });
        send(
          ctx.id,
          `Done. New exit: %ch${name(
            ctx.player!,
            toExit
          )}%cn linked to: %ch${name(ctx.player!, toRoom)}%cn`
        );
      }

      if (args[4]) {
        fromExit = await createEntity(args[4], "exit", {
          owner: ctx.player?._id,
          data: {
            to: ctx.player?.location,
          },
          location: toRoom?._id,
        });
        send(
          ctx.id,
          `Done. New exit: %ch${name(
            ctx.player!,
            fromExit
          )}%cn linked to: %ch${name(ctx.player!, fromRoom!)}%cn`
        );
      }
    },
  });
};
