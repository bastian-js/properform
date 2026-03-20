import express from "express";
import { db } from "../../../../db.js";
import { requireAuth } from "../../../../middleware/auth.js";

const router = express.Router();

router.delete("/:id", requireAuth, async (req, res) => {
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

    await db.query("DELETE FROM user_training_plans WHERE id = ? AND uid = ?", [
      id,
      userId,
    ]);

    res.status(200).json({
      message: "user training plan deleted successfully",
    });
  } catch (error) {
    console.error("error deleting user training plan:", error);
    res.status(500).json({
      message: "error deleting user training plan",
      error: error.message,
    });
  }
});

export default router;
