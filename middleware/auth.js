import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function requireAuth(req, res, next) {
  const authHeader = req.headers?.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No authorization header" });
  }

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ error: "Nicht eingeloggt" });

  const token = authHeader.slice(7); // nach "Bearer "

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: "Ungültiger Token" });
  }
}
