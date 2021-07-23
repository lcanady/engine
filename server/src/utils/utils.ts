import {
  broadcastTo,
  compare,
  Data,
  DBObj,
  flags,
  MUSocket,
  send,
  sign,
} from "@ursamu/core";
import { db } from "..";

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
      player.temp = {};
      await db.update({ _id: player._id }, player);
      broadcastTo(player.location, `${player.name} has conencted.`, {
        type: "connect",
        id: player._id,
        name: player.name,
        flags: player.flags,
      });
      socket.join(player._id!);
      socket.join(player.location);
      player.data.channels?.forEach((channel: string) => socket.join(channel));
      await send(socket.id, "", {
        type: "self",
        id: player._id,
        flags: player.flags,
      });
    }
  }
  return {
    token: await sign(player._id!, process.env.SECRET || ""),
    player,
  };
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

export const dbObj = async (
  tar: string,
  flgs: string = "",
  data: Data = {}
) => {
  const player = (
    await db.find({
      $where: function () {
        if (this.name.toLowerCase() === tar.trim() || this._id === tar) {
          return true;
        }
        return false;
      },
    })
  )[0];

  const { tags } = flags.set(player.flags, {}, flgs || "");
  player.flags = tags;
  player.data = { ...player.data, ...data };
  await db.update({ _id: player._id }, player);
  return player;
};

export const idle = (secs: number) => {
  const curr = Date.now();
  const past = secs;
  secs = Math.floor((curr - secs) / 1000);
  const mins = Math.floor((curr - past) / (1000 * 60));
  const hrs = Math.floor((curr - past) / (1000 * 60 * 60));

  if (hrs) return hrs + "h";
  if (mins) return mins + "m";
  return secs + "s";
};
