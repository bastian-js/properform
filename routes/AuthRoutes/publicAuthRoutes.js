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
      return res.status(400).json({ error: "Pflichtfelder fehlen" });

    try {
      const hashedPassword = await bcrypt.hash(password_hash, saltRounds);
      await db.execute(
        "INSERT INTO users (firstname, birthdate, email, password_hash, role_id) VALUES (?, ?, ?, ?, 1)",
        [firstname, birthdate || null, email, hashedPassword],
      );
      res.status(201).json({ message: `Admin ${firstname} registriert.` });
    } catch (error) {
      console.error("Admin-Registrierungsfehler:", error);
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
        .json({ error: "E-Mail und Passwort sind erforderlich" });

    try {
      const [rows] = await db.execute(
        "SELECT * FROM users WHERE email = ? AND role_id = 1",
        [email],
      );

      if (rows.length === 0)
        return res
          .status(401)
          .json({ error: "Ungültige Anmeldeinformationen" });

      const user = rows[0];
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid)
        return res
          .status(401)
          .json({ error: "Ungültige Anmeldeinformationen" });

      const token = jwt.sign(
        { id: user.uid, email: user.email, role: "owner" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
      );

      res.json({ message: "Admin-Login erfolgreich", token });
    } catch (error) {
      console.error("Admin-Anmeldefehler:", error);
      res.status(500).json({ error: "Serverfehler: " + error.message });
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
        .json({ error: "Bitte füllen Sie alle erforderlichen Felder aus." });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_-])[A-Za-z\d@$!%*?&#_-]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Das Passwort muss mindestens 8 Zeichen lang sein und mindestens einen Großbuchstaben, einen Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Die E-Mail-Adresse ist ungültig.",
      });
    }

    try {
      const role_id = 2;

      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // token generation for email verification
      const rawCode = String(Math.floor(Math.random() * 900000) + 100000);

      const codeHash = crypto
        .createHash("sha256")
        .update(rawCode)
        .digest("hex");

      const expiresIn = 15 * 60 * 1000; // 15 minuten

      const expiresAt = new Date(Date.now() + expiresIn); // datum + 15 minuten

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
          subject: "Bestätige deine E-Mail",
          html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
          .container { max-width: 500px; margin: 0 auto; padding: 20px; }
          .email-wrapper { background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 16px; color: #333; margin: 0 0 24px 0; }
          .code-section { background: #f9f9f9; border-left: 4px solid #667eea; padding: 20px; margin: 30px 0; border-radius: 4px; }
          .code-label { font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
          .code { font-size: 32px; font-weight: 700; color: #667eea; letter-spacing: 4px; font-family: 'Courier New', monospace; margin: 0; }
          .info { font-size: 13px; color: #666; margin: 20px 0 0 0; line-height: 1.6; }
          .footer { background: #f9f9f9; padding: 20px 30px; border-top: 1px solid #eee; font-size: 12px; color: #999; line-height: 1.6; }
          .footer a { color: #667eea; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="email-wrapper">
            <div class="header">
              <h1>ProPerform</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Email-Bestätigung</p>
            </div>
            
            <div class="content">
              <p class="greeting">Hey ${firstname},</p>
              
              <p style="font-size: 15px; color: #555; line-height: 1.6;">
                vielen Dank für deine Registrierung! Um dein Konto zu aktivieren, nutze bitte den folgenden Code:
              </p>
              
              <div class="code-section">
                <div class="code-label">Bestätigungscode</div>
                <p class="code">${rawCode}</p>
              </div>
              
              <p class="info">
                <strong>⏱️ Wichtig:</strong> Dieser Code ist <strong>15 Minuten</strong> lang gültig.
              </p>
              
              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                Falls du dich nicht registriert hast, ignoriere diese E-Mail einfach.
              </p>
            </div>
            
            <div class="footer">
              <p style="margin: 0;">
                <strong>ProPerform</strong> | <a href="https://properform.app">properform.app</a><br>
                Diese ist eine automatisch generierte E-Mail. Bitte antworte nicht auf diese Nachricht.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `,
        });
      } catch (err) {
        return res.json({
          message: "Fehler beim Versenden der E-Mail",
          error: err.message,
        });
      }

      res.status(201).json({
        message: "Benutzer erfolgreich erstellt",
        uid: result.insertId,
      });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "E-Mail bereits registriert." });
      }

      console.error("Fehler beim Erstellen des Benutzers:", error);
      res.status(500).json({
        message: "Fehler beim Erstellen des Benutzers",
        error: error.message,
      });
    }
  },
);

router.post(
  "/login",
  createRateLimiter({ windowMs: 15 * 60 * 1000, max: 5 }),
  async (req, res) => {
    let { email, password, stayLoggedIn } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Bitte alle erforderlichen Felder ausfüllen",
      });
    }

    email = email.toLowerCase().trim();

    if (stayLoggedIn !== undefined && typeof stayLoggedIn !== "boolean") {
      return res.status(400).json({
        error: "Ungültiger Wert für 'stayLoggedIn'",
      });
    }

    const stayLoggedInSafe = stayLoggedIn === true;

    try {
      const [rows] = await db.query(
        "SELECT * FROM users WHERE email = ? LIMIT 1",
        [email],
      );

      if (rows.length === 0) {
        return res.status(401).json({
          error: "Ungültige Zugangsdaten",
        });
      }

      const user = rows[0];

      const passwordIsValid = await bcrypt.compare(
        password,
        user.password_hash,
      );

      if (!passwordIsValid) {
        return res.status(401).json({
          error: "Ungültige Zugangsdaten",
        });
      }

      const tokenExpiresIn = stayLoggedInSafe ? "60d" : "3d";

      const token = jwt.sign(
        { id: user.uid, role: "user" },
        process.env.JWT_SECRET,
        { expiresIn: tokenExpiresIn },
      );

      return res.json({
        message: "Login erfolgreich",
        token,
        uid: user.uid,
      });
    } catch (err) {
      console.error("Fehler beim Login:", err);
      return res.status(500).json({
        error: "Interner Serverfehler",
      });
    }
  },
);

router.post(
  "/trainers/login",
  createRateLimiter({ windowMs: 15 * 60 * 1000, max: 5 }),
  async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Bitte alle erforderlichen Felder ausfüllen",
      });
    }

    try {
      const [rows] = await db.query(
        "SELECT * FROM trainers WHERE email = ? LIMIT 1",
        [email],
      );

      if (rows.length === 0) {
        return res.status(401).json({
          error: "Ungültige Zugangsdaten",
        });
      }

      const trainer = rows[0];

      const passwordIsValid = await bcrypt.compare(
        password,
        trainer.password_hash,
      );

      if (!passwordIsValid) {
        return res.status(401).json({
          error: "Ungültige Zugangsdaten",
        });
      }

      const token = jwt.sign(
        { id: trainer.tid, role: "trainer" },
        process.env.JWT_SECRET,
        { expiresIn: "3d" },
      );

      return res.json({
        message: "Login erfolgreich",
        token,
        tid: trainer.tid,
      });
    } catch (err) {
      console.error("Fehler beim Trainer-Login:", err);
      return res.status(500).json({
        error: "Interner Serverfehler",
      });
    }
  },
);

router.post("/check-verification-code", async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({
      error: "E-Mail und Code sind erforderlich",
    });
  }

  try {
    const [rows] = await db.execute(
      `SELECT email_verification_code, email_verification_expires
       FROM users
       WHERE email = ?
       LIMIT 1`,
      [email],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Kein Benutzer mit dieser E-Mail gefunden",
      });
    }

    const { email_verification_code, email_verification_expires } = rows[0];

    const codeHash = crypto.createHash("sha256").update(code).digest("hex");

    if (email_verification_code !== codeHash) {
      return res.status(401).json({
        error: "Verifikationscode ist ungültig",
      });
    }

    const expiresAt = new Date(email_verification_expires);

    if (expiresAt <= new Date()) {
      return res.status(410).json({
        error: "Verifikationscode ist abgelaufen",
      });
    }

    return res.status(200).json({
      message: "Verifikationscode gültig",
    });
  } catch (err) {
    return res.status(500).json({
      error: "Fehler bei der Code-Überprüfung",
    });
  }
});

export default router;
