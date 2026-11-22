# Verzeichnis von Verarbeitungstätigkeiten (Art. 30 DSGVO)

Stand 22.11.2026 · Verantwortlicher: Carsten Jaksch, Sudetenstraße 40, 61184 Karben, carsten@jaksch.me
(privater Betrieb, kein Datenschutzbeauftragter)

## 1. Bereitstellung der Website (Hosting)

| Punkt | Inhalt |
|---|---|
| Zweck | Auslieferung der Seite, Sicherheit, Abwehr von Angriffen |
| Rechtsgrundlage | Art. 6 Abs. 1 lit. f DSGVO |
| Betroffene | Besucher:innen |
| Daten | IP-Adresse, Zeitpunkt, aufgerufene Adresse (ohne #-Teil), User-Agent, Referrer |
| Empfänger | Cloudflare, Inc. (Auftragsverarbeiter, DPA Teil der Self-Serve-Bedingungen) |
| Drittland | USA: EU-US Data Privacy Framework, ergänzend Standardvertragsklauseln |
| Löschfrist | nach Vorgaben von Cloudflare; eigene Protokolle: keine (`observability` aus) |

## 2. Missbrauchsschutz der Speicher-API

| Punkt | Inhalt |
|---|---|
| Zweck | Begrenzung der Schreibvorgänge (30 pro Minute und Verbindung) |
| Rechtsgrundlage | Art. 6 Abs. 1 lit. f DSGVO |
| Daten | IP-Adresse, nur flüchtig als Schlüssel des Rate-Limiters |
| Empfänger | Cloudflare (Workers Rate Limiting) |
| Löschfrist | keine Speicherung über das 60-Sekunden-Fenster hinaus |

## 3. Verschlüsselte Speicherung der Antworten (nur mit Einwilligung)

| Punkt | Inhalt |
|---|---|
| Zweck | Antworten über einen persönlichen Link geräteübergreifend abrufbar machen |
| Rechtsgrundlage | Art. 6 Abs. 1 lit. a und Art. 9 Abs. 2 lit. a DSGVO (ausdrückliche Einwilligung im Speicher-Fenster) |
| Daten | Chiffretext (AES-256-GCM) mit Gesundheitsangaben, SHA-256-Fingerabdruck der UUID, Zeitstempel |
| Empfänger | Cloudflare D1, Rechtsraum EU (`--jurisdiction=eu`) |
| Löschfrist | 730 Tage nach letzter Änderung (täglicher Cron), vorher jederzeit durch die Nutzer:innen |
| Widerruf | „Vom Server löschen“ im Speicher-Fenster |

## 4. Lokale Speicherung im Browser

| Punkt | Inhalt |
|---|---|
| Zweck | Eingaben beim nächsten Besuch behalten, Sicherung bei Serverausfall |
| Rechtsgrundlage | § 25 Abs. 2 Nr. 2 TDDDG (unbedingt erforderlich) |
| Daten | Antworten, Ausblenden/Reihenfolge, persönlicher Link; bleiben auf dem Endgerät |
| Empfänger | keine |
| Löschfrist | durch Nutzer:innen („Lokal löschen“, Browser-Einstellungen) |

## Technische und organisatorische Maßnahmen

- Ende-zu-Ende-Verschlüsselung im Browser; Schlüssel nur im #-Teil der URL, nie beim Server
- Datenbank-Kennung ist ein Fingerabdruck, die UUID selbst wird nicht gespeichert
- Keine IP-Speicherung durch eigenen Code, Request-Logs abgeschaltet
- Server nimmt nur Chiffretext in fester Struktur an (Größenlimit, Formatprüfung)
- Keine Freitextfelder; Import prüft Schlüssel und Wertebereiche
- Content-Security-Policy ohne externe Quellen, `Referrer-Policy: no-referrer`, keine Cookies
- TLS durch Cloudflare
