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

router.delete(
  "/training-plans/assign",
  requireAuth,
  requireRole("trainer"),
  async (req, res) => {
    const tid = await requireTrainerContext(req, res);
    if (!tid) return;

    const { uid, tpid, tpid_list } = req.body;

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

    try {
      const removedPlanIds = [];

      for (const rawPlanId of planIds) {
        const planId = Number(rawPlanId);
        if (!Number.isInteger(planId)) {
          return res
            .status(400)
            .json({ error: "all tpid values must be integers." });
        }

        const [result] = await db.query(
          `DELETE FROM user_training_plans
           WHERE uid = ? AND tpid = ? AND assigned_by_trainer = ?`,
          [athleteId, planId, tid],
        );

        if (result.affectedRows > 0) {
          removedPlanIds.push(planId);
        }
      }

      const [selectedRows] = await db.query(
        "SELECT id FROM user_training_plans WHERE uid = ? AND is_selected = 1 LIMIT 1",
        [athleteId],
      );

      if (selectedRows.length === 0) {
        const [fallbackRows] = await db.query(
          `SELECT id FROM user_training_plans
           WHERE uid = ?
           ORDER BY created_at DESC
           LIMIT 1`,
          [athleteId],
        );

        if (fallbackRows.length > 0) {
          await db.query(
            "UPDATE user_training_plans SET is_selected = 1 WHERE id = ? AND uid = ?",
            [fallbackRows[0].id, athleteId],
          );
        }
      }

      return res.status(200).json({
        message: "training plan unassignment completed",
        removedCount: removedPlanIds.length,
        removedPlanIds,
      });
    } catch (error) {
      console.error("trainer training plan unassign failed.", error);
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

router.get(
  "/training-plans/:tpid/exercises",
  requireAuth,
  requireRole("trainer"),
  async (req, res) => {
    const tid = await requireTrainerContext(req, res);
    if (!tid) return;

    const trainingPlanId = Number(req.params.tpid);
    if (!Number.isInteger(trainingPlanId)) {
      return res.status(400).json({ error: "invalid training plan id." });
    }

    try {
      const [planRows] = await db.query(
        "SELECT tpid FROM training_plans WHERE tpid = ? AND created_by_trainer = ?",
        [trainingPlanId, tid],
      );

      if (planRows.length === 0) {
        return res.status(404).json({ error: "training plan not found." });
      }

      const [rows] = await db.query(
        `SELECT
         tpe.id,
         tpe.tpid,
         tpe.eid,
         e.name,
         e.description,
         e.sid,
         s.name AS sport,
         e.dlid,
         dl.name AS difficulty,
         tpe.week_number,
         tpe.day_number,
         tpe.exercise_order,
         tpe.sets,
         tpe.reps,
         tpe.duration_minutes,
         tpe.rest_seconds,
         tpe.notes
       FROM training_plan_exercises tpe
       JOIN exercises e ON e.eid = tpe.eid
       LEFT JOIN sports s ON s.sid = e.sid
       LEFT JOIN difficulty_levels dl ON dl.dlid = e.dlid
       WHERE tpe.tpid = ?
       ORDER BY tpe.week_number ASC, tpe.day_number ASC, tpe.exercise_order ASC`,
        [trainingPlanId],
      );

      return res.status(200).json({
        trainingPlanId,
        count: rows.length,
        exercises: rows,
      });
    } catch (error) {
      console.error("trainer training plan exercises fetch failed.", error);
      return res.status(500).json({ error: "internal server error." });
    }
  },
);

router.post(
  "/training-plans/:tpid/exercises",
  requireAuth,
  requireRole("trainer"),
  async (req, res) => {
    const tid = await requireTrainerContext(req, res);
    if (!tid) return;

    const trainingPlanId = Number(req.params.tpid);
    if (!Number.isInteger(trainingPlanId)) {
      return res.status(400).json({ error: "invalid training plan id." });
    }

    const {
      eid,
      weekNumber,
      dayNumber,
      exerciseOrder,
      sets,
      reps,
      durationMinutes,
      restSeconds,
      notes,
    } = req.body;

    if (!eid || !weekNumber || !dayNumber || !exerciseOrder) {
      return res.status(400).json({
        error: "eid, weekNumber, dayNumber and exerciseOrder are required.",
      });
    }

    const parsedEid = Number(eid);
    const parsedWeekNumber = Number(weekNumber);
    const parsedDayNumber = Number(dayNumber);
    const parsedExerciseOrder = Number(exerciseOrder);
    const parsedSets =
      sets === undefined || sets === null || sets === "" ? null : Number(sets);
    const parsedReps =
      reps === undefined || reps === null || reps === "" ? null : Number(reps);
    const parsedDurationMinutes =
      durationMinutes === undefined ||
      durationMinutes === null ||
      durationMinutes === ""
        ? null
        : Number(durationMinutes);
    const parsedRestSeconds =
      restSeconds === undefined || restSeconds === null || restSeconds === ""
        ? null
        : Number(restSeconds);

    if (
      !Number.isInteger(parsedEid) ||
      !Number.isInteger(parsedWeekNumber) ||
      !Number.isInteger(parsedDayNumber) ||
      !Number.isInteger(parsedExerciseOrder)
    ) {
      return res.status(400).json({
        error: "eid, weekNumber, dayNumber and exerciseOrder must be integers.",
      });
    }

    if (
      (parsedSets !== null && !Number.isInteger(parsedSets)) ||
      (parsedReps !== null && !Number.isInteger(parsedReps)) ||
      (parsedDurationMinutes !== null &&
        !Number.isInteger(parsedDurationMinutes)) ||
      (parsedRestSeconds !== null && !Number.isInteger(parsedRestSeconds))
    ) {
      return res.status(400).json({
        error:
          "sets, reps, durationMinutes and restSeconds must be integers when provided.",
      });
    }

    try {
      const [planRows] = await db.query(
        "SELECT tpid FROM training_plans WHERE tpid = ? AND created_by_trainer = ?",
        [trainingPlanId, tid],
      );

      if (planRows.length === 0) {
        return res.status(404).json({ error: "training plan not found." });
      }

      const [exerciseRows] = await db.query(
        "SELECT eid FROM exercises WHERE eid = ?",
        [parsedEid],
      );

      if (exerciseRows.length === 0) {
        return res.status(404).json({ error: "exercise not found." });
      }

      const [insertResult] = await db.query(
        `INSERT INTO training_plan_exercises
         (tpid, eid, week_number, day_number, exercise_order, sets, reps, duration_minutes, rest_seconds, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          trainingPlanId,
          parsedEid,
          parsedWeekNumber,
          parsedDayNumber,
          parsedExerciseOrder,
          parsedSets,
          parsedReps,
          parsedDurationMinutes,
          parsedRestSeconds,
          notes ?? null,
        ],
      );

      const [rows] = await db.query(
        `SELECT
         tpe.id,
         tpe.tpid,
         tpe.eid,
         e.name,
         e.description,
         e.sid,
         s.name AS sport,
         e.dlid,
         dl.name AS difficulty,
         tpe.week_number,
         tpe.day_number,
         tpe.exercise_order,
         tpe.sets,
         tpe.reps,
         tpe.duration_minutes,
         tpe.rest_seconds,
         tpe.notes
       FROM training_plan_exercises tpe
       JOIN exercises e ON e.eid = tpe.eid
       LEFT JOIN sports s ON s.sid = e.sid
       LEFT JOIN difficulty_levels dl ON dl.dlid = e.dlid
       WHERE tpe.id = ?
       LIMIT 1`,
        [insertResult.insertId],
      );

      return res.status(201).json({
        message: "exercise added to training plan successfully",
        exercise: rows[0],
      });
    } catch (error) {
      if (error?.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          error:
            "exercise already exists for this week/day in the selected training plan.",
        });
      }

      console.error("trainer training plan exercise add failed.", error);
      return res.status(500).json({ error: "internal server error." });
    }
  },
);

router.delete(
  "/training-plans/:tpid/exercises/:id",
  requireAuth,
  requireRole("trainer"),
  async (req, res) => {
    const tid = await requireTrainerContext(req, res);
    if (!tid) return;

    const trainingPlanId = Number(req.params.tpid);
    const trainingPlanExerciseId = Number(req.params.id);

    if (
      !Number.isInteger(trainingPlanId) ||
      !Number.isInteger(trainingPlanExerciseId)
    ) {
      return res.status(400).json({
        error: "invalid training plan id or training plan exercise id.",
      });
    }

    try {
      const [planRows] = await db.query(
        "SELECT tpid FROM training_plans WHERE tpid = ? AND created_by_trainer = ?",
        [trainingPlanId, tid],
      );

      if (planRows.length === 0) {
        return res.status(404).json({ error: "training plan not found." });
      }

      const [exerciseRows] = await db.query(
        "SELECT id FROM training_plan_exercises WHERE id = ? AND tpid = ?",
        [trainingPlanExerciseId, trainingPlanId],
      );

      if (exerciseRows.length === 0) {
        return res
          .status(404)
          .json({ error: "training plan exercise not found." });
      }

      await db.query("DELETE FROM training_plan_exercises WHERE id = ?", [
        trainingPlanExerciseId,
      ]);

      return res.status(200).json({
        message: "training plan exercise deleted successfully",
        id: trainingPlanExerciseId,
        tpid: trainingPlanId,
      });
    } catch (error) {
      console.error("trainer training plan exercise delete failed.", error);
      return res.status(500).json({ error: "internal server error." });
    }
  },
);

export default router;
