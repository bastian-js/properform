---
layout: two-cols
---

# REST API & Datenbank

Das Backend stellt alle Daten der Applikation strukturiert über eine **REST API** bereit.

<div class="mt-3 mb-1 font-bold">Kernaufgaben:</div>

- Bereitstellung aller Daten für die Mobile App (Übungen, Trainingspläne, Statistiken)
- CRUD-Endpunkte zum **Erstellen, Lesen, Aktualisieren und Löschen** von Ressourcen
- Datenbankanbindung & Verwaltung der Datenbankstruktur
- Saubere Trennung von Routen, Controllern und Datenbanklogik

<div class="mt-3 mb-1 font-bold">Tech Stack:</div>

`Node.js` · `Express.js` · `REST`

::right::

<div class="ml-8 mt-2">

```js
router.get("/:tpid", requireAuth, async (req, res) => {
  const { tpid } = req.params;
  const userId = req.user.uid;

  try {
    const [rows] = await db.query(
      `SELECT tp.tpid, tp.name, tp.description,
              s.name AS sport, dl.name AS difficulty,
              tp.duration_weeks, tp.sessions_per_week
       FROM training_plans tp
       LEFT JOIN sports s ON tp.sid = s.sid
       LEFT JOIN difficulty_levels dl ON tp.dlid = dl.dlid
       WHERE tp.created_by_user = ? AND tp.tpid = ?`,
      [userId, tpid]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Not found." });

    return res.status(200).json({ plan: rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

</div>
