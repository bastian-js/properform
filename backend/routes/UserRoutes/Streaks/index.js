import express from "express";
import GetStreaksByType from "./GetStreaksByType.js";
import UpdatedateStreak from "./UpdateStreak.js";

const router = express.Router();

router.use(UpdatedateStreak);
router.use(GetStreaksByType);

export default router;
