import express from "express";
import { db } from "../../../db.js";
import { requireAuth } from "../../../middleware/auth.js";

const router = express.Router();

async function disconnectTrainerConnection(req, res) {
  try {
    const uid = req.user.role === "trainer" ? req.body?.uid : req.user.uid;

    if (!uid) {
      return res.status(400).json({ message: "uid is required." });
    }

    const params = [uid];
    let query = "DELETE FROM trainer_athletes WHERE athlete_uid = ?";

    if (req.user.role === "trainer") {
      query += " AND tid = ?";
      params.push(req.user.tid);
    }

    const [result] = await db.execute(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "no trainer connection found." });
    }

    return res
      .status(200)
      .json({ message: "trainer disconnected successfully." });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "server error.", error: err.message });
  }
}

router.get("/disconnect", requireAuth, disconnectTrainerConnection);
router.delete("/disconnect", requireAuth, disconnectTrainerConnection);

export default router;
