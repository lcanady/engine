import { compare, Data, DBObj, MUSocket, sign } from "@ursamu/core";
import { db } from "../src";

export const login = async (name: string, password: string) => {
  const regex = new RegExp(name, "i");
  const player = (await db.find({ name: regex }))[0];
  if (player) {
    if (compare(password, player.password || "")) {
      return sign(player._id!, process.env.SECRET || "");
    }
  }
};

export const target = async (enactor: DBObj, tar: string) => {
  switch (tar.toLowerCase()) {
    case "me":
      return enactor;
    case "here" || "":
      return await db.get(enactor.location);
    default:
      return (
        await db.find({
          $where: function () {
            if (this.name.toLowerCase() === tar || this._id === tar) {
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
