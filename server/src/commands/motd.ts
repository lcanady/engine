import { addCmd, send, textDB } from "@ursamu/core";
import { readFile } from "fs/promises";
import path from "path";
export default () => {
  addCmd({
    name: "motd",
    pattern: /^motd/i,
    flags: "connected",
    render: async (args, ctx) => {
      const motd = await textDB
        .get("text")
        ?.find((file) => file.name === "motd")?.body;
      await send(ctx.id, motd!);
    },
  });
};
