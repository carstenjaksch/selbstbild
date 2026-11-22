/* Selbstbild – Logik: Auswertungen, Rendern, Übersicht (Abhaken, Anordnen, Filter) und Navigation.
   Inhalte stehen in inhalte.js, das Speichern (lokal und verschlüsselt auf dem Server) in speicher.js. */
import { G, DA_ENTW, R, DA_TAGS, DIFF_TAGS, T, XAREAS, CLS_LABEL, CLS_LV, CLS_OPTS, MDQ_P, XT, TSHORT, XDESC } from './inhalte.js';
import * as speicher from './speicher.js';

let S = {};
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const has0 = (o,k) => Object.prototype.hasOwnProperty.call(o,k);
function ansage(t){ const el=document.getElementById('ansage'); if(!el) return; el.textContent=''; setTimeout(()=>{ el.textContent=t; }, 40); }
const KRISE = '<div class="krise" data-krise hidden role="note"><strong>Du musst damit nicht allein bleiben.</strong><p>Du hast bei Frage 9 angegeben, dass du Gedanken hattest, lieber tot zu sein oder dir Leid zuzufügen. Sprich bitte mit jemandem darüber, am besten noch heute. Die TelefonSeelsorge ist kostenlos, anonym und rund um die Uhr erreichbar: <a href="tel:08001110111">0800 111 0 111</a> oder <a href="tel:08001110222">0800 111 0 222</a>, auch im Chat unter <a href="https://online.telefonseelsorge.de" rel="noopener">online.telefonseelsorge.de</a>. In akuter Gefahr: Notruf <a href="tel:112">112</a>.</p></div>';
const SUB_HINWEIS = 'Eine detaillierte Auswertung der Unter-Skalen kann beim Anbieter des jeweiligen Tests kostenpflichtig sein. In die Bewertung fließt nur die Hauptpunktzahl ein.';
const ABLAGE_HINWEIS = '<p class="xhint"><strong>Tipp:</strong> Hebe Screenshots oder PDFs deiner beantworteten Fragebögen und Ergebnisse auf. Für eine spätere Diagnostik können sie hilfreich sein.</p>';

/* ---------- Helfer ---------- */
/* Merkmale: 1 = trifft zu, 0.5 = teilweise. MODE 1 zählt nur „ja“, MODE 0.5 auch „teilweise“. */
let MODE = 1;
const val = (g,i) => S[g+'.'+i] || 0;
const has = (g,i) => val(g,i) >= MODE;
const cnt = g => G[g].items.reduce((n,_,i)=> n + (has(g,i)?1:0), 0);
const pc = g => G[g].items.reduce((n,_,i)=> n + (val(g,i)===0.5?1:0), 0);
const full = g => G[g].items.reduce((n,_,i)=> n + (val(g,i)===1?1:0), 0);
const fmtC = g => { const n=cnt(g), p=pc(g); return (MODE===1 && p) ? n+' (+ '+p+' teilweise)' : String(n); };
const fmtN = x => String(Math.round(x*10)/10).replace('.',',');
const tv = (t,i) => { const v = S['t.'+t+'.'+i]; return (v===undefined||v===null) ? null : Number(v); };
const rv = r => { const v = S['r.'+r]; return (v===undefined||v===null) ? null : Number(v); };
const itemText = it => Array.isArray(it) ? it[0] : it;
const res = (lv,pill,text,lines,fine) => ({lv,pill,text,lines:lines||[],fine:fine||''});
const NONE = () => res('none','Noch offen','Noch keine Angaben in diesem Bereich.');


/* ---------- Eingaben prüfen: nur bekannte Schlüssel, nur Zahlen ---------- */
function validKey(k, v){
 let m;
 if(typeof k!=='string' || typeof v!=='number' || !isFinite(v)) return false;
 if((m=/^h\.([a-z]+)$/.exec(k))) return AREA_IDS.includes(m[1]) && (v===0 || v===1);
 if((m=/^o\.([a-z]+)$/.exec(k))) return AREA_IDS.includes(m[1]) && Number.isInteger(v) && v>=0 && v<AREA_IDS.length;
 if(k==='x.mdq.y') return Number.isInteger(v) && v>=0 && v<=13;
 if(k==='x.mdq.g') return v===0 || v===1;
 if(k==='x.mdq.p') return Number.isInteger(v) && v>=0 && v<=3;
 if((m=/^x\.([a-z0-9]+)$/.exec(k))){ if(!has0(XT,m[1])) return false; const t=XT[m[1]]; return t.min!==undefined && v>=t.min && v<=t.max; }
 if((m=/^x\.([a-z0-9]+)\.([a-z]+)$/.exec(k))){
  if(!has0(XT,m[1])) return false; const t=XT[m[1]]; if(t.min===undefined) return false;
  if(m[2]==='sl' || m[2]==='sln') return !!t.hedge && Number.isInteger(v) && v>=0 && v<=t.hedge.n;
  const sb=(t.subs||[]).find(x=>x.id===m[2]); return !!sb && v>=(sb.min||0) && v<=sb.max;
 }
 if((m=/^xc\.([a-z0-9-]+)$/.exec(k))){ if(!has0(XT,m[1])) return false; const t=XT[m[1]]; return !!t.manual && Number.isInteger(v) && v>=0 && v<=2; }
 if((m=/^t\.(asrs|phq|who5)\.(\d+)$/.exec(k))){ const t=T[m[1]]; return Number(m[2])<t.items.length && t.opts.some(o=>o[1]===v); }
 if((m=/^r\.([a-z-]+)$/.exec(k))){ const n = m[1]==='phqf' ? 4 : (has0(R,m[1]) ? R[m[1]].opts.length : 0); return Number.isInteger(v) && v>=0 && v<n; }
 const i=k.lastIndexOf('.'); if(i<1) return false;
 const gid=k.slice(0,i), n=Number(k.slice(i+1));
 if(!has0(G,gid)) return false;
 return Number.isInteger(n) && n>=0 && n<G[gid].items.length && (v===1 || v===0.5);
}
function clean(o){ const r={}; if(!o || typeof o!=='object' || Array.isArray(o)) return r; Object.keys(o).forEach(k=>{ if(validKey(k,o[k])) r[k]=o[k]; }); return r; }

/* ---------- Auswertungen ---------- */
const RAW = {};
RAW.adhs = () => {
 const ia=cnt('adhs-a1'), hi=cnt('adhs-a2'), fr=cnt('adhs-rahmen');
 if(!ia && !hi && !fr) return NONE();
 const sA=ia>=5, sH=hi>=5;
 const pres = sA&&sH ? 'kombiniertes Erscheinungsbild' : sA ? 'vorwiegend unaufmerksames Erscheinungsbild' : sH ? 'vorwiegend hyperaktiv-impulsives Erscheinungsbild' : '';
 const lines=['Unaufmerksamkeit: '+fmtC('adhs-a1')+' von 9 (Schwelle 5)','Hyperaktivität-Impulsivität: '+fmtC('adhs-a2')+' von 9 (Schwelle 5)','Rahmenkriterien: '+fmtC('adhs-rahmen')+' von 5'];
 const fine='Schwelle für Erwachsene ab 17 Jahren. Hinweis für ein Fachgespräch, keine Diagnose.';
 if((sA||sH) && fr===5) return res('match','Muster erfüllt','Deine Angaben entsprechen dem Kriterienmuster einer ADHS ('+pres+'). Eine fachärztliche Abklärung ist sinnvoll.',lines,fine);
 if(sA||sH) return res('partial','Symptomschwelle erreicht','Die Symptomschwelle ist erreicht ('+pres+'), die Rahmenkriterien sind erst zu '+fr+' von 5 bestätigt. Entscheidend sind vor allem der Beginn in der Kindheit und die Beeinträchtigung.',lines,fine);
 if(ia>=3||hi>=3) return res('partial','Einzelne Merkmale','Einzelne Merkmale liegen vor, die Schwelle von 5 je Bereich ist nicht erreicht.',lines,fine);
 return res('low','Wenige Hinweise','Wenige Merkmale angegeben.',lines,fine);
};
RAW.autismus = () => {
 const a=[1,2,3].map(n=>cnt('aut-a'+n)>0), b=[1,2,3,4].map(n=>cnt('aut-b'+n)>0), fr=cnt('aut-rahmen');
 const aN=a.filter(Boolean).length, bN=b.filter(Boolean).length;
 if(!aN && !bN && !fr) return NONE();
 const lines=['A · soziale Kommunikation: '+aN+' von 3 Bereichen angedeutet (nötig: 3)','B · wiederholte Muster: '+bN+' von 4 Bereichen angedeutet (nötig: 2)','Rahmenkriterien: '+fr+' von 3'];
 const fine='Ein Bereich gilt als angedeutet, sobald ein Beispiel zutrifft. Hinweis für ein Fachgespräch, keine Diagnose.';
 if(aN===3 && bN>=2 && fr===3) return res('match','Muster erfüllt','Deine Angaben entsprechen dem Kriterienmuster einer Autismus-Spektrum-Störung. Eine Abklärung in einer Autismus-Ambulanz ist sinnvoll.',lines,fine);
 if(aN===3 && bN>=2) return res('partial','Symptommuster angedeutet','Das Symptommuster ist angedeutet; die Rahmenkriterien sind erst zu '+fr+' von 3 bestätigt.',lines,fine);
 if(aN>=2 || bN>=2) return res('partial','Teilmuster','Ein Teil des Musters ist angedeutet. Für das vollständige Muster braucht es alle drei A-Bereiche und mindestens zwei B-Bereiche.',lines,fine);
 return res('low','Wenige Hinweise','Wenige Merkmale angegeben.',lines,fine);
};
RAW.audhs = () => {
 const ra=RAW.adhs(), rb=RAW.autismus(), m=cnt('audhs-muster');
 if(ra.lv==='none' && rb.lv==='none' && !m) return NONE();
 const lines=['ADHS: '+ra.pill,'Autismus: '+rb.pill,'Typische Wechselwirkungen: '+fmtC('audhs-muster')+' von '+G['audhs-muster'].items.length];
 const fine='AuDHS setzt voraus, dass beide Kriterienmuster vollständig erfüllt sind.';
 if(ra.lv==='match' && rb.lv==='match') return res('match','Beide Muster erfüllt','Beide Kriterienmuster sind erfüllt. Nach DSM-5-TR und ICD-11 können beide Diagnosen gemeinsam vergeben werden; sprich in der Diagnostik ausdrücklich beide Bereiche an.',lines,fine);
 const pa=(ra.lv==='match'||ra.lv==='partial'), pb=(rb.lv==='match'||rb.lv==='partial');
 if(pa && pb) return res('partial','Hinweise auf beide','Es gibt Hinweise in beiden Bereichen, aber noch nicht für beide das vollständige Muster.',lines,fine);
 if(m>=4) return res('partial','Viele Wechselwirkungen','Viele typische AuDHS-Muster. Fülle die Reiter ADHS und Autismus aus, um die Kriterien zu prüfen.',lines,fine);
 return res('low','Wenige Hinweise','Bisher wenige Hinweise auf eine Kombination.',lines,fine);
};
RAW.dep = () => {
 const d=i=>has('dep-sym',i), fr=cnt('dep-rahmen');
 const n = cnt('dep-sym');
 if(!n && !fr) return NONE();
 const dsm=[d(0),d(1),d(9),d(8),d(10),d(2),d(4)||d(5),d(3),d(7)];
 const dsmN=dsm.filter(Boolean).length, dsmCore=d(0)||d(1), dsmOk=dsmN>=5&&dsmCore;
 const core=[0,1,2].filter(d).length, add=[3,4,5,6,7,8,9].filter(d).length;
 const sev = core>=3&&add>=4 ? 'schweren' : core>=2&&add>=3 ? 'mittelgradigen' : core>=2&&add>=2 ? 'leichten' : null;
 const i11=[d(0),d(1),d(3),d(4)||d(5),d(6),d(7),d(8),d(9),d(10),d(2)], n11=i11.filter(Boolean).length, ok11=n11>=5&&dsmCore;
 const lines=[
  'DSM-5-TR: '+dsmN+' von 9 Symptomen'+(dsmCore?', Kernsymptom vorhanden':', kein Kernsymptom')+' → Schwelle '+(dsmOk?'erreicht':'nicht erreicht'),
  'ICD-10: '+core+' Haupt- und '+add+' Zusatzsymptome → '+(sev?'Muster einer '+sev+' Episode':'unter der Schwelle (mindestens 2 + 2)'),
  'ICD-11: '+n11+' von 10 Symptomen → Schwelle '+(ok11?'erreicht':'nicht erreicht'),
  'Rahmenkriterien: '+fr+' von 4'];
 const fine='Hinweis für ein Fachgespräch, keine Diagnose.';
 if((dsmOk||sev) && fr===4) return res('match','Muster einer Episode','Deine Angaben entsprechen dem Muster einer depressiven Episode. Bitte lass das zeitnah ärztlich oder psychotherapeutisch abklären.',lines,fine);
 if(dsmOk||sev) return res('partial','Symptomschwelle erreicht','Die Symptomschwelle ist erreicht. Prüfe die Rahmenkriterien, vor allem die Dauer von mindestens 2 Wochen.',lines,fine);
 return res('low','Unter der Schwelle','Einzelne Symptome, die Schwelle einer depressiven Episode ist nicht erreicht.',lines,fine);
};
RAW.dys = () => {
 const k=has('dys-rahmen',0), f=has('dys-rahmen',1), s=cnt('dys-sym');
 if(!k && !f && !s) return NONE();
 const lines=['Seit mindestens 2 Jahren überwiegend gedrückt: '+(k?'ja':'nein'),'Begleitsymptome: '+fmtC('dys-sym')+' von 6 (nötig: 2)','Nie länger als 2 Monate beschwerdefrei: '+(f?'ja':'nein')];
 if(k && f && s>=2) return res('match','Muster Dysthymie','Deine Angaben entsprechen dem Muster einer anhaltenden depressiven Störung (Dysthymie).',lines);
 if(k) return res('partial','Teilweise','Langanhaltend gedrückte Stimmung, aber noch nicht alle Kriterien angegeben.',lines);
 return res('low','Wenige Hinweise','Das Zeitkriterium von 2 Jahren ist nicht angegeben.',lines);
};
RAW.verlauf = () => {
 const v=i=>has('dep-verlauf',i), n=cnt('dep-verlauf');
 if(!n) return NONE();
 const L=[];
 if(v(0)&&v(1)) L.push('Mehrere Episoden mit beschwerdefreien Zeiten dazwischen: Hinweis auf einen rezidivierenden Verlauf (F33 · 6A71).');
 else if(v(0)) L.push('Frühere Episode angegeben; für „rezidivierend“ zählen beschwerdefreie Zeiten von mindestens 2 Monaten dazwischen.');
 if(v(2)) L.push('Episode länger als 2 Jahre: chronischer Verlauf. Bestand vorher eine Dysthymie, spricht man von „Double Depression“.');
 if(v(3)) L.push('Saisonales Muster.');
 if(v(4)&&v(5)) L.push('Atypische Merkmale. Die Kränkbarkeit bei Zurückweisung ähnelt der ADHS-typischen Zurückweisungsempfindlichkeit; der Unterschied liegt in der Dauer.');
 else if(v(4)||v(5)) L.push('Einzelne atypische Merkmale.');
 if(v(6)) L.push('Melancholische Merkmale (somatisches Syndrom).');
 if(v(7)) return res('alert','Frühere Hochphase','Du hast eine frühere Phase mit gehobener oder gereizter Stimmung angegeben. Bitte fülle den Reiter Bipolar aus und sprich das bei der Behandlung unbedingt an.',L);
 return res('info','Verlauf',L.length?'Aus deinen Angaben ergeben sich folgende Verlaufshinweise:':'Noch keine eindeutigen Verlaufshinweise.',L);
};
RAW.depression = () => {
 const a=RAW.dep(), b=RAW.dys(), c=RAW.verlauf();
 if(c.lv==='alert') return c;
 const order={match:4,partial:3,info:2,low:1,none:0};
 const best=[a,b].sort((x,y)=>order[y.lv]-order[x.lv])[0];
 if(best.lv==='none' && c.lv!=='none') return c;
 return best;
};
RAW.bipolar = () => {
 const a=cnt('bip-a'), b=cnt('bip-b'), ir=has('bip-zusatz',0), dep=has('bip-zusatz',1), zy=has('bip-zusatz',2);
 const dauer=rv('bip-dauer'), schw=rv('bip-schwere');
 if(!a && !b && !ir && !dep && !zy && dauer===null && schw===null) return NONE();
 const need = ir?4:3, ep = a===2 && b>=need;
 const lines=['Abgegrenzte Hochphase mit mehr Energie: '+a+' von 2','Merkmale: '+fmtC('bip-b')+' von 7 (nötig: '+need+(ir?', da vor allem gereizt':'')+')','Dauer: '+(dauer===null?'nicht angegeben':R['bip-dauer'].opts[dauer]),'Folgen: '+(schw===null?'nicht angegeben':(schw===1?'schwerwiegend':'sichtbar, Alltag lief weiter'))];
 if(dep) lines.push('Depressive Phasen von mindestens 2 Wochen: ja');
 if(zy) lines.push('Über 2 Jahre wiederkehrende unterschwellige Hochs und Tiefs: ja (Zyklothymie-Muster)');
 const fine='Gilt nur, wenn die Hochphase nicht durch Drogen, Medikamente oder eine körperliche Erkrankung ausgelöst wurde. Hinweis für ein Fachgespräch, keine Diagnose.';
 if(dauer===3){
  const ra=RAW.adhs(), adhsHint=(ra.lv==='match'||ra.lv==='partial');
  if(zy) lines.push('Auch bei der Zyklothymie geht es um Phasen von Tagen; Hochs, die innerhalb eines Tages kommen und gehen, sprechen eher für ADHS-typische Schwankungen.');
  const rb=res('low', adhsHint?'Eher ADHS-typisch':'Keine Episode', 'Hochs, die kürzer als einen Tag dauern und oft mehrmals am Tag kommen und gehen, erfüllen die Zeitkriterien einer Hypomanie (mindestens 4 Tage) oder Manie (mindestens 7 Tage) nicht.'+(adhsHint?' Sie passen zu den ADHS-Hinweisen: Getriebenheit „wie von einem Motor“, Begeisterung, Rededrang und Impulskäufe kommen dort oft mehrmals täglich vor.':''), lines, fine); rb.adhsTypical=adhsHint; return rb;
 }
 if(ep && schw===1) return res('match','Muster Manie','Deine Angaben entsprechen dem Muster einer manischen Episode und damit einer Bipolar-I-Störung (Dauer mindestens 7 Tage oder Klinikaufenthalt). Bitte fachärztlich abklären lassen.',lines,fine);
 if(ep && schw===0 && (dauer===1 || dauer===2)) return res('match', dep?'Muster Bipolar II':'Muster Hypomanie', dep?'Hypomane und depressive Phasen: Das entspricht dem Muster einer Bipolar-II-Störung. Bitte fachärztlich abklären lassen.':'Deine Angaben entsprechen dem Muster einer hypomanen Episode. Für Bipolar II braucht es zusätzlich mindestens eine depressive Episode.',lines,fine);
 if(ep && dauer===0) return res('partial','Kurze Hochphasen','Die Merkmale sind erfüllt, die Phasen dauern aber nur 1 bis 3 Tage. Kurze hypomane Phasen werden gesondert betrachtet; ein Stimmungstagebuch hilft bei der Einordnung.',lines,fine);
 if(ep) return res('partial','Merkmale erfüllt','Die Merkmale einer Hochphase sind erfüllt. Gib noch Dauer und Folgen an.',lines,fine);
 if(zy) return res('partial','Hinweis Zyklothymie','Langjährige unterschwellige Hochs und Tiefs passen zum Muster einer Zyklothymie.',lines,fine);
 if(a>=1 || b>=2) return res('partial','Einzelne Merkmale','Einzelne Merkmale einer Hochphase, das Muster ist nicht vollständig.',lines,fine);
 return res('low','Wenige Hinweise','Wenige Hinweise auf Hochphasen.',lines,fine);
};
RAW.abgrenzung = () => {
 const c={adhs:0,dep:0,bip:0};
 DIFF_TAGS.forEach((t,i)=>{ c[t]+=val('diff',i); });
 const tot=c.adhs+c.dep+c.bip;
 if(!tot) return NONE();
 const names={adhs:'ADHS-typisch',dep:'depressionstypisch',bip:'bipolar-typisch'};
 const sorted=Object.keys(c).sort((x,y)=>c[y]-c[x]);
 const mixed = c[sorted[1]]>=2 && c[sorted[0]]-c[sorted[1]]<=1;
 const text = mixed ? 'Mischmuster: Deine Angaben passen zu mehreren Erklärungen. Das kommt häufig vor, auch weil die Störungen gemeinsam auftreten können.' : 'Am stärksten ausgeprägt: '+names[sorted[0]]+'es Muster.';
 const r=res(c.bip>=2?'partial':'info', mixed?'Mischmuster':names[sorted[0]], text, [], 'Grobe Orientierung, nicht validiert. Bei bipolar-typischen Angaben bitte den Reiter Bipolar ausfüllen.');
 r.bars=[['ADHS-typisch',c.adhs],['Depressionstypisch',c.dep],['Bipolar-typisch',c.bip]];
 return r;
};
RAW.alexithymie = () => {
 const a=cnt('alx-dif'), b=cnt('alx-ddf'), e=cnt('alx-eot'), t=a+b+e;
 if(!t) return NONE();
 const lines=['Gefühle erkennen: '+fmtC('alx-dif')+' von 4','Gefühle beschreiben: '+fmtC('alx-ddf')+' von 4','Außenorientiertes Denken: '+fmtC('alx-eot')+' von 4'];
 const fine='Faustregel dieser Seite, nicht validiert. Aussagekräftig sind TAS-20 oder PAQ.';
 if(t>=8) return res('match','Deutliche Hinweise','Deutliche Hinweise auf alexithyme Züge. Ein validierter Fragebogen (TAS-20, PAQ) kann das genauer einordnen.',lines,fine);
 if(t>=5 || a>=3 || b>=3) return res('partial','Einige Hinweise','Einige Hinweise, besonders in den Facetten mit 3 oder 4 Treffern.',lines,fine);
 return res('low','Wenige Hinweise','Wenige Hinweise auf alexithyme Züge.',lines,fine);
};
const MIG_ORT=['typisch für Migräne, aber kein Muss.','kommt bei Migräne und Spannungskopfschmerz vor.','bei Migräne seltener, aber beschrieben; entscheidend sind Schmerzcharakter, Dauer und Begleitsymptome.','kommt bei Migräne und Spannungskopfschmerz vor.','typisch für Spannungskopfschmerz, bei Migräne aber möglich.','bei kurzen, sehr heftigen Attacken mit tränendem Auge an Clusterkopfschmerz denken.'];
RAW.migraene = () => {
 const GR=['mig-attacke','mig-begleit','mig-verlauf','mig-aura','mig-aura-c','mig-phasen','mig-ausloeser','mig-tth','mig-tth-b'];
 const n=GR.reduce((s,g)=>s+cnt(g),0), tage=rv('mig-tage'), dauer=rv('mig-dauer'), ort=rv('mig-ort');
 if(!n && tage===null && dauer===null && ort===null) return NONE();
 const a=i=>has('mig-attacke',i), b=i=>has('mig-begleit',i), v=i=>has('mig-verlauf',i), au=i=>has('mig-aura',i), p=i=>has('mig-phasen',i), tb=i=>has('mig-tth-b',i);
 const C=cnt('mig-attacke')>=2, D=b(0)||b(1), B=dauer===2||dauer===3, E=v(0);
 const tthLike=cnt('mig-tth')>=2 && tb(0) && tb(1), TTH=tthLike && !D;
 const daily=tage!==null && tage>=3, m3=v(1);
 const chronic=daily && m3 && (v(2) || v(3) || (C && D));
 const episodic=E && B && C && D;
 const typAura=cnt('mig-aura')>=1, aura=typAura && cnt('mig-aura-c')>=3;
 const ndph=v(4) && daily, moh=v(5)||v(6);
 const miss=[]; if(!E) miss.push('mindestens 5 Attacken'); if(!B) miss.push('Dauer von 4 bis 72 Stunden'); if(!C) miss.push('2 von 4 Schmerzmerkmalen'); if(!D) miss.push('Übelkeit oder Licht- und Lärmempfindlichkeit');
 if(daily && dauer===4){ const i=miss.indexOf('Dauer von 4 bis 72 Stunden'); if(i>=0) miss.splice(i,1); if(!m3) miss.push('Bestehen seit mehr als 3 Monaten'); }
 const lines=[
  'Schmerzmerkmale der Migräne: '+fmtC('mig-attacke')+' von 4 (mindestens 2 nötig)',
  'Begleitsymptome: '+(D?'erfüllt':'nicht erfüllt'),
  'Dauer: '+(dauer===null?'nicht angegeben':R['mig-dauer'].opts[dauer]),
  'Kopfschmerztage pro Monat: '+(tage===null?'nicht angegeben':R['mig-tage'].opts[tage])];
 if(ort!==null) lines.push('Ort: '+R['mig-ort'].opts[ort]+'; '+MIG_ORT[ort]);
 if(dauer===3) lines.push('Attacken über 72 Stunden heißen Status migraenosus und gehören ärztlich behandelt.');
 if(dauer===0) lines.push('Unter 30 Minuten ist für Migräne und Spannungskopfschmerz zu kurz; kurze, heftige Attacken passen eher zu anderen Kopfschmerzformen wie dem Clusterkopfschmerz.');
 if(daily) lines.push('Kopfschmerz an 15 oder mehr Tagen im Monat: Infrage kommen chronische Migräne, chronischer Spannungskopfschmerz, neu aufgetretener täglicher Kopfschmerz und Kopfschmerz bei Medikamentenübergebrauch. Ein Kopfschmerzkalender klärt das am besten.');
 if(daily && !m3) lines.push('Als chronisch gilt das Muster, wenn es seit mehr als 3 Monaten besteht.');
 if(aura) lines.push('Aura: passt zu Migräne mit Aura. Neue oder veränderte Auren ärztlich abklären lassen.');
 else if(typAura) lines.push('Aura-artige Symptome angegeben; für eine Aura braucht es mindestens 3 der 6 Verlaufsmerkmale (bisher '+fmtC('mig-aura-c')+').');
 if(au(3)) lines.push('Halbseitige Schwäche in der Aura: an hemiplegische Migräne denken, u. a. durch das Gen CACNA1A (siehe Ataxie Typ 2). Eine erstmalige Lähmung immer sofort abklären lassen.');
 if(v(3)) lines.push('Besserung durch ein Triptan stützt Migräne; bei Spannungskopfschmerz wirken Triptane nicht.');
 if(moh) lines.push('Schmerzmittel an vielen Tagen: Kopfschmerz bei Medikamentenübergebrauch möglich. Ärztlich besprechen; eine begleitete Medikamentenpause senkt die Kopfschmerztage oft deutlich.');
 if(ndph && !m3) lines.push('Täglich seit einem klar erinnerbaren Tag: Nach mehr als 3 Monaten an einen neu aufgetretenen täglichen Kopfschmerz (NDPH) denken.');
 if(cnt('mig-phasen')) lines.push('Weitere migränetypische Zeichen: '+fmtC('mig-phasen')+' von 13');
 if(p(6)) lines.push('Geruchsempfindlichkeit in der Attacke spricht deutlich für Migräne.');
 if(p(5)) lines.push('Berührungsempfindlichkeit der Haut (Allodynie) ist ein Risikofaktor für Chronifizierung; die ASC-12 unten misst sie.');
 if(cnt('mig-ausloeser')) lines.push('Auslöser: '+fmtC('mig-ausloeser')+' angegeben. Sie erklären einzelne Attacken, zählen aber nicht für die Diagnose.');
 if(cnt('mig-tth')||cnt('mig-tth-b')) lines.push('Spannungskopfschmerz: '+fmtC('mig-tth')+' von 4 Schmerzmerkmalen (mindestens 2 nötig), '+fmtC('mig-tth-b')+' von 2 Begleitkriterien (beide nötig)');
 if(tthLike && C && D) lines.push('Merkmale beider Kopfschmerzarten: Viele Menschen mit Migräne haben zusätzlich Spannungskopfschmerzen; ein Kalender trennt die Tage.');
 const fine='Grundlage: Internationale Kopfschmerzklassifikation ICHD-3. Orientierung für das Gespräch in Neurologie oder Kopfschmerzambulanz, keine Diagnose.';
 if(ndph && m3) return res('partial','Möglicher NDPH','Täglicher Kopfschmerz, der an einem klar erinnerbaren Tag begann und seit über 3 Monaten anhält, ordnet die Klassifikation als neu aufgetretenen täglichen Kopfschmerz (NDPH) ein, auch wenn er Migränemerkmale hat. Bitte neurologisch abklären lassen.',lines,fine);
 if(chronic) return res('match','Passt zu chronischer Migräne','Kopfschmerz an mindestens 15 Tagen im Monat seit mehr als 3 Monaten mit Migränemerkmalen passt zu einer chronischen Migräne.'+(moh?' Der angegebene Schmerzmittelgebrauch kann daran beteiligt sein.':'')+' Bitte in Neurologie oder Kopfschmerzambulanz abklären lassen; chronische Migräne ist behandelbar.',lines,fine);
 if(episodic) return res('match',aura?'Passt zu Migräne mit Aura':'Passt zu Migräne','Deine Angaben erfüllen die Kriterien einer Migräne'+(aura?' mit Aura':' ohne Aura')+': mindestens 5 Attacken von 4 bis 72 Stunden mit typischem Schmerz und Begleitsymptomen.',lines,fine);
 if(aura) return res('match','Passt zu Migräne mit Aura','Vollständig zurückgehende Seh-, Gefühls- oder Sprachstörungen, die sich langsam ausbreiten und von Kopfschmerz gefolgt werden, passen zu einer Migräne mit Aura.',lines,fine);
 if(miss.length===1 && !TTH) return res('partial','Wahrscheinliche Migräne','Bis auf ein Kriterium ist das Bild einer Migräne erfüllt; die Klassifikation nennt das „wahrscheinliche Migräne“. Es fehlt: '+miss[0]+'.',lines,fine);
 if(TTH) return res('low','Eher Spannungskopfschmerz','Beidseitiger, drückender, leichter bis mittlerer Kopfschmerz ohne Übelkeit und höchstens mit Licht- oder Lärmempfindlichkeit passt eher zu Spannungskopfschmerz als zu Migräne.'+(daily?' An 15 oder mehr Tagen im Monat spricht man von chronischem Spannungskopfschmerz.':''),lines,fine);
 if(C || D) return res('low','Einzelne Merkmale','Einzelne Migränemerkmale sind angegeben; für das Kriterienbild fehlen noch: '+miss.join(', ')+'.',lines,fine);
 return res('low','Kaum Merkmale','Bisher sind kaum Merkmale einer Migräne angegeben.',lines,fine);
};
RAW.ataxie = () => {
 const n=cnt('ea2-kern')+cnt('ea2-ausloeser')+cnt('ea2-verlauf')+cnt('ea2-weitere'), dauer=rv('ea-dauer');
 if(!n && dauer===null) return NONE();
 const k=i=>has('ea2-kern',i), t=i=>has('ea2-ausloeser',i), v=i=>has('ea2-verlauf',i), w=i=>has('ea2-weitere',i);
 const core = k(0) && (k(1) || k(2));
 const trgDoc = [0,1,3,4,5,6,8].filter(t).length;
 const support = trgDoc>0 || v(0) || v(1) || v(2) || v(5);
 const lines=[
  'Beschriebene EA2-Merkmale während der Attacken: '+fmtC('ea2-kern')+' von 9',
  'Dauer der Attacke: '+(dauer===null?'nicht angegeben':R['ea-dauer'].opts[dauer]),
  'Beschriebene Auslöser: '+trgDoc+' von 7',
  'Verlauf, Befunde, Familie: '+fmtC('ea2-verlauf')+' von 6'];
 if(v(5)) lines.push('Ansprechen auf Acetazolamid oder 4-Aminopyridin stützt die Diagnose.');
 if(t(2)) lines.push('Längere Gleichgewichtsanforderung ist als EA2-Auslöser nicht ausdrücklich beschrieben, passt aber zu einer Belastung des Gleichgewichtssystems.');
 const dd=[];
 if(dauer!==null && dauer<=1) dd.push('EA1: Attacken von Sekunden bis Minuten, oft mehrmals täglich, meist mit Muskelzucken (Myokymien); Drehschwindel eher selten.');
 if(dauer===0) dd.push('Vestibuläre Paroxysmie: sehr kurze, gleichförmige Drehschwindelattacken unter 1 Minute, oft viele pro Tag; spricht auf Carbamazepin an.');
 if(v(4)) dd.push('Vestibuläre Migräne: Schwindelattacken von 5 Minuten bis 72 Stunden bei bekannter Migräne; Schlaf hilft oft, danach häufig Erschöpfung.');
 if(w(5)) dd.push('Morbus Menière: Attacken von 20 Minuten bis 12 Stunden mit Hörminderung, Ohrdruck und Ohrgeräuschen auf einem Ohr.');
 if(t(7)) dd.push('Lagerungsschwindel: Sekunden-Attacken bei bestimmten Kopfbewegungen; mit einfachen Manövern behandelbar.');
 if(w(4)) dd.push('Bewusstseinsstörung: ärztlich einordnen lassen, ob ein Kreislauf- oder Anfallsgeschehen beteiligt ist (z. B. EKG, EEG).');
 if(w(3)) dd.push('Erholung durch Schlaf ist bei EA2 und bei Migräne beschrieben und unterscheidet beide nicht sicher.');
 dd.forEach(x=>lines.push('Abgrenzung · '+x));
 const fine='Gewertet werden nur in der Literatur beschriebene Merkmale; die weiteren Beobachtungen fließen nur in die Abgrenzung ein. Orientierung für das Gespräch in der Neurologie, keine Diagnose.';
 if(core && support && dauer!==null && dauer>=2) return res('match','Passt zu episodischer Ataxie','Anfallsartige Gang- und Standunsicherheit mit Drehschwindel oder Augenzittern, einer Dauer ab 5 Minuten und beschriebenen Auslösern oder Befunden passt zum Bild einer episodischen Ataxie Typ 2. Bitte neurologisch abklären lassen, inklusive Beratung zum Gentest.',lines,fine);
 if(core && support && dauer===1) return res('partial','Kurze Attacken','Das Muster passt zu einer episodischen Ataxie, die Attacken sind aber kürzer als die beschriebenen 5 Minuten bis Tage. Bei kurzen Attacken kommen auch EA1 und andere Schwindelformen infrage.',lines,fine);
 if(core && dauer===0) return res('partial','Sehr kurze Attacken','Attacken unter etwa einer Minute sind für EA2 untypisch. Eher passen sie zu EA1 oder einer vestibulären Paroxysmie; siehe Abgrenzung.',lines,fine);
 if(core && support) return res('partial','Episodisches Muster','Das Muster passt zu einer episodischen Ataxie. Gib noch die Dauer der Attacken an; sie unterscheidet EA2 von EA1 und anderen Schwindelformen.',lines,fine);
 if(k(0)) return res('partial','Episodisches Muster','Wiederkehrende Ataxie-Attacken. Dauer, Auslöser und Befunde zwischen den Attacken helfen bei der Einordnung.',lines,fine);
 return res('low','Einzelne Merkmale','Einzelne Merkmale, aber keine Ataxie-Attacken angegeben.',lines,fine);
};

RAW.dyskalkulie = () => {
 const z=cnt('dk-zahl'), r=cnt('dk-rechnen'), a=cnt('dk-alltag'), v=cnt('dk-vg');
 if(!z && !r && !a && !v) return NONE();
 const lines=['Zahlverständnis: '+fmtC('dk-zahl')+' von 4','Rechnen: '+fmtC('dk-rechnen')+' von 4','Alltag: '+fmtC('dk-alltag')+' von 5','Vorgeschichte seit der Schulzeit: '+fmtC('dk-vg')+' von 2'];
 const fine='Faustregel dieser Seite, nicht validiert. Gesichert wird eine Rechenstörung nur mit normiertem Rechentest und Intelligenztest.';
 if(z+r>=5 && v>=1) return res('match','Viele Hinweise','Viele Merkmale im Zahlverständnis und Rechnen, dazu eine Vorgeschichte seit der Schulzeit. Eine Testdiagnostik kann Klarheit bringen.',lines,fine);
 if(z+r+a>=4) return res('partial','Einige Hinweise','Einige Merkmale. Achte auf die Abgrenzung zu Flüchtigkeitsfehlern (ADHS) und Mathematikangst.',lines,fine);
 return res('low','Wenige Hinweise','Wenige Merkmale angegeben.',lines,fine);
};
RAW.dyspraxie = () => {
 const g=cnt('dp-grob'), f=cnt('dp-fein'), a=cnt('dp-alltag'), v=cnt('dp-vg');
 if(!g && !f && !a && !v) return NONE();
 const lines=['Grobmotorik: '+fmtC('dp-grob')+' von 4','Feinmotorik: '+fmtC('dp-fein')+' von 4','Planung und Alltag: '+fmtC('dp-alltag')+' von 4','Vorgeschichte seit der Kindheit: '+fmtC('dp-vg')+' von 2'];
 const fine='Faustregel dieser Seite, nicht validiert. Gesichert wird eine UEMF über einen normierten Motoriktest.';
 if(g+f>=4 && v>=1 && a>=1) return res('match','Viele Hinweise','Viele motorische Merkmale mit Alltagsfolgen und Beginn in der Kindheit. Das passt zum Muster einer UEMF/Dyspraxie.',lines,fine);
 if(g+f+a>=4) return res('partial','Einige Hinweise','Einige Merkmale. Ohne Beginn in der Kindheit kommen eher erworbene Ursachen infrage; dann bitte neurologisch abklären.',lines,fine);
 return res('low','Wenige Hinweise','Wenige Merkmale angegeben.',lines,fine);
};
RAW.dysarthrie = () => {
 const groups=['da-stimme','da-artik','da-begleit'];
 let n=0; const tags={};
 groups.forEach(g=>G[g].items.forEach((_,i)=>{ if(has(g,i)){ n++; (DA_TAGS[g+'.'+i]||[]).forEach(t=>{tags[t]=(tags[t]||0)+1;}); } }));
 const vl=rv('da-verlauf');
 const entw=G['da-entw'].items.map((_,i)=>i).filter(i=>has('da-entw',i));
 const eaSpeech=has('ea2-kern',4);
 if(!n && vl===null && !entw.length && !eaSpeech) return NONE();
 const lines=[];
 const top=Object.keys(tags).filter(t=>tags[t]>=2).sort((x,y)=>tags[y]-tags[x]);
 if(top.length) lines.push('Klangmerkmale passen am ehesten zu: '+top.map(t=>t+' ('+tags[t]+')').join(', ')+'. Nur zur Orientierung.');
 if(has('da-begleit',0)) lines.push('Verschlucken: Schluckdiagnostik ansprechen, da Verschlucken zu Lungenentzündungen führen kann.');
 if(vl===2) lines.push('Phasenweises Auftreten kommt z. B. bei episodischer Ataxie oder Myasthenie vor.');
 if(vl===3 && n) lines.push('Bei Beginn in der Kindheit kommen auch entwicklungsbedingte Sprechbesonderheiten in Frage (siehe „Sprechen seit der Kindheit“).');
 if(entw.length) lines.push('Sprechen seit der Kindheit: '+entw.map(i=>DA_ENTW[i]).join(', ')+'. Das sind keine Dysarthrie-Merkmale; einordnen kann sie die Logopädie.');
 if(eaSpeech) lines.push('Im Reiter Ataxie hast du verwaschene Sprache während der Attacken angegeben. Das ist eine ataktische Dysarthrie, die nur in den Attacken auftritt.');
 if(vl===0) return res('partial','Zeitnah abklären','Eine plötzlich aufgetretene Sprechstörung sollte zeitnah ärztlich abgeklärt werden, auch wenn sie sich zurückgebildet hat.',lines);
 if(n>=1) return res('partial','Abklärung sinnvoll','Merkmale einer Sprechstörung. Die Ursache sollte neurologisch geklärt werden, Befund und Therapie übernimmt die Logopädie.',lines,'Die Zuordnung zu Formen ist eine grobe Orientierung, keine Diagnose.');
 const extra=entw.length ? ' Dazu kommen Sprechbesonderheiten, wie sie bei Autismus, ADHS oder Dyspraxie vorkommen.' : '';
 if(eaSpeech){ const r=res('info','Nur in Attacken','Außerhalb der Attacken hast du keine Merkmale einer Dysarthrie angegeben.'+extra,lines); r.note='Mehr dazu:'; r.link=['/ataxie','Ataxie Typ 2']; return r; }
 if(entw.length) return res('low','Keine Dysarthrie','Keine Merkmale einer erworbenen Sprechstörung, aber Sprechbesonderheiten, wie sie bei Autismus, ADHS oder Dyspraxie vorkommen.',lines);
 return res('low','Wenige Hinweise','Nur der Verlauf ist angegeben.',lines);
};

/* Teilweise: jede Auswertung läuft streng (nur „ja“) und großzügig (auch „teilweise“) */
const RANK={none:0,low:1,info:2,partial:3,match:4,alert:5};
function withPartial(fn){
 MODE=1; const a=fn(); MODE=0.5; const b=fn(); MODE=1;
 if(a.lv==='alert' || (a.lv===b.lv && a.pill===b.pill)) return a;
 if(a.lv==='none'){
  /* nur teilweise markierte Angaben: Inhalt der großzügigen Auswertung, eine Stufe vorsichtiger */
  const down={match:'partial', partial:'low', alert:'alert', info:'info', low:'low'};
  return Object.assign({}, b, {lv:down[b.lv]||'low', pill: b.lv==='match' ? 'Grenzwertig' : (b.lv==='info'||b.lv==='alert') ? b.pill : 'Nur teilweise', text:'Nur teilweise zutreffende Angaben. '+b.text, lines:b.lines.slice()});
 }
 const r=Object.assign({}, a, {lines:a.lines.slice()});
 if(r.bars) r.bars=a.bars;
 if(b.lv==='match' && a.lv!=='match'){
  r.lv='partial'; r.pill='Grenzwertig';
  r.text='Mit den eindeutig zutreffenden Merkmalen ist das Muster nicht vollständig erfüllt, mit den teilweise zutreffenden schon. Diagnostisch zählen Merkmale, die deutlich und dauerhaft vorliegen; die teilweise zutreffenden sind ein guter Punkt fürs Fachgespräch.';
 } else if(RANK[b.lv]>RANK[a.lv] || b.pill!==a.pill){
  r.lines.push('Mit den teilweise zutreffenden Merkmalen: '+b.pill);
 }
 return r;
}
const RES={}; Object.keys(RAW).forEach(k=>{ RES[k]=()=>withPartial(RAW[k]); });
/* Hinweis: „teilweise“ bei Autismus-Merkmalen und ADHS */
const AUT_GROUPS=['aut-a1','aut-a2','aut-a3','aut-b1','aut-b2','aut-b3','aut-b4','aut-rahmen','aut-zusatz'];
const autBase=RES.autismus;
RES.autismus = () => {
 const r=autBase(), p=AUT_GROUPS.reduce((n,g)=>n+pc(g),0);
 if(!p) return r;
 const ra=RES.adhs(), adhsHint=(ra.lv==='match'||ra.lv==='partial');
 const out=Object.assign({}, r, {lines:r.lines.slice()});
 out.note = adhsHint
  ? 'Du hast '+p+' autistische Merkmale als „teilweise“ markiert und zugleich ADHS-Hinweise. Das ist bei der Kombination häufig: ADHS kann autistische Merkmale abschwächen oder überdecken, etwa Neugier und Reizsuche gegenüber Routinen oder spontanes Reden gegenüber Unsicherheit im Gespräch. Sprich das in der Diagnostik ausdrücklich an.'
  : 'Du hast '+p+' Merkmale als „teilweise“ markiert. Kommen ADHS-Merkmale hinzu, können sie autistische abschwächen oder überdecken; dann lohnt sich der Blick auf die Kombination.';
 out.link=['/audhs','Zum Reiter AuDHS'];
 out.tileNote = adhsHint ? 'Teilweise zutreffende Merkmale können durch ADHS überdeckt sein.' : 'Teilweise zutreffende Merkmale: Kombination mit ADHS prüfen.';
 return out;
};
/* Depression: Bezug zu ADHS-typischen Stimmungsschwankungen */
function depAdhsInfo(){
 const t=rv('dep-tagesverlauf'), p=pc('dep-sym'), ra=RES.adhs(), adhsHint=(ra.lv==='match'||ra.lv==='partial');
 const lines=[];
 if(t===2) lines.push('Morgentief: typisch für melancholische Merkmale einer Depression.');
 if(t===3) lines.push('Abendtief: eher Erschöpfung nach einem anstrengenden Tag; bei melancholischer Depression ist es umgekehrt.');
 if(t!==1 && !(p>=3 && adhsHint)) return {lines, note:null};
 const note = t===1
  ? 'Für eine depressive Episode müssen die Beschwerden fast den ganzen Tag und fast jeden Tag bestehen. Stimmung, die mehrmals am Tag wechselt und von Situationen abhängt, passt eher zur emotionalen Dysregulation bei ADHS'+(adhsHint?', für die es bei dir auch Hinweise gibt':'')+'. Beides kann zusammen vorkommen: Halten Tiefs wochenlang an und hellt auch Interessantes sie nicht mehr auf, spricht das für eine zusätzliche Depression.'
  : 'Viele Symptome sind nur teilweise markiert, und es gibt ADHS-Hinweise. Wechselt die Stimmung im Tagesverlauf, passt das eher zur emotionalen Dysregulation bei ADHS als zu einer depressiven Episode. Gib oben an, wie die Beschwerden über den Tag verlaufen.';
 return {lines, note, tile: t===1 ? 'Stimmung wechselt im Tagesverlauf: eher ADHS-typisch.' : 'Viele Symptome nur teilweise: Abgrenzung zu ADHS beachten.'};
}
const depBase=RES.dep;
RES.dep = () => {
 const r=depBase(), info=depAdhsInfo();
 if(!info.lines.length && !info.note) return r;
 const out=Object.assign({}, r, {lines:r.lines.concat(info.lines)});
 if(info.note){ out.note=info.note; out.link=['/abgrenzung','Zur Abgrenzung der Stimmung']; }
 return out;
};
/* Dysthymie: dieselbe Relativierung, denn auch hier zählt gedrückte Stimmung über den größten Teil des Tages */
const dysBase=RES.dys;
RES.dys = () => {
 const r=dysBase();
 if(r.lv==='none' || rv('dep-tagesverlauf')!==1) return r;
 return Object.assign({}, r, {note:'Auch für eine Dysthymie muss die Stimmung den größten Teil des Tages gedrückt sein, über mindestens 2 Jahre an mehr Tagen als nicht. Stimmung, die mehrmals am Tag wechselt, passt eher zur emotionalen Dysregulation bei ADHS.', link:['/abgrenzung','Zur Abgrenzung der Stimmung']});
};
/* Reiter Depression gesamt: die höchste der angezeigten Auswertungen (Episode, Dysthymie), damit Navigation, Übersicht und Gesamtbild dazu passen */
RES.depression = () => {
 const a=RES.dep(), b=RES.dys(), c=RES.verlauf(), info=depAdhsInfo();
 if(c.lv==='alert') return c;
 let r = (RANK[b.lv]>RANK[a.lv]) ? Object.assign({}, b, {pill:'Dysthymie: '+b.pill}) : a;
 if(r.lv==='none') r=c;
 if(!info.note || r.lv==='none') return r;
 return Object.assign({}, r, {tileNote:info.tile, link:['/abgrenzung','Zur Abgrenzung']});
};
/* Bipolar: Relativierung gegenüber ADHS */
const BIP_GROUPS=['bip-a','bip-b','bip-zusatz'];
const bipBase=RES.bipolar;
RES.bipolar = () => {
 const r=bipBase();
 if(r.lv==='none') return r;
 const p=BIP_GROUPS.reduce((n,g)=>n+pc(g),0), dauer=rv('bip-dauer'), ra=RES.adhs(), adhsHint=(ra.lv==='match'||ra.lv==='partial');
 if(!(adhsHint || p>=2 || dauer===3)) return r;
 return Object.assign({}, r, {
  note:'Viele Merkmale einer Hochphase gehören bei ADHS zum Alltag: Getriebenheit „wie von einem Motor“, Rededrang, Gedankenrasen, Ablenkbarkeit, viele Projekte gleichzeitig, Impulskäufe und andere riskante Entscheidungen, oft mehrmals am Tag wechselnd. Für eine bipolare Hochphase zählen sie nur, wenn sie über mehrere Tage am Stück deutlich stärker sind als sonst. Am besten unterscheiden ein vermindertes Schlafbedürfnis ohne Müdigkeit über mehrere Nächte und ein deutlich gesteigertes Selbstbild, das andere als Veränderung bemerken. Ein Stimmungs- und Schlaftagebuch über einige Wochen macht den Unterschied sichtbar.',
  link:['/abgrenzung','Zur Abgrenzung der Stimmung'],
  tileNote: dauer===3 ? (adhsHint ? 'Hochs wechseln im Tagesverlauf: eher ADHS-typisch.' : 'Hochs wechseln im Tagesverlauf: keine Episode im Sinne der Kriterien.') : 'Viele Merkmale überschneiden sich mit ADHS.'
 });
};
/* AuDHS: teilweise markierte Merkmale beider Bereiche als Hinweis mitwerten */
const ADHS_GROUPS=['adhs-a1','adhs-a2','adhs-rahmen'];
const audhsBase=RES.audhs;
RES.audhs = () => {
 const r=audhsBase();
 const pA=ADHS_GROUPS.reduce((n,g)=>n+pc(g),0), pB=AUT_GROUPS.reduce((n,g)=>n+pc(g),0);
 if(r.lv==='none') return r;
 const out=Object.assign({}, r, {lines:r.lines.slice()});
 if(out.lines.length>=2){ out.lines[0]='ADHS: '+RES.adhs().pill; out.lines[1]='Autismus: '+RES.autismus().pill; }
 if(!pA && !pB) return out;
 out.lines.push('Teilweise markiert: ADHS '+pA+', Autismus '+pB);
 MODE=0.5; const lb=RAW.audhs(); MODE=1;
 if(lb.lv==='partial' && RANK[r.lv]<RANK.partial){
  out.lv='partial'; out.pill='Hinweise auf beide';
  out.text='Zählst du die teilweise zutreffenden Merkmale mit, gibt es Hinweise in beiden Bereichen.';
  out.lines=out.lines.filter(l=>l.indexOf('Mit den teilweise zutreffenden Merkmalen:')!==0);
 }
 out.note='Bei AuDHS überdecken sich ADHS- und Autismus-Merkmale oft gegenseitig. Teilweise markierte Merkmale in einem oder beiden Bereichen können deshalb stärker ausgeprägt sein, als sie sich in der Selbsteinschätzung anfühlen: Autistische Routinen dämpfen ADHS-Chaos, ADHS-Spontaneität und Reizsuche überdecken Unsicherheit im Gespräch und das Bedürfnis nach Gleichförmigkeit. Die Schwellen der Einzeldiagnosen berücksichtigen das nicht; sprich die teilweise markierten Merkmale im Fachgespräch gezielt an.';
 out.tileNote='Teilweise markierte Merkmale können sich gegenseitig überdecken.';
 return out;
};

/* ---------- Testauswertungen ---------- */
const TR = {};
TR.asrs = () => {
 const vals=T.asrs.items.map((_,i)=>tv('asrs',i)), ans=vals.filter(v=>v!==null).length;
 if(!ans) return res('none','Noch offen','Noch nicht beantwortet.');
 const pos=vals.reduce((n,v,i)=>n+(v!==null&&T.asrs.shade(i,v)?1:0),0), sum=vals.reduce((n,v)=>n+(v||0),0);
 const lines=['Antworten im dunkel schattierten Bereich: '+pos+' von 6','Summenwert: '+sum+' von 24 (aktualisierte Auswertung: ab 14 auffällig)','Beantwortet: '+ans+' von 6'];
 if(ans<6) return res('info','Unvollständig','Bitte alle sechs Fragen beantworten.',lines);
 if(pos>=4) return res('match','Screening positiv','4 oder mehr Antworten im schattierten Bereich: Laut Testautoren sind die Beschwerden gut mit ADHS im Erwachsenenalter vereinbar, eine weitere Abklärung ist angezeigt.',lines,'Screening, keine Diagnose. Depression, Angst, Schlafmangel und Trauma können ähnliche Werte erzeugen.');
 return res('low','Screening unauffällig','Weniger als 4 Antworten im schattierten Bereich.',lines,'Ein unauffälliges Screening schließt ADHS nicht sicher aus.');
};
TR.phq = () => {
 const vals=T.phq.items.map((_,i)=>tv('phq',i)), ans=vals.filter(v=>v!==null).length;
 if(!ans) return res('none','Noch offen','Noch nicht beantwortet.');
 const sum=vals.reduce((n,v)=>n+(v||0),0);
 const sev = sum<=4?'minimale oder keine':sum<=9?'milde':sum<=14?'mittelgradige':sum<=19?'ausgeprägte':'schwerste';
 const nHigh = vals.slice(0,8).filter(v=>v!==null&&v>=2).length + ((vals[8]||0)>=1?1:0);
 const coreHigh = (vals[0]||0)>=2 || (vals[1]||0)>=2;
 const cat = coreHigh&&nHigh>=5 ? 'Verdacht auf eine Major Depression (kategoriale Auswertung: mindestens 5 Beschwerden an mehr als der Hälfte der Tage, darunter Frage 1 oder 2)' : coreHigh&&nHigh>=2 ? 'Verdacht auf eine andere depressive Störung (kategoriale Auswertung: 2–4 Beschwerden, darunter Frage 1 oder 2)' : 'Kategoriale Auswertung: kein Hinweis auf ein depressives Syndrom';
 const f=rv('phqf');
 const lines=['Summenwert: '+sum+' von 27 → '+sev+' depressive Symptomatik','0–4 minimal · 5–9 mild · 10–14 mittelgradig · 15–19 ausgeprägt · 20–27 schwerst',cat];
 if(f!==null) lines.push('Beeinträchtigung im Alltag: '+T.phq.extra.opts[f]);
 if(ans<9) lines.push('Beantwortet: '+ans+' von 9');
 const lv = sum>=10 ? 'match' : sum>=5 ? 'partial' : 'low';
 return res(ans<9?'info':lv, ans<9?'Unvollständig':(sum>=10?'Auffällig ('+sum+')':'Wert '+sum), sum>=10?'Ab 10 Punkten gilt das Screening als auffällig. Bitte lass die Beschwerden ärztlich oder psychotherapeutisch abklären.':'Unter 10 Punkten gilt das Screening als unauffällig; bei anhaltenden Beschwerden trotzdem ansprechen.',lines,'Screening, keine Diagnose.');
};
TR.who5 = () => {
 const vals=T.who5.items.map((_,i)=>tv('who5',i)), ans=vals.filter(v=>v!==null).length;
 if(!ans) return res('none','Noch offen','Noch nicht beantwortet.');
 const raw=vals.reduce((n,v)=>n+(v||0),0), pct=raw*4, low=vals.some(v=>v!==null&&v<=1);
 const lines=['Rohwert: '+raw+' von 25 · Prozentwert: '+pct+' von 100'];
 if(ans<5) { lines.push('Beantwortet: '+ans+' von 5'); return res('info','Unvollständig','Bitte alle fünf Aussagen beantworten.',lines); }
 if(pct<=28) return res('match','Deutlich reduziert','Prozentwert bis 28: Hinweis auf eine mögliche Depression. Bitte lass das abklären; der PHQ-9 oben gibt zusätzliche Orientierung.',lines,'Screening, keine Diagnose.');
 if(raw<13 || low) return res('partial','Reduziert','Rohwert unter 13 oder eine Aussage mit 0–1 Punkten: Die Testautoren empfehlen ein Depressionsscreening, z. B. mit dem PHQ-9.',lines,'Screening, keine Diagnose.');
 return res('low','Unauffällig','Das Wohlbefinden liegt im unauffälligen Bereich.',lines);
};

/* PHQ-9: zählt Tage, nicht Stunden – Relativierung bei schwankender Stimmung */
const phqBase=TR.phq;
TR.phq = () => {
 const r=phqBase();
 if(r.lv==='none') return r;
 const t=rv('dep-tagesverlauf'), ra=RES.adhs(), adhsHint=(ra.lv==='match'||ra.lv==='partial');
 if(t!==1 && !adhsHint) return r;
 return Object.assign({}, r, {
  note:'Der PHQ-9 zählt Tage, an denen eine Beschwerde auftritt, nicht wie lange sie am Tag anhält. Wechselt die Stimmung mehrmals täglich'+(adhsHint?', wie es bei ADHS häufig ist,':'')+' kommt schnell „an mehr als der Hälfte der Tage“ zusammen, obwohl kein Tag durchgehend gedrückt ist. Der Wert kann dann zu hoch ausfallen. Aussagekräftiger ist, ob Tiefs über viele Stunden anhalten und ob Interessantes sie noch aufhellt. Der WHO-5 darunter fragt nach dem Zeitanteil und bildet Schwankungen besser ab.',
  link:['/abgrenzung','Zur Abgrenzung der Stimmung']
 });
};

/* ---------- Rendern ---------- */
const ariaOf = v => v===1 ? 'true' : v===0.5 ? 'mixed' : 'false';
const titleOf = v => v===1 ? 'Trifft zu – Klick: teilweise' : v===0.5 ? 'Trifft teilweise zu – Klick: zurücksetzen' : 'Trifft nicht zu – Klick: trifft zu';
const LEGEND = '<span class="item"><span class="tri" data-v="0"></span>nein</span><span class="item"><span class="tri" data-v="1"></span>trifft zu</span><span class="item"><span class="tri" data-v="0.5"></span>teilweise</span><span class="legend-click">Jeder Klick wechselt: nein → trifft zu → teilweise → nein.</span>';
function addLegends(){
 document.querySelectorAll('.view').forEach(v=>{
  const first=v.querySelector('[data-group]');
  if(!first || v.querySelector('.legend')) return;
  const p=document.createElement('p'); p.className='legend'; p.innerHTML=LEGEND;
  let node=first; while(node.parentElement && node.parentElement!==v) node=node.parentElement;
  v.insertBefore(p, node);
 });
}
function renderGroup(el){
 const gid=el.dataset.group, g=G[gid];
 let h='<div class="group-head"><h4>'+esc(g.title)+'</h4><span class="count" data-count="'+gid+'"></span></div>';
 if(g.rule) h+='<p class="rule">'+esc(g.rule)+'</p>';
 if(g.min||g.all) h+='<div class="bar" aria-hidden="true"><span data-bar="'+gid+'"></span><span class="pbar" data-pbar="'+gid+'"></span><i style="left:'+((g.all?1:g.min/g.items.length)*100)+'%"></i></div>';
 h+='<ul class="checks">'+g.items.map((it,i)=>{
  const t=Array.isArray(it)?it[0]:it, n=Array.isArray(it)?it[1]:'', id='c-'+gid+'-'+i, v=val(gid,i);
  return '<li data-v="'+v+'"><button type="button" class="tri" id="'+id+'" data-k="'+gid+'.'+i+'" data-v="'+v+'" role="checkbox" aria-checked="'+ariaOf(v)+'" title="'+titleOf(v)+'"></button><label for="'+id+'">'+esc(t)+'<span class="part-tag">teilweise</span>'+(n?'<small>'+esc(n)+'</small>':'')+'</label></li>';
 }).join('')+'</ul>';
 el.innerHTML=h;
}
function renderRadio(el){
 const rid=el.dataset.radio, r=R[rid], cur=rv(rid);
 const order = r.order || r.opts.map((_,i)=>i);
 el.innerHTML='<div class="group-head"><h4>'+esc(r.title)+'</h4></div><div class="radios" role="radiogroup" aria-label="'+esc(r.title)+'">'+order.map(i=>{
  const id='r-'+rid+'-'+i;
  return '<label for="'+id+'"><input type="radio" id="'+id+'" name="'+rid+'" data-r="'+rid+'" value="'+i+'"'+(cur===i?' checked':'')+'><span>'+esc(r.opts[i])+'</span></label>';
 }).join('')+'</div>';
}
function renderTest(el){
 const k=el.dataset.test, t=T[k];
 let h='<h4>'+esc(t.title)+'</h4><p class="fine">'+esc(t.intro)+(t.link?' <a href="'+t.link[1]+'">'+esc(t.link[0])+'</a>':'')+'</p>';
 h+='<div class="tbl-wrap"><table class="test"><thead><tr><th scope="col">'+esc(t.instr)+'</th>'+t.opts.map(o=>'<th scope="col" class="o">'+esc(o[0])+'</th>').join('')+'</tr></thead><tbody>';
 t.items.forEach((q,i)=>{
  h+='<tr><td class="q"><span>'+(i+1)+'.</span>'+esc(q)+'</td>';
  t.opts.forEach(o=>{
   const v=o[1], id='t-'+k+'-'+i+'-'+v, cls=t.shade?(t.shade(i,v)?'o s2':'o s1'):'o';
   h+='<td class="'+cls+'"><input type="radio" id="'+id+'" name="t-'+k+'-'+i+'" data-t="'+k+'" data-i="'+i+'" value="'+v+'" aria-label="Frage '+(i+1)+': '+esc(o[0])+'"'+(tv(k,i)===v?' checked':'')+'></td>';
  });
  h+='</tr>';
 });
 h+='</tbody></table></div>';
 if(t.extra){
  const cur=rv('phqf');
  h+='<div><p>'+esc(t.extra.q)+'</p><div class="radios" role="radiogroup">'+t.extra.opts.map((o,i)=>'<label for="r-phqf-'+i+'"><input type="radio" id="r-phqf-'+i+'" name="phqf" data-r="phqf" value="'+i+'"'+(cur===i?' checked':'')+'><span>'+esc(o)+'</span></label>').join('')+'</div></div>';
 }
 h+='<div class="result" data-tres="'+k+'"></div>'+(k==='phq'?KRISE:'')+'<p class="copyright">'+esc(t.copy)+'</p>';
 el.innerHTML=h;
}
function paintResult(el,r){
 el.dataset.lv=r.lv;
 let h='<div class="result-head"><h4>Auswertung</h4><span class="pill" data-lv="'+r.lv+'">'+esc(r.pill)+'</span></div><p>'+esc(r.text)+'</p>';
 if(r.bars){
  h+='<div class="diffbars">'+r.bars.map(b=>'<div class="diffbar"><span>'+esc(b[0])+'</span><span class="track"><span class="fill" style="width:'+(b[1]/4*100)+'%"></span></span><span>'+fmtN(b[1])+' / 4</span></div>').join('')+'</div>';
 }
 if(r.lines.length) h+='<ul>'+r.lines.map(l=>'<li>'+esc(l)+'</li>').join('')+'</ul>';
 if(r.note) h+='<p class="note">'+esc(r.note)+(r.link?' <a href="'+r.link[0]+'">'+esc(r.link[1])+'</a>':'')+'</p>';
 if(r.fine) h+='<p class="fine">'+esc(r.fine)+'</p>';
 el.innerHTML=h;
}

/* ---------- Übersicht: Bereiche ---------- */
const CARDS = [
 {id:'adhs', title:'ADHS', desc:'Unaufmerksamkeit, Hyperaktivität, Impulsivität', groups:['adhs-a1','adhs-a2','adhs-rahmen','adhs-zusatz'], test:'asrs'},
 {id:'autismus', title:'Autismus', desc:'Soziale Kommunikation, Routinen, Interessen, Sinne', groups:['aut-a1','aut-a2','aut-a3','aut-b1','aut-b2','aut-b3','aut-b4','aut-rahmen','aut-zusatz']},
 {id:'audhs', title:'AuDHS', desc:'Autismus und ADHS gemeinsam', groups:['audhs-muster']},
 {id:'depression', title:'Depression', desc:'Episode, rezidivierend, Dysthymie, chronisch', groups:['dep-sym','dep-rahmen','dys-rahmen','dys-sym','dep-verlauf'], test:'phq'},
 {id:'bipolar', title:'Bipolar', desc:'Manie, Hypomanie, Bipolar I und II, Zyklothymie', groups:['bip-a','bip-b','bip-zusatz']},
 {id:'abgrenzung', title:'Stimmung: Abgrenzung', desc:'ADHS, Depression oder bipolar?', groups:['diff']},
 {id:'alexithymie', title:'Alexithymie', desc:'Gefühle erkennen und benennen', groups:['alx-dif','alx-ddf','alx-eot']},
 {id:'ataxie', title:'Ataxie Typ 2', desc:'Episodische Ataxie (EA2), Hinweise zu SCA2', groups:['ea2-kern','ea2-ausloeser','ea2-verlauf','ea2-weitere']},
 {id:'migraene', title:'Migräne', desc:'Migräne, Abgrenzung zum Spannungskopfschmerz', groups:['mig-attacke','mig-begleit','mig-verlauf','mig-aura','mig-aura-c','mig-phasen','mig-ausloeser','mig-tth','mig-tth-b']},
 {id:'dyskalkulie', title:'Dyskalkulie', desc:'Zahlverständnis und Rechnen', groups:['dk-zahl','dk-rechnen','dk-alltag','dk-vg']},
 {id:'dyspraxie', title:'Dyspraxie', desc:'Motorische Koordination (UEMF/DCD)', groups:['dp-grob','dp-fein','dp-alltag','dp-vg']},
 {id:'dysarthrie', title:'Dysarthrie', desc:'Neurologische Sprechstörung', groups:['da-stimme','da-artik','da-begleit','da-entw']}
];

/* ---------- Bereiche: ausblenden („abhaken“) und anordnen ---------- */
const AREA_IDS = CARDS.map(c=>c.id);
const DEFAULT_HIDDEN = ['alexithymie','ataxie','dyskalkulie','dyspraxie','dysarthrie'];
const LEAD_NAMES = {adhs:'ADHS', autismus:'Autismus', audhs:'AuDHS', depression:'depressive Störungen', bipolar:'bipolare Störungen', abgrenzung:null, alexithymie:'Alexithymie', ataxie:'episodische Ataxie Typ 2', migraene:'Migräne', dyskalkulie:'Dyskalkulie', dyspraxie:'Dyspraxie', dysarthrie:'Dysarthrie'};
const cardOf = id => CARDS.find(c=>c.id===id);
const isHidden = id => { const v=S['h.'+id]; return v===undefined ? DEFAULT_HIDDEN.includes(id) : v===1; };
function areaOrder(){
 return AREA_IDS.map((id,i)=>({id, p:(S['o.'+id]!==undefined ? S['o.'+id] : i), i})).sort((a,b)=>a.p-b.p || a.i-b.i).map(x=>x.id);
}
/* Neue Reihenfolge einer Teilliste (z. B. nur sichtbare Kacheln) in die Gesamtreihenfolge einsetzen */
function mergeOrder(teil){ const set=new Set(teil); let j=0; return areaOrder().map(id=>set.has(id) ? teil[j++] : id); }
function setOrder(ids){ ids.forEach((id,i)=>{ S['o.'+id]=i; }); }

/* ---------- Übersicht: Kacheln ---------- */
const GRIFF = '<svg viewBox="0 0 12 18" width="12" height="18" aria-hidden="true" focusable="false"><g fill="currentColor"><circle cx="3" cy="3" r="1.7"/><circle cx="9" cy="3" r="1.7"/><circle cx="3" cy="9" r="1.7"/><circle cx="9" cy="9" r="1.7"/><circle cx="3" cy="15" r="1.7"/><circle cx="9" cy="15" r="1.7"/></g></svg>';
function tileHtml(c, aus){
 const r=RES[c.id](), checked=c.groups.reduce((n,g)=>n+full(g),0), part=c.groups.reduce((n,g)=>n+pc(g),0), total=c.groups.reduce((n,g)=>n+G[g].items.length,0);
 let meta='<span class="pill" data-lv="'+r.lv+'">'+esc(r.pill)+'</span><span>'+checked+(part?' + '+part+' teilweise':'')+' von '+total+' Merkmalen markiert</span>';
 if(c.test){ const tr=TR[c.test](); if(tr.lv!=='none') meta+='<span>'+(c.test==='asrs'?'ASRS':'PHQ-9')+': '+esc(tr.pill)+'</span>'; }
 const g=gesNav(c.id);
 if(g) meta+='<span class="tile-ges">Gesamtbild aus '+g.src.length+(g.src.length===1?' Quelle':' Quellen')+': '+pillHtml(g.lv, GES_SHORT[g.pill]||g.pill)+'</span>';
 const note = r.tileNote ? '<p class="tile-note">'+esc(r.tileNote)+(r.link?' <a href="'+r.link[0]+'">'+esc(r.link[1])+'</a>':'')+'</p>' : '';
 return '<div class="tile'+(aus?' aus':'')+'" data-tile="'+c.id+'" data-lv="'+(g?g.lv:r.lv)+'">'
  +'<div class="tile-top"><h3><a class="tile-link" href="/'+c.id+'">'+esc(c.title)+'</a></h3>'
  +'<button type="button" class="tile-griff" data-griff="'+c.id+'" aria-label="'+esc(c.title)+' verschieben" aria-describedby="griff-hilfe" title="Ziehen oder mit den Pfeiltasten verschieben">'+GRIFF+'</button></div>'
  +'<p>'+esc(c.desc)+'</p>'+note+'<div class="meta">'+meta+'</div>'
  +'<label class="tile-hide"><input type="checkbox" data-hide="'+c.id+'"'+(aus?' checked':'')+'>'+(aus?'abgehakt':'abhaken')+'<span class="sr-only">: '+esc(c.title)+(aus?' wieder einblenden':' ausblenden')+'</span></label></div>';
}
function paintTiles(){
 const ord=areaOrder(), vis=ord.filter(id=>!isHidden(id)), aus=ord.filter(id=>isHidden(id));
 document.getElementById('tiles').innerHTML = vis.length ? vis.map(id=>tileHtml(cardOf(id),false)).join('') : '<p class="fine">Alle Bereiche sind abgehakt. Du findest sie unter „Ausgeblendet“.</p>';
 document.getElementById('tiles-aus').innerHTML = aus.map(id=>tileHtml(cardOf(id),true)).join('');
 document.getElementById('ausgeblendet').hidden = !aus.length;
 document.getElementById('ausgeblendet-n').textContent = '('+aus.length+')';
 applyFilter();
}

/* ---------- Filter: blendet nicht passende Bereiche aus. Die Eingabe wird nie gespeichert. ---------- */
const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ß/g,'ss');
let SUCHINDEX = null, filterVorher = null;
function buildIndex(){
 SUCHINDEX = {};
 CARDS.forEach(c=>{ const sec=document.getElementById(c.id); SUCHINDEX[c.id]=norm(c.title+' '+c.desc+' '+(sec?sec.textContent:'')); });
}
function applyFilter(){
 const inp=document.getElementById('filter'); if(!inp) return;
 if(!SUCHINDEX) buildIndex();
 const terms=norm(inp.value).split(/\s+/).filter(Boolean);
 const passt = id => terms.every(t=>SUCHINDEX[id].includes(t));
 let nVis=0, nAus=0;
 document.querySelectorAll('[data-tile]').forEach(el=>{
  const ok = !terms.length || passt(el.dataset.tile); el.hidden=!ok;
  if(ok){ if(el.classList.contains('aus')) nAus++; else nVis++; }
 });
 document.querySelectorAll('#gesamt-table tr[data-row]').forEach(tr=>{ tr.hidden = terms.length>0 && !passt(tr.dataset.row); });
 const det=document.getElementById('ausgeblendet'), info=document.getElementById('filter-info');
 if(terms.length){
  if(filterVorher===null) filterVorher=det.open;
  det.open = nAus>0 ? true : filterVorher;
  const n=nVis+nAus;
  info.textContent = n ? n+(n===1?' Bereich passt':' Bereiche passen')+(nAus?', davon '+nAus+' unter „Ausgeblendet“':'')+'.' : 'Kein Bereich passt zu deiner Suche.';
 } else {
  if(filterVorher!==null){ det.open=filterVorher; filterVorher=null; }
  info.textContent='';
 }
}

/* ---------- Externe Tests: Auswertung und Eingabe ---------- */
function xClass(id){
 const t=XT[id];
 if(t.special==='mdq'){ const y=S['x.mdq.y']; if(y===undefined) return null; const g=S['x.mdq.g'], p=S['x.mdq.p']; if(y>=7 && g===1 && p>=2) return 2; return y>=7 ? 1 : 0; }
 if(t.manual){ const c=S['xc.'+id]; return c===undefined ? null : c; }
 const v=S['x.'+id]; return v===undefined ? null : t.cls(v);
}
function xValueText(id){
 const t=XT[id];
 if(t.special==='mdq'){ const y=S['x.mdq.y'], g=S['x.mdq.g'], p=S['x.mdq.p']; if(y===undefined) return ''; return y+' × Ja'+(g!==undefined?(g?', gleichzeitig':', nicht gleichzeitig'):'')+(p!==undefined?', '+MDQ_P[p]+' Probleme':''); }
 const v=S['x.'+id];
 let txt = v!==undefined ? (t.unit==='PR'?'PR '+fmtN(v):t.unit==='T'?'T '+fmtN(v):fmtN(v)+' Punkte') : '';
 if(t.manual && S['xc.'+id]!==undefined && t.opts!==CLS_OPTS) txt += (txt?' · ':'')+t.opts[S['xc.'+id]];
 return txt;
}
/* Zusatzangaben: Normbereiche und Mittelwerte zum Gesamtwert (haupt), Unter-Skalen getrennt (unter) */
function xDetail(id){
 const t=XT[id], haupt=[], unter=[]; if(!t || t.min===undefined) return {haupt, unter};
 const v=S['x.'+id];
 const f1=x=>(Math.round(x*10)/10).toFixed(1).replace('.',',');
 if(t.bands && v!==undefined){ const b=t.bands.list.find(x=>v<=x[0]) || t.bands.list[t.bands.list.length-1]; haupt.push((t.bands.label||'Normbereich')+': '+b[1]+' ('+b[2]+' Punkte). '+t.bands.ref); }
 if(t.perItem && v!==undefined) haupt.push('Mittelwert pro Frage: '+f1(v/t.perItem.n)+' ('+t.perItem.ref+').'+(t.perItem.pos && t.cls ? ' '+t.perItem.pos[t.cls(v)] : ''));
 if(t.subs){
  const sv=sb=>S['x.'+id+'.'+sb.id], have=t.subs.filter(sb=>sv(sb)!==undefined);
  if(have.length){
   const withTh=have.filter(sb=>sb.th!==undefined), hit=withTh.filter(sb=>sv(sb)>=sb.th).length;
   unter.push('Unter-Skalen: '+have.map(sb=>{ const ex=[]; if(sb.th!==undefined) ex.push('ab '+sb.th); if(sb.n) ex.push('Ø '+f1(sv(sb)/sb.n)+(sb.ref?'; '+sb.ref:'')); return sb.name+' '+fmtN(sv(sb))+' von '+sb.max+(ex.length?' ('+ex.join('; ')+')':''); }).join(', ')+'.'+(withTh.length?' '+hit+' von '+withTh.length+' erreichen die Schwelle.':''));
   if(t.subsNote) unter.push(t.subsNote);
  }
 }
 if(t.hedge && v!==undefined && S['x.'+id+'.sl']!==undefined){
  const sl=S['x.'+id+'.sl'], sln=S['x.'+id+'.sln'];
  let tx='Unsicher oder situationsabhängig beantwortet („slightly“): '+fmtN(sl)+' der '+t.hedge.n+' gewerteten Fragen'+(sln!==undefined?', '+fmtN(sln)+' davon in der Richtung ohne Punkt':'')+'. Eine „slightly“-Antwort zählt in Richtung Empathie 1 Punkt, in die Gegenrichtung 0, genau wie eine eindeutige Antwort.';
  if(sln!==undefined){ const ub=Math.min(t.max, v+sln); tx+=' Hätte jede dieser Antworten einen Punkt gezählt, läge der Wert bei '+fmtN(ub)+(t.cls(ub)===t.cls(v)?'; die Einstufung bliebe gleich.':'; die Einstufung wäre dann „'+CLS_LABEL[t.cls(ub)]+'“.'); }
  haupt.push(tx);
 }
 return {haupt, unter};
}
function xSubsHtml(id){
 const t=XT[id];
 let h='';
 if(t.hedge) h+='<div class="xsubs">'+numIn('x.'+id+'.sl', '„Slightly“-Antworten (gewertete Fragen)', 0, t.hedge.n)+numIn('x.'+id+'.sln', 'davon ohne Punkt', 0, t.hedge.n)+'</div>';
 if(t.bands || t.perItem || t.hedge) h+='<p class="fine xsubinfo" data-xsub="'+id+'" hidden></p>';
 if(t.subs){
  h+='<div class="xsubbox"><p><strong>Unter-Skalen</strong> (freiwillig)</p>'
   +'<div class="xsubs">'+t.subs.map(sb=>numIn('x.'+id+'.'+sb.id, sb.name+(sb.th!==undefined?', ab '+sb.th:''), sb.min||0, sb.max)).join('')+'</div>'
   +'<p class="fine" data-xsubu="'+id+'" hidden></p>'
   +'<p class="fine">'+esc(SUB_HINWEIS)+'</p></div>';
 }
 return h;
}
function extEntries(area){
 const out=[];
 Object.keys(XT).filter(id=>XT[id].area===area).forEach(id=>{ const c=xClass(id); if(c!==null) out.push({kind:'Extern', id, label:XT[id].name, val:c, text:xValueText(id)}); });
 return out;
}
const xid = k => 'xi-'+k.replace(/[^a-z0-9]/gi,'-');
function numIn(k,label,min,max){ const v=S[k]; return '<label class="xfield" for="'+xid(k)+'"><span>'+esc(label)+' ('+min+'–'+max+')</span><input type="number" inputmode="decimal" id="'+xid(k)+'" data-xnum="'+k+'" min="'+min+'" max="'+max+'" step="any" value="'+(v!==undefined?v:'')+'"></label>'; }
function selIn(k,label,opts){ const v=S[k]; return '<label class="xfield" for="'+xid(k)+'"><span>'+esc(label)+'</span><select id="'+xid(k)+'" data-xsel="'+k+'"><option value="">–</option>'+opts.map((o,i)=>'<option value="'+i+'"'+(v===i?' selected':'')+'>'+esc(o)+'</option>').join('')+'</select></label>'; }
function renderExtern(el){
 const area=el.dataset.extern;
 let h='<h3>Standardisierte Fragebögen</h3><p class="fine xdesc">'+(XDESC[area]||'')+'</p>'+ABLAGE_HINWEIS+'<div class="xlist">';
 ((GES_AREAS.find(a=>a.id===area)||{}).tests||[]).forEach(k=>{ h+='<div class="xtest" data-test="'+k+'"></div>'; });
 Object.keys(XT).filter(id=>XT[id].area===area).forEach(id=>{
  const t=XT[id];
  const lk = t.links ? '<span class="xlinks">Test: '+t.links.map(l=>'<a href="'+l[0]+'" target="_blank" rel="noopener">'+esc(l[1])+'</a>').join(' · ')+'</span>' : (t.note ? '<span class="xlinks">'+esc(t.note)+'</span>' : '');
  h+='<div class="xrow"><div class="xinfo"><strong>'+esc(t.name)+'</strong><span class="fine">'+esc(t.what)+(t.rule?' · '+esc(t.rule):'')+'</span>'+lk+'</div><div class="xin">';
  if(t.special==='mdq') h+=numIn('x.mdq.y','Ja-Antworten',0,13)+selIn('x.mdq.g','Gleichzeitig aufgetreten?',['nein','ja'])+selIn('x.mdq.p','Probleme dadurch',['keine','leichte','mittlere','schwere']);
  else {
   if(t.min!==undefined) h+=numIn('x.'+id, t.unit==='PR'?'Prozentrang':t.unit==='T'?'T-Wert':'Punkte', t.min, t.max);
   if(t.manual) h+=selIn('xc.'+id, t.min!==undefined?'Einstufung':'Ergebnis', t.opts);
  }
  h+='<span class="pill" data-xpill="'+id+'"></span></div>'+xSubsHtml(id)+'</div>';
 });
 el.innerHTML=h+'</div>';
}
function paintXPills(){
 document.querySelectorAll('[data-xsub]').forEach(el=>{ const d=xDetail(el.dataset.xsub).haupt; el.textContent=d.join(' '); el.hidden=!d.length; });
 document.querySelectorAll('[data-xsubu]').forEach(el=>{ const d=xDetail(el.dataset.xsubu).unter; el.textContent=d.join(' '); el.hidden=!d.length; });
 document.querySelectorAll('[data-xpill]').forEach(el=>{
  const id=el.dataset.xpill, c=xClass(id);
  if(c===null){ el.textContent=''; el.removeAttribute('data-lv'); }
  else { el.textContent=CLS_LABEL[c]; el.dataset.lv=CLS_LV[c]; }
 });
}

/* ---------- Gesamtbild ---------- */
const GES_AREAS=[{id:'adhs',title:'ADHS',tests:['asrs']},{id:'autismus',title:'Autismus'},{id:'audhs',title:'AuDHS'},{id:'depression',title:'Depression',tests:['phq','who5']},{id:'bipolar',title:'Bipolar'},{id:'alexithymie',title:'Alexithymie'},{id:'ataxie',title:'Ataxie Typ 2'},{id:'migraene',title:'Migräne'},{id:'dyskalkulie',title:'Dyskalkulie'},{id:'dyspraxie',title:'Dyspraxie'},{id:'dysarthrie',title:'Dysarthrie'}];
const LV2 = lv => lv==='match'?2 : lv==='partial'?1 : lv==='low'?0 : null;
function GES(area){
 if(area==='audhs') return gesAudhs();
 const def=GES_AREAS.find(a=>a.id===area), src=[], cav=[];
 const r=RES[area]();
 let v=LV2(r.lv); if(r.lv==='alert') v = area==='dysarthrie' ? 2 : 1;
 if(v!==null) src.push({kind:'Fragebogen', label:'Symptomfragebogen', val:v, text:r.pill});
 (def.tests||[]).forEach(t=>{ const tr=TR[t](), tv2=LV2(tr.lv); if(tv2!==null) src.push({kind:'Test', label:TSHORT[t], val:tv2, text:tr.pill}); });
 extEntries(area).forEach(e=>src.push(e));
 if(area==='depression' && depAdhsInfo().note) cav.push('Die Stimmung schwankt im Tagesverlauf; Fragebogen und PHQ-9 können depressive Beschwerden dann überschätzen.');
 if(area==='bipolar' && RES.bipolar().note) cav.push('Viele Merkmale einer Hochphase überschneiden sich mit ADHS.');
 if(area==='autismus' && RES.autismus().note) cav.push('Teilweise markierte Merkmale können durch ADHS überdeckt sein.');
 const g=gesFrom(src, cav);
 if(area==='bipolar' && r.adhsTypical && g.mean===0){ g.pill='Eher ADHS-typisch'; g.text='Keine Hinweise auf bipolare Phasen; die kurzen Hochs passen eher zu ADHS.'; }
 return g;
}
function gesFrom(src, cav){
 if(!src.length) return {lv:'none', pill:'Noch offen', text:'Noch keine Angaben.', src, cav, mean:null};
 const mean=src.reduce((n,x)=>n+x.val,0)/src.length, n2=src.filter(x=>x.val===2).length, n1=src.filter(x=>x.val===1).length, n0=src.length-n2-n1;
 let lv, pill;
 if(mean>=1.5){ lv='match'; pill=(src.length>=2 && src.every(x=>x.val>=1)) ? 'Übereinstimmend deutliche Hinweise' : 'Deutliche Hinweise'; }
 else if(mean>=0.75){ lv='partial'; pill='Gemischte Hinweise'; }
 else if(mean>0){ lv='low'; pill='Schwache Hinweise'; }
 else { lv='low'; pill='Keine Hinweise'; }
 const text = src.length===1 ? 'Bisher nur eine Quelle; weitere Tests machen das Bild belastbarer.' : src.length+' Quellen: '+n2+' auffällig, '+n1+' grenzwertig, '+n0+' unauffällig.';
 return {lv, pill, text, src, cav, mean};
}
function gesAudhs(){
 const a=GES('adhs'), b=GES('autismus'), r=RES.audhs(), src=[], cav=[];
 if(a.mean!==null) src.push({kind:'Gesamtbild', label:'ADHS', val:a.mean>=1.5?2:a.mean>=0.75?1:0, text:a.pill});
 if(b.mean!==null) src.push({kind:'Gesamtbild', label:'Autismus', val:b.mean>=1.5?2:b.mean>=0.75?1:0, text:b.pill});
 const rv2=LV2(r.lv); if(rv2!==null) src.push({kind:'Fragebogen', label:'Wechselwirkungen', val:rv2, text:r.pill});
 if(r.note) cav.push('ADHS- und Autismus-Merkmale können sich gegenseitig überdecken; teilweise Hinweise sind hier besonders beachtenswert.');
 if(a.mean===null || b.mean===null) return {lv:'none', pill:'Noch offen', text:'Für AuDHS braucht es Angaben zu ADHS und zu Autismus.', src, cav, mean:null};
 let lv, pill;
 if(a.mean>=1.5 && b.mean>=1.5){ lv='match'; pill='Deutliche Hinweise auf beide'; }
 else if(a.mean>=0.75 && b.mean>=0.75){ lv='partial'; pill='Hinweise auf beide'; }
 else { lv='low'; pill='Nicht für beide'; }
 return {lv, pill, text:'AuDHS setzt Hinweise in beiden Bereichen voraus. ADHS: '+a.pill+' · Autismus: '+b.pill+'.', src, cav, mean:Math.min(a.mean,b.mean)};
}
/* Gesamtbild für Navigation und Übersicht: nur wenn Tests oder externe Ergebnisse mitzählen, sonst bleibt der Fragebogen maßgeblich */
const GES_SHORT={'Übereinstimmend deutliche Hinweise':'übereinstimmend deutlich','Deutliche Hinweise':'deutlich','Gemischte Hinweise':'gemischt','Schwache Hinweise':'schwach','Keine Hinweise':'keine Hinweise','Eher ADHS-typisch':'eher ADHS-typisch','Deutliche Hinweise auf beide':'deutlich in beiden Bereichen','Hinweise auf beide':'Hinweise in beiden Bereichen','Nicht für beide':'nicht in beiden Bereichen'};
const hasExtra = g => g.src.some(x=>x.kind==='Test' || x.kind==='Extern');
function gesNav(id){
 if(!GES_AREAS.find(a=>a.id===id)) return null;
 const g=GES(id); if(g.lv==='none') return null;
 const extra = id==='audhs' ? (hasExtra(GES('adhs')) || hasExtra(GES('autismus'))) : hasExtra(g);
 return extra ? g : null;
}
const navLv = id => { const g=gesNav(id); if(g) return g.lv; return RES[id]().lv; };
const pillHtml = (lv,txt) => '<span class="pill" data-lv="'+lv+'">'+esc(txt)+'</span>';
function paintGesamt(el){
 const g=GES(el.dataset.gesamt);
 el.dataset.lv=g.lv;
 let h='<div class="result-head"><h4>Gesamtbild</h4>'+pillHtml(g.lv,g.pill)+'</div><p>'+esc(g.text)+'</p>';
 if(g.src.length){
  h+='<div class="tbl-wrap"><table class="srcs"><thead><tr><th scope="col">Quelle</th><th scope="col">Ergebnis</th><th scope="col">Einstufung</th></tr></thead><tbody>'+g.src.map(x=>'<tr><td>'+esc(x.label)+'</td><td>'+esc(x.text||'–')+'</td><td>'+pillHtml(CLS_LV[x.val],CLS_LABEL[x.val])+'</td></tr>').join('')+'</tbody></table></div>';
 }
 g.cav.forEach(c=>{ h+='<p class="note">'+esc(c)+'</p>'; });
 h+='<p class="fine">Alle Quellen zählen gleich. Validierte Tests und fachliche Befunde sind aussagekräftiger als die Checklisten dieser Seite. Keine Diagnose.</p>';
 el.innerHTML=h;
}
function paintGesamtTable(){
 const el=document.getElementById('gesamt-table'); if(!el) return;
 const mini=(lv,txt)=>'<div class="mini"><span class="dot" data-lv="'+lv+'"></span>'+esc(txt)+'</div>';
 const ord=areaOrder();
 const areas=GES_AREAS.filter(a=>!isHidden(a.id)).sort((a,b)=>ord.indexOf(a.id)-ord.indexOf(b.id));
 const aus=GES_AREAS.filter(a=>isHidden(a.id)).sort((a,b)=>ord.indexOf(a.id)-ord.indexOf(b.id));
 let rows='';
 areas.forEach(a=>{
  const g=GES(a.id);
  const fb=g.src.filter(x=>x.kind==='Fragebogen'), sf=g.src.filter(x=>x.kind==='Test' || x.kind==='Extern');
  rows+='<tr data-row="'+a.id+'"><th scope="row"><a href="/'+a.id+'">'+esc(a.title)+'</a></th>'
   +'<td>'+(fb.length?fb.map(x=>mini(CLS_LV[x.val],x.text)).join(''):'<span class="fine">–</span>')+'</td>'
   +'<td>'+(sf.length?sf.map(x=>mini(CLS_LV[x.val],x.label+': '+(x.kind==='Test'?x.text:CLS_LABEL[x.val]))).join(''):'<span class="fine">–</span>')+'</td>'
   +'<td>'+pillHtml(g.lv,g.pill)+'</td></tr>';
 });
 el.innerHTML='<h3>Gesamtbild</h3><p class="fine">Fasst je Bereich den Symptomfragebogen und die standardisierten Fragebögen zusammen. Alle Quellen zählen gleich; keine Diagnose.</p>'
  +(areas.length ? '<div class="tbl-wrap"><table class="gtab"><thead><tr><th scope="col">Bereich</th><th scope="col">Symptomfragebogen</th><th scope="col">Standardisierte Fragebögen</th><th scope="col">Gesamt</th></tr></thead><tbody>'+rows+'</tbody></table></div>' : '<p class="fine">Alle Bereiche sind abgehakt.</p>')
  +(aus.length ? '<p class="fine">Ausgeblendet: '+aus.map(a=>esc(a.title)).join(', ')+'.</p>' : '');
}
function paintResultsList(){
 const el=document.getElementById('results-list'); if(!el) return;
 const rows=[], ord=areaOrder();
 const TEST_AREA={asrs:'adhs', phq:'depression', who5:'depression'};
 Object.keys(TSHORT).filter(t=>!isHidden(TEST_AREA[t])).forEach(t=>{ const tr=TR[t](), v=LV2(tr.lv); if(v!==null) rows.push([TSHORT[t]+' (eingebaut)', t==='asrs'?'ADHS':'Depression', tr.pill, v, ord.indexOf(TEST_AREA[t])]); });
 XAREAS.filter(a=>!isHidden(a)).forEach(area=>{ const title=(GES_AREAS.find(a=>a.id===area)||{}).title||area; extEntries(area).forEach(e=>rows.push([e.label, title, e.text||'–', e.val, ord.indexOf(area)])); });
 rows.sort((a,b)=>a[4]-b[4]);
 el.innerHTML='<h3>Deine Testergebnisse</h3>'+(rows.length
  ? '<div class="tbl-wrap"><table class="srcs"><thead><tr><th scope="col">Test</th><th scope="col">Bereich</th><th scope="col">Ergebnis</th><th scope="col">Einstufung</th></tr></thead><tbody>'+rows.map(r=>'<tr><td>'+esc(r[0])+'</td><td>'+esc(r[1])+'</td><td>'+esc(r[2])+'</td><td>'+pillHtml(CLS_LV[r[3]],CLS_LABEL[r[3]])+'</td></tr>').join('')+'</tbody></table></div>'
  : '<p class="fine">Noch keine Testergebnisse. Fragebögen füllst du im jeweiligen Reiter unter „Standardisierte Fragebögen“ aus oder trägst dort Ergebnisse ein.</p>');
}

/* ---------- Aktualisieren ---------- */
function update(){
 document.querySelectorAll('[data-count]').forEach(el=>{
  const gid=el.dataset.count, g=G[gid], n=full(gid), p=pc(gid), N=g.items.length, th=g.all?N:g.min;
  el.textContent = n+' von '+N+(p?' · + '+p+' teilweise':'')+(th?' · Schwelle '+th:'');
  el.classList.toggle('hit', !!th && n>=th);
 });
 document.querySelectorAll('[data-bar]').forEach(el=>{ const g=el.dataset.bar; el.style.width=(full(g)/G[g].items.length*100)+'%'; });
 document.querySelectorAll('[data-pbar]').forEach(el=>{ const g=el.dataset.pbar, N=G[g].items.length; el.style.left=(full(g)/N*100)+'%'; el.style.width=(pc(g)/N*100)+'%'; });
 document.querySelectorAll('[data-result]').forEach(el=> paintResult(el, RES[el.dataset.result]()));
 document.querySelectorAll('[data-tres]').forEach(el=> paintResult(el, TR[el.dataset.tres]()));
 document.querySelectorAll('[data-dot]').forEach(el=>{ const lv=navLv(el.dataset.dot); if(lv==='none') el.removeAttribute('data-lv'); else el.dataset.lv=lv; });
 paintTiles();
 paintXPills();
 document.querySelectorAll('[data-gesamt]').forEach(paintGesamt);
 paintGesamtTable();
 paintResultsList();
 paintBereiche();
}
/* Reihenfolge und Sichtbarkeit der Bereiche überall anwenden */
function paintBereiche(){
 const ord=areaOrder();
 const list=document.querySelector('.tablist'), last=list.querySelector('a[href="/tests"]');
 ord.forEach(id=>{ const a=list.querySelector('a[data-area="'+id+'"]'); if(a){ list.insertBefore(a,last); a.hidden=isHidden(id); } });
 const namen=ord.filter(id=>!isHidden(id)).map(id=>LEAD_NAMES[id]).filter(Boolean);
 document.getElementById('lead-liste').textContent = !namen.length ? 'die Bereiche, die du in der Übersicht einblendest' : namen.length===1 ? namen[0] : namen.slice(0,-1).join(', ')+' und '+namen[namen.length-1];
 document.querySelectorAll('#tests tr[data-area]').forEach(tr=>{ tr.hidden=isHidden(tr.dataset.area); });
 document.querySelectorAll('[data-banner]').forEach(b=>{ b.hidden=!isHidden(b.dataset.banner); });
 document.querySelectorAll('.view').forEach(v=>v.classList.toggle('aus-druck', AREA_IDS.includes(v.id) && isHidden(v.id)));
 document.querySelectorAll('[data-krise]').forEach(k=>{ k.hidden=!((tv('phq',8)||0)>=1); });
}
function addBanners(){
 CARDS.forEach(c=>{
  const sec=document.getElementById(c.id); if(!sec || sec.querySelector('[data-banner]')) return;
  const d=document.createElement('div'); d.className='hidden-banner'; d.dataset.banner=c.id; d.hidden=true;
  d.innerHTML='<span>Dieser Bereich ist abgehakt und fehlt deshalb in Navigation und Gesamtbild.</span><button type="button" class="btn ghost" data-unhide="'+c.id+'">Wieder einblenden</button>';
  sec.insertBefore(d, sec.children[1] || null);
 });
}

/* ---------- Eingaben ---------- */
function changed(){ speicher.geaendert(); }
function setHidden(id, hide){
 S['h.'+id]=hide?1:0; changed(); update();
 ansage(cardOf(id).title+(hide?' abgehakt und ausgeblendet.':' wieder eingeblendet.'));
 const det=document.getElementById('ausgeblendet'), cb=document.querySelector('input[data-hide="'+id+'"]');
 if(hide && !det.open) det.querySelector('summary').focus();
 else if(cb && !cb.closest('[hidden]')) cb.focus();
}
document.addEventListener('click', e=>{
 const b=e.target && e.target.closest ? e.target.closest('button.tri') : null;
 if(b && b.dataset.k){
  const k=b.dataset.k, v=S[k]||0, nv = v===0 ? 1 : v===1 ? 0.5 : 0;
  if(nv) S[k]=nv; else delete S[k];
  b.dataset.v=nv; b.setAttribute('aria-checked', ariaOf(nv)); b.title=titleOf(nv);
  const li=b.closest('li'); if(li) li.dataset.v=nv;
  changed(); update(); return;
 }
 const un=e.target && e.target.closest ? e.target.closest('[data-unhide]') : null;
 if(un) setHidden(un.dataset.unhide, false);
});
document.addEventListener('input', e=>{
 const t=e.target;
 if(t.id==='filter'){ applyFilter(); return; }
 if(t.dataset.xnum){
  const k=t.dataset.xnum, raw=t.value.trim().replace(',','.');
  if(raw===''){ delete S[k]; t.removeAttribute('aria-invalid'); }
  else { const n=Number(raw); if(validKey(k,n)){ S[k]=n; t.removeAttribute('aria-invalid'); } else { t.setAttribute('aria-invalid','true'); return; } }
  changed(); update();
 }
});
document.addEventListener('change', e=>{
 const t=e.target;
 if(t.dataset.hide){ setHidden(t.dataset.hide, t.checked); return; }
 if(t.dataset.t){ S['t.'+t.dataset.t+'.'+t.dataset.i]=Number(t.value); }
 else if(t.dataset.r){ S['r.'+t.dataset.r]=Number(t.value); }
 else if(t.dataset.xsel){ const k=t.dataset.xsel; if(t.value==='') delete S[k]; else S[k]=Number(t.value); }
 else return;
 changed(); update();
});

/* ---------- Kacheln anordnen: Griff mit Maus, Finger oder Pfeiltasten ---------- */
let zug=null;
const idsIn = list => [...list.querySelectorAll('[data-tile]')].map(t=>t.dataset.tile);
function positionAnsagen(id){ const t=document.querySelector('[data-tile="'+id+'"]'); if(!t) return; const ids=idsIn(t.parentElement); ansage(cardOf(id).title+': Position '+(ids.indexOf(id)+1)+' von '+ids.length+'.'); }
function griffFokus(id){ const g=document.querySelector('[data-griff="'+id+'"]'); if(g) g.focus({preventScroll:true}); }
document.addEventListener('pointerdown', e=>{
 const g=e.target && e.target.closest ? e.target.closest('[data-griff]') : null;
 if(!g || e.button!==0) return;
 e.preventDefault();
 const tile=g.closest('[data-tile]');
 zug={g, tile, list:tile.parentElement, id:tile.dataset.tile, start:idsIn(tile.parentElement).join(), x:e.clientX, y:e.clientY, raf:0};
 try { g.setPointerCapture(e.pointerId); } catch(err){}
 tile.classList.add('zieht'); document.body.classList.add('zieht-gerade');
 const rollen=()=>{ if(!zug) return; const m=70, v = zug.y<m ? -(m-zug.y)/4 : zug.y>innerHeight-m ? (zug.y-(innerHeight-m))/4 : 0; if(v){ window.scrollBy(0,v); ziehen(); } zug.raf=requestAnimationFrame(rollen); };
 zug.raf=requestAnimationFrame(rollen);
});
function ziehen(){
 const el=document.elementFromPoint(zug.x, zug.y), ziel=el && el.closest ? el.closest('[data-tile]') : null;
 if(!ziel || ziel===zug.tile || ziel.parentElement!==zug.list) return;
 const kids=[...zug.list.querySelectorAll('[data-tile]')];
 zug.list.insertBefore(zug.tile, kids.indexOf(ziel) < kids.indexOf(zug.tile) ? ziel : ziel.nextSibling);
}
document.addEventListener('pointermove', e=>{ if(!zug) return; zug.x=e.clientX; zug.y=e.clientY; ziehen(); });
function zugEnde(){
 if(!zug) return;
 const z=zug; zug=null; cancelAnimationFrame(z.raf);
 z.tile.classList.remove('zieht'); document.body.classList.remove('zieht-gerade');
 if(idsIn(z.list).join()!==z.start){ setOrder(mergeOrder(idsIn(z.list))); changed(); update(); positionAnsagen(z.id); }
 griffFokus(z.id);
}
document.addEventListener('pointerup', zugEnde);
document.addEventListener('pointercancel', zugEnde);
document.addEventListener('keydown', e=>{
 const g=e.target && e.target.closest ? e.target.closest('[data-griff]') : null; if(!g) return;
 const d = (e.key==='ArrowUp' || e.key==='ArrowLeft') ? -1 : (e.key==='ArrowDown' || e.key==='ArrowRight') ? 1 : 0;
 if(!d) return;
 e.preventDefault();
 const tile=g.closest('[data-tile]'), id=tile.dataset.tile, ids=idsIn(tile.parentElement), i=ids.indexOf(id), j=i+d;
 if(j<0 || j>=ids.length) return;
 ids.splice(j,0,ids.splice(i,1)[0]);
 setOrder(mergeOrder(ids)); changed(); update();
 griffFokus(id); positionAnsagen(id);
});

/* ---------- Navigation: Bereiche als Pfade (/adhs), der #-Teil bleibt für den persönlichen Link frei ---------- */
const VIEWS=[...document.querySelectorAll('.view')].map(v=>v.id);
const pfadZuView = p => { const s=String(p).replace(/^\/+|\/+$/g,''); return s==='' ? 'uebersicht' : (VIEWS.includes(s) && s!=='uebersicht' ? s : null); };
function show(scroll){
 let h=pfadZuView(location.pathname);
 if(!h){ h='uebersicht'; history.replaceState(null,'','/'+location.hash); }
 document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active', v.id===h));
 document.querySelectorAll('.tablist a').forEach(a=>{
  if(pfadZuView(a.getAttribute('href'))===h){ a.setAttribute('aria-current','page'); if(!a.hidden){ try{ a.scrollIntoView({block:'nearest',inline:'nearest'}); }catch(e){} } }
  else a.removeAttribute('aria-current');
 });
 const c=cardOf(h);
 document.title=(c ? c.title+' – ' : h==='tests' ? 'Alle Tests – ' : '')+'Selbstbild – Diagnosekriterien & Selbsttests';
 if(scroll){ const nav=document.querySelector('nav.tabs'), top=nav.offsetTop; if(window.scrollY>top) window.scrollTo(0,top); }
}
document.addEventListener('click', e=>{
 if(e.defaultPrevented || e.button!==0) return;
 const a=e.target && e.target.closest ? e.target.closest('a[href]') : null; if(!a) return;
 const href=a.getAttribute('href');
 if(href==='#inhalt'){ e.preventDefault(); const m=document.getElementById('inhalt'); m.setAttribute('tabindex','-1'); m.focus(); return; }
 if(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target || !href.startsWith('/') || href.startsWith('//')) return;
 const v=pfadZuView(href.split('#')[0]); if(!v) return;
 e.preventDefault();
 if(pfadZuView(location.pathname)!==v) history.pushState(null,'',(v==='uebersicht'?'/':'/'+v)+location.hash);
 show(true);
});
window.addEventListener('popstate',()=>show(true));

/* ---------- Start ---------- */
function init(){
 document.querySelectorAll('[data-group]').forEach(renderGroup);
 document.querySelectorAll('[data-radio]').forEach(renderRadio);
 document.querySelectorAll('[data-extern]').forEach(renderExtern);
 document.querySelectorAll('[data-test]').forEach(renderTest);
 addLegends();
 addBanners();
 SUCHINDEX=null;
 update();
}
{ const h=location.hash.slice(1); if(VIEWS.includes(h)) history.replaceState(null,'', h==='uebersicht' ? '/' : '/'+h); }
init();
show(false);
speicher.starten({ holen: ()=>S, setzen: d=>{ S=clean(d); init(); }, pruefen: clean });
