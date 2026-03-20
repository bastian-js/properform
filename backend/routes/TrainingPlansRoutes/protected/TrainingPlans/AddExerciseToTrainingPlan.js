import express from "express";
import { db } from "../../../../db.js";
import { requireAuth } from "../../../../middleware/auth.js";

const router = express.Router();

router.post("/:tpid/exercises", requireAuth, async (req, res) => {
  const { tpid } = req.params;
  const userId = req.user.uid;
  const {
    eid,
    weekNumber,
    dayNumber,
    exerciseOrder,
    sets,
    reps,
    durationMinutes,
    restSeconds,
    notes,
  } = req.body;

  if (!eid || !weekNumber || !dayNumber || !exerciseOrder) {
    return res.status(400).json({ message: "missing required fields." });
  }

  try {
    const [trainingPlan] = await db.query(
      `
        SELECT tpid FROM training_plans WHERE tpid = ? AND created_by_user = ?
        `,
      [tpid, userId],
    );

    if (trainingPlan.length === 0) {
      return res.status(404).json({ message: "training plan not found." });
    }

    const [result] = await db.query(
      `
      INSERT INTO training_plan_exercises 
      (tpid, eid, week_number, day_number, exercise_order, sets, reps, duration_minutes, rest_seconds, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        tpid,
        eid,
        weekNumber,
        dayNumber,
        exerciseOrder,
        sets || null,
        reps || null,
        durationMinutes || null,
        restSeconds || null,
        notes || null,
      ],
    );

    // Die gerade hinzugefügte Übung zurück geben
    const [newExercise] = await db.query(
      "SELECT * FROM training_plan_exercises WHERE id = ?",
      [result.insertId],
    );

    res.status(201).json({
      message: "exercise added to training plan successfully",
      exercise: newExercise[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
