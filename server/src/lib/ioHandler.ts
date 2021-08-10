import { Context, io, MUSocket, remConn } from "@ursamu/core";
import { login } from "../utils/utils";

io.on("connect", (socket: MUSocket) => {
  socket.on("message", async (ctx: Context) => {
    if (ctx.data.token && !socket.cid) {
      if (!(await login(ctx.socket, { token: ctx.data.token }))) {
        io.to(socket.id).emit("login");
      }
    } else if (!socket.cid && !ctx.data.found) {
      io.to(socket.id).emit("login");
    }
    socket.on("disconnect", () => remConn(socket.cid || ""));
  });
});
