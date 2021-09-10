import {
  addCmd,
  conns,
  flags,
  force,
  hash,
  io,
  send,
  sign,
} from "@ursamu/core";
import { config, db } from "..";
import { createEntity, login } from "../utils/utils";

export default () => {
  addCmd({
    name: "create",
    pattern: /^create\s+(\w+)\s+(\w+)/i,
    flags: "!conencted",
    render: async (args, ctx) => {
      // Look for players that have the same name.
      const taken = await db.find({
        $where: function () {
          return (
            this.flags.includes("player") &&
            this.name.toLowerCase() === args[1].toLowerCase()
          );
        },
      });

      if (!taken.length) {
        const name = new RegExp(config.get("startingRoom") || "Limbo", "i");
        const objs = await db.find({});
        const room =
          objs.find((obj) => name.test(obj.name)) ||
          (await createEntity("Limbo", "room"));
        const players = objs.find((obj) => obj.flags.includes("player"));
        const pwd = await hash(args[2]);
        // Create a new entity.
        let player = await createEntity(
          args[1],
          players ? "player" : "player immortal",
          {
            password: pwd,
            location: room?._id,
          }
        );

        // update the owner of the character to itsself.
        player.owner = player._id || "";
        await db.update({ id: player._id }, player);

        // Log the new player in and fire off some beginning commands!
        player = await login(ctx, { name: args[1], password: args[2] });
        ctx.socket.cid = player?._id;
        ctx.player = player;
        ctx.socket.join(player?._id || "");
        ctx.socket.join(player?.location || "");

        const token = await sign(player?._id!, process.env.SECRET || "").catch(
          (err) => console.log(err)
        );

        const conn = conns.find((conn) => conn.id === ctx.id);
        if (!conn) conns.push(ctx.socket);

        io.to(player.location).emit("login", player);
        await send(ctx.socket.id, "", {
          type: "self",
          id: player?._id,
          flags: player?.flags,
          token,
        });
        await force(ctx, "motd");
        await force(ctx, "look");
      } else {
        await send(ctx.id, "That name is already taken or unavailable.");
      }
    },
  });
};
