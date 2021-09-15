import { parser } from "@ursamu/core";

export default () => {
  parser.add("width", async (args, data) => {
    return data.width || 78;
  });

  /**
   * Repeat a string.
   * SYNTAX: repeat(<string> [,width])
   */
  parser.add("repeat", async (args, data) => {
    const width = parseInt(args[1]) || 78;
    const repeat = args[0] || " ";
    const reWidth = parser.stripSubs(
      data.type ? data.type : "telnet",
      repeat
    ).length;

    const rem = Math.round(width % reWidth);

    let pad = "";

    if (/%c/g.test(repeat) && reWidth >= 2)
      pad =
        repeat
          .repeat(20)
          .split("%c")
          .filter(Boolean)
          .slice(0, rem)
          .map((char: string) => `%c${char}`)
          .join("") + "%cn";

    if (/%c/g.test(repeat) && reWidth <= 1) pad = repeat.repeat(rem) + "%cn";
    if (!/%c/g.test(repeat)) pad = repeat.slice(0, rem);

    // return repeat.repeat(width / reWidth);
    return repeat.repeat(width / reWidth) + pad;
  });

  parser.add("center", async (args, data) => {
    const words = args[0] || "";
    const width = parseInt(args[1]) || 78;
    const filler = args[2] || " ";
    const subWords = parser.stripSubs("telnet", words).length;

    const subFiller = parser.stripSubs("telnet", filler).length;

    const adjWidth = Math.floor((width - subWords) / 2);
    const repWidth = Math.floor(adjWidth / subFiller);
    const rem = Math.round(width % (adjWidth * 2 + subWords));
    let pad = "";

    if (/%c/g.test(filler) && subFiller >= 2)
      pad =
        filler
          .repeat(20)
          .split("%c")
          .filter(Boolean)
          .slice(0, rem)
          .map((char: string) => `%c${char}`)
          .join("") + "%cn";

    if (/%c/g.test(filler) && subFiller <= 1) pad = filler.repeat(rem) + "%cn";
    if (!/%c/g.test(filler)) pad = filler.slice(0, rem);

    // return filler.filler(width / subFiller);
    return filler.repeat(repWidth) + words + filler.repeat(repWidth) + pad;
  });

  parser.add("ljust", async (args, data) => {
    const words = args[0] || "";
    const width = parseInt(args[1]) || 78;
    const filler = args[2] || " ";
    const subWords = parser.stripSubs("telnet", words).length;

    const subFiller = parser.stripSubs("telnet", filler).length;

    const adjWidth = Math.floor(width - subWords);
    const repWidth = Math.floor(adjWidth / subFiller);
    const rem = Math.round(width % (adjWidth + subWords));
    let pad = "";

    if (/%c/g.test(filler) && subFiller >= 2)
      pad =
        filler
          .repeat(20)
          .split("%c")
          .filter(Boolean)
          .slice(0, rem)
          .map((char: string) => `%c${char}`)
          .join("") + "%cn";

    if (/%c/g.test(filler) && subFiller <= 1) pad = filler.repeat(rem) + "%cn";
    if (!/%c/g.test(filler)) pad = filler.slice(0, rem);

    // return filler.filler(width / subFiller);
    return words + filler.repeat(repWidth) + pad;
  });

  parser.add("rjust", async (args, data) => {
    const words = args[0] || "";
    const width = parseInt(args[1]) || 78;
    const filler = args[2] || " ";
    const subWords = parser.stripSubs(
      data.type ? data.type : "telnet",
      words
    ).length;

    const subFiller = parser.stripSubs(
      data.type ? data.type : "telnet",
      filler
    ).length;

    const adjWidth = Math.floor(width - subWords);
    const repWidth = Math.floor(adjWidth / subFiller);
    const rem = Math.round(width % (adjWidth + subWords));
    let pad = "";

    if (/%c/g.test(filler) && subFiller >= 2)
      pad =
        filler
          .repeat(20)
          .split("%c")
          .slice(0, rem)
          .map((char: string) => `%c${char}`)
          .join("") + "%cn";

    if (/%c/g.test(filler) && subFiller <= 1) pad = filler.repeat(rem) + "%cn";
    if (!/%c/g.test(filler)) pad = filler.slice(0, rem);

    // return filler.filler(width / subFiller);
    return pad + filler.repeat(repWidth) + words;
  });
};
