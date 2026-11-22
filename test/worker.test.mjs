import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/worker.js';
import { FRIST_TAGE, tag } from '../src/frist.js';

/* Ersatz für D1: versteht genau die Abfragen des Workers */
function ersatzDb(){
  const rows = new Map();
  return {
    rows,
    prepare(sql){
      return {
        bind(...a){ this.a = a; return this; },
        async first(){
          if (/^SELECT/.test(sql)) { const r = rows.get(this.a[0]); return r ? { iv: r.iv, ct: r.ct, stand: r.stand } : null; }
          throw new Error('unerwartet: ' + sql);
        },
        async run(){
          const a = this.a;
          if (/^INSERT/.test(sql)) {
            const [id, iv, ct, stand, geaendert] = a, alt = rows.get(id);
            if (alt && stand < alt.stand) return { meta: { changes: 0 } };
            rows.set(id, { iv, ct, stand, geaendert }); return { meta: { changes: 1 } };
          }
          if (/^DELETE FROM staende WHERE id/.test(sql)) { const n = rows.delete(a[0]) ? 1 : 0; return { meta: { changes: n } }; }
          if (/^DELETE FROM staende WHERE geaendert/.test(sql)) { let n = 0; for (const [k, r] of rows) if (r.geaendert < a[0]) { rows.delete(k); n++; } return { meta: { changes: n } }; }
          throw new Error('unerwartet: ' + sql);
        }
      };
    }
  };
}
const env = () => ({ DB: ersatzDb(), ASSETS: { fetch: async () => new Response('asset', { status: 200 }) } });
const ID = 'a'.repeat(64);
const url = p => 'https://selbstbild.test' + p;
const box = (stand = Date.now()) => ({ iv: 'AAAAAAAAAAAAAAAA', ct: 'x'.repeat(64), stand });
const put = (e, id, body) => worker.fetch(new Request(url('/api/s/' + id), { method: 'PUT', body: typeof body === 'string' ? body : JSON.stringify(body) }), e);
const get = (e, id) => worker.fetch(new Request(url('/api/s/' + id)), e);

test('fremde Pfade gehen an die statischen Dateien', async () => {
  const r = await worker.fetch(new Request(url('/adhs')), env());
  assert.equal(await r.text(), 'asset');
});

test('ungültige id → 400', async () => {
  const e = env();
  assert.equal((await get(e, 'abc')).status, 400);
  assert.equal((await get(e, 'A'.repeat(64))).status, 400);
});

test('unbekannte id → 404', async () => {
  assert.equal((await get(env(), ID)).status, 404);
});

test('PUT dann GET liefert denselben Datensatz', async () => {
  const e = env(), b = box();
  assert.equal((await put(e, ID, b)).status, 204);
  const r = await get(e, ID);
  assert.equal(r.status, 200);
  assert.equal(r.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await r.json(), b);
});

test('älterer Stand wird mit 409 abgelehnt, gleicher oder neuerer überschreibt', async () => {
  const e = env(), t = Date.now();
  await put(e, ID, box(t));
  assert.equal((await put(e, ID, box(t - 1000))).status, 409);
  assert.equal((await put(e, ID, box(t))).status, 204);
  assert.equal((await put(e, ID, box(t + 1000))).status, 204);
});

test('kaputte oder unplausible Daten → 400', async () => {
  const e = env();
  assert.equal((await put(e, ID, '{kein json')).status, 400);
  assert.equal((await put(e, ID, { ...box(), iv: 'zu-kurz' })).status, 400);
  assert.equal((await put(e, ID, { ...box(), ct: 'hallo welt!' })).status, 400);
  assert.equal((await put(e, ID, { ...box(), stand: Date.now() + 3 * 86400000 })).status, 400);
  assert.equal((await put(e, ID, { ...box(), stand: 'gestern' })).status, 400);
  assert.equal((await put(e, ID, { ...box(), extra: 'name@example.org' })).status, 400);
});

test('zu große Datensätze → 413', async () => {
  assert.equal((await put(env(), ID, { ...box(), ct: 'x'.repeat(70000) })).status, 413);
});

test('DELETE entfernt den Datensatz', async () => {
  const e = env();
  await put(e, ID, box());
  assert.equal((await worker.fetch(new Request(url('/api/s/' + ID), { method: 'DELETE' }), e)).status, 204);
  assert.equal((await get(e, ID)).status, 404);
});

test('andere Methoden → 405', async () => {
  const r = await worker.fetch(new Request(url('/api/s/' + ID), { method: 'POST', body: '{}' }), env());
  assert.equal(r.status, 405);
});

test('Ratenbegrenzung greift beim Schreiben', async () => {
  const e = env(); e.SCHREIBLIMIT = { limit: async () => ({ success: false }) };
  assert.equal((await put(e, ID, box())).status, 429);
});

test('Datenbank-Tageslimit → 429, sonstige Fehler → 503', async () => {
  const e = env();
  e.DB = { prepare(){ return { bind(){ return this; }, async first(){ throw new Error('D1_ERROR: daily limit exceeded'); } }; } };
  assert.equal((await get(e, ID)).status, 429);
  e.DB = { prepare(){ return { bind(){ return this; }, async first(){ throw new Error('network'); } }; } };
  assert.equal((await get(e, ID)).status, 503);
});

test('Cron löscht nur Datensätze, die länger als die Frist unverändert sind', async () => {
  const e = env(), heute = tag();
  e.DB.rows.set('alt', { iv: '', ct: '', stand: 1, geaendert: heute - FRIST_TAGE - 1 });
  e.DB.rows.set('grenze', { iv: '', ct: '', stand: 1, geaendert: heute - FRIST_TAGE });
  e.DB.rows.set('neu', { iv: '', ct: '', stand: 1, geaendert: heute });
  await worker.scheduled({}, e, { waitUntil(){} });
  assert.deepEqual([...e.DB.rows.keys()].sort(), ['grenze', 'neu']);
  assert.equal(FRIST_TAGE, 730);
});
