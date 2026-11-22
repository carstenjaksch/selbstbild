-- Selbstbild: verschlüsselte Stände. id = SHA-256-Fingerabdruck der UUID (die UUID selbst kennt der Server nicht).
-- stand = Zeitstempel des Browsers (ms) für Konflikte, geaendert = Tag (seit 1970) der letzten Änderung für die Löschfrist.
CREATE TABLE IF NOT EXISTS staende (
  id        TEXT PRIMARY KEY,
  iv        TEXT NOT NULL,
  ct        TEXT NOT NULL,
  stand     INTEGER NOT NULL,
  geaendert INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS staende_geaendert ON staende (geaendert);
