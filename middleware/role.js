export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Nicht authentifiziert." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Keine Berechtigung." });
    }

    next();
  };
}
