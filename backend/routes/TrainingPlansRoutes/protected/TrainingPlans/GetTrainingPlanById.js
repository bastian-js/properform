import express from "express";
import { db } from "../../../../db.js";
import { requireAuth } from "../../../../middleware/auth.js";

const router = express.Router();

router.get("/:tpid", requireAuth, async (req, res) => {
  const userId = req.user.uid;
  const { tpid } = req.params;

  try {
    const [rows] = await db.query(
      `
        SELECT tp.tpid, tp.name, tp.description, s.name as sport, dl.name as difficulty, tp.duration_weeks, tp.sessions_per_week 
        FROM training_plans tp
        LEFT JOIN sports s ON tp.sid = s.sid
        LEFT JOIN difficulty_levels dl ON tp.dlid = dl.dlid
        WHERE tp.created_by_user = ? AND tp.tpid = ?
        ORDER BY tp.created_at DESC
        `,
      [userId, tpid],
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "training plan not found for this user." });
    }

    return res.status(200).json({ plan: rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
