import express from "express";
import { db } from "../../../../db.js";
import { requireAuth } from "../../../../middleware/auth.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const userId = req.user.uid;

  try {
    const [rows] = await db.query(
      `
      SELECT tp.tpid, tp.name, tp.description, s.name as sport, dl.name as difficulty, tp.duration_weeks, tp.sessions_per_week 
      FROM training_plans tp
      LEFT JOIN sports s ON tp.sid = s.sid
      LEFT JOIN difficulty_levels dl ON tp.dlid = dl.dlid
      WHERE tp.created_by_user = ?
      ORDER BY tp.created_at DESC
      `,
      [userId],
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "no training plan found for this user." });
    }

    res.status(200).json({ count: rows.length, plans: rows });
  } catch (error) {
    console.error("error fetching training plans:", error);
    res.status(500).json({
      message: "error fetching training plans.",
      error: error.message,
    });
  }
});

export default router;
