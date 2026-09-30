// Guided, one-at-a-time version of the Week 0 tests (Section 7). Each answer is a big
// button or a stopwatch; follow-up tests only appear when the result makes them relevant.
// Button values are the lower bound of each range, so the guide's placement rules
// (TEST_A / TEST_B in tests.ts) give the same result as typing the exact number.
import { Equip } from './sv';
import { TestBattery } from './program';
import { Values } from './tests';

export type Choice = { label: string; value: number };

export type GuidedStep = {
  key: string;
  title: string;
  how: string;
  media?: string;
  kind: 'hold' | 'choice';
  choices?: Choice[];
  /** Only ask when earlier answers make it relevant. */
  when?: (v: Values) => boolean;
  /** Skip automatically when none of this equipment is owned. */
  needs?: Equip[];
  skipLabel?: string;
};

const r = (...pairs: [string, number][]): Choice[] => pairs.map(([label, value]) => ({ label, value }));
const has = (n: number | undefined) => typeof n === 'number';

export const GUIDED: Record<Exclude<TestBattery, 'C'>, GuidedStep[]> = {
  A: [
    { key: 'hs', title: 'Handstående mot väggen', how: 'Gå upp med fötterna på väggen tills magen nästan nuddar den, händerna 10–20 cm från väggen. Håll så länge du har raka armar.', media: 'HS2', kind: 'hold', skipLabel: 'Vågar/kan inte' },
    { key: 'pullups', title: 'Pull-ups', how: 'Från raka armar, hakan över stången. Inga sving. Hur många klarar du i rad?', media: 'VPu4', kind: 'choice', choices: r(['0', 0], ['1–4', 1], ['5–7', 5], ['8–9', 8], ['10–14', 10], ['15+', 15]), needs: ['bar', 'rings'] },
    { key: 'negatives', title: 'Långsam nedsänkning', how: 'Hoppa upp så hakan är över stången och sänk dig så långsamt du kan (minst 5 s). Hur många gånger klarar du det?', media: 'VPu2', kind: 'choice', choices: r(['0', 0], ['1–2', 1], ['3 eller fler', 3]), when: (v) => v.pullups === 0, needs: ['bar', 'rings'] },
    { key: 'c2b', title: 'Bröstet till stången', how: 'Dra hela vägen tills bröstet nuddar stången. Hur många?', media: 'VPu5', kind: 'choice', choices: r(['0–2', 0], ['3 eller fler', 3]), when: (v) => has(v.pullups) && v.pullups! >= 10 && v.pullups! < 15, needs: ['bar'] },
    { key: 'tuckFl', title: 'Tuck front lever', how: 'Häng i stången, dra upp knäna och luta bakåt tills ryggen är vågrät under stången. Raka armar. Håll så länge du kan.', media: 'FL1', kind: 'hold', when: (v) => has(v.pullups) && v.pullups! >= 8, needs: ['bar', 'rings'] },
    { key: 'advFl', title: 'Avancerad tuck front lever', how: 'Samma som nyss men med rak rygg och knäna längre från bröstet.', media: 'FL2', kind: 'hold', when: (v) => has(v.tuckFl) && v.tuckFl! >= 10, needs: ['bar', 'rings'] },
    { key: 'dips', title: 'Dips', how: 'Starta med raka armar, sänk tills axeln är strax under armbågen och tryck upp. Hur många?', media: 'DP3', kind: 'choice', choices: r(['0', 0], ['1–4', 1], ['5–9', 5], ['10–14', 10], ['15+', 15]), skipLabel: 'Har inget att göra dips på' },
    { key: 'support', title: 'Stödhäng', how: 'Håll dig uppe på raka armar med axlarna nedtryckta.', media: 'DP1', kind: 'hold', when: (v) => v.dips === 0 },
    { key: 'lean', title: 'Planche lean', how: 'Armhävningsläge med raka armar. Runda övre ryggen och luta axlarna ca 10 cm fram förbi händerna. Håll.', media: 'PL0a', kind: 'hold' },
    { key: 'tuckPl', title: 'Tuck planche', how: 'Knäna mot bröstet, luta fram och lyft fötterna från golvet på raka armar. Håll.', media: 'PL1', kind: 'hold', when: (v) => has(v.lean) && v.lean! >= 20 && has(v.dips) && v.dips! >= 10 },
    { key: 'pike', title: 'Pike push-ups', how: 'Höften högt som ett upp-och-nervänt V. Sänk huvudet mot golvet framför händerna och tryck upp. Hur många?', media: 'VP1', kind: 'choice', choices: r(['0–4', 0], ['5–11', 5], ['12+', 12]) },
    { key: 'elevPike', title: 'Pike push-ups med fötterna på låda', how: 'Samma rörelse men fötterna på en stol eller låda. Hur många?', media: 'VP2', kind: 'choice', choices: r(['0–5', 0], ['6–9', 6], ['10+', 10]), when: (v) => has(v.pike) && v.pike! >= 12 },
    { key: 'rows', title: 'Rodd', how: 'Häng under ringar, stång eller ett stadigt bord med rak kropp och hälarna i golvet. Dra bröstet upp. Hur många?', media: 'HPu2', kind: 'choice', choices: r(['0–7', 0], ['8–14', 8], ['15+', 15]) },
    { key: 'pushups', title: 'Armhävningar', how: 'Rak kropp, bröstet ner till en knytnävs höjd från golvet. Hur många?', media: 'HP2', kind: 'choice', choices: r(['0–4', 0], ['5–14', 5], ['15–25', 15], ['26+', 26]) },
    { key: 'diamond', title: 'Diamantarmhävningar', how: 'Händerna ihop under bröstet. Hur många?', media: 'HP3', kind: 'choice', choices: r(['0–7', 0], ['8+', 8]), when: (v) => has(v.pushups) && v.pushups! >= 15 && v.pushups! < 26 },
    { key: 'archer', title: 'Archer-armhävningar', how: 'Brett grepp, sänk mot ena handen med den andra armen rak. Hur många per sida?', media: 'HP5', kind: 'choice', choices: r(['0–4', 0], ['5+', 5]), when: (v) => has(v.pushups) && v.pushups! >= 26 },
  ],
  B: [
    { key: 'split', title: 'Split squat', how: 'Utfallssteg på stället, bakre knät nuddar lätt golvet. Hur många per ben?', media: 'SL2', kind: 'choice', choices: r(['0–11', 0], ['12+', 12]) },
    { key: 'bss', title: 'Bulgarian split squat', how: 'Samma sak men bakre foten på en stol eller bänk. Hur många per ben?', media: 'SL3', kind: 'choice', choices: r(['0–11', 0], ['12+', 12]), when: (v) => has(v.split) && v.split! >= 12 },
    { key: 'boxHeight', title: 'Enbensknäböj till låda', how: 'Sätt dig ner på ett ben mot en låda/stol och res dig utan att gunga. Vilken är den lägsta höjden du klarar 5 gånger?', media: 'SL4', kind: 'choice', choices: r(['Klarar inte', 0], ['Stol (≈45 cm)', 45], ['Låg pall (≈30 cm)', 30], ['Nästan golvet (≈15 cm)', 15]), when: (v) => has(v.bss) && v.bss! >= 12 },
    { key: 'pistol', title: 'Full pistol squat', how: 'Hela vägen ner på ett ben utan låda, hälen i golvet. Klarar du 3?', media: 'SL6', kind: 'choice', choices: r(['Nej', 0], ['Ja', 3]), when: (v) => v.boxHeight === 15 },
    { key: 'hlr', title: 'Hängande benlyft', how: 'Häng i stången och lyft raka ben till vågrätt utan sving. Hur många?', media: 'CC3', kind: 'choice', choices: r(['0', 0], ['1–9', 1], ['10+', 10]), needs: ['bar', 'rings'] },
    { key: 'slBridge', title: 'Höftlyft på ett ben', how: 'Ligg på rygg, ett ben i golvet, lyft höften. Klarar du 10 med höften i våg?', media: 'H2', kind: 'choice', choices: r(['Nej', 5], ['Ja', 10]) },
    { key: 'slRdl', title: 'Enbens-marklyft', how: 'Stå på ett ben och fäll höften bakåt med rak rygg. Klarar du 10 med balans?', media: 'H3', kind: 'choice', choices: r(['Nej', 5], ['Ja', 10]), when: (v) => v.slBridge === 10 },
    { key: 'nordic', title: 'Nordic', how: 'Stå på knä med fötterna fastlåsta (under en soffa). Fall långsamt framåt med rak höft. Starta tidtagningen när du börjar falla, stoppa när du tappar kontrollen.', media: 'KF5', kind: 'hold' },
  ],
  mini: [
    { key: 'hs', title: 'Handstående mot väggen', how: 'Håll så länge du har raka armar.', media: 'HS2', kind: 'hold' },
    { key: 'pullups', title: 'Pull-ups', how: 'Hur många i rad?', media: 'VPu4', kind: 'choice', choices: r(['0', 0], ['1–4', 1], ['5–9', 5], ['10–14', 10], ['15+', 15]), needs: ['bar', 'rings'] },
    { key: 'dips', title: 'Dips', how: 'Hur många?', media: 'DP3', kind: 'choice', choices: r(['0', 0], ['1–4', 1], ['5–9', 5], ['10–14', 10], ['15+', 15]), skipLabel: 'Hoppa över' },
    { key: 'boxHeight', title: 'Enbensknäböj till låda', how: 'Lägsta höjden du klarar 5 gånger per ben?', media: 'SL4', kind: 'choice', choices: r(['Klarar inte', 0], ['Stol (≈45 cm)', 45], ['Låg pall (≈30 cm)', 30], ['Nästan golvet (≈15 cm)', 15]) },
    { key: 'nordic', title: 'Nordic', how: 'Fall långsamt framåt med rak höft. Stoppa när du tappar kontrollen.', media: 'KF5', kind: 'hold' },
  ],
};

export function activeSteps(battery: Exclude<TestBattery, 'C'>, values: Values, equipment: Equip[] | null): GuidedStep[] {
  return GUIDED[battery].filter(
    (s) => (!s.when || s.when(values)) && (!s.needs || !equipment || s.needs.some((e) => equipment.includes(e))),
  );
}
