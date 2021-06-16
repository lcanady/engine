import { addCmd, broadcast } from "@ursamu/core";
import { spawn } from "child_process";

export default () =>
  addCmd({
    name: "reboot",
    pattern: /^@reboot/i,
    flags: "connected wizard+",
    render: async (args, ctx) => {
      broadcast(
        `**Game:** Reboot initiated by ${ctx.player?.name}.  Please hold!`
      );
    },
  });
