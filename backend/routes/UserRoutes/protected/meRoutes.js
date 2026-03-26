import express from "express";
import { db } from "../../../db.js";
import { requireAuth } from "../../../middleware/auth.js";
import { createRateLimiter } from "../../../middleware/rate.js";

const router = express.Router();

router.get(
  "/me",
  requireAuth,
  createRateLimiter({ windowMs: 15 * 60 * 1000, max: 10 }),
  async (req, res) => {
    try {
      const userId = req.user.uid;

      console.log("jwt user.", req.user);

      const [rows] = await db.execute(
        `SELECT
     uid,
     firstname,
     birthdate,
     email,
     weight,
     height,
     gender,
     profile_image_url,
     onboarding_completed,
     fitness_level,
     training_frequency,
     primary_goal,
     role_id,
     last_login,
     created_at,
     updated_at,
     email_verified
   FROM users
   WHERE uid = ?
   LIMIT 1`,
        [userId],
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: "user not found." });
      }

      return res.status(200).json(rows[0]);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "server error.", error: err.message });
    }
  },
);

router.get("/me/trainer", requireAuth, async (req, res) => {
  const userId = req.user.uid;

  try {
    const [rows] = await db.query(
      `
        SELECT 
            t.tid,
            t.firstname,
            t.lastname,
            t.phone_number
        FROM trainer_athletes ta
        JOIN trainers t ON t.tid = ta.tid
        WHERE ta.uid = ?;
      `,
      [userId],
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "no trainer found for this user." });
    }

    return res.status(200).json({ trainers: rows[0] });
  } catch (err) {
    console.error("fetch trainer error.", err);
    res.status(500).json({ message: "failed to fetch trainer." });
  }
});

export default router;
