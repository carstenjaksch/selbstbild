# Selbstbild: öffentliche Fassung des Artefakts „Diagnosekriterien & Selbsttests“

Stand 22.11.2026, abgestimmt mit Carsten im Chat.

## Ziel

Das claude.ai-Artefakt `Q3DTfzcjDNrTZtdZCQgXHd` wird als statische, quelloffene Website nachgebaut:
Repo `carstenjaksch/selbstbild` (öffentlich, MIT), Adresse `https://selbstbild.jaksch.workers.dev`.
Betreiber ist Carsten privat (kein Gewerbe, keine Werbung).

## Rahmen

- **Hosting:** Cloudflare Workers mit Static Assets (nicht Pages: Cloudflare entwickelt nur noch Workers
  weiter, Workers hat Cron für die Löschfrist). Konto-Subdomain `jaksch.workers.dev`.
- **Datenbank:** Cloudflare D1, beim Anlegen fest auf `--jurisdiction=eu` gesetzt.
- **Inhalte statisch**, nur Nutzereingaben in die Datenbank. Keine Freitextfelder, nur Zahlen und Haken.
- **Keine persönlichen Daten:** Das Original enthält Carstens eigene Antworten als Schnappschuss; die
  öffentliche Fassung startet leer. Google Fonts werden durch selbst gehostete Dateien ersetzt.

## Speichern

1. **Lokal immer:** Jede Änderung landet sofort im `localStorage` des Browsers (Sicherung).
2. **Server nur mit einmaliger Zustimmung (Art. 9 DSGVO):** Bei der ersten Änderung öffnet sich das
   Speicher-Fenster mit „Verschlüsselt auf dem Server speichern?“ → „Ja“ / „Nur in diesem Browser“.
3. **Link:** Mit Zustimmung erzeugt der Browser eine UUID v4 und hängt sie hinter das `#`:
   `…/adhs#7c9e6679-7425-40de-944b-e07fc1f90ae7`. Der `#`-Teil wird nie an einen Server gesendet.
4. **Verschlüsselung im Browser:** `id = SHA-256("selbstbild-id:" + uuid)` (Datenbank-Schlüssel),
   AES-256-GCM-Schlüssel per HKDF-SHA-256 aus der UUID. Der Server sieht nur `id`, `iv`, Chiffretext und
   einen Zeitstempel `stand` (für Konflikte). Keine IP-Speicherung.
5. **Abgleich:** Beim Öffnen gewinnt der neuere Stand (lokal oder Server). Fehlschläge (offline, Limit,
   Serverfehler) → Stand bleibt lokal, Wiederholung mit Abstand; Hinweis „kann bis zu einem Tag dauern“.
6. **Wiederaufnahme:** Die Startadresse ohne `#` öffnet den zuletzt in diesem Browser genutzten Stand.
7. **Import/Export:** JSON-Datei mit den Antworten, Import wird streng geprüft (nur bekannte Schlüssel,
   nur Zahlen). Kein Upload, die Datei wird nur im Browser gelesen.
8. **Löschen:** „Vom Server löschen“ (Widerruf der Zustimmung) und „Lokale Daten löschen“ im
   Speicher-Fenster. Kein „Neu beginnen“, kein „Lesezeichen“-Knopf.
9. **Aufbewahrung:** Datensätze, die 24 Monate nicht geändert wurden, löscht ein täglicher Cron-Job.

## Speicher-Punkt

Rechts in der Navigationsleiste, fest, mit Abstand zu den Reitern. Farbe und Form zeigen, wo der
letzte Stand liegt: gefüllt in Akzentfarbe = Server, Ring in Bernstein = nur lokal, grau gestrichelt =
noch nichts gespeichert, rot = Fehler. Klick öffnet ein Popup direkt am Punkt mit Kurzfassung
(Cloudflare, EU, Verschlüsselung, 24 Monate), Farberklärung, Zustimmung, Link kopieren, Import/Export,
Löschen und Link zur Datenschutzerklärung. Eine Zeile im Kopf der Seite fasst das ebenfalls zusammen.

## Übersicht

- Jede Kachel hat einen Haken „abhaken“. Abgehakte Bereiche wandern in ein aufklappbares „Ausgeblendet (n)“
  und lassen sich dort öffnen oder wieder einblenden.
- Ausgeblendete Bereiche fehlen in Navigation, Gesamtbild, Einleitungssatz, Testtabelle und
  „Deine Testergebnisse“. Wer einen ausgeblendeten Bereich per Link öffnet, sieht ein Banner
  „Wieder einblenden“.
- Standard sichtbar: ADHS, Autismus, AuDHS, Depression, Bipolar, Stimmung: Abgrenzung, Migräne.
  Standard ausgeblendet: Alexithymie, Ataxie Typ 2, Dyskalkulie, Dyspraxie, Dysarthrie.
- Der Ausblende-Zustand gehört zu den Eingaben (Schlüssel `h.<bereich>`), wird also mitgespeichert.
- **Filter:** Suchfeld über den Kacheln. Alle Begriffe müssen vorkommen (Titel, Beschreibung, Codes,
  Text des Bereichs), ohne Rücksicht auf Groß-/Kleinschreibung und Umlaute. Blendet Kacheln und
  Gesamtbild-Zeilen aus. Die Eingabe wird nie gespeichert.

## Fragebögen

- Uploads, Anhang-Vorschau und pdf.js entfallen. Stattdessen je Karte „Standardisierte Fragebögen“
  einmal ein eigener Absatz unter der Beschreibung: Screenshots oder PDFs der beantworteten Fragen für
  eine etwaige Diagnostik aufheben.
- Unter-Skalen (RAADS-R, CAT-Q, TAS-20, PAQ) in einem abgesetzten Kasten (anderer Hintergrund, Abstand)
  mit Hinweis: Detailauswertung beim Testanbieter kann kostenpflichtig sein, nur der Gesamtwert zählt.
- „Abweichender Wert laut …“ (RAADS-R) entfällt.
- PHQ-9 Frage 9 > 0 → Hilfe-Kasten mit Telefonseelsorge und 112.

## Navigation

Bereiche bekommen echte Pfade (`/adhs`, `/tests`, `/` für die Übersicht) über die History-API;
der `#`-Teil bleibt für die UUID frei. Unbekannte Pfade zeigen die Übersicht.

## Recht

- Impressum nach § 18 Abs. 1 MStV: Carsten Jaksch, Sudetenstraße 40, 61184 Karben, carsten@jaksch.me.
- Datenschutzerklärung: Verantwortlicher, Hosting Cloudflare (Art. 6 Abs. 1 lit. f, DPA automatisch,
  DPF), Speicherfunktion (Einwilligung Art. 9 Abs. 2 lit. a, Verschlüsselung, Widerruf/Löschen,
  24 Monate), localStorage (§ 25 Abs. 2 Nr. 2 TDDDG), keine Cookies, kein Tracking, Schriften lokal,
  Betroffenenrechte, Beschwerderecht (HBDI Hessen).
- Verzeichnis der Verarbeitungstätigkeiten in `docs/verarbeitungsverzeichnis.md`.
- Zweckbestimmung durchgängig „Information und Selbstreflexion, keine Diagnose“.

## Aufbau

```
public/            statische Dateien (index.html, impressum.html, datenschutz.html, css, js, fonts, _headers)
public/js/inhalte.js   Checklisten, Tests, externe Tests, Texte (Daten)
public/js/app.js       Rendern, Auswertungen, Übersicht, Filter, Navigation
public/js/speicher.js  lokal + Server, Verschlüsselung, Zustimmung, Import/Export, Speicher-Punkt
src/worker.js      API GET/PUT/DELETE /api/s/:id, Cron-Löschung
schema.sql, wrangler.jsonc, test/ (node:test)
```

## Prüfung

- Unit-Tests: Verschlüsselung (Hin und zurück, falscher Schlüssel), Eingabeprüfung, Worker-API mit
  Ersatz-Datenbank.
- Lokal mit `wrangler dev` und lokaler D1: Abhaken, Filter, alle Fragebögen, Zustimmung, Link in neuem
  Tab, Server aus → lokal → Server an → nachgereicht, Import/Export, Löschen, Konsole ohne Fehler,
  Mobilbreite, Dunkelmodus.
