# 🚨 Kritische Issues & Bugs – ProPerform Backend

## HIGH PRIORITY

- [x] **MISSING: User Login** – Kein `/auth/userLogin` Endpoint
  - User können sich nicht einloggen (nur Admin)
  - **Lösung:** `POST /auth/userLogin` mit Email/Passwort

- [x] **MISSING: Trainer Login** – Kein `/auth/trainerLogin` Endpoint
  - Trainer können sich nicht authentifizieren
  - **Lösung:** `POST /auth/trainerLogin` mit Email/Passwort

- [x] **NO Role-Check auf `/trainer/createTrainer`** – Jeder mit JWT kann Trainer erstellen
  - **Lösung:** `requireRole(OWNER)` Middleware hinzufügen

- [ ] **NO Role-Check auf `/admin/deleteUser`** – Jeder mit JWT kann User löschen
  - **Lösung:** `requireRole(OWNER)` Middleware hinzufügen

- [ ] **`/trainer/link-athlete` hat kein `requireAuth`** – Öffentlich zugänglich!
  - Jeder kann Athlete mit Code verknüpfen ohne Token
  - **Lösung:** `requireAuth` Middleware vor Handler

- [ ] **Softdelete fehlt** – `DELETE FROM users` ist permanent
  - Datenverlust bei Unfällen
  - **Lösung:** `deleted_at` Timestamp + `WHERE deleted_at IS NULL` in SELECT Queries

- [ ] **NO Email-Verification** – Fake Emails können sich registrieren
  - **Lösung:** Verification-Email mit Token nach `/auth/createUser`

- [ ] **Keine Input-Validation** – Nur Email & Passwort, alles andere unkontrolliert
  - firstname, lastname, phone_number sind nicht validiert
  - **Lösung:** `express-validator` auf alle Felder

## MEDIUM PRIORITY

- [ ] **NO Rate-Limiting** – Brute-Force auf `/auth/adminLogin` möglich
  - **Lösung:** `express-rate-limit` (max 5 Versuche pro 15 Min)

- [ ] **NO Pagination auf `/admin/users`** – Könnte 10.000+ User zurückgeben
  - **Lösung:** `?page=1&limit=20` Query-Parameter

- [ ] **NO User Password Reset** – User können Passwort nicht zurücksetzen
  - **Lösung:** `POST /auth/forgot-password` + Token-basierter Reset-Link

- [ ] **NO Refresh Token** – JWT läuft nach 1h ab, kein automatisches Erneuern
  - **Lösung:** Separate Refresh-Token mit längerer Expiration

- [ ] **Minimales Error-Logging** – Keine strukturierten Logs
  - **Lösung:** `winston` oder `pino` Logger implementieren

- [ ] **NO User Self-Update** – User können ihr Profil nicht ändern
  - **Lösung:** `PUT /user/profile` für Selbst-Updates

- [ ] **NO Trainer-Athlete Relations abfragen** – Trainer sieht eigene Athletes nicht
  - **Lösung:** `GET /trainer/athletes` Endpoint

- [ ] **Keine Audit-Logs** – Admin-Aktionen werden nicht nachverfolgbar
  - **Lösung:** Separate `audit_logs` Tabelle

## LOW PRIORITY

- [ ] **NO API Documentation** – Swagger/OpenAPI wäre hilfreich
  - **Lösung:** `swagger-jsdoc` + `swagger-ui-express`

- [ ] **NO CORS Configuration** – Frontend kann nicht requests senden
  - **Lösung:** `express.cors()` mit whitelist Origins

- [ ] **NO Request Size Limit** – Theoretisch unbegrenzte Uploads möglich
  - **Lösung:** `express.json({ limit: '10mb' })`

- [ ] **Token im Cookie statt Header** – Sicherer gegen XSS
  - **Lösung:** HttpOnly Cookies statt Authorization Header

---

## Checklist für schnelle Fixes (< 2 Stunden)

```markdown
### Sofort implementieren:

- [x] User Login Endpoint
- [x] Trainer Login Endpoint
- [ ] Role-Check Middleware
- [ ] requireAuth auf /trainer/link-athlete
- [ ] Rate-Limiting auf /auth/\* Routes

### Diese Woche:

- [ ] Passwort-Reset Flow
- [ ] Email-Verification
- [ ] Pagination auf /admin/users
- [ ] Input-Validation mit express-validator
- [ ] Strukturiertes Logging
```

eine route bitte die einem user seine eigenen daten zurückgibt
