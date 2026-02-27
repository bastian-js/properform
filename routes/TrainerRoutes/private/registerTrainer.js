import express from "express";
import { db } from "../../../db.js";
import { generateTrainerCode } from "../../../helpers/TrainerFunctions.js";
import { requireRole } from "../../../middleware/role.js";
import { createRateLimiter } from "../../../middleware/rate.js";
import { requireAuth } from "../../../middleware/auth.js";
import bcrypt from "bcrypt";

const SALT_RONDS = 10;

const router = express.Router();

router.post(
  "/",
  requireAuth,
  requireRole("owner"),
  createRateLimiter({ windowMs: 15 * 60 * 1000, max: 10 }),
  async (req, res) => {
    const { firstname, lastname, password, birthdate, email, phone_number } =
      req.body;

    if (
      !firstname ||
      !lastname ||
      !email ||
      !phone_number ||
      !birthdate ||
      !password
    ) {
      return res.status(400).json({ error: "Pflichtfelder fehlen" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const trainerCode = generateTrainerCode();

      const [result] = await db.execute(
        "INSERT INTO trainers (firstname, lastname, birthdate, email, password_hash, phone_number, invite_code) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          firstname,
          lastname,
          birthdate,
          email,
          hashedPassword,
          phone_number,
          trainerCode,
        ],
      );
      res.status(201).json({
        message: `Trainer ${firstname} ${lastname} erstellt.`,
        trainerId: result.insertId,
        invite_code: trainerCode,
      });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res
          .status(409)
          .json({ error: "Ein Trainer mit dieser E-Mail existiert bereits." });
      }

      res.status(500).json({ error: error.message });
    }
  },
);

export default router;
