import express from "express";

import { requireAuth } from "../../middleware/auth.js";

const router = express.Router();

router.post("/verify-token", requireAuth, async (req, res) => {
  try {
    res.status(200).json({ valid: true, uid: req.user.uid });
  } catch (error) {
    console.error("invalid token.:", error);
    res.status(500).json({ message: "invalid token.", error: error.message });
  }
});

export default router;
