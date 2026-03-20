import express from "express";
import { db } from "../../../../db.js";
import { requireAuth } from "../../../../middleware/auth.js";

const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
  const userId = req.user.uid;
  const {
    name,
    description,
    sportId,
    difficultyLevelId,
    durationWeeks,
    sessionsPerWeek,
  } = req.body;

  if (
    !name ||
    !sportId ||
    !difficultyLevelId ||
    !durationWeeks ||
    !sessionsPerWeek
  ) {
    return res.status(400).json({ message: "missing required fields" });
  }
  try {
    const [result] = await db.query(
      `
        INSERT INTO training_plans (name, description, sid, dlid, duration_weeks, sessions_per_week, created_by_user)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
      [
        name,
        description,
        sportId,
        difficultyLevelId,
        durationWeeks,
        sessionsPerWeek,
        userId,
      ],
    );
    return res.status(201).json({
      message: "training plan created successfully",
      planId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
