import express from "express";
import { db } from "../../../db.js";
import { requireAuth } from "../../../middleware/auth.js";
import { requireRole } from "../../../middleware/role.js";

const router = express.Router();

router.post("/requests", requireAuth, requireRole("user"), async (req, res) => {
  const { code } = req.body;
  const uid = req.user.uid;

  if (!code) {
    return res.status(400).json({ message: "code is required." });
  }

  try {
    const [trainer] = await db.query(
      `
            SELECT tid FROM trainers WHERE invite_code = ?
            `,
      [code.trim()],
    );

    if (trainer.length === 0) {
      return res.status(400).json({ message: "invalid code." });
    }

    const tid = trainer[0].tid;

    await db.query(
      `
            INSERT INTO trainer_requests (tid, uid, status) VALUES (?, ?, ?)
            `,
      [tid, uid, "pending"],
    );

    return res.status(201).json({ message: "trainer request sent." });
  } catch (error) {
    console.error("failed to send trainer request.", error);
    return res.status(500).json({
      error: "internal server error.",
    });
  }
});

router.patch(
  "/requests/:id",
  requireAuth,
  requireRole("trainer"),
  async (req, res) => {
    const { id } = req.params;
    const { action } = req.body;
    const tid = req.user.tid;

    if (!["accept", "reject"].includes(action)) {
      return res.status(400).json({ message: "invalid action." });
    }

    try {
      const [rows] = await db.query(
        `
            SELECT * FROM trainer_requests WHERE id = ? AND tid = ?
            `,
        [id, tid],
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: "trainer request not found." });
      }

      const request = rows[0];

      if (action === "accept") {
        await db.query(
          `
            UPDATE trainer_requests SET status = 'accepted' WHERE id = ?
            `,
          [id],
        );

        return res.status(200).json({ message: "accepted" });
      }

      await db.query(
        `
        UPDATE trainer_requests SET status = 'rejected' WHERE id = ?
        `,
        [id],
      );

      return res.status(200).json({ message: "rejected" });
    } catch (error) {
      console.error("failed to update trainer request.", error);
      return res.status(500).json({
        error: "internal server error.",
      });
    }
  },
);

export default router;
