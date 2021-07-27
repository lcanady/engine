import { addCmd, addText, DB, flags, send } from "@ursamu/core";
import { db } from "..";
import { target } from "../utils/utils";
import _fetch from "node-fetch";
import { mkdir, stat, unlink, write, writeFile } from "fs/promises";
import { nanoid } from "@reduxjs/toolkit";
import { join, resolve } from "path";

export default () => {
  addCmd({
    name: "@avatar",
    pattern: /^[@\+]?av[atar]*\s+(\w+)\s*=\s*(.*)/i,
    flags: "connected",
    render: async (args, ctx) => {
      const tar = await target(ctx.player!, args[1]);
      if (tar) {
        if (
          tar.owner === ctx.player?._id ||
          flags.check(ctx.player?.flags || "", "wizard+")
        ) {
          const res = await _fetch(args[2]);

          if (res.headers.get("content-type")?.includes("image")) {
            const name = `${nanoid()}.${args[2].split(".").pop()}`;

            const filePath = `../uploads/${name}`;

            const content = await res.buffer();
            if (tar.data.avatar) {
              unlink(join(__dirname, `../uploads/${tar.data.avatar}`));
            }

            writeFile(resolve(__dirname, filePath), content, { flag: "wx" });

            tar.data.avatar = name;

            db.update({ _id: tar._id }, tar);
            send(ctx.id, `Done. ${tar.name}'s avatar image has been set! `);
          }
        } else {
          send(ctx.id, "I can't find that.");
        }
      } else {
        send(ctx.id, "I can't find that.");
      }
    },
  });
};
