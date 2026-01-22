export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      console.log("REQ.USER:", req.user);
      console.log("ROLE TYPE:", typeof req.user?.role);

      return res.status(401).json({ error: "Nicht authentifiziert." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      console.log("REQ.USER:", req.user);
      console.log("ROLE TYPE:", typeof req.user?.role);

      return res.status(403).json({ error: "Keine Berechtigung." });
    }

    next();
  };
}
