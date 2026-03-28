import express from "express";
import { db } from "../../../db.js";
import { requireAuth } from "../../../middleware/auth.js";

const router = express.Router();

router.get("/:type", requireAuth, async (req, res) => {
  const uid = req.user.uid;
  const { type } = req.params;

  if (!type) {
    return res.status(400).json({ message: "type is required." });
  }

  try {
    const [rows] = await db.query(
      `
        SELECT current_streak, longest_streak, last_activity_date
        FROM streaks
        WHERE uid = ? AND type = ?
      `,
      [uid, type],
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "no streak found for this type." });
    }

    const [streakLogsRows] = await db.query(
      `
        SELECT activity_date, created_at 
        FROM streak_logs
        WHERE uid = ? AND type = ?
      `,
      [uid, type],
    );

    res.status(200).json({
      streak: rows[0],
      logs: streakLogsRows,
    });
  } catch (err) {
    console.log("get streak by type error.", err);
    return res
      .status(500)
      .json({ message: "server error.", error: err.message });
  }
});

export default router;
