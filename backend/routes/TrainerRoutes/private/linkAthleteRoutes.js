import express from "express";
import { db } from "../../../db.js";
import { requireAuth } from "../../../middleware/auth.js";
import { requireRole } from "../../../middleware/role.js";

const router = express.Router();

router.post("/connect", requireAuth, async (req, res) => {
  const { invite_code, uid: athleteUid } = req.body;

  try {
    if (req.user.role === "user") {
      if (!invite_code || invite_code.trim() === "") {
        return res.status(400).json({
          error: "invite code is required.",
        });
      }

      const uid = req.user.uid;

      const [trainerRows] = await db.execute(
        "SELECT tid, firstname, lastname FROM trainers WHERE invite_code = ?",
        [invite_code.trim()],
      );

      if (trainerRows.length === 0) {
        return res.status(400).json({
          error: "invalid invite code.",
        });
      }

      const trainer = trainerRows[0];

      const [existing] = await db.execute(
        "SELECT tid FROM trainer_athletes WHERE athlete_uid = ?",
        [uid],
      );

      if (existing.length > 0) {
        return res.status(409).json({
          error: "user already connected to a trainer.",
        });
      }

      await db.execute(
        "INSERT INTO trainer_athletes (tid, athlete_uid, assigned_date) VALUES (?, ?, CURDATE())",
        [trainer.tid, uid],
      );

      return res.status(200).json({
        message: "trainer connected successfully.",
        trainer: {
          tid: trainer.tid,
          firstname: trainer.firstname,
          lastname: trainer.lastname,
        },
      });
    }

    if (req.user.role === "trainer") {
      if (!athleteUid) {
        return res.status(400).json({
          error: "uid is required.",
        });
      }

      const tid = req.user.tid;

      const [existing] = await db.execute(
        "SELECT tid FROM trainer_athletes WHERE athlete_uid = ?",
        [athleteUid],
      );

      if (existing.length > 0) {
        if (Number(existing[0].tid) === Number(tid)) {
          return res.status(200).json({
            message: "athlete already connected.",
          });
        }

        return res.status(409).json({
          error: "user already connected to a trainer.",
        });
      }

      await db.execute(
        "INSERT INTO trainer_athletes (tid, athlete_uid, assigned_date) VALUES (?, ?, CURDATE())",
        [tid, athleteUid],
      );

      return res.status(200).json({
        message: "athlete connected successfully.",
      });
    }

    return res.status(403).json({ error: "not authorized." });
  } catch (error) {
    console.error("connect trainer error.", error);
    return res.status(500).json({
      error: "internal server error.",
    });
  }
});

export default router;
