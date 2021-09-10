import { loaddir, textDB } from "@ursamu/core";
import { Dirent, PathLike } from "fs";
import { readFile } from "fs/promises";
import matter from "gray-matter";
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
      const res = matter(text);
      textDB.get("help")?.push({
        name: res.data.name ? res.data.name : file.name.split(".")[0],
        category: res.data.category ? res.data.category : "general",
        body: res.content,
        visible: res.data.visible || true,
        lock: res.data.lock ? res.data.lock : "",
      });
    }
  );

  await loaddir(path.join(__dirname, "../plugins/"));
})();
