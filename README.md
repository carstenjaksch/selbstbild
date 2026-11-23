# Selbstbild

**Diagnosekriterien und Selbsttests zum Abhaken**: ADHS, Autismus, AuDHS, Depression, bipolare Störungen,
Migräne, Alexithymie, episodische Ataxie Typ 2, Dyskalkulie, Dyspraxie und Dysarthrie. Kriterien nach ICD-10-GM,
ICD-11 und DSM-5-TR (sinngemäß), Checklisten, eingebaute Kurztests (ASRS-v1.1, PHQ-9, WHO-5) und ein Gesamtbild.

**Live:** derzeit offline

> **Keine Diagnose.** Selbstbild dient der Information und Selbstreflexion. Es ersetzt keine ärztliche oder
> psychotherapeutische Abklärung.

## Funktionen

- Merkmale abhaken (trifft zu / teilweise), Auswertung je Bereich und Gesamtbild aus allen Quellen
- Übersicht: Bereiche abhaken, damit sie unter „Ausgeblendet“ verschwinden; Kacheln per Griff anordnen
  (Maus, Finger oder Pfeiltasten); Filter über Titel, Codes und Texte
- Ergebnisse externer Fragebögen eintragen (nur Zahlen, keine Freitexte)
- Export und Import der Antworten als Datei

## Speichern und Datenschutz

- **Lokal:** Jede Änderung liegt sofort im Browser (`localStorage`).
- **Server, nur mit Zustimmung:** verschlüsselt bei **Cloudflare**, Datenbank **D1 mit Datenhaltung in der EU**.
- **Verschlüsselung im Browser:** Aus einer zufälligen UUID, die nur hinter dem `#` des persönlichen Links steht,
  leitet der Browser einen AES-256-GCM-Schlüssel ab (HKDF) und einen SHA-256-Fingerabdruck als Datenbank-Kennung.
  Der `#`-Teil wird nie an einen Server gesendet. Der Server sieht nur Fingerabdruck und Chiffretext und kann
  nichts lesen, auch der Betreiber nicht.
- **Aufbewahrung:** Ein täglicher Cron-Job löscht Stände, die **24 Monate** nicht geändert wurden. Löschen geht
  jederzeit im Speicher-Fenster („Vom Server löschen“).
- Ist der Server nicht erreichbar oder das kostenlose Tageskontingent erschöpft, bleibt der Stand lokal und wird
  automatisch nachgereicht (kann bis zu einem Tag dauern).
- Keine Cookies, kein Tracking, keine Drittinhalte; Schriften liegen lokal. Details:
  [Datenschutzerklärung](https://selbstbild.jaksch.workers.dev/datenschutz).

## Aufbau

```
public/              statische Seite (ohne Build)
  index.html         alle Bereiche
  js/inhalte.js      Checklisten, Tests, Texte (Daten)
  js/app.js          Auswertungen, Übersicht, Filter, Navigation
  js/speicher.js     lokal + Server, Zustimmung, Speicher-Punkt, Import/Export
  js/krypto.js       Verschlüsselung (Web Crypto)
src/worker.js        API GET/PUT/DELETE /api/s/:id und Cron-Löschung
schema.sql           Tabelle staende
wrangler.jsonc       Cloudflare-Konfiguration
test/                node:test
```

## Entwicklung

```bash
npm install
npm run db:local     # lokale D1-Datenbank anlegen
npm run dev          # http://localhost:8787
npm test
```

## Veröffentlichen (Cloudflare Workers)

Jeder Push auf `main` wird automatisch veröffentlicht (Cloudflare Workers Builds, Befehl `npx wrangler deploy`).
Einmalige Einrichtung für einen eigenen Fork:

```bash
npx wrangler login
npx wrangler d1 create selbstbild --jurisdiction=eu   # database_id in wrangler.jsonc eintragen
npm run db:remote
npm run deploy
```

## Lizenz

Quellcode: [MIT](LICENSE). Ausgenommen sind die eingebauten Fragebögen, die ihren Rechteinhabern gehören:
ASRS-v1.1 Screener (© New York University and President and Fellows of Harvard College),
PHQ-9 (deutsche Version © Prof. Dr. Bernd Löwe, UKE Hamburg), WHO-5 (© Psychiatric Research Unit, WHO
Collaborating Center for Mental Health). Schriften: Atkinson Hyperlegible und Newsreader, SIL Open Font License
(`public/fonts/LICENSE-*.txt`).

Impressum: <https://selbstbild.jaksch.workers.dev/impressum>

🤖 Generated with [Claude Code](https://claude.com/claude-code)
