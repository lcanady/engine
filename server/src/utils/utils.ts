import {
  compare,
  Context,
  Data,
  DBObj,
  flags,
  MUSocket,
  parser,
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

  const regex = new RegExp(
    id ? id : name?.startsWith("#") ? name.slice(1) : name,
    "i"
  );
  const player = (
    await db.find({
      $or: [{ name: regex }, { _id: regex }, { dbref: parseInt(id) }],
    })
  )[0];

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
              this.dbref === parseInt(tar.slice(1), 10) ||
              this.name
                .toLowerCase()
                .split(";")
                .find((piece: string) => piece === tar) ||
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
  const id = async () => {
    const dbrefs = (await db.find({})).map((item) => item.dbref) as number[];

    var mia = dbrefs.reduce(function (acc: number[], cur, ind, arr) {
      var diff = cur - arr[ind - 1];
      if (diff > 1) {
        var i = 1;
        while (i < diff) {
          acc.push(arr[ind - 1] + i);
          i++;
        }
      }
      return acc;
    }, []);
    return mia.length > 0 ? mia[0] : dbrefs.length;
  };

  const entity: DBObj = {
    attrs: {},
    data: {},
    dbref: await id(),
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
  const parts = tar.name.split(";");
  let name = bold ? `%ch${parts[0]}%cn` : parts[0];
  if (canEdit(en, tar) && !parts[1])
    name += `(#${tar.dbref}${flags.codes(tar.flags)})`;
  if (parts[1])
    name = `%ch${tar.flags.includes("dark") ? "* " : "  "}${parts[0]}(#${
      tar.dbref
    }${flags.codes(tar.flags)}) <%cy${parts[1].toUpperCase()}%cn%ch>%cn`;
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

export const remainder = (str: string, width: number, type = "telnet") => {
  const subsStr = parser.stripSubs(type, str).length;

  const rem = Math.round(width % width);

  let pad = "";

  if (/%c/g.test(str) && subsStr >= 2)
    pad =
      str
        .repeat(20)
        .split("%c")
        .filter(Boolean)
        .slice(0, rem)
        .map((char: string) => `%c${char}`)
        .join("") + "%cn";

  if (/%c/g.test(str) && subsStr <= 1) pad = str.repeat(rem) + "%cn";
  if (!/%c/g.test(str)) pad = str.slice(0, rem);

  // return repeat.repeat(width / reWidth);
  return pad;
};

/**
 * Repeat a string.
 * @param str The string to be releated
 * @param width Width with of the string to repeat
 * @param type The type of subs to perform defaults to 'telnet'.
 * @returns
 */
export const repeat = (str: string, width: number, type = "telnet") => {
  const reWidth: number = parser.stripSubs(type ? type : "telnet", str).length;

  const rem = Math.round(width % reWidth);

  let pad = "";

  if (/%c/g.test(str) && reWidth >= 2)
    pad =
      str
        .repeat(20)
        .split("%c")
        .filter(Boolean)
        .slice(0, rem)
        .map((char: string) => `%c${char}`)
        .join("") + "%cn";

  if (/%c/g.test(str) && reWidth <= 1) pad = str.repeat(rem) + "%cn";
  if (!/%c/g.test(str)) pad = str.slice(0, rem);

  return str.repeat(width / reWidth) + pad;
};

export const center = (str = "", width = 78, filler = " ", type = "telnet") => {
  const subWords = parser.stripSubs(type, str).length;
  const subFiller = parser.stripSubs("telnet", filler).length;
  const repWidth = width - subWords;

  return (
    repeat(filler, Math.round(repWidth / subFiller)) +
    str +
    repeat(filler, Math.floor(repWidth / subFiller))
  );
};

export const columns = (
  list: string[],
  width: number = 78,
  columns: number = 4
) => {
  let line = "";
  let table = "";
  for (const item of list) {
    const cell =
      item +
      repeat(
        " ",
        Math.round(width / columns - parser.stripSubs("telnet", item).length) -
          3
      );

    if (list.length < 2) {
      table += list.join("%r");
    } else if (parser.stripSubs("telnet", line + cell).length < width) {
      line += cell;
    } else {
      table += line + "%r";
      line = cell;
    }
  }

  table += line;
  return table;
};

/**
 * Set a flag experession on a target
 * @param tar The  target whos flags we're setting
 * @param flgs The flag expression.
 * @returns {DBObj}
 */
export const set = async (tar: DBObj, flgs: string) => {
  const { tags } = flags.set(tar.flags, {}, flgs);
  tar.flags = tags;
  await db.update({ _id: tar._id }, tar);
  return tar;
};
