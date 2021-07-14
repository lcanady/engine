import {
  compare,
  Data,
  DBObj,
  flags,
  MUSocket,
  send,
  sign,
} from "@ursamu/core";
import { db } from "../src";

export const login = async (
  socket: MUSocket,
  name: string,
  password: string
) => {
  const regex = new RegExp(name, "i");
  const player = (await db.find({ name: regex }))[0];
  if (player) {
    if (compare(password, player.password || "")) {
      socket.cid = player._id;
      const { tags } = flags.set(player.flags, {}, "connected");
      player.flags = tags.trim();
      await db.update({ _id: player._id }, player);
      socket.join(player._id!);
      socket.join(player.location);
      player.data.channels?.forEach((channel: string) => socket.join(channel));
      await send(socket.id, "", {
        type: "self",
        id: player._id,
        flags: player.flags,
      });
      return sign(player._id!, process.env.SECRET || "");
    }
  }
};

export const target = async (enactor: DBObj, tar: string) => {
  switch (tar.toLowerCase().trim()) {
    case "me":
      return enactor;
    case "here" || "":
      return await db.get(enactor.location);
    default:
      return (
        await db.find({
          $where: function () {
            if (this.name.toLowerCase() === tar.trim() || this._id === tar) {
              return true;
            }
            return false;
          },
        })
      )[0];
  }
};

export const createEntity = async (
  name: string,
  flags: string = "",
  data: Data = {}
) => {
  const entity: DBObj = {
    attrs: {},
    data: {},
    description: "You see nothing special",
    flags,
    location: "",
    name,
    owner: "",
    temp: {},
    ...data,
  };

  return await db.create(entity);
};

export const join = (socket: MUSocket, tar: DBObj) => {
  // Join channels
  socket.join(tar.location);
  socket.join(tar._id!);
  tar.data.channels?.forEach((channel: string) => socket.join(channel));
};

export const canEdit = (en: DBObj, tar: DBObj) => {
  return (
    tar.owner === en._id ||
    flags.check(en.flags, "wizard+") ||
    tar._id === en._id
  );
};

export const name = (en: DBObj, tar: DBObj, bold = false) => {
  let name = bold ? `**${tar.name}**` : tar.name;
  if (canEdit(en, tar)) name += `(${tar._id}-${flags.codes(tar.flags)})`;
  return name;
};
