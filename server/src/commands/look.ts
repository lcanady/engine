import { addCmd, DBObj, flags, parser, send } from "@ursamu/core";
import { db } from "..";
import { center, columns, idle, name, repeat, target } from "../utils/utils";

interface TextDescParts {
  tarName: string;
  desc: string;
  items: Item[];
  flgs: string;
  width?: number;
  en: DBObj;
}

interface Item {
  name: string;
  id: string;
  desc: string;
  shortdesc: string;
  avatar: string;
  flags: string;
  idle: string;
}

export default () => {
  const charStatus = (char: Item, width: number) => {
    const match = char.idle.match(/(\d{1,3})(\w)/);
    let colorIdle = char.idle;
    let tag = "%b%b";
    if (match) {
      let [_, time, mark] = match;
      let currTime = parseInt(time, 10);
      if (mark === "s") colorIdle = `%ch%cg${colorIdle}%cn`;
      if (mark === "m" && currTime < 15) colorIdle = `%cg${colorIdle}%cn`;
      if (mark === "m" && currTime > 14 && currTime < 30)
        colorIdle = `%ch%cy${colorIdle}%cn`;
      if (mark === "m" && currTime > 30) colorIdle = `%ch%cr${colorIdle}%cn`;
      if (mark === "h") colorIdle = `%ch%cx${colorIdle}%cn`;
    }

    if (char.flags.includes("immortal")) tag = "%ch%cy*%cn%b";

    return `${tag}${
      char.name + " ".repeat(30 - parser.stripSubs("telnet", char.name).length)
    }%b${
      " ".repeat(5 - parser.stripSubs("telnet", colorIdle).length) +
      colorIdle +
      "%b"
    }${
      char.shortdesc
        ? char.shortdesc.substring(0, width - 40)
        : "%ch%cxType '+shortdesc <desc>' to set.%cn"
    }`;
  };

  const textDesc = ({
    tarName,
    desc,
    items,
    flgs,
    width = 78,
    en,
  }: TextDescParts) => {
    let rtrn =
      center(
        `%cy<%ch<%cn%ch ${tarName} %ch%cy>%cn%cy>%cn`,
        width,
        "%cb=%ch-%cn"
      ) +
      "%r%r" +
      desc +
      "%r%r";

    const chars = items.filter((item) => item.flags.includes("connected"));
    const exits = items.filter((item) => item.flags.includes("exit"));
    if (
      chars.length > 0 &&
      (!flgs.includes("dark") || flags.check(en.flags, "staff+"))
    ) {
      rtrn +=
        center(
          `%cy<%ch<%cn%ch Characters %cy>%cn%cy>%cn`,
          width,
          "%cb-%cb-%cn"
        ) +
        "%r" +
        items
          .filter((item) => item.flags.includes("connected"))
          .map((char) => charStatus(char, width))
          .join("%r") +
        "%r";
    }

    if (
      exits.length > 0 &&
      (!flgs.includes("dark") || flags.check(en.flags, "staff+"))
    ) {
      const exitNames = exits.map((exit) => exit.name);
      rtrn +=
        center(`%cy<%ch<%cn%ch Exits %cy>%cn%cy>%cn`, width, "%cb-%cb-%cn") +
        "%r" +
        columns(exitNames, width, 2) +
        "%r";
    }

    rtrn += repeat("%cb=%ch-%cn", width);
    return rtrn;
  };

  addCmd({
    name: "look",
    pattern: /^l[ook]*?(?:\s+?(.*))?/i,
    flags: "connected",
    render: async (args, ctx) => {
      let tarName = "";

      const tar = await target(ctx.player!, args[1] || "here");
      let contents: DBObj[] = [];
      if (tar) {
        tarName = name(ctx.player!, tar, true);
        contents = await db.find({ location: tar._id });
        contents = contents.filter((item) =>
          (item.flags.includes("player") && item.flags.includes("connected")) ||
          !item.flags.includes("player")
            ? true
            : false
        );
        let items: Item[] = [];
        for (let item of contents) {
          items.push({
            name: name(ctx.player!, item),
            id: item._id!,
            desc: item.description,
            shortdesc: item.data.shortdesc,
            avatar: item.data.avatar,
            flags: item.flags,
            idle: idle(item.temp.lastCommand || Date.now()),
          });
        }

        await send(
          ctx.id,
          textDesc({
            tarName,
            desc: tar.description,
            items,
            flgs: tar.flags,
            width: ctx.data.width,
            en: ctx.player!,
          }),
          {
            type: "look",
            desc: tar.description,
            name: name(ctx.player!, tar),
            avatar: tar.data.avatar,
            items,
            flags: tar.flags,
          }
        );
      } else {
        await send(ctx.id, "I don't see that here.");
      }
    },
  });
};
