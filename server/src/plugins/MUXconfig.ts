import { DB, DBObj, flags } from "@ursamu/core";
import { db } from "..";
import { createEntity } from "../../utils/utils";

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
      name: "staff",
      code: "s",
      lvl: 5,
      lock: "wizard+",
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
  const rooms = await db.find({
    $where: function () {
      return this.flags.includes("room");
    },
  });

  if (!rooms.length) {
    const room = await createEntity("Limbo", "room");
    room.owner = room._id!;
    await db.update({ _id: room._id }, room);
  }
};
