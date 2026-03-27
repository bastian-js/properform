import express from "express";
import { db } from "../../../db.js";

import { requireRole } from "../../../middleware/role.js";

import { requireAuth } from "../../../middleware/auth.js";

const router = express.Router();

router.get(
  "/exercises/muscle-groups",
  requireAuth,
  requireRole("owner"),
  async (req, res) => {
    try {
      const [rows] = await db.query(
        `
        SELECT mgid, name FROM muscle_groups
        ORDER BY name
        `,
      );

      return res.status(200).json({ count: rows.length, data: rows });
    } catch (err) {
      console.error("create exercise failed.", err);
      return res.status(500).json({ error: "internal server error." });
    }
  },
);

export default router;
