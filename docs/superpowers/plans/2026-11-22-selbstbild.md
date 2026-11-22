# Selbstbild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Das Artefakt „Diagnosekriterien & Selbsttests“ als statische, quelloffene Website `selbstbild.jaksch.workers.dev` mit verschlüsselter UUID-Speicherung in Cloudflare D1 (EU) veröffentlichen.

**Architecture:** Cloudflare Worker mit Static Assets. Die Seite ist reines HTML/CSS/JS ohne Build (ES-Module). Ein kleiner Worker (`src/worker.js`) bedient nur `/api/s/:id` und den täglichen Cron. Der Browser verschlüsselt alle Antworten (AES-256-GCM, Schlüssel per HKDF aus der UUID im `#`-Teil der URL), der Server sieht nur Fingerabdruck und Chiffretext.

**Tech Stack:** Vanilla JS (ES2022, Web Crypto), Cloudflare Workers + D1, Wrangler 4, node:test.

## Global Constraints

- Sprache der Oberfläche: Deutsch, du-Form wie im Original.
- Keine Freitext-Eingaben, die gespeichert werden. Der Filter-Text wird nie gespeichert.
- Keine externen Ressourcen zur Laufzeit (keine CDNs, keine Google Fonts, kein Tracking, keine Cookies).
- `localStorage` nur für den eigenen Stand (Schlüssel mit Präfix `selbstbild:`).
- Standard ausgeblendet: `alexithymie`, `ataxie`, `dyskalkulie`, `dyspraxie`, `dysarthrie`.
- Löschfrist: 24 Monate (730 Tage) ohne Änderung.
- D1 mit `--jurisdiction=eu`.
- Originaldatei `quelle/artefakt-original.html` enthält persönliche Antworten und ist per `.gitignore` ausgeschlossen.

---

### Task 1: Gerüst und Herauslösen aus dem Artefakt

**Files:**
- Create: `package.json`, `wrangler.jsonc`, `schema.sql`, `public/index.html`, `public/css/style.css`, `public/js/inhalte.js`, `public/js/app.js`, `public/fonts/*`, `public/_headers`, `.claude/launch.json`
- Quelle: `quelle/artefakt-original.html` (Zeilen: CSS im `<style>`, Body bis `</main>`, Skript 965–2652)

**Interfaces:**
- Produces: `inhalte.js` exportiert `G, R, T, XT, XAREAS, CLS_LABEL, CLS_LV, CLS_OPTS, MDQ_P, TSHORT, DA_ENTW, DA_TAGS, DIFF_TAGS, XDESC`.
- Produces: `app.js` importiert `inhalte.js` und `speicher.js`; exportiert nichts.

- [ ] Schriften (Atkinson Hyperlegible 400/400i/700, Newsreader variabel) aus `@fontsource` (OFL) nach `public/fonts/` legen, `@font-face` in `style.css`.
- [ ] CSS übernehmen, Anhang-/Viewer-Regeln (`.att*`, `.vw-*`, `.viewer`) und `body.ro`-Regeln entfernen.
- [ ] Body übernehmen, interne `href="#bereich"` → `href="/bereich"` (`#uebersicht` → `/`), Status-Zeile entfernen.
- [ ] Skript aufteilen: Daten nach `inhalte.js`, Rest nach `app.js`; entfernen: Schnappschuss, `migrate`/Legacy, Anhänge, Viewer, pdf.js, `connect()`/Online-Speicher, `EDIT`/`applyMode`, `summary*`, `window.__dx`.
- [ ] `wrangler dev` startet, Seite lädt ohne Konsolenfehler, alle Reiter rendern.
- [ ] Commit.

### Task 2: Verschlüsselung und Prüfung (TDD)

**Files:**
- Create: `public/js/krypto.js`, `test/krypto.test.mjs`

**Interfaces:**
- Produces: `istUuid(s): boolean`, `neueUuid(): string`, `ableiten(uuid): Promise<{id: string(64 hex), key: CryptoKey}>`, `verschluesseln(key, obj): Promise<{iv, ct}>` (base64url), `entschluesseln(key, {iv, ct}): Promise<obj>` (wirft bei falschem Schlüssel).

- [ ] Tests: UUID-Erkennung; `ableiten` deterministisch (gleiche UUID → gleiche id), verschiedene UUIDs → verschiedene ids; Hin und zurück liefert dasselbe Objekt; falscher Schlüssel wirft; iv ist 16 Zeichen base64url (12 Byte).
- [ ] Tests laufen rot, Umsetzung, Tests grün (`node --test test/`).
- [ ] Commit.

### Task 3: Worker-API und Cron (TDD)

**Files:**
- Create: `src/worker.js`, `test/worker.test.mjs`, `schema.sql`

**Interfaces:**
- `GET /api/s/:id` → 200 `{iv, ct, stand}` · 404 · 400
- `PUT /api/s/:id` Body `{iv, ct, stand}` → 204 · 409 (älterer Stand) · 400 · 413 · 429
- `DELETE /api/s/:id` → 204
- `scheduled()` löscht `geaendert < heute − 730` (Tage seit Epoche).
- Tabelle `staende(id TEXT PRIMARY KEY, iv TEXT, ct TEXT, stand INTEGER, geaendert INTEGER)`.

- [ ] Tests mit Ersatz-D1 (Map): ungültige id → 400; PUT/GET Hin und zurück; älterer `stand` → 409; zu groß → 413; DELETE; Cron löscht alte Einträge; fremde Pfade → `env.ASSETS.fetch`.
- [ ] Umsetzung, Tests grün, Commit.

### Task 4: Speicher-Modul und Speicher-Punkt

**Files:**
- Create: `public/js/speicher.js`
- Modify: `public/index.html` (Punkt in der Navigation, Kopfzeile), `public/css/style.css`, `public/js/app.js`

**Interfaces:**
- Consumes: `krypto.js`
- Produces: `starten({holen, setzen, pruefen}): Promise<void>` (lädt Stand, ruft `setzen(daten)`), `geaendert(daten)` (nach jeder Änderung), Zustand am Punkt.

- [ ] Lokal sofort speichern, Server nur nach Zustimmung, Abgleich nach `stand`, Wiederholung mit Abstand (15 s, 1 min, 5 min, 15 min, 30 min), `online`/`visibilitychange` lösen Wiederholung aus.
- [ ] Popup: Kurzfassung, Farberklärung, Zustimmung, Link kopieren, Export/Import, Löschen (zweistufiger Knopf), Link Datenschutz; Escape und Klick außerhalb schließen.
- [ ] Prüfen im Browser, Commit.

### Task 5: Ausblenden, Filter, Fragebogen-Karten, Navigation per Pfad

**Files:**
- Modify: `public/js/app.js`, `public/index.html`, `public/css/style.css`, `public/js/inhalte.js`

- [ ] `h.<bereich>`-Schlüssel in `validKey`, Kacheln mit Haken, „Ausgeblendet (n)“, Banner im ausgeblendeten Bereich, Filter auf Navigation, Gesamtbild, Einleitung, Testtabelle (`data-areas`), Testergebnisse.
- [ ] Suchfeld mit Normalisierung (klein, ohne Diakritika, ß→ss), UND-Verknüpfung, „Keine Treffer“.
- [ ] Screenshot-/PDF-Hinweis je Fragebogen-Karte, Unter-Skalen-Kasten mit Kostenhinweis, `.ext`-Feld entfernt, PHQ-9-Frage-9-Hilfe.
- [ ] History-Navigation (`/bereich` + `#uuid` erhalten), `popstate`.
- [ ] Prüfen im Browser, Commit.

### Task 6: Impressum, Datenschutz, README, Verzeichnis, AGENTS.md

**Files:**
- Create: `public/impressum.html`, `public/datenschutz.html`, `README.md`, `LICENSE`, `docs/verarbeitungsverzeichnis.md`, `AGENTS.md`, `CLAUDE.md`

- [ ] Inhalte laut Spec, Fußzeile auf allen Seiten.
- [ ] Commit.

### Task 7: Gesamtprüfung und Veröffentlichung

- [ ] Komplettprüfung lokal (Spec „Prüfung“), Mobil, Dunkelmodus, Konsole.
- [ ] GitHub-Repo `carstenjaksch/selbstbild` (öffentlich) anlegen, pushen.
- [ ] `wrangler login` (Carsten im Browser), `wrangler d1 create selbstbild --jurisdiction=eu`, Schema anwenden, `wrangler deploy`.
- [ ] Live-Prüfung auf `https://selbstbild.jaksch.workers.dev`.
