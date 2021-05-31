import { DBObj, DB, Article, flags } from "@ursamu/core";
import express, { Router } from "express";
import webAuth from "../middleware/webAuth";

const router: Router = express.Router();

router.post("/", webAuth, async (req, res) => {
  try {
    const article: Article = await DB.dbs.wiki.create({
      title: req.body.title,
      body: req.body.body,
      category: req.body?.category?.toLowerCase() || "general",
      created_by: req.body.created_by || req.player._id,
      slug: req.body.slug,
      created_at: Date.now(),
    });

    res.status(200).json({ article });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/category/:category", async (req, res) => {
  try {
    let articles = await DB.dbs.wiki.find<Article>({
      $where: function () {
        const pflags = req.player?.flags || "";
        if (
          (!this.flags || flags.check(pflags, this.flags)) &&
          this.category === req.params.category.toLowerCase()
        ) {
          return true;
        } else {
          return false;
        }
      },
    });

    res.status(200).json({ articles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
