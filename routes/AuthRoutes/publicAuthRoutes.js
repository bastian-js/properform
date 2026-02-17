import express from "express";
import bcrypt from "bcrypt";
import { db } from "../../db.js";
import jwt from "jsonwebtoken";

import { requireRole } from "../../middleware/role.js";
import { createRateLimiter } from "../../middleware/rate.js";

import crypto from "crypto";
import { mailer } from "../../functions/mailer.js";

const router = express.Router();

const saltRounds = 10;

router.post(
  "/admin/register",
  createRateLimiter({ windowMs: 15 * 60 * 1000, max: 5 }),
  requireRole("owner"),
  async (req, res) => {
    const { firstname, birthdate, email, password_hash } = req.body;

    if (!firstname || !birthdate || !email || !password_hash)
      return res.status(400).json({ error: "required fields missing." });

    try {
      const hashedPassword = await bcrypt.hash(password_hash, saltRounds);

      await db.execute(
        "INSERT INTO users (firstname, birthdate, email, password_hash, role_id) VALUES (?, ?, ?, ?, 1)",
        [firstname, birthdate || null, email, hashedPassword],
      );

      res.status(201).json({ message: `admin ${firstname} registered.` });
    } catch (error) {
      console.error("admin registration error:", error);
      res.status(500).json({ error: error.message });
    }
  },
);

router.post(
  "/admin/login",
  createRateLimiter({ windowMs: 15 * 60 * 1000, max: 5 }),
  async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ error: "email and password are required." });

    try {
      const [rows] = await db.execute(
        "SELECT * FROM users WHERE email = ? AND role_id = 1",
        [email],
      );

      if (rows.length === 0)
        return res.status(401).json({ error: "invalid credentials." });

      const user = rows[0];

      const valid = await bcrypt.compare(password, user.password_hash);

      if (!valid)
        return res.status(401).json({ error: "invalid credentials." });

      const token = jwt.sign(
        { id: user.uid, email: user.email, role: "owner" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
      );

      res.json({ message: "admin login successful.", token });
    } catch (error) {
      console.error("admin login error:", error);
      res.status(500).json({ error: "server error: " + error.message });
    }
  },
);

router.post(
  "/register",
  createRateLimiter({ windowMs: 15 * 60 * 1000, max: 5 }),
  async (req, res) => {
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
      return res
        .status(400)
        .json({ error: "please fill all required fields." });
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

    try {
      const role_id = 2;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const rawCode = String(Math.floor(Math.random() * 900000) + 100000);

      const codeHash = crypto
        .createHash("sha256")
        .update(rawCode)
        .digest("hex");

      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      const [result] = await db.execute(
        "INSERT INTO users (firstname, birthdate, email, password_hash, weight, height, gender, onboarding_completed, fitness_level, training_frequency, primary_goal, role_id, email_verification_code, email_verification_expires) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
        ],
      );

      try {
        await mailer.sendMail({
          from: '"ProPerform" <no-reply@properform.app>',
          to: email,
          subject: "verify your email",

          text: `
hello ${firstname},

your verification code:

${rawCode}

the code is valid for 15 minutes.
`,

          html: `<p>hello ${firstname},</p><h2>${rawCode}</h2>`,
        });
      } catch (err) {
        return res.json({
          message: "failed to send verification email.",
          error: err.message,
        });
      }

      res.status(201).json({
        message: "user successfully created.",
        uid: result.insertId,
      });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "email already registered." });
      }

      res.status(500).json({
        message: "failed to create user.",
        error: error.message,
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

    const token = jwt.sign({ id: user.uid }, process.env.JWT_SECRET, {
      expiresIn: stayLoggedIn ? "60d" : "3d",
    });

    res.json({
      message: "login successful.",
      token,
      uid: user.uid,
    });
  } catch {
    res.status(500).json({ error: "internal server error." });
  }
});

router.post("/check-verification-code", async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code)
    return res.status(400).json({ error: "email and code are required." });

  try {
    const [rows] = await db.execute(
      `SELECT email_verification_code, email_verification_expires, email_verified FROM users WHERE email = ?`,
      [email],
    );

    if (!rows.length) return res.status(404).json({ error: "user not found." });

    if (rows[0].email_verified === 1)
      return res.status(400).json({ error: "email already verified." });

    const codeHash = crypto.createHash("sha256").update(code).digest("hex");

    if (rows[0].email_verification_code !== codeHash)
      return res
        .status(401)
        .json({ error: "invalid or expired verification code." });

    await db.execute(`UPDATE users SET email_verified = 1 WHERE email = ?`, [
      email,
    ]);

    res.json({ message: "verification code valid." });
  } catch {
    res.status(500).json({ error: "verification check failed." });
  }
});

export default router;
