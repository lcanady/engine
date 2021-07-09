import { addCmd, broadcast } from "@ursamu/core";

export default () =>
  addCmd({
    name: "reboot",
    pattern: /^@reboot/i,
    flags: "connected wizard+",
    render: async (args, ctx) => {
      await broadcast(
        `**Game:** Reboot initiated by ${ctx.player?.name}.  Please hold!`
      );
      process.exit(0);
    },
  });
