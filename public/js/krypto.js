/* Selbstbild – Verschlüsselung im Browser.
   Aus der UUID im #-Teil der Adresse entstehen zwei Dinge:
   - id: SHA-256-Fingerabdruck, unter dem der Server den Datensatz ablegt (verrät die UUID nicht)
   - key: AES-256-GCM-Schlüssel per HKDF, verlässt den Browser nie
   Der Server sieht nur id, IV und Chiffretext. */

const enc = new TextEncoder(), dec = new TextDecoder();
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

export const istUuid = s => typeof s === 'string' && UUID_RE.test(s);
export const neueUuid = () => crypto.randomUUID();

function zuB64u(buf){
  const u = new Uint8Array(buf); let s = '';
  for (let i = 0; i < u.length; i++) s += String.fromCharCode(u[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function ausB64u(s){
  if (typeof s !== 'string' || !/^[A-Za-z0-9_-]*$/.test(s)) throw new Error('kein base64url');
  let t = s.replace(/-/g, '+').replace(/_/g, '/'); while (t.length % 4) t += '=';
  const bin = atob(t), u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return u;
}
const hex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');

export async function ableiten(uuid){
  if (!istUuid(uuid)) throw new Error('keine gültige UUID');
  const id = hex(await crypto.subtle.digest('SHA-256', enc.encode('selbstbild-id:' + uuid)));
  const basis = await crypto.subtle.importKey('raw', enc.encode(uuid), 'HKDF', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey(
    { name: 'HKDF', hash: 'SHA-256', salt: enc.encode('selbstbild-v1'), info: enc.encode('aes-gcm-256') },
    basis, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  return { id, key };
}

export async function verschluesseln({ id, key }, obj){
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: enc.encode(id) }, key, enc.encode(JSON.stringify(obj)));
  return { iv: zuB64u(iv), ct: zuB64u(ct) };
}

export async function entschluesseln({ id, key }, { iv, ct }){
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: ausB64u(iv), additionalData: enc.encode(id) }, key, ausB64u(ct));
  return JSON.parse(dec.decode(pt));
}
