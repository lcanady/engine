import { addCmd, send } from "@ursamu/core";
import { readFile } from "fs/promises";
import path from "path";
export default () => {
  addCmd({
    name: "motd",
    pattern: /^motd/i,
    flags: "connected",
    render: async (args, ctx) => {
      const motd = await readFile(path.join(__dirname, "../../text/motd.md"), {
        encoding: "utf-8",
      });
      send(ctx.id, motd);
    },
  });
};
