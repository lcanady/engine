import { loaddir, textDB } from "@ursamu/core";
import { Dirent, PathLike } from "fs";
import { readFile } from "fs/promises";
import path from "path";

(async () => {
  await loaddir(path.join(__dirname, "../commands/"));
  await loaddir(
    path.join(__dirname, "../../text/"),
    async (file: Dirent, path: PathLike) => {
      const text = await readFile(`${path}/${file.name}`, { encoding: "utf8" });
      textDB.set("text", [
        { name: file.name.split(".")[0], category: "text", body: text },
      ]);
    }
  );

  await loaddir(
    path.join(__dirname, "../../help/"),
    async (file: Dirent, path: PathLike) => {
      const text = await readFile(`${path}/${file.name}`, { encoding: "utf8" });
      textDB.set("help", [
        { name: file.name.split(".")[0], category: "help", body: text },
      ]);
    }
  );

  await loaddir(path.join(__dirname, "../plugins/"));
})();
