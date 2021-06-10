import { express, verify, DB, DBObj } from "@ursamu/core";
import { db } from "..";

const webAuth = async (
  req: any,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1] || "";
    if (token) {
      const verified = await verify(
        token,
        process.env.SECRET || "YOUSHOULDCHANGETHIS"
      );
      if (!verified) return res.sendStatus(403);

      const player = (await db.get(verified.id)) as DBObj;
      req.player = player;

      next();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default webAuth;
