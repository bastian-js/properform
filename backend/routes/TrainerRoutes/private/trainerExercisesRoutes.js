import express from "express";
import { db } from "../../../db.js";
import { requireAuth } from "../../../middleware/auth.js";
import { requireRole } from "../../../middleware/role.js";

const router = express.Router();

// Create exercise (trainer only)
router.post(
  "/exercises",
  requireAuth,
  requireRole("trainer"),
  async (req, res) => {
    const creatorId = req.user.uid ?? req.user.tid ?? null;
    const { name, description, video_url, thumbnail_url, sid, dlid } = req.body;

    try {
      const result = await db.query(
        `INSERT INTO exercises
        (name, description, video_url, thumbnail_url, sid, dlid, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, description, video_url, thumbnail_url, sid, dlid, creatorId],
      );

      return res.status(201).json({ eid: result.insertId });
    } catch (err) {
      return res.status(500).json({ error: "failed" });
    }
  },
);

// Update exercise (only own)
router.put(
  "/exercises/:eid",
  requireAuth,
  requireRole("trainer"),
  async (req, res) => {
    const { eid } = req.params;
    const creatorId = req.user.uid ?? req.user.tid ?? null;
    const { name, description } = req.body;

    try {
      const [check] = await db.query(
        "SELECT eid FROM exercises WHERE eid = ? AND created_by = ?",
        [eid, creatorId],
      );

      if (check.length === 0) {
        return res.status(403).json({ error: "not yours" });
      }

      await db.query(
        "UPDATE exercises SET name = ?, description = ? WHERE eid = ?",
        [name, description, eid],
      );

      return res.json({ message: "updated" });
    } catch (err) {
      return res.status(500).json({ error: "failed" });
    }
  },
);

// Delete exercise (only own)
router.delete(
  "/exercises/:eid",
  requireAuth,
  requireRole("trainer"),
  async (req, res) => {
    const { eid } = req.params;
    const creatorId = req.user.uid ?? req.user.tid ?? null;

    try {
      const result = await db.query(
        "DELETE FROM exercises WHERE eid = ? AND created_by = ?",
        [eid, creatorId],
      );

      if (result.affectedRows === 0) {
        return res.status(403).json({ error: "not yours" });
      }

      return res.json({ message: "deleted" });
    } catch (err) {
      return res.status(500).json({ error: "failed" });
    }
  },
);

export default router;
