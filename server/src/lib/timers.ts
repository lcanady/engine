import { broadcastTo, conns, flags, Tick } from "@ursamu/core";
import { db } from "..";

setInterval(async () => {
  const players = await db.find({
    $where: function () {
      return this.flags.includes("player");
    },
  });

  if (players) {
    for (const player of players) {
      const diff = Math.round(
        (Date.now() - player.temp.lastCommand || Date.now()) / (1000 * 3600)
      );

      const conn = conns.find((conn) => conn.cid === player._id);

      if (
        diff &&
        player.temp.lastCommand &&
        !conn &&
        player.flags.includes("connected")
      ) {
        const { tags } = flags.set(player.flags, {}, "!connected");
        player.flags = tags;
        player.temp = {};
        db.update({ _id: player._id }, player);
        broadcastTo(player.location, `${player.name} has disconnected.`);
      }
    }
  }
}, 60000);
