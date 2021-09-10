import { addCmd, send, textDB } from "@ursamu/core";
import { center, repeat } from "../utils/utils";
export default () => {
  addCmd({
    name: "motd",
    pattern: /^motd/i,
    flags: "connected",
    render: async (args, ctx) => {
      const motd = await textDB
        .get("text")
        ?.find((file) => file.name === "motd")?.body;
      let display =
        center(
          "%cy<%ch<%cn%ch Message Of the Day%cn %ch%cy>%cn%cy>%cn",
          ctx.data.width,
          "%cr=%ch-%cn"
        ) +
        "%r" +
        motd +
        repeat("%cr=%ch-%cn", ctx.data.width || 78);
      await send(ctx.id, display!);
    },
  });
};
