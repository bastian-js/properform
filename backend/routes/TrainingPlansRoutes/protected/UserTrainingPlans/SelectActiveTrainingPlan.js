import express from "express";
import { db } from "../../../../db.js";
import { requireAuth } from "../../../../middleware/auth.js";

const router = express.Router();

router.patch("/:id/select", requireAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.uid;

  try {
    const [plan] = await db.query(
      "SELECT id FROM user_training_plans WHERE id = ? AND uid = ?",
      [id, userId],
    );

    if (plan.length === 0) {
      return res
        .status(404)
        .json({ message: "training plan not found or access denied" });
    }

    // Alle anderen Pläne auf is_selected = 0 setzen
    await db.query(
      "UPDATE user_training_plans SET is_selected = 0 WHERE uid = ?",
      [userId],
    );

    // Diesen Plan auf is_selected = 1 setzen
    await db.query(
      "UPDATE user_training_plans SET is_selected = 1 WHERE id = ? AND uid = ?",
      [id, userId],
    );

    res.status(200).json({
      message: "training plan selected successfully",
      selected_plan_id: parseInt(id),
    });
  } catch (error) {
    console.error("error selecting training plan:", error);
    res.status(500).json({
      message: "error selecting training plan",
      error: error.message,
    });
  }
});

export default router;
