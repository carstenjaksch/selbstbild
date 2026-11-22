/* Selbstbild – Worker: speichert verschlüsselte Stände unter einem Fingerabdruck.
   Der Worker sieht nie die UUID und nie Klartext. Er speichert keine IP-Adressen.
   GET/PUT/DELETE /api/s/:id · täglicher Cron löscht Stände, die 24 Monate unverändert sind. */

import { FRIST_TAGE, tag } from './frist.js';
const MAX_BODY = 66000;                 // Zeichen; ein voller Stand ist weit kleiner
const ID_RE = /^[0-9a-f]{64}$/;
const B64U_RE = /^[A-Za-z0-9_-]+$/;
const STAND_MIN = Date.UTC(2026, 0, 1);

const KOPF = {
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'no-referrer'
};
const antwort = (status, body) => body === undefined
  ? new Response(null, { status, headers: KOPF })
  : new Response(JSON.stringify(body), { status, headers: { ...KOPF, 'content-type': 'application/json; charset=utf-8' } });

function pruefen(b){
  if (!b || typeof b !== 'object' || Array.isArray(b)) return false;
  const k = Object.keys(b).sort().join(',');
  if (k !== 'ct,iv,stand') return false;
  if (typeof b.iv !== 'string' || b.iv.length !== 16 || !B64U_RE.test(b.iv)) return false;
  if (typeof b.ct !== 'string' || b.ct.length < 24 || !B64U_RE.test(b.ct)) return false;
  if (!Number.isInteger(b.stand) || b.stand < STAND_MIN || b.stand > Date.now() + 86400000) return false;
  return true;
}

async function api(req, env, id){
  if (req.method === 'GET') {
    const row = await env.DB.prepare('SELECT iv, ct, stand FROM staende WHERE id = ?1').bind(id).first();
    return row ? antwort(200, { iv: row.iv, ct: row.ct, stand: row.stand }) : antwort(404);
  }
  if (req.method === 'PUT') {
    if (env.SCHREIBLIMIT) {
      const { success } = await env.SCHREIBLIMIT.limit({ key: req.headers.get('cf-connecting-ip') || 'unbekannt' });
      if (!success) return antwort(429, { fehler: 'zu_viele_anfragen' });
    }
    if (Number(req.headers.get('content-length') || 0) > MAX_BODY) return antwort(413);
    const text = await req.text();
    if (text.length > MAX_BODY) return antwort(413);
    let b; try { b = JSON.parse(text); } catch { return antwort(400); }
    if (!pruefen(b)) return antwort(400);
    const r = await env.DB.prepare(
      'INSERT INTO staende (id, iv, ct, stand, geaendert) VALUES (?1, ?2, ?3, ?4, ?5) ' +
      'ON CONFLICT(id) DO UPDATE SET iv = excluded.iv, ct = excluded.ct, stand = excluded.stand, geaendert = excluded.geaendert ' +
      'WHERE excluded.stand >= staende.stand'
    ).bind(id, b.iv, b.ct, b.stand, tag()).run();
    return r.meta && r.meta.changes ? antwort(204) : antwort(409, { fehler: 'neuerer_stand' });
  }
  if (req.method === 'DELETE') {
    await env.DB.prepare('DELETE FROM staende WHERE id = ?1').bind(id).run();
    return antwort(204);
  }
  return new Response(null, { status: 405, headers: { ...KOPF, allow: 'GET, PUT, DELETE' } });
}

export default {
  async fetch(req, env){
    const url = new URL(req.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(req);
    const m = url.pathname.match(/^\/api\/s\/([^/]+)$/);
    if (!m) return antwort(404);
    if (!ID_RE.test(m[1])) return antwort(400);
    try {
      return await api(req, env, m[1]);
    } catch (e) {
      const limit = /limit|exceeded|too many/i.test(String(e && e.message));
      return antwort(limit ? 429 : 503, { fehler: limit ? 'kontingent' : 'datenbank' });
    }
  },
  async scheduled(_ev, env){
    await env.DB.prepare('DELETE FROM staende WHERE geaendert < ?1').bind(tag() - FRIST_TAGE).run();
  }
};
