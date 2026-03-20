import express from "express";
import { db } from "../../../../db.js";
import { requireAuth } from "../../../../middleware/auth.js";

const router = express.Router();

router.get("/start/current", requireAuth, async (req, res) => {
  const userId = req.user.uid;

  try {
    const [selectedPlan] = await db.query(
      `
      SELECT utp.tpid
      FROM user_training_plans utp
      WHERE utp.uid = ? AND utp.is_selected = 1
      `,
      [userId],
    );

    if (selectedPlan.length === 0) {
      return res
        .status(404)
        .json({ message: "no selected training plan found" });
    }

    const tpid = selectedPlan[0].tpid;

    const [trainingPlan] = await db.query(
      "SELECT tpid, name, description, duration_weeks, sessions_per_week FROM training_plans WHERE tpid = ?",
      [tpid],
    );

    if (trainingPlan.length === 0) {
      return res.status(404).json({ message: "training plan not found" });
    }

    const [exercises] = await db.query(
      `
      SELECT 
        id,
        eid,
        week_number,
        day_number,
        exercise_order,
        sets,
        reps,
        duration_minutes,
        rest_seconds,
        notes
      FROM training_plan_exercises
      WHERE tpid = ?
      ORDER BY week_number ASC, day_number ASC, exercise_order ASC
      `,
      [tpid],
    );

    res.status(200).json({
      message: "current training loaded successfully",
      plan: trainingPlan[0],
      exercises: exercises,
    });
  } catch (error) {
    console.error("error loading current training:", error);
    res.status(500).json({
      message: "error loading current training",
      error: error.message,
    });
  }
});

export default router;
