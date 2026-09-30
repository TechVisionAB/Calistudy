// Plain-Swedish explanations for the guide's jargon. Used by the "?" buttons.
import { LADDERS } from './ladders';
import { LADDER_SV, LEVEL_SV } from './sv';

export type Term = { term: string; match: RegExp; text: string };

export const GLOSSARY: Term[] = [
  { term: 'RIR', match: /\bRIR\b/, text: 'Reps In Reserve – hur många reps du hade orkat till. RIR 2 = sluta när du har ungefär 2 reps kvar. I appen: Lätt ≈ 3, Lagom ≈ 2, Tungt ≈ 1, Max = 0.' },
  { term: 'RPE', match: /\bRPE\b/, text: 'Upplevd ansträngning på en skala 1–10. RPE ≤6 = ska kännas lätt, långt ifrån max.' },
  { term: 'Hold reserve', match: /hold reserve/i, text: 'För hållningar: sluta 2–3 sekunder innan formen brister, i stället för att hålla tills du faller.' },
  { term: 'CTW', match: /\bCTW\b|chest-to-wall/i, text: 'Chest-to-wall: handstående med magen/bröstet mot väggen (du går upp med fötterna på väggen). Lättare att hålla rak linje än med ryggen mot väggen.' },
  { term: 'Toe pulls', match: /toe[- ]pulls?/i, text: 'Handstående med ryggen mot väggen: du drar försiktigt bort tårna från väggen och balanserar fritt så länge du kan (målet är ≥3 s), sedan tillbaka. Övar balans inför fritt handstående.' },
  { term: 'Shoulder taps', match: /shoulder taps?/i, text: 'I handstående mot väggen: flytta vikten till en hand och nudda axeln med den andra. Bygger styrka och balans.' },
  { term: 'Bail / cartwheel out', match: /\bbail\b|cartwheel/i, text: 'Att säkert ta sig ur ett handstående som tippar över: vrid höften och kliv ut åt sidan som en hjulning.' },
  { term: 'Tuck', match: /\btuck\b/i, text: 'Knäna dragna in mot bröstet – den kortaste och lättaste varianten av t.ex. planche och front lever.' },
  { term: 'Advanced tuck', match: /adv(anced)? tuck/i, text: 'Tuck med rak rygg och höften längre ut – nästa steg efter tuck.' },
  { term: 'Straddle', match: /straddle/i, text: 'Benen raka och isärsärade i ett V. Svårare än tuck, lättare än benen ihop.' },
  { term: 'Half-lay / one-leg', match: /half-lay|one-leg/i, text: 'Mellansteg: ett ben rakt och ett böjt, eller båda böjda till hälften.' },
  { term: 'Protraction', match: /protract/i, text: 'Skjut skulderbladen isär och framåt (runda övre ryggen), som att trycka bort golvet.' },
  { term: 'Depression', match: /depress/i, text: 'Dra ner axlarna bort från öronen.' },
  { term: 'Scap / skulderblad', match: /\bscap(ular|s)?\b/i, text: 'Skulderbladen. Scap pull-ups/push-ups = små rörelser där bara skulderbladen rör sig, armarna är raka.' },
  { term: 'Full ROM', match: /\bROM\b/, text: 'Full rörelsebana – hela vägen ner och hela vägen upp.' },
  { term: 'BW', match: /\bBW\b/, text: 'Kroppsvikt. "+10% BW" = extra vikt motsvarande 10 % av din kroppsvikt (t.ex. 8 kg om du väger 80).' },
  { term: 'Tempo', match: /tempo|\b\d-\d-[\dX]-\d\b/i, text: 'Fyra siffror: sekunder ner – paus i botten – upp – paus i toppen. X = så snabbt du kan. 3-1-X-0 = 3 s ner, 1 s paus, explosivt upp.' },
  { term: 'Superset', match: /superset/i, text: 'Två övningar som varvas: set av den ena, vila, set av den andra, vila, och så vidare.' },
  { term: 'Deload', match: /deload/i, text: 'Lättare vecka (vecka 6 och 12) med ungefär halva mängden, så att kroppen hinner återhämta sig och bli starkare.' },
  { term: 'Block', match: /\bblock\b/i, text: 'Programmet har två block à 5 veckor. Block 2 (v7–11) byter vissa övningar mot svårare när du klarar kraven.' },
  { term: 'Zone 2', match: /zone ?2|zon 2/i, text: 'Lugn kondition där du fortfarande kan prata i hela meningar – rask promenad, cykel, lätt jogg.' },
  { term: 'False grip', match: /false[- ]grip/i, text: 'Greppet i ringarna där handleden ligger ovanpå ringen. Behövs för muscle-ups i ringar.' },
  { term: 'RTO', match: /\bRTO\b|turned out/i, text: 'Rings Turned Out – vrid ringarna utåt så att tummarna pekar ut. Svårare och bättre för axlarna i längden.' },
  { term: 'German hang', match: /german hang/i, text: 'Häng i ringar/stång med armarna bakom kroppen – töjer framsidan av axlarna. Gå försiktigt fram.' },
  { term: 'Skin the cat', match: /skin[- ]the[- ]cat/i, text: 'Rulla bakåt genom armarna i ringar/stång till german hang och tillbaka.' },
  { term: 'Hollow body', match: /hollow/i, text: 'Ligg på rygg, pressa ländryggen i golvet och lyft axlar och raka ben. Grunden för nästan alla färdigheter.' },
  { term: 'L-sit', match: /L-sit/i, text: 'Sitt på raka armar med raka ben rakt fram, rumpan i luften.' },
  { term: 'Pike', match: /\bpike\b/i, text: 'Höften böjd med raka ben, som ett upp-och-nervänt V.' },
  { term: 'Pancake', match: /pancake/i, text: 'Sittande med benen isär, fäll fram överkroppen.' },
  { term: 'Negatives / eccentric', match: /negative|eccentric/i, text: 'Bara den sänkande delen av rörelsen, långsamt (t.ex. 5 s ner). Bra för att bli stark nog för hela rörelsen.' },
  { term: 'Box pistol', match: /box pistol/i, text: 'Pistol squat ner till en låda/stol och upp igen. Sänk lådan 10–15 cm när du klarar kravet.' },
  { term: 'Nordic', match: /nordic/i, text: 'Stå på knä med fötterna fastlåsta och fall långsamt framåt med rak höft. Mycket effektiv för baksida lår.' },
  { term: 'SL-RDL', match: /SL-RDL|single-leg RDL/i, text: 'Enbens-marklyft: fäll höften bakåt på ett ben med rak rygg, andra benet går bakåt.' },
  { term: 'BSS', match: /\bBSS\b|bulgarian/i, text: 'Bulgarian split squat: utfallsknäböj med bakre foten på en bänk.' },
  { term: 'Copenhagen', match: /copenhagen/i, text: 'Sidoplanka med övre benet på en bänk – stärker insidan av låret (adduktorerna).' },
  { term: 'Pallof press', match: /pallof/i, text: 'Håll ett gummiband fäst åt sidan, tryck ut armarna och stå emot att bli vriden.' },
  { term: 'MU', match: /\bMU\b/, text: 'Muscle-up: pull-up som fortsätter över stången/ringarna till stöd på raka armar.' },
  { term: 'HSPU', match: /HSPU/i, text: 'Handstand push-up – armhävning i handstående.' },
  { term: 'C2B', match: /C2B|chest-to-bar/i, text: 'Chest-to-bar: pull-up där bröstet når stången.' },
  { term: 'OAC / OAP', match: /\bOA[CP]\b/, text: 'One-arm chin-up / one-arm pull-up – enarms-pull-up.' },
  { term: 'OAHS', match: /OAHS/, text: 'One-arm handstand – enarms-handstående.' },
  { term: 'DB', match: /\bDB\b/, text: 'Dumbbell = hantel.' },
  { term: 'Plyo', match: /plyo/i, text: 'Plyometri: hopp och studs med maximal fart.' },
  { term: 'Gateway', match: /gateway/i, text: 'En grundförmåga som låser upp flera avancerade färdigheter (t.ex. 10 strikta pull-ups → muscle-up, front lever).' },
];

const LEVEL_RE = /\b(VPu|HPu|HP|VP|DP|HS|PL|MU|FL|BL|HF|CC|SL|KF|H)(\d+[ab]?)\b/g;

export type Found = { term: string; text: string };

/** Glossary terms and ladder level codes that appear in a piece of text. */
export function explain(text: string): Found[] {
  const out: Found[] = [];
  const seen = new Set<string>();
  for (const m of text.matchAll(LEVEL_RE)) {
    const code = m[0];
    if (seen.has(code)) continue;
    const ladder = LADDERS.find((l) => l.levels.some((x) => x.code === code));
    const lvl = ladder?.levels.find((x) => x.code === code);
    if (!ladder || !lvl) continue;
    seen.add(code);
    out.push({
      term: code,
      text: `${LADDER_SV[ladder.id] ?? ladder.name}, nivå ${lvl.code.replace(/^[A-Za-z]+/, '')}: ${LEVEL_SV[code] ?? lvl.name}. Gå vidare när du klarar: ${lvl.advance}.`,
    });
  }
  for (const g of GLOSSARY) {
    if (g.match.test(text) && !seen.has(g.term)) {
      seen.add(g.term);
      out.push({ term: g.term, text: g.text });
    }
  }
  if (/[<≥≤]\s?\d+|→/.test(text)) {
    out.push({ term: 'Så läser du "<20 s → HS1"', text: 'Resultatet till vänster ger nivån till höger. "<20 s → HS1" betyder: klarar du under 20 sekunder börjar du på nivå HS1. "≥60 s" betyder 60 sekunder eller mer.' });
  }
  return out;
}
