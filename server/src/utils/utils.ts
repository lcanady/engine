import {
  compare,
  Context,
  Data,
  DBObj,
  flags,
  force,
  parser,
  verify,
} from "@ursamu/core";
import { channels, db } from "..";

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
    player.temp = {
      lastCommand: player.temp.lastCommand
        ? player.temp.lastCommand
        : Date.now(),
      lastPage: player.temp.lastPage ? player.temp.lastPage : "",
    };
    player.flags = tags;
  }
  await db.update({ _id: id }, player);
  player.data.channels?.forEach((chan) => {
    if (chan.joined) ctx.socket.join(chan._id);
  });

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

    var mia = dbrefs.sort().reduce(function (acc: number[], cur, ind, arr) {
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
    name = `%ch${tar.flags.includes("dark") ? "*" : ""}${parts[0]}(#${
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

export const pose = (name: string, str: String, def = "") => {
  if (str.startsWith(":")) return `${name} ${str.slice(1)}`;
  if (str.startsWith(";")) return `${name}${str.slice(1)}`;
  if (str.startsWith('"')) return `${name}, says "${str.slice(1)}"`;
  return `${name}${def ? " " + def : ""}: ${str}`;
};

export const cmsg = async (id: string, en: DBObj, msg: string) => {
  const channel = await channels.get(id);
  const entry = en.data?.channels?.find((ent) => ent._id === id);

  const header = () =>
    channel?.header ? channel.header : "%ch[" + channel?.name + "]%cn";

  if (channel && entry) {
    return `${header()} ${pose(
      (entry.title ? entry.title : "") + (entry.mask ? entry.mask : en.name),
      msg
    )}`;
  }
  return "";
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

/**
 * Break an array into spaced columns
 * @param list The array to be broken up
 * @param width The width of the overall table.
 * @param columns The number of columns.
 * @returns
 */
export const columns = (
  list: string[],
  width: number = 78,
  columns: number = 4,
  sep: string = " "
) => {
  let line = "";
  let table = "";
  let ct = -1;
  if (columns <= 1) {
    table = list
      .map((item) => {
        return (
          item + repeat(" ", width - parser.stripSubs("telnet", item).length)
        );
      })
      .join("%r");
  } else {
    for (const idx in list) {
      let cellWidth =
        Math.round(
          width / columns - parser.stripSubs("telnet", list[idx]).length
        ) -
        sep.length -
        1;

      const cell =
        list[idx] +
        repeat(" ", cellWidth) +
        `${ct++ % columns !== 0 ? sep + " " : ""}`;

      if (parser.stripSubs("telnet", line + cell).length <= width) {
        line += cell;
      } else {
        table += line + "%r";
        line = cell;
      }
    }

    table += line;
  }
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

export const header = (str: string, width: number, color: string = "b") =>
  center(`%cy<%ch<%cn%ch ${str} %cy>%cn%cy>%cn`, width, `%c${color}=%ch-%cn`);

export const headerNarrow = (str: string, width: number, color: string) =>
  center(
    `%cy<%ch<%cn%ch ${str} %cy>%cn%cy>%cn`,
    width,
    `%c${color}-%c${color}-%cn`
  );

export const idleColor = (idleTime: number) => {
  const str = idle(idleTime);
  const match = str.match(/(\d{1,3})(\w)/);
  if (match) {
    let [_, time, mark] = match;
    let currTime = parseInt(time, 10);
    if (mark === "s") return `%ch%cg${str}%cn`;
    if (mark === "m" && currTime < 15) return `%cg${str}%cn`;
    if (mark === "m" && currTime > 14 && currTime < 30)
      return `%ch%cy${str}%cn`;
    if (mark === "m" && currTime > 30) return `%ch%cr${str}%cn`;
    if (mark === "h") return `%ch%cx${str}%cn`;
  }
  return str;
};

/**
 * Return a boolean value if a player can see something.
 * @param en The action enactor
 * @param tar The action target
 * @returns
 */
export const canSee = (en: DBObj, tar: DBObj) =>
  (tar.flags.includes("dark") && flags.lvl(en.flags) >= flags.lvl(tar.flags)) ||
  (flags.check(en.flags, "staff+") && tar.flags.includes("dark")) ||
  flags.check(tar.flags, "!dark");

export const joinChans = async (ctx: Context) => {
  const chans = await channels.find({});

  for (const chan of chans) {
    const alias = chan.alias || "";
    const pchan = ctx.player?.data.channels?.find(
      (chann) => chann._id === chan._id
    );

    if (
      alias.length > 0 &&
      !pchan &&
      flags.check(ctx.player?.flags || "", chan.access || "")
    ) {
      await force(ctx, `addcom ${chan.alias}=${chan.name}`);
    }
  }
};
