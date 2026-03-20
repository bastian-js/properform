import express from "express";
import { db } from "../../../../db.js";
import { requireAuth } from "../../../../middleware/auth.js";

const router = express.Router();

router.get("/selected", requireAuth, async (req, res) => {
  const userId = req.user.uid;

  try {
    const [plan] = await db.query(
      `
      SELECT 
        utp.id,
        utp.uid,
        utp.tpid,
        utp.assigned_by_trainer,
        utp.start_date,
        utp.end_date,
        utp.completion_percentage,
        utp.status,
        utp.is_selected,
        utp.created_at,
        utp.updated_at
      FROM user_training_plans utp
      WHERE utp.uid = ? AND utp.is_selected = 1
      `,
      [userId],
    );

    if (plan.length === 0) {
      return res
        .status(404)
        .json({ message: "no selected training plan found" });
    }

    const [trainingPlan] = await db.query(
      "SELECT tpid, name, description, duration_weeks, sessions_per_week FROM training_plans WHERE tpid = ?",
      [plan[0].tpid],
    );

    res.status(200).json({
      message: "selected training plan fetched successfully",
      plan: {
        ...plan[0],
        training_plan: trainingPlan[0],
      },
    });
  } catch (error) {
    console.error("error fetching selected training plan:", error);
    res.status(500).json({
      message: "error fetching selected training plan",
      error: error.message,
    });
  }
});

export default router;
