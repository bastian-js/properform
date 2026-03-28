import express from "express";
import { db } from "../../../db.js";
import { requireAuth } from "../../../middleware/auth.js";

const router = express.Router();

router.post("/update", requireAuth, async (req, res) => {
  const uid = req.user.uid;
  const { type, date } = req.body;

  if (!type) {
    return res.status(400).json({ message: "type is required." });
  }

  try {
    // ✅ DEV override möglich
    const today =
      process.env.NODE_ENV === "development" && date
        ? date
        : new Date().toLocaleDateString("en-CA");

    const [logResult] = await db.query(
      `
      INSERT IGNORE INTO streak_logs (uid, type, activity_date)
      VALUES (?, ?, ?)
      `,
      [uid, type, today],
    );

    if (logResult.affectedRows === 0) {
      const [rows] = await db.query(
        `
        SELECT current_streak, longest_streak 
        FROM streaks 
        WHERE uid = ? AND type = ?
        `,
        [uid, type],
      );

      return res.status(200).json({
        message: "streak already updated today.",
        current_streak: rows[0]?.current_streak ?? 1,
        longest_streak: rows[0]?.longest_streak ?? 1,
      });
    }

    const [rows] = await db.query(
      `
      SELECT * FROM streaks 
      WHERE uid = ? AND type = ?
      `,
      [uid, type],
    );

    if (!rows.length) {
      await db.query(
        `
        INSERT INTO streaks (uid, type, current_streak, longest_streak, last_activity_date)
        VALUES (?, ?, 1, 1, ?)
        `,
        [uid, type, today],
      );

      return res.status(200).json({
        message: "streak created.",
        current_streak: 1,
        longest_streak: 1,
      });
    }

    const streak = rows[0];

    const yesterday = new Date(today); // nutzt override korrekt
    yesterday.setDate(yesterday.getDate() - 1);
    const yest = yesterday.toLocaleDateString("en-CA");

    let newCurrent = 1;

    if (streak.last_activity_date) {
      const last = streak.last_activity_date;

      if (last === yest) {
        newCurrent = streak.current_streak + 1;
      }
    }

    const newLongest = Math.max(newCurrent, streak.longest_streak);

    await db.query(
      `
      UPDATE streaks
      SET current_streak = ?, longest_streak = ?, last_activity_date = ?
      WHERE uid = ? AND type = ?
      `,
      [newCurrent, newLongest, today, uid, type],
    );

    return res.status(200).json({
      message: "streak updated successfully.",
      current_streak: newCurrent,
      longest_streak: newLongest,
    });
  } catch (err) {
    console.log("update streak error.", err);
    return res
      .status(500)
      .json({ message: "server error.", error: err.message });
  }
});

export default router;
