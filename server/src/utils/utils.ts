import {
  broadcastTo,
  compare,
  conns,
  Context,
  Data,
  DBObj,
  flags,
  MUSocket,
  send,
  sign,
  verify,
} from "@ursamu/core";
import { db } from "..";

interface LoginOptions {
  name?: string;
  password?: string;
  token?: string;
}

export const login = async (
  ctx: Context,
  { name, password, token }: LoginOptions
) => {
  const id = token
    ? (await verify(token || "", process.env.SECRET || "")).id || ""
    : "";

  const regex = new RegExp(id ? id : name, "i");
  const player = (await db.find({ $or: [{ name: regex }, { _id: regex }] }))[0];

  if (player && !id) {
    if ((await compare(password || "", player.password || "")) || id) {
      const { tags } = flags.set(player.flags, {}, "connected");
      player.temp = {};
      player.flags = tags;
    }
  } else if (id) {
    const { tags } = flags.set(player.flags, {}, "connected");
    player.temp = {};
    player.flags = tags;
  } else {
    await send(ctx.id, "Permission denied");
  }
  await db.update({ _id: id }, player);
  return player;
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
            if (
              this.name.toLowerCase() === tar ||
              this._id === tar ||
              this.alias?.toLowerCase() === tar
            ) {
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

export const andList = (list: string[]) => {
  const last = list.pop() || "";
  const commas = list.join(",");
  return `${commas}${commas ? "and" : ""}${last}`;
};
