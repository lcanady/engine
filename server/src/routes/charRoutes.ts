import { compare, DBObj, express, hash, sign } from "@ursamu/core";
import { db } from "..";
import { createEntity } from "../../utils/utils";

const router: express.Router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const players = (await db.find({})).filter((obj: DBObj) =>
      obj.flags.includes("player")
    );
    const taken = players.filter(
      (player) => player.name.toLowerCase() === req.body.name.toLowerCase()
    );

    if (taken.length)
      return res.status(500).json({ error: "Permission denied." });

    const hsh = await hash(req.body.password);

    const player = await createEntity(req.body.name, "player", {
      password: hsh,
    });

    const token = await sign(player._id!, process.env.SECRET || "");
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  const regex = new RegExp(req.body.name, "i");
  try {
    const player = ((await db.find({
      $or: [{ name: regex }, { alias: regex }],
    })) || [])[0];

    const valid = await compare(req.body.password, player.password || "");
    if (!valid) return res.sendStatus(403);

    const token = await sign(player._id!, process.env.SECRET || "");
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
