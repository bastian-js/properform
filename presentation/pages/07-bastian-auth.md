---
layout: two-cols
---

# Authentifizierung mit JWT

Sichere Nutzerauthentifizierung über **JSON Web Tokens** – kein Session-State am Server nötig.

<div class="mt-3 mb-1 font-bold">Ablauf:</div>

1. Nutzer registriert sich oder loggt ein
2. Server prüft Credentials und erstellt ein **JWT**
3. Token wird im Client gespeichert und bei jedem Request mitgeschickt
4. Middleware verifiziert den Token und schützt alle privaten Routen

<div class="mt-3 mb-1 font-bold">Vorteile:</div>

- Stateless & skalierbar
- Kein serverseitiger Session-Store nötig
- Einfache Integration in Mobile App & Web

::right::

<div class="ml-8 mt-2">

```js
// Token erstellen beim Login
const accessToken = jwt.sign(
  { uid: newUserId, role: "user" },
  process.env.JWT_SECRET,
  { expiresIn: "15m" },
);

// Middleware zum Schutz von Routen
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ error: "not authenticated." });

  const token = authHeader.split(" ")[1];

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "token invalid or expired." });
  }
}
```

</div>
