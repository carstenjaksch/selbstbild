/* Selbstbild – Speichern.
   1. Lokal: jede Änderung sofort im localStorage dieses Browsers (Präfix „selbstbild:“).
   2. Server: nur nach ausdrücklicher Zustimmung. Dann entsteht eine UUID, die hinter dem # der Adresse steht.
      Der Browser verschlüsselt den Stand (krypto.js), der Server sieht nur Fingerabdruck und Chiffretext.
   3. Abgleich: Es gewinnt der neuere Stand. Klappt das Senden nicht, bleibt er lokal und wird nachgereicht.
   Dazu der farbige Speicher-Punkt in der Navigation mit Popup (Erklärung, Link, Import/Export, Löschen). */
import { istUuid, neueUuid, ableiten, verschluesseln, entschluesseln } from './krypto.js';

const P = 'selbstbild:';
const K_ZULETZT = P + 'zuletzt', K_LOKAL = P + 'lokal', kServer = u => P + 's:' + u;
const WARTEN = [15e3, 60e3, 300e3, 900e3, 1800e3];

let app = null;              // { holen, setzen, pruefen } aus app.js
let uuid = null;             // gesetzt = Stand liegt (auch) auf dem Server
let schluessel = null;       // { id, key }
let stand = 0;               // Zeitstempel des aktuellen Stands, 0 = noch nichts
let synced = 0;              // vom Server bestätigter Stand
let geladen = false;         // Serverstand wurde abgefragt (oder es gibt keinen)
let nurLokal = false;        // „Nur in diesem Browser“ gewählt
let lokalOk = true;          // localStorage nutzbar
let netz = 'ok';             // ok | sendet | offline | limit | fehler
let fehlerText = '';
let hinweis = '';
let versuch = 0, naechster = 0, timer = null, laeuft = false, nochmal = false;
let gefragt = false, importVorschlag = null;

/* ---------- localStorage ---------- */
function lesen(k){ try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
function schreiben(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); lokalOk = true; } catch (e) { lokalOk = false; } }
function entfernen(k){ try { localStorage.removeItem(k); } catch (e) {} }
function zuletzt(v){ try { localStorage.setItem(K_ZULETZT, v); } catch (e) {} }
function zuletztLesen(){ try { return localStorage.getItem(K_ZULETZT); } catch (e) { return null; } }
function lokalSichern(){
  if (uuid) schreiben(kServer(uuid), { stand, synced, daten: app.holen() });
  else schreiben(K_LOKAL, { stand, nurLokal, daten: app.holen() });
}

/* ---------- Server ---------- */
function api(method, body){
  return fetch('/api/s/' + schluessel.id, {
    method, cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer',
    headers: body ? { 'content-type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined
  });
}
function planen(ms){ if (!uuid) return; clearTimeout(timer); timer = setTimeout(sync, ms); }
function jetzt(){ if (uuid && (!geladen || stand > synced)) planen(0); }
function fehlschlag(art){
  netz = art;
  const w = art === 'limit' ? 1800e3 : WARTEN[Math.min(versuch, WARTEN.length - 1)];
  versuch++; naechster = Date.now() + w; planen(w);
}
async function sync(){
  if (!uuid) return;
  if (laeuft) { nochmal = true; return; }
  laeuft = true; clearTimeout(timer); timer = null;
  try {
    if (!geladen) await abgleichen();
    if (uuid && geladen && stand > synced && netz !== 'fehler') await hochladen();
  } finally {
    laeuft = false;
    if (nochmal) { nochmal = false; planen(0); }
    zeichnen();
  }
}
async function abgleichen(){
  netz = 'sendet'; zeichnen();
  let r;
  try { r = await api('GET'); } catch (e) { return fehlschlag('offline'); }
  if (r.status === 429) return fehlschlag('limit');
  if (r.status === 404) {
    geladen = true; netz = 'ok'; versuch = 0;
    if (!stand) leererLink();
    return;
  }
  if (!r.ok) return fehlschlag('offline');
  let box, inhalt;
  try { box = await r.json(); inhalt = await entschluesseln(schluessel, box); }
  catch (e) { netz = 'fehler'; fehlerText = 'Der Stand auf dem Server lässt sich mit diesem Link nicht entschlüsseln.'; return; }
  geladen = true; netz = 'ok'; versuch = 0;
  const sStand = Number(inhalt && inhalt.stand) || Number(box.stand) || 0;
  if (sStand >= stand) {
    stand = sStand; synced = sStand;
    app.setzen((inhalt && inhalt.daten) || {});
    lokalSichern();
  }
}
async function hochladen(){
  const s = stand;
  netz = 'sendet'; zeichnen();
  let r;
  try {
    const box = await verschluesseln(schluessel, { v: 1, stand: s, daten: app.holen() });
    r = await api('PUT', { iv: box.iv, ct: box.ct, stand: s });
  } catch (e) { return fehlschlag('offline'); }
  if (r.status === 204) { synced = Math.max(synced, s); netz = 'ok'; versuch = 0; lokalSichern(); return; }
  if (r.status === 409) { geladen = false; return abgleichen(); }
  if (r.status === 429) return fehlschlag('limit');
  if (r.status === 400 || r.status === 413) { netz = 'fehler'; fehlerText = 'Der Server hat den Stand abgelehnt (Fehler ' + r.status + '). Exportiere deine Antworten zur Sicherheit.'; return; }
  return fehlschlag('offline');
}
/* Link ohne gespeicherten Stand: zurück in den lokalen Modus, Hinweis zeigen */
function leererLink(){
  uuid = null; schluessel = null; geladen = false;
  history.replaceState(null, '', location.pathname);
  hinweis = 'Zu diesem Link ist auf dem Server nichts gespeichert. Vielleicht wurde der Stand gelöscht oder ist nach 24 Monaten ohne Änderung abgelaufen.';
  ladeLokal();
  oeffnen();
}

/* ---------- Laden ---------- */
function ladeLokal(){
  const L = lesen(K_LOKAL);
  if (L && L.daten) { stand = Number(L.stand) || 0; nurLokal = !!L.nurLokal; app.setzen(L.daten); }
}
async function ladeServer(u){
  uuid = u; schluessel = await ableiten(u); zuletzt(u);
  const L = lesen(kServer(u));
  if (L && L.daten) { stand = Number(L.stand) || 0; synced = Number(L.synced) || 0; app.setzen(L.daten); }
  await sync();
}

/* ---------- Öffentliche Schnittstelle ---------- */
export async function starten(a){
  app = a;
  baueUi();
  window.addEventListener('hashchange', hashGeaendert);
  window.addEventListener('online', jetzt);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') jetzt(); });
  let h = location.hash.slice(1).toLowerCase();
  if (!istUuid(h)) {
    const z = zuletztLesen();
    h = (istUuid(z) && lesen(kServer(z))) ? z : null;
    if (h) history.replaceState(null, '', location.pathname + '#' + h);
  }
  zeichnen();
  if (h) await ladeServer(h); else ladeLokal();
  zeichnen();
}
export function geaendert(){
  stand = Date.now(); hinweis = '';
  lokalSichern();
  if (uuid) planen(1500);
  else {
    zuletzt('lokal');
    if (!nurLokal && !gefragt) { gefragt = true; oeffnen(); ansage('Gespeichert in diesem Browser. Im Speicher-Fenster kannst du wählen, ob der Stand auch verschlüsselt auf den Server soll.'); }
  }
  zeichnen();
}
function hashGeaendert(){
  const h = location.hash.slice(1).toLowerCase();
  if (istUuid(h) && h !== uuid) { location.reload(); return; }
  if (!istUuid(h) && uuid) history.replaceState(null, '', location.pathname + '#' + uuid);
}

/* ---------- Aktionen ---------- */
async function zustimmen(){
  const u = neueUuid();
  uuid = u; schluessel = await ableiten(u); geladen = true; synced = 0; nurLokal = false; hinweis = '';
  if (!stand) stand = Date.now();
  lokalSichern(); entfernen(K_LOKAL); zuletzt(u);
  history.replaceState(null, '', location.pathname + '#' + u);
  meldung('Dein persönlicher Link ist erstellt. Speichere ihn gut, nur damit kommst du von anderen Geräten an deine Antworten.');
  planen(0); zeichnen();
  const f = pop.querySelector('[data-sp="kopieren"]'); if (f) f.focus();
}
function nurHier(){
  nurLokal = true; lokalSichern(); zuletzt('lokal');
  meldung('In Ordnung: Deine Antworten bleiben nur in diesem Browser.');
  zeichnen();
}
async function vomServerLoeschen(){
  let r;
  try { r = await api('DELETE'); } catch (e) { return meldung('Löschen fehlgeschlagen: Der Server ist nicht erreichbar. Versuch es später noch einmal.', 'fehler'); }
  if (r.status !== 204) return meldung('Löschen fehlgeschlagen (Fehler ' + r.status + ').', 'fehler');
  clearTimeout(timer); entfernen(kServer(uuid));
  uuid = null; schluessel = null; synced = 0; geladen = false; nurLokal = true; netz = 'ok';
  lokalSichern(); zuletzt('lokal');
  history.replaceState(null, '', location.pathname);
  meldung('Der Stand ist vom Server gelöscht, deine Zustimmung damit widerrufen. Deine Antworten liegen weiter in diesem Browser.');
  zeichnen();
}
function lokalLoeschen(){
  try { Object.keys(localStorage).filter(k => k.startsWith(P)).forEach(k => localStorage.removeItem(k)); } catch (e) {}
  stand = 0; synced = 0; nurLokal = false; gefragt = false; hinweis = '';
  app.setzen({});
  meldung('Alle Antworten in diesem Browser sind gelöscht.');
  zeichnen();
}
function exportieren(){
  const datei = { format: 'selbstbild', version: 1, exportiert: new Date().toISOString(), stand: stand ? new Date(stand).toISOString() : null, antworten: app.holen() };
  const url = URL.createObjectURL(new Blob([JSON.stringify(datei, null, 1)], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url; a.download = 'selbstbild-antworten-' + new Date().toISOString().slice(0, 10) + '.json';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
  meldung('Die Datei enthält deine Antworten unverschlüsselt. Bewahre sie sicher auf.');
}
function importLesen(file){
  if (!file) return;
  if (file.size > 200000) return meldung('Die Datei ist zu groß für eine Selbstbild-Datei.', 'fehler');
  const fr = new FileReader();
  fr.onload = () => {
    let d; try { d = JSON.parse(fr.result); } catch (e) { return meldung('Die Datei ist keine gültige Selbstbild-Datei.', 'fehler'); }
    if (!d || d.format !== 'selbstbild' || !d.antworten || typeof d.antworten !== 'object' || Array.isArray(d.antworten)) return meldung('Die Datei ist keine Selbstbild-Datei.', 'fehler');
    importVorschlag = app.pruefen(d.antworten);
    const n = Object.keys(importVorschlag).length, weg = Object.keys(d.antworten).length - n;
    $('sp-import-text').textContent = 'Die Datei enthält ' + n + (n === 1 ? ' Angabe' : ' Angaben') + (weg > 0 ? ' (' + weg + ' unbekannte verworfen)' : '') + '. Übernehmen ersetzt deine aktuellen Antworten.';
    $('sp-import').hidden = false;
    pop.querySelector('[data-sp="import-ja"]').focus();
  };
  fr.onerror = () => meldung('Die Datei ließ sich nicht lesen.', 'fehler');
  fr.readAsText(file);
}
function importUebernehmen(){
  if (!importVorschlag) return;
  app.setzen(importVorschlag); importVorschlag = null; $('sp-import').hidden = true;
  geaendert();
  meldung('Import übernommen.');
}
async function linkKopieren(){
  const inp = $('sp-link');
  try { await navigator.clipboard.writeText(inp.value); meldung('Link kopiert.'); }
  catch (e) { inp.select(); meldung('Link markiert. Kopiere ihn mit Strg+C bzw. Cmd+C.'); }
}

/* ---------- Oberfläche: Punkt und Popup ---------- */
let btn, pop, dot, label;
const $ = id => document.getElementById(id);
const zeit = ms => {
  if (!ms) return '';
  const d = new Date(ms), heute = new Date().toDateString() === d.toDateString();
  return heute ? d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr' : d.toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' }) + ' Uhr';
};
function ansage(t){ const el = $('ansage'); if (!el) return; el.textContent = ''; setTimeout(() => { el.textContent = t; }, 40); }
function meldung(t, art){ const el = $('sp-meldung'); if (!el) return; el.textContent = t || ''; if (art) el.dataset.art = art; else delete el.dataset.art; }

function baueUi(){
  btn = $('sp-btn'); pop = $('sp-pop'); dot = btn.querySelector('.sp-dot'); label = $('sp-label');
  pop.innerHTML = `
  <div class="sp-kopf"><h3 id="sp-titel">Speichern</h3><button type="button" class="sp-zu" data-sp="zu" aria-label="Schließen">×</button></div>
  <div class="sp-status"><span class="sp-dot" id="sp-st-dot" data-ort="leer" aria-hidden="true"></span><div><strong id="sp-st-titel"></strong><br><span class="fine" id="sp-st-text"></span></div></div>
  <p class="sp-meldung" id="sp-hinweis"></p>
  <div class="sp-frage" id="sp-frage">
    <p><strong>Verschlüsselt auf dem Server speichern?</strong> Dann kommst du über deinen persönlichen Link auch von anderen Geräten an deine Antworten.</p>
    <div class="sp-knoepfe"><button type="button" class="btn" data-sp="ja">Ja, verschlüsselt speichern</button><button type="button" class="btn ghost" data-sp="lokal" id="sp-nur-lokal">Nur in diesem Browser</button></div>
    <p class="fine">Mit „Ja“ willigst du ein, dass deine Antworten, also Angaben zu deiner Gesundheit, verschlüsselt auf dem Server gespeichert werden. Du kannst das jederzeit hier mit „Vom Server löschen“ widerrufen. <a href="/datenschutz">Datenschutzerklärung</a></p>
  </div>
  <div id="sp-linkbox" hidden>
    <label for="sp-link"><strong>Dein persönlicher Link</strong></label>
    <div class="sp-link"><input id="sp-link" readonly><button type="button" class="btn ghost" data-sp="kopieren">Link kopieren</button></div>
    <p class="fine">Wer diesen Link hat, kann deine Antworten sehen und ändern. Ohne ihn kommt niemand an die Daten, auch nicht der Betreiber.</p>
  </div>
  <ul class="sp-fakten">
    <li><strong>Lokal:</strong> Jede Änderung liegt sofort in diesem Browser.</li>
    <li><strong>Server:</strong> nur mit deiner Zustimmung, bei Cloudflare mit Rechenzentrum in der EU. Verschlüsselt wird schon in deinem Browser (AES-256). Der Schlüssel steckt nur in deinem Link hinter dem #-Zeichen und wird nie übertragen.</li>
    <li><strong>Aufbewahrung:</strong> Nach 24 Monaten ohne Änderung wird der Stand auf dem Server automatisch gelöscht.</li>
    <li><strong>Server nicht erreichbar?</strong> Dann bleibt der Stand lokal und wird automatisch nachgereicht, sobald es wieder geht. Das kann bis zu einem Tag dauern; öffne die Seite dafür einfach noch einmal.</li>
  </ul>
  <dl class="sp-legende" aria-label="Bedeutung der Farben">
    <dt><span class="sp-dot" data-ort="server"></span></dt><dd>Letzter Stand liegt auf dem Server (und in diesem Browser)</dd>
    <dt><span class="sp-dot" data-ort="lokal"></span></dt><dd>Letzter Stand liegt nur in diesem Browser</dd>
    <dt><span class="sp-dot" data-ort="leer"></span></dt><dd>Noch nichts gespeichert</dd>
    <dt><span class="sp-dot" data-ort="fehler"></span></dt><dd>Speichern gerade nicht möglich</dd>
  </dl>
  <div class="sp-aktionen">
    <button type="button" class="btn ghost" data-sp="export">Exportieren</button>
    <button type="button" class="btn ghost" data-sp="import">Importieren</button>
    <input type="file" id="sp-datei" accept=".json,application/json" hidden>
    <button type="button" class="btn ghost" data-sp="server-loeschen" id="sp-server-loeschen" hidden>Vom Server löschen</button>
    <button type="button" class="btn ghost" data-sp="lokal-loeschen" id="sp-lokal-loeschen">Lokal löschen</button>
  </div>
  <div class="sp-import" id="sp-import" hidden>
    <p id="sp-import-text"></p>
    <div class="sp-knoepfe"><button type="button" class="btn" data-sp="import-ja">Übernehmen</button><button type="button" class="btn ghost" data-sp="import-nein">Abbrechen</button></div>
  </div>
  <p class="sp-meldung" id="sp-meldung" aria-live="polite"></p>
  <p class="fine">Export speichert deine Antworten als Datei, Import liest sie wieder ein, ganz ohne Server. Mehr in der <a href="/datenschutz">Datenschutzerklärung</a>.</p>`;

  btn.addEventListener('click', () => { pop.hidden ? oeffnen(true) : schliessen(false); });
  // pointerdown statt click: Öffnet eine Änderung das Fenster automatisch, schließt derselbe Klick es nicht gleich wieder
  document.addEventListener('pointerdown', e => { if (!pop.hidden && !$('speicher').contains(e.target)) schliessen(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !pop.hidden) { schliessen(true); } });
  $('sp-datei').addEventListener('change', e => { importLesen(e.target.files && e.target.files[0]); e.target.value = ''; });
  pop.addEventListener('click', e => {
    const b = e.target.closest('[data-sp]'); if (!b) return;
    const was = b.dataset.sp;
    if (was === 'zu') schliessen(true);
    else if (was === 'ja') zustimmen();
    else if (was === 'lokal') nurHier();
    else if (was === 'kopieren') linkKopieren();
    else if (was === 'export') exportieren();
    else if (was === 'import') $('sp-datei').click();
    else if (was === 'import-ja') importUebernehmen();
    else if (was === 'import-nein') { importVorschlag = null; $('sp-import').hidden = true; meldung('Import abgebrochen.'); }
    else if (was === 'server-loeschen' || was === 'lokal-loeschen') zweistufig(b, was === 'server-loeschen' ? vomServerLoeschen : lokalLoeschen);
  });
}
/* Löschen erst beim zweiten Klick */
function zweistufig(b, tun){
  if (!b.dataset.armed) {
    b.dataset.armed = '1'; b.dataset.text = b.textContent; b.textContent = 'Wirklich löschen? Nochmal klicken'; b.classList.add('armed');
    setTimeout(() => { if (b.dataset.armed) { delete b.dataset.armed; b.textContent = b.dataset.text; b.classList.remove('armed'); } }, 5000);
    return;
  }
  delete b.dataset.armed; b.textContent = b.dataset.text; b.classList.remove('armed');
  tun();
}
function oeffnen(fokus){
  pop.hidden = false; btn.setAttribute('aria-expanded', 'true'); zeichnen();
  if (fokus) pop.querySelector('.sp-zu').focus();
}
function schliessen(fokus){
  pop.hidden = true; btn.setAttribute('aria-expanded', 'false');
  if (fokus) btn.focus();
}

function ort(){
  if (uuid && !geladen && !stand && (netz === 'offline' || netz === 'limit' || netz === 'fehler')) return 'fehler';
  if (!stand) return lokalOk ? 'leer' : 'fehler';
  if (uuid && synced >= stand) return 'server';
  return lokalOk ? 'lokal' : 'fehler';
}
function statusText(o){
  const t = zeit(stand), wann = naechster ? ' Nächster Versuch gegen ' + new Date(naechster).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr.' : '';
  if (o === 'leer') return ['Noch nichts gespeichert', 'Sobald du etwas abhakst oder einträgst, speichert die Seite es in diesem Browser.'];
  if (o === 'server') return ['Auf dem Server gespeichert', 'Verschlüsselt, Stand ' + t + '. Eine Kopie liegt auch in diesem Browser.'];
  if (o === 'fehler') {
    if (!lokalOk) return ['Speichern gerade nicht möglich', 'Dieser Browser erlaubt keinen lokalen Speicher (zum Beispiel im privaten Fenster)' + (uuid ? ' und der Server ist nicht erreichbar.' : '.') + ' Exportiere deine Antworten, um sie zu sichern.'];
    return ['Stand konnte nicht geladen werden', (netz === 'limit' ? 'Der Server ist für heute ausgelastet.' : 'Der Server ist gerade nicht erreichbar.') + wann];
  }
  if (!uuid) return nurLokal
    ? ['Nur in diesem Browser gespeichert', 'Stand ' + t + '. Du hast „Nur in diesem Browser“ gewählt.']
    : ['In diesem Browser gespeichert', 'Stand ' + t + '. Auf den Server kommt er erst mit deiner Zustimmung.'];
  if (netz === 'sendet') return ['In diesem Browser gespeichert', 'Stand ' + t + ', wird gerade verschlüsselt übertragen …'];
  if (netz === 'limit') return ['Nur in diesem Browser gespeichert', 'Stand ' + t + '. Das kostenlose Tageskontingent des Servers ist erschöpft. Der Stand wird automatisch nachgereicht, das kann bis zu einem Tag dauern.'];
  if (netz === 'fehler') return ['Nur in diesem Browser gespeichert', 'Stand ' + t + '. ' + fehlerText];
  if (netz === 'offline') return ['Nur in diesem Browser gespeichert', 'Stand ' + t + '. Der Server ist gerade nicht erreichbar.' + wann + ' Ist die Seite dann zu, wird der Stand beim nächsten Öffnen nachgereicht.'];
  return ['In diesem Browser gespeichert', 'Stand ' + t + ', wird gleich übertragen.'];
}
const KURZ = { leer: 'Nicht gespeichert', lokal: 'Lokal', server: 'Server', fehler: 'Fehler' };
function zeichnen(){
  if (!btn) return;
  const o = ort(), [titel, text] = statusText(o), busy = netz === 'sendet';
  [dot, $('sp-st-dot')].forEach(d => { d.dataset.ort = o; if (busy) d.dataset.busy = ''; else delete d.dataset.busy; });
  label.textContent = KURZ[o];
  btn.setAttribute('aria-label', 'Speicherstatus: ' + titel + '. Details anzeigen');
  btn.title = titel;
  $('sp-st-titel').textContent = titel;
  $('sp-st-text').textContent = text;
  $('sp-hinweis').textContent = hinweis;
  $('sp-frage').hidden = !!uuid;
  $('sp-nur-lokal').hidden = nurLokal;
  $('sp-linkbox').hidden = !uuid;
  if (uuid) $('sp-link').value = location.origin + '/#' + uuid;
  $('sp-server-loeschen').hidden = !uuid;
  $('sp-lokal-loeschen').hidden = !!uuid;
}
