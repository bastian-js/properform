import express from "express";
import { db } from "../../../db.js";
import { requireAuth } from "../../../middleware/auth.js";
import { requireRole } from "../../../middleware/role.js";

const router = express.Router();

async function requireTrainerContext(req, res) {
  const tid = req.user.tid ?? req.user.uid ?? null;
  if (!tid) {
    res.status(400).json({ error: "trainer id missing." });
    return null;
  }

  return tid;
}

router.get(
  "/training-plans",
  requireAuth,
  requireRole("trainer"),
  async (req, res) => {
    const tid = await requireTrainerContext(req, res);
    if (!tid) return;

    try {
      const [rows] = await db.query(
        `SELECT
         tp.tpid,
         tp.name,
         tp.description,
         tp.sid,
         s.name AS sport,
         tp.dlid,
         dl.name AS difficulty,
         tp.duration_weeks,
         tp.sessions_per_week,
         tp.created_by_trainer,
         tp.is_template,
         tp.created_at,
         tp.updated_at,
         COUNT(DISTINCT utp.id) AS assigned_count
       FROM training_plans tp
       LEFT JOIN sports s ON s.sid = tp.sid
       LEFT JOIN difficulty_levels dl ON dl.dlid = tp.dlid
       LEFT JOIN user_training_plans utp ON utp.tpid = tp.tpid
       WHERE tp.created_by_trainer = ?
       GROUP BY tp.tpid
       ORDER BY tp.created_at DESC`,
        [tid],
      );

      return res.status(200).json({ count: rows.length, plans: rows });
    } catch (error) {
      console.error("trainer training plans fetch failed.", error);
      return res.status(500).json({ error: "internal server error." });
    }
  },
);

router.post(
  "/training-plans",
  requireAuth,
  requireRole("trainer"),
  async (req, res) => {
    const tid = await requireTrainerContext(req, res);
    if (!tid) return;

    const {
      name,
      description,
      sid,
      dlid,
      duration_weeks,
      sessions_per_week,
      is_template,
    } = req.body;

    if (!name || !sid || !duration_weeks || !sessions_per_week) {
      return res.status(400).json({
        error: "name, sid, duration_weeks and sessions_per_week are required.",
      });
    }

    const parsedSid = Number(sid);
    const parsedDurationWeeks = Number(duration_weeks);
    const parsedSessionsPerWeek = Number(sessions_per_week);
    const parsedDlid =
      dlid === undefined || dlid === null || dlid === "" ? null : Number(dlid);

    if (!Number.isInteger(parsedSid)) {
      return res.status(400).json({ error: "sid must be an integer." });
    }

    if (!Number.isInteger(parsedDurationWeeks) || parsedDurationWeeks <= 0) {
      return res
        .status(400)
        .json({ error: "duration_weeks must be a positive integer." });
    }

    if (
      !Number.isInteger(parsedSessionsPerWeek) ||
      parsedSessionsPerWeek <= 0
    ) {
      return res
        .status(400)
        .json({ error: "sessions_per_week must be a positive integer." });
    }

    if (parsedDlid !== null && !Number.isInteger(parsedDlid)) {
      return res.status(400).json({ error: "dlid must be an integer." });
    }

    try {
      const [result] = await db.query(
        `INSERT INTO training_plans
        (name, description, sid, dlid, duration_weeks, sessions_per_week, created_by_trainer, is_template)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          description ?? null,
          parsedSid,
          parsedDlid,
          parsedDurationWeeks,
          parsedSessionsPerWeek,
          tid,
          is_template ? 1 : 0,
        ],
      );

      return res.status(201).json({
        message: "training plan created successfully",
        tpid: result.insertId,
      });
    } catch (error) {
      console.error("trainer training plan create failed.", error);
      return res.status(500).json({ error: "internal server error." });
    }
  },
);

router.put(
  "/training-plans/:tpid",
  requireAuth,
  requireRole("trainer"),
  async (req, res) => {
    const tid = await requireTrainerContext(req, res);
    if (!tid) return;

    const tpid = Number(req.params.tpid);
    const {
      name,
      description,
      sid,
      dlid,
      duration_weeks,
      sessions_per_week,
      is_template,
    } = req.body;

    if (!Number.isInteger(tpid)) {
      return res.status(400).json({ error: "invalid training plan id." });
    }

    if (!name || !sid || !duration_weeks || !sessions_per_week) {
      return res.status(400).json({
        error: "name, sid, duration_weeks and sessions_per_week are required.",
      });
    }

    const parsedSid = Number(sid);
    const parsedDurationWeeks = Number(duration_weeks);
    const parsedSessionsPerWeek = Number(sessions_per_week);
    const parsedDlid =
      dlid === undefined || dlid === null || dlid === "" ? null : Number(dlid);

    if (!Number.isInteger(parsedSid)) {
      return res.status(400).json({ error: "sid must be an integer." });
    }

    if (!Number.isInteger(parsedDurationWeeks) || parsedDurationWeeks <= 0) {
      return res
        .status(400)
        .json({ error: "duration_weeks must be a positive integer." });
    }

    if (
      !Number.isInteger(parsedSessionsPerWeek) ||
      parsedSessionsPerWeek <= 0
    ) {
      return res
        .status(400)
        .json({ error: "sessions_per_week must be a positive integer." });
    }

    if (parsedDlid !== null && !Number.isInteger(parsedDlid)) {
      return res.status(400).json({ error: "dlid must be an integer." });
    }

    try {
      const [result] = await db.query(
        `UPDATE training_plans
       SET name = ?, description = ?, sid = ?, dlid = ?, duration_weeks = ?, sessions_per_week = ?, is_template = ?
       WHERE tpid = ? AND created_by_trainer = ?`,
        [
          name,
          description ?? null,
          parsedSid,
          parsedDlid,
          parsedDurationWeeks,
          parsedSessionsPerWeek,
          is_template ? 1 : 0,
          tpid,
          tid,
        ],
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "training plan not found." });
      }

      return res.json({ message: "training plan updated successfully", tpid });
    } catch (error) {
      console.error("trainer training plan update failed.", error);
      return res.status(500).json({ error: "internal server error." });
    }
  },
);

router.delete(
  "/training-plans/:tpid",
  requireAuth,
  requireRole("trainer"),
  async (req, res) => {
    const tid = await requireTrainerContext(req, res);
    if (!tid) return;

    const tpid = Number(req.params.tpid);
    if (!Number.isInteger(tpid)) {
      return res.status(400).json({ error: "invalid training plan id." });
    }

    try {
      const [result] = await db.query(
        "DELETE FROM training_plans WHERE tpid = ? AND created_by_trainer = ?",
        [tpid, tid],
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "training plan not found." });
      }

      return res.json({ message: "training plan deleted successfully", tpid });
    } catch (error) {
      console.error("trainer training plan delete failed.", error);
      return res.status(500).json({ error: "internal server error." });
    }
  },
);

router.post(
  "/training-plans/assign",
  requireAuth,
  requireRole("trainer"),
  async (req, res) => {
    const tid = await requireTrainerContext(req, res);
    if (!tid) return;

    const { uid, tpid, tpid_list, start_date } = req.body;

    if (!uid) {
      return res.status(400).json({ error: "uid is required." });
    }

    const planIds = Array.isArray(tpid_list)
      ? tpid_list
      : tpid !== undefined && tpid !== null
        ? [tpid]
        : [];

    if (planIds.length === 0) {
      return res.status(400).json({ error: "tpid or tpid_list is required." });
    }

    const athleteId = Number(uid);
    if (!Number.isInteger(athleteId)) {
      return res.status(400).json({ error: "uid must be an integer." });
    }

    const assignmentDate = start_date || new Date().toISOString().slice(0, 10);

    try {
      const [athleteRows] = await db.query(
        "SELECT uid FROM users WHERE uid = ? AND role_id = 2",
        [athleteId],
      );

      if (athleteRows.length === 0) {
        return res.status(404).json({ error: "athlete not found." });
      }

      const createdPlanIds = [];
      const skippedPlanIds = [];

      for (const rawPlanId of planIds) {
        const planId = Number(rawPlanId);
        if (!Number.isInteger(planId)) {
          return res
            .status(400)
            .json({ error: "all tpid values must be integers." });
        }

        const [planRows] = await db.query(
          "SELECT tpid FROM training_plans WHERE tpid = ? AND created_by_trainer = ?",
          [planId, tid],
        );

        if (planRows.length === 0) {
          skippedPlanIds.push(planId);
          continue;
        }

        const [existingRows] = await db.query(
          "SELECT id FROM user_training_plans WHERE uid = ? AND tpid = ?",
          [athleteId, planId],
        );

        if (existingRows.length > 0) {
          skippedPlanIds.push(planId);
          continue;
        }

        const [result] = await db.query(
          `INSERT INTO user_training_plans (uid, tpid, assigned_by_trainer, start_date, status)
         VALUES (?, ?, ?, ?, 'active')`,
          [athleteId, planId, tid, assignmentDate],
        );

        createdPlanIds.push(result.insertId);
      }

      if (createdPlanIds.length > 0) {
        const [selectedRows] = await db.query(
          "SELECT id FROM user_training_plans WHERE uid = ? AND is_selected = 1 LIMIT 1",
          [athleteId],
        );

        if (selectedRows.length === 0) {
          await db.query(
            "UPDATE user_training_plans SET is_selected = 1 WHERE id = ? AND uid = ?",
            [createdPlanIds[0], athleteId],
          );
        }
      }

      return res.status(201).json({
        message: "training plan assignment completed",
        createdCount: createdPlanIds.length,
        skippedPlanIds,
        assignmentDate,
      });
    } catch (error) {
      console.error("trainer training plan assign failed.", error);
      return res.status(500).json({ error: "internal server error." });
    }
  },
);

router.get(
  "/training-plans/athletes/:uid",
  requireAuth,
  requireRole("trainer"),
  async (req, res) => {
    const tid = await requireTrainerContext(req, res);
    if (!tid) return;

    const athleteId = Number(req.params.uid);
    if (!Number.isInteger(athleteId)) {
      return res.status(400).json({ error: "invalid athlete id." });
    }

    try {
      const [rows] = await db.query(
        `SELECT
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
         utp.updated_at,
         tp.name AS plan_name,
         tp.description,
         tp.sid,
         s.name AS sport,
         tp.dlid,
         dl.name AS difficulty,
         tp.duration_weeks,
         tp.sessions_per_week
       FROM user_training_plans utp
       LEFT JOIN training_plans tp ON tp.tpid = utp.tpid
       LEFT JOIN sports s ON s.sid = tp.sid
       LEFT JOIN difficulty_levels dl ON dl.dlid = tp.dlid
       WHERE utp.uid = ? AND utp.assigned_by_trainer = ?
       ORDER BY utp.created_at DESC`,
        [athleteId, tid],
      );

      return res.status(200).json({ count: rows.length, plans: rows });
    } catch (error) {
      console.error("trainer athlete plans fetch failed.", error);
      return res.status(500).json({ error: "internal server error." });
    }
  },
);

export default router;
