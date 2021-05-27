import { server, express, app } from "@ursamu/core";

app.use(express.static("client"));

server.listen(4201);
