import express from "express";
import { db } from "../../../../db.js";
import { requireAuth } from "../../../../middleware/auth.js";

const router = express.Router();

router.delete("/:tpid/exercises/:id", requireAuth, async (req, res) => {
  const { tpid, id } = req.params;
  const userId = req.user.uid;

  try {
    const [trainingPlan] = await db.query(
      "SELECT tpid FROM training_plans WHERE tpid = ? AND created_by_user = ?",
      [tpid, userId],
    );

    if (trainingPlan.length === 0) {
      return res
        .status(404)
        .json({ message: "training plan not found or access denied" });
    }

    const [exercise] = await db.query(
      "SELECT id FROM training_plan_exercises WHERE id = ? AND tpid = ?",
      [id, tpid],
    );

    if (exercise.length === 0) {
      return res
        .status(404)
        .json({ message: "exercise not found in this training plan" });
    }

    await db.query(
      "DELETE FROM training_plan_exercises WHERE id = ? AND tpid = ?",
      [id, tpid],
    );

    res.status(200).json({
      message: "training plan exercise deleted successfully",
    });
  } catch (error) {
    console.error("error deleting training plan exercise:", error);
    res.status(500).json({
      message: "error deleting training plan exercise",
      error: error.message,
    });
  }
});

export default router;
