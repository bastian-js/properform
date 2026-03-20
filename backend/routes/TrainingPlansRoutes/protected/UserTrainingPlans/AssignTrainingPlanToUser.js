import express from "express";
import { db } from "../../../../db.js";
import { requireAuth } from "../../../../middleware/auth.js";

const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
  const userId = req.user.uid;
  const { tpid, startDate } = req.body;

  try {
    if (!tpid || !startDate) {
      return res.status(400).json({ message: "missing required fields" });
    }

    const [trainingPlan] = await db.query(
      "SELECT tpid FROM training_plans WHERE tpid = ?",
      [tpid],
    );

    if (trainingPlan.length === 0) {
      return res.status(404).json({ message: "training plan not found" });
    }

    const [existingPlan] = await db.query(
      "SELECT id FROM user_training_plans WHERE uid = ? AND tpid = ?",
      [userId, tpid],
    );

    if (existingPlan.length > 0) {
      return res
        .status(400)
        .json({ message: "user already has this training plan" });
    }

    const [result] = await db.query(
      `
      INSERT INTO user_training_plans (uid, tpid, start_date, status)
      VALUES (?, ?, ?, 'active')
      `,
      [userId, tpid, startDate],
    );

    const [newPlan] = await db.query(
      "SELECT * FROM user_training_plans WHERE id = ?",
      [result.insertId],
    );

    res.status(201).json({
      message: "training plan assigned successfully",
      user_training_plan: newPlan[0],
    });
  } catch (error) {
    console.error("error assigning training plan:", error);
    res.status(500).json({
      message: "error assigning training plan",
      error: error.message,
    });
  }
});

export default router;
