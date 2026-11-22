# Selbstbild – Projekt-Erinnerungen

Öffentliche Fassung des claude.ai-Artefakts „Diagnosekriterien & Selbsttests“ (`Q3DTfzcjDNrTZtdZCQgXHd`).
Privates Projekt von Carsten Jaksch. Repo `carstenjaksch/selbstbild` (öffentlich, MIT),
live `https://selbstbild.jaksch.workers.dev` (privates Cloudflare-Konto, Subdomain `jaksch.workers.dev`).
Konzept: `docs/superpowers/specs/2026-11-22-selbstbild-design.md`, Plan: `docs/superpowers/plans/2026-11-22-selbstbild.md`.

## Architektur

- **Cloudflare Worker mit Static Assets** (nicht Pages: Cloudflare entwickelt nur Workers weiter, Workers hat Cron).
  `public/` ohne Build, ES-Module. `src/worker.js` bedient nur `/api/s/:id` (`run_worker_first: ["/api/*"]`),
  alles andere sind Assets mit SPA-Fallback (Pfade wie `/adhs` liefern `index.html`).
- **Datenbank:** D1 `selbstbild`, Tabelle `staende(id, iv, ct, stand, geaendert)`. Jurisdiction `eu` geht **nur beim
  Anlegen** (`wrangler d1 create selbstbild --jurisdiction=eu`), nachträglich nicht.
- **Verschlüsselung (`public/js/krypto.js`):** UUID v4 steht hinter dem `#` → `id = SHA-256("selbstbild-id:"+uuid)`,
  Schlüssel per HKDF (Salt `selbstbild-v1`), AES-256-GCM mit `id` als Additional Data. Server sieht nur id/iv/ct/stand.
  Salt/Präfixe nie ändern, sonst sind alle gespeicherten Links unlesbar.
- **Speichern (`public/js/speicher.js`):** lokal sofort (`localStorage`, Präfix `selbstbild:`; `lokal`, `s:<uuid>`,
  `zuletzt`), Server nur nach Zustimmung (Art. 9 DSGVO). Abgleich nach `stand` (neuerer gewinnt, 409 = Server neuer).
  Fehlschläge → Wiederholung 15 s, 1, 5, 15, 30 min; 429 = Tageslimit → 30 min. Startadresse ohne `#` öffnet den
  zuletzt genutzten Stand. Popup am farbigen Punkt: Zustimmung, Link, Export/Import, „Vom Server löschen“ (zweistufig). Kein lokales
  Löschen: lokal wird nicht eingewilligt, also kein Opt-out (Carsten, 22.11.2026). Zustimmungstext nennt „anonyme
  Angaben zu deiner Gesundheit“ und „keine persönlichen Daten wie Name, E-Mail- oder IP-Adresse gespeichert“
  (bewusst „gespeichert“, nicht „erhoben“: Cloudflare verarbeitet IPs technisch beim Ausliefern).
- **Navigation:** Bereiche sind Pfade (`/adhs`, `/tests`, `/`), History-API; der `#`-Teil gehört der UUID.
  Interne Links in HTML und Daten deshalb immer `/bereich`, nie `#bereich`.
- **Eingaben (`app.js`):** `S` ist ein flaches Objekt aus Zahlen. Schlüssel: Checklisten `gruppe.i` (1/0.5),
  Tests `t.*`, Radios `r.*`, externe Tests `x.*`/`xc.*`, ausgeblendet `h.<bereich>` (0/1), Reihenfolge
  `o.<bereich>` (Position). `validKey` prüft alles (mit `hasOwnProperty`, wegen `constructor.0` u. ä.).
- Standard ausgeblendet: Alexithymie, Ataxie, Dyskalkulie, Dyspraxie, Dysarthrie. Das Häkchen an der Kachel heißt
  „ausblenden“/„ausgeblendet“ (nicht „abhaken“, das meint die Merkmale der Checklisten).

## Regeln

- **Keine Freitextfelder**, die gespeichert werden (keine persönlichen Daten). Der Filter-Text wird nie gespeichert.
- **Keine externen Ressourcen** zur Laufzeit (CSP `default-src 'self'`); Schriften liegen in `public/fonts/`.
- `quelle/artefakt-original.html` enthält Carstens **persönliche Antworten** (Schnappschuss) und ist per
  `.gitignore` ausgeschlossen. Nie committen.
- Rechtstexte: Impressum nach § 18 Abs. 1 MStV (privat), Datenschutzerklärung und
  `docs/verarbeitungsverzeichnis.md` bei jeder Änderung an Speicherung, Anbietern oder Fristen mitziehen.
- Löschfrist 730 Tage steht in `src/frist.js`, README, Datenschutzerklärung, Speicher-Popup und Kopfzeile.

## Gotchas

- Workers erlaubt in der Startdatei **keine benannten Exporte** außer Entrypoints (`FRIST_TAGE` brach den Start) →
  Hilfswerte in `src/frist.js`.
- `[hidden]{display:none !important}` steht global im CSS; sonst überstimmen `display:flex`-Regeln das Attribut.
- Pill-Stil der Reiter nur auf `.tablist a`, nicht `nav.tabs a`, sonst sehen Links im Speicher-Popup wie Reiter aus.
- Popup schließt bei `pointerdown` außerhalb, nicht bei `click`: Sonst schließt der Klick, der es automatisch öffnet,
  es sofort wieder.
- `_headers` und `.assetsignore` stehen in `.assetsignore`; die Header gelten trotzdem (lokal geprüft).
- Rate-Limit-Binding `SCHREIBLIMIT` (30/min je IP) ist im Worker optional (`if (env.SCHREIBLIMIT)`).
- `node --test test/` (Ordner) geht in Node 24 nicht → `node --test test/*.test.mjs`.
- Vorschau im Desktop-Browser: Startkonfiguration `selbstbild` steht in `~/Claude/Code/.claude/launch.json`.

## Befehle

```bash
npm test                 # Krypto + Worker (node:test)
npm run db:local         # Schema in lokale D1
npm run dev              # wrangler dev, http://localhost:8787
npm run db:remote        # Schema in die echte D1
npm run deploy           # wrangler deploy (nur nötig, wenn Workers Builds ausfällt)
```

**Deploy:** Workers Builds ist mit `carstenjaksch/selbstbild` verbunden (Cloudflare-GitHub-App nur für dieses
Repo). Jeder Push auf `main` baut und veröffentlicht (`npx wrangler deploy`, kein Build-Befehl), Vorschau-Builds
für andere Branches sind aus. Schema-Änderungen an D1 laufen nicht automatisch mit: vorher `npm run db:remote`
(bzw. eine Migration) ausführen. Build-Status: Cloudflare-Dashboard → Worker `selbstbild` → Bereitstellungen.

## Prüfen (vor jedem Deploy)

Abhaken → Zustimmungsfenster erscheint → „Ja“ → Adresse bekommt `#uuid`, Punkt „Server“; Link in leerem Browser
öffnen lädt den Stand; Server weg (fetch abfangen) → „Lokal“ → `online` → „Server“; Kacheln abhaken/einblenden,
Filter, Pfeiltasten- und Maus-Anordnen; Import mit fremden Schlüsseln; „Vom Server löschen“; alle 14 Reiter;
Konsole ohne Fehler; 375 px ohne waagerechtes Scrollen; hell und dunkel.
