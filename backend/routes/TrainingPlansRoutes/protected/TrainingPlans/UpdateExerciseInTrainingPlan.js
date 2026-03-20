import express from "express";
import { db } from "../../../../db.js";
import { requireAuth } from "../../../../middleware/auth.js";

const router = express.Router();

router.put("/:tpid/exercises/:id", requireAuth, async (req, res) => {
  const { tpid, id } = req.params;
  const userId = req.user.uid;
  const {
    weekNumber,
    dayNumber,
    exerciseOrder,
    sets,
    reps,
    durationMinutes,
    restSeconds,
    notes,
  } = req.body;

  if (!weekNumber || !dayNumber || !exerciseOrder) {
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
      return res
        .status(404)
        .json({ message: "training plan not found or access denied" });
    }

    // Checken, ob Übung existiert und zum Trainingsplan gehört
    const [exercise] = await db.query(
      "SELECT id FROM training_plan_exercises WHERE id = ? AND tpid = ?",
      [id, tpid],
    );

    if (exercise.length === 0) {
      return res
        .status(404)
        .json({ message: "exercise not found in this training plan" });
    }

    // Übung aktualisieren
    await db.query(
      `
      UPDATE training_plan_exercises
      SET week_number = ?, day_number = ?, exercise_order = ?, sets = ?, reps = ?, duration_minutes = ?, rest_seconds = ?, notes = ?
      WHERE id = ? AND tpid = ?
      `,
      [
        weekNumber,
        dayNumber,
        exerciseOrder,
        sets || null,
        reps || null,
        durationMinutes || null,
        restSeconds || null,
        notes || null,
        id,
        tpid,
      ],
    );

    // Aktualisierte Übung zurück geben
    const [updatedExercise] = await db.query(
      "SELECT * FROM training_plan_exercises WHERE id = ?",
      [id],
    );

    res.status(200).json({
      message: "training plan exercise updated successfully",
      exercise: updatedExercise[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
