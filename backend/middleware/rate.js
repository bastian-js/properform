import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export function createRateLimiter({
  windowMs = 15 * 60 * 1000,
  max = 100,
  key = "ip",
} = {}) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,

    keyGenerator: (req) => {
      if (key === "user" && req.user?.uid) {
        return `user:${req.user.uid}`;
      }
      return req.ip;
    },

    handler: (req, res) => {
      console.log("RATE LIMIT HIT");
      res.status(429).json({
        error: "rate_limit.",
        message: "too many requests.",
      });
    },
  });
}
