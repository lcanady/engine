import { config, db } from "..";
import { createEntity } from "../utils/utils";

export default async () => {
  // Make sure initial room has been created.  Should only fire at first creation of db file.
  const items = await db.find({});
  const rooms = items.filter((item) => item.flags.includes("room"));
  const players = items.filter((item) => item.flags.includes("player"));
  if (players) config.set("superuser", false);

  if (!rooms.length) {
    const room = await createEntity("Limbo", "room");
    room.owner = room._id!;
    await db.update({ _id: room._id }, room);
  }
};
