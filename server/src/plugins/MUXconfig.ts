import { createEntity, DB, DBObj, flags } from "@ursamu/core";
import { config } from "..";

export default async () => {
  flags.add(
    {
      name: "immortal",
      code: "i",
      lvl: 10,
      lock: "immortal",
    },
    {
      name: "wizard",
      code: "w",
      lvl: 9,
      lock: "immortal",
    },
    {
      name: "player",
      code: "p",
      lvl: 0,
      lock: "wizard+",
    },
    {
      name: "room",
      code: "r",
      lvl: 0,
      lock: "wizard+",
    },
    {
      name: "connected",
      code: "c",
      lvl: 0,
      lock: "wizard+",
    }
  );

  // Make sure initial room has been created.  Should only fire at first creation of db file.
  const rooms = await DB.dbs.db.find<DBObj>({
    $where: function () {
      return this.flags.includes("room");
    },
  });

  if (!rooms.length) {
    const room = await createEntity("", "Limbo", "room");
    room.owner = room._id!;
    await DB.dbs.db.update({ _id: room._id }, room);
  }
};
