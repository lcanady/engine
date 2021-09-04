const telnetlib = require("telnetlib");
const { io } = require("socket.io-client");
const env = require("dotenv");
const { nanoid } = require("@reduxjs/toolkit");
const { readFile } = require("fs/promises");
const { join } = require("path");

env.config();

const { NAWS } = telnetlib.options;
const server = telnetlib.createServer(
  {
    localOptions: [NAWS],
    remoteOptions: [NAWS],
  },
  async (c) => {
    const s = new io("http://localhost:4201", { transports: ["websocket"] });
    const naws = c.getOption(NAWS);
    let token;
    naws.on("resize", (data) => {
      c.width = data.width;
      c.height = data.height;
    });
    c.id = nanoid();

    const connect = await readFile(join(__dirname, "../text/connect.txt"), {
      encoding: "utf8",
    });
    c.write(connect + "\r\n");

    s.on("login", async () => {
      const connect = await readFile(join(__dirname, "../text/connect.txt"), {
        encoding: "utf8",
      });
      c.write(connect + "\r\n");
    });

    s.on("message", (ctx) => {
      const { token: tkn, connected, command } = ctx.data;
      if (tkn) token = tkn;
      if (connected && token) {
        c.write("...Reconnecting\r\n");
      } else if (ctx.msg) {
        c.write(ctx.msg + "\r\n");
      }
    });

    s.on("quit", () => c.end());

    c.on("data", (data) => {
      s.send({
        data: { token, height: c.height, width: c.width },
        msg: data.toString(),
      });
    });
  }
);

server.listen(4202, () => console.log("Telnet server listening on port: 4202"));
