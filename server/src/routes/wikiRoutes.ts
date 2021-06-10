import { Article, flags, MuRequest } from "@ursamu/core";
import express, { Router } from "express";
import { wiki } from "..";
import webAuth from "../middleware/webAuth";

const router: Router = express.Router();

router.post("/", webAuth, async (req: MuRequest, res) => {
  try {
    const article: Article = await wiki.create({
      title: req.body.title,
      body: req.body.body,
      category: req.body?.category?.toLowerCase() || "general",
      created_by: req.body.created_by || req.player?._id,
      slug: req.body.slug,
      created_at: Date.now(),
    });

    res.status(200).json({ article });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/category/:category", async (req: MuRequest, res) => {
  try {
    let articles = await wiki.find({
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
