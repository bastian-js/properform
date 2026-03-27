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
    skip: (req) => req.method === "OPTIONS",

    keyGenerator: (req) => {
      const routeScope = `${req.method}:${req.baseUrl}${req.route?.path || req.path}`;

      if (key === "user" && req.user?.uid) {
        return `${routeScope}:user:${req.user.uid}`;
      }

      const ipKey = ipKeyGenerator(req.ip || req.socket?.remoteAddress || "");
      return `${routeScope}:ip:${ipKey}`;
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
