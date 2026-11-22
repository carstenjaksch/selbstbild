import { test } from 'node:test';
import assert from 'node:assert/strict';
import { istUuid, neueUuid, ableiten, verschluesseln, entschluesseln } from '../public/js/krypto.js';

const U1 = '7c9e6679-7425-40de-944b-e07fc1f90ae7';
const U2 = '3f2504e0-4f89-41d3-9a0c-0305e82c3301';

test('istUuid erkennt nur UUID v4 in Kleinbuchstaben', () => {
  assert.equal(istUuid(U1), true);
  assert.equal(istUuid(U1.toUpperCase()), false);
  assert.equal(istUuid('adhs'), false);
  assert.equal(istUuid(''), false);
  assert.equal(istUuid(undefined), false);
  assert.equal(istUuid(neueUuid()), true);
});

test('ableiten ist deterministisch und trennt verschiedene UUIDs', async () => {
  const a = await ableiten(U1), b = await ableiten(U1), c = await ableiten(U2);
  assert.match(a.id, /^[0-9a-f]{64}$/);
  assert.equal(a.id, b.id);
  assert.notEqual(a.id, c.id);
  assert.ok(!a.id.includes(U1.replace(/-/g, '').slice(0, 12)), 'id verrät die UUID nicht');
});

test('ableiten lehnt Nicht-UUIDs ab', async () => {
  await assert.rejects(() => ableiten('nicht-gueltig'));
});

test('verschlüsseln und entschlüsseln ergibt dasselbe Objekt', async () => {
  const s = await ableiten(U1);
  const obj = { v: 1, stand: 1795361868479, daten: { 'adhs-a1.0': 1, 'adhs-a1.1': 0.5, 'h.migraene': 0 } };
  const box = await verschluesseln(s, obj);
  assert.match(box.iv, /^[A-Za-z0-9_-]{16}$/);
  assert.match(box.ct, /^[A-Za-z0-9_-]+$/);
  assert.ok(!box.ct.includes('adhs'));
  assert.deepEqual(await entschluesseln(s, box), obj);
});

test('jede Verschlüsselung nutzt einen neuen IV', async () => {
  const s = await ableiten(U1);
  const a = await verschluesseln(s, { x: 1 }), b = await verschluesseln(s, { x: 1 });
  assert.notEqual(a.iv, b.iv);
  assert.notEqual(a.ct, b.ct);
});

test('falscher Schlüssel oder fremder Datensatz scheitert', async () => {
  const s1 = await ableiten(U1), s2 = await ableiten(U2);
  const box = await verschluesseln(s1, { geheim: true });
  await assert.rejects(() => entschluesseln(s2, box));
  await assert.rejects(() => entschluesseln({ id: s2.id, key: s1.key }, box), 'an die id gebunden');
});
