import express from "express";
import bcrypt from "bcrypt";
import { db } from "../../../db.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { mailer } from "../../../helpers/mailer.js";

import { buildVerificationEmail } from "../../../helpers/buildMails.js";

import { createRateLimiter } from "../../../middleware/rate.js";

const router = express.Router();

const saltRounds = Number(process.env.SALT_ROUNDS) || 10;

const allowedOrigins = ["http://localhost:5173", "https://docs.properform.app"];

router.post(
  "/register",
  createRateLimiter({ windowMs: 15 * 60 * 1000, max: 5 }),
  async (req, res) => {
    const origin = req.headers.origin;
    const docsKey = req.headers["x-docs-key"];

    let email_verified = 0;

    if (allowedOrigins.includes(origin) && docsKey === process.env.DOCS_KEY) {
      email_verified = 1;
    }

    const {
      firstname,
      birthdate,
      email,
      password,
      weight,
      height,
      gender,
      onboarding_completed,
      fitness_level,
      training_frequency,
      primary_goal,
      stayLoggedIn,
      invite_code,
    } = req.body;

    if (
      !firstname ||
      !birthdate ||
      !email ||
      !password ||
      weight == null ||
      height == null ||
      !gender ||
      onboarding_completed === undefined ||
      !fitness_level ||
      training_frequency == null ||
      !primary_goal
    ) {
      return res.status(400).json({
        error: "please fill all required fields.",
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_-])[A-Za-z\d@$!%*?&#_-]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "password must be at least 8 characters long and contain uppercase, lowercase, number, and special character.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "invalid email address.",
      });
    }

    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const role_id = 2;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const rawCode = String(crypto.randomInt(100000, 1000000));
      const codeHash = crypto
        .createHash("sha256")
        .update(rawCode)
        .digest("hex");
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      const [result] = await connection.execute(
        `INSERT INTO users 
        (firstname, birthdate, email, password_hash, weight, height, gender, onboarding_completed, fitness_level, training_frequency, primary_goal, role_id, email_verification_code, email_verification_expires, email_verified) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          firstname,
          birthdate,
          email,
          hashedPassword,
          weight,
          height,
          gender,
          onboarding_completed,
          fitness_level,
          training_frequency,
          primary_goal,
          role_id,
          codeHash,
          expiresAt,
          email_verified,
        ],
      );

      const newUserId = result.insertId;

      if (invite_code?.trim()) {
        const [trainerRows] = await connection.execute(
          "SELECT tid FROM trainers WHERE invite_code = ?",
          [invite_code.trim()],
        );

        if (trainerRows.length === 0) {
          await connection.rollback();
          return res.status(400).json({
            error: "invalid invite code.",
          });
        }

        const trainerId = trainerRows[0].tid;

        await connection.execute(
          "INSERT INTO trainer_athletes (tid, uid, assigned_date) VALUES (?, ?, CURDATE())",
          [trainerId, newUserId],
        );
      }

      await connection.commit();
      connection.release();

      const token = jwt.sign(
        { uid: newUserId, role: "user" },
        process.env.JWT_SECRET,
        {
          expiresIn: stayLoggedIn ? "60d" : "3d",
        },
      );

      const { subject, text, html } = buildVerificationEmail(
        firstname,
        rawCode,
      );

      mailer
        .sendMail({
          from: '"ProPerform" <no-reply@properform.app>',
          to: email,
          subject,
          text,
          html,
        })
        .catch(console.error);

      return res.status(201).json({
        message: "user successfully created.",
        token,
        uid: newUserId,
      });
    } catch (error) {
      await connection.rollback();
      connection.release();

      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          error: "email already registered.",
        });
      }

      return res.status(500).json({
        error: "registration failed.",
      });
    }
  },
);

router.post("/login", async (req, res) => {
  let { email, password, stayLoggedIn } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "please fill all required fields.",
    });
  }

  email = email.trim().toLowerCase();

  if (stayLoggedIn !== undefined && typeof stayLoggedIn !== "boolean") {
    return res.status(400).json({
      error: "invalid value for stayloggedin.",
    });
  }

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (!rows.length)
      return res.status(401).json({ error: "invalid credentials." });

    const user = rows[0];

    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) return res.status(401).json({ error: "invalid credentials." });

    if (!user.email_verified) {
      return res.status(403).json({ error: "email not verified." });
    }

    await db.query("UPDATE users SET last_login = NOW() WHERE uid = ?", [
      user.uid,
    ]);

    const userRole = user.role_id === 1 ? "owner" : "user";

    const token = jwt.sign(
      { uid: user.uid, role: userRole },
      process.env.JWT_SECRET,
      {
        expiresIn: stayLoggedIn ? "60d" : "3d",
      },
    );

    res.json({
      message: "login successful.",
      token,
      uid: user.uid,
      role: userRole,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error.", error: error.message });
  }
});

export default router;
