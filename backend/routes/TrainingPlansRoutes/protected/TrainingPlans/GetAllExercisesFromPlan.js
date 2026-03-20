import express from "express";
import { db } from "../../../../db.js";
import { requireAuth } from "../../../../middleware/auth.js";

const router = express.Router();

router.get("/:tpid/exercises", requireAuth, async (req, res) => {
  const { tpid } = req.params;
  const userId = req.user.uid;

  try {
    const [trainingPlan] = await db.query(
      `
        SELECt tpid FROM training_plans WHERE tpid = ? AND created_by_user = ?
        `,
      [tpid, userId],
    );

    if (trainingPlan.length === 0) {
      return res.status(404).json({ message: "training plan not found." });
    }

    const [exercises] = await db.query(
      `
        SELECT 
        tpe.id,
        tpe.tpid,
        tpe.eid,
        tpe.week_number,
        tpe.day_number,
        tpe.exercise_order,
        tpe.sets,
        tpe.reps,
        tpe.duration_minutes,
        tpe.rest_seconds,
        tpe.notes
      FROM training_plan_exercises tpe
      WHERE tpe.tpid = ?
      ORDER BY tpe.week_number ASC, tpe.day_number ASC, tpe.exercise_order ASC
      `,
      [tpid],
    );

    if (exercises.length === 0) {
      return res
        .status(404)
        .json({ message: "no exercises found for this training plan." });
    }

    return res
      .status(200)
      .json({ trainingPlanId: tpid, count: exercises.length, exercises });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
