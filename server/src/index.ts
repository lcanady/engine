import { server, express, app } from "@ursamu/core";
import path from "path";

app.use(express.static(path.resolve(__dirname, "../../client/build")));

server.listen(4201);
