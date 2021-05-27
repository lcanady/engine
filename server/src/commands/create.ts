import { addCmd, login, send } from "@ursamu/core";

addCmd({
  name: "create",
  pattern: "",
  render: async (args, ctx) => {
    const token = await login(ctx.socket, args[1], args[2]);
    send(ctx.id, "Welcome to the game!", { token });
  },
});
