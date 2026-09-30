// Swedish plain-language layer on top of the guide's English content, plus
// equipment rules. The guide text itself (sessions.ts, ladders.ts) stays untouched.

export type Equip = 'bar' | 'rings' | 'dip' | 'dumbbells' | 'weight' | 'bench' | 'bands';

export const EQUIPMENT: { id: Equip; label: string; hint: string }[] = [
  { id: 'bar', label: 'Räckhäck / dörrstång', hint: 'Pull-ups, benlyft, front lever' },
  { id: 'rings', label: 'Romerska ringar', hint: 'Rodd, dips, ringarmhävningar' },
  { id: 'dip', label: 'Dipsställning / parallettes', hint: 'Dips, L-sit' },
  { id: 'dumbbells', label: 'Hantlar', hint: 'Belastade ben, axlar, armar' },
  { id: 'weight', label: 'Viktväst / dipsbälte', hint: 'Belastade pull-ups och dips' },
  { id: 'bench', label: 'Bänk / stadig låda', hint: 'Bulgarian split squat, box-pistol' },
  { id: 'bands', label: 'Gummiband', hint: 'Assisterade pull-ups, axelprehab' },
];

/** Swedish display name and cue per session exercise, keyed "session:slot". */
export const EX_SV: Record<string, { name: string; cue: string }> = {
  'upperA:A': { name: 'Handstående', cue: 'Tryck bort golvet, revbenen in' },
  'upperA:B': { name: 'Planche', cue: 'Runda övre ryggen, raka armar, axlarna framför händerna' },
  'upperA:C': { name: 'Front lever', cue: 'Dra stången mot höfterna, spänn sätet' },
  'upperA:D1': { name: 'Vertikal press', cue: 'Huvudet fram till en triangel, armbågar ~45°' },
  'upperA:D2': { name: 'Pull-ups', cue: 'Axlarna ner först, sedan armbågarna mot revbenen' },
  'upperA:E1': { name: 'Dips', cue: 'Bröstet fram, axlarna ner, lås ut i toppen' },
  'upperA:E2': { name: 'Rodd', cue: 'Bröstet mot händerna, kläm 1 s' },
  'upperA:F1': { name: 'Sidolyft med hantel', cue: 'Led med armbågarna, stanna i axelhöjd' },
  'upperA:F2': { name: 'Bicepscurl', cue: 'Stilla armbågar, full sträckning nere' },
  'upperA:G': { name: 'L-sit', cue: 'Axlarna ner, tryck ifrån, raka knän' },
  'lowerA:A': { name: 'Lådhopp', cue: 'Hoppa högt, landa tyst, knäna över tårna. Kliv ner.' },
  'lowerA:B': { name: 'Enbensknäböj', cue: 'Sätt dig bakåt och ner, hälen tung' },
  'lowerA:C': { name: 'Enbens-marklyft', cue: 'Höften bakåt, rak rygg, höften i våg' },
  'lowerA:D': { name: 'Nordic hamstring', cue: 'Rak höft, fall så långsamt du kan' },
  'lowerA:E': { name: 'Tåhävning på ett ben', cue: 'Tryck genom stortån, full sträckning' },
  'lowerA:F1': { name: 'Copenhagen-planka', cue: 'Övre benet trycker ner i bänken' },
  'lowerA:F2': { name: 'Hollow body', cue: 'Ländryggen i golvet, revbenen in' },
  'upperB:A': { name: 'Handstående', cue: 'Handleder, axlar och höfter i linje' },
  'upperB:B': { name: 'Front lever', cue: 'Axlarna ner, raka armar, hollow' },
  'upperB:C': { name: 'Planche lean', cue: 'Luta tills du känner axlarna jobba' },
  'upperB:D': { name: 'Explosiva pull-ups', cue: 'Dra stången till bröstbenet – snabbt!' },
  'upperB:E1': { name: 'Armhävningar', cue: 'Runda ryggen i toppen, armbågar ~45°' },
  'upperB:E2': { name: 'Rodd', cue: 'Dra ringarna mot nedre revbenen' },
  'upperB:F1': { name: 'Chin-ups', cue: 'Död häng i botten, bröstet mot stången' },
  'upperB:F2': { name: 'Pseudo-planche-armhävningar', cue: 'Behåll lutningen hela repet' },
  'upperB:G1': { name: 'Tricepsextension över huvudet', cue: 'Djup stretch bakom huvudet' },
  'upperB:G2': { name: 'Band pull-apart', cue: 'Tummarna bakåt, dra inte upp axlarna' },
  'upperB:H': { name: 'Hängande benlyft', cue: 'Tippa bäckenet först, ingen sving' },
  'lowerB:A1': { name: 'Pogohopp', cue: 'Studsa på framfoten, stela fotleder' },
  'lowerB:A2': { name: 'Sidohopp', cue: 'Landa mjukt och håll 2 s' },
  'lowerB:B': { name: 'Bulgarian split squat', cue: 'Främre smalbenet lätt framåt, tryck genom hela foten' },
  'lowerB:C': { name: 'Höftlyft', cue: 'Hakan in, lås höften med sätet' },
  'lowerB:D': { name: 'Glidande bencurl', cue: 'Håll höften uppe hela tiden' },
  'lowerB:E': { name: 'Shrimp-knäböj', cue: 'Kontrollerat ner, knät över tårna' },
  'lowerB:F1': { name: 'Tåhävning, böjda knän', cue: 'Full rörelse' },
  'lowerB:F2': { name: 'Tibialislyft', cue: 'Tårna mot smalbenen' },
  'lowerB:G1': { name: 'Höftabduktion', cue: 'Lätt sträckt höft, tårna framåt' },
  'lowerB:G2': { name: 'Pallof press', cue: 'Revbenen ner, stå emot rotationen' },
};

/** Swedish short name per ladder level. */
export const LEVEL_SV: Record<string, string> = {
  HP1: 'Armhävning mot bänk', HP2: 'Armhävning', HP3: 'Diamantarmhävning', HP4: 'Armhävning i ringar', HP5: 'Archer-armhävning',
  HP6: 'Pseudo-planche-armhävning', HP7: 'Armhävning med vikt', HP8: 'Enarmsarmhävning mot bänk', HP9: 'Enarmsarmhävning',
  VP1: 'Pike push-up', VP2: 'Pike push-up, fötter på låda', VP3: 'Handståendepress mot vägg (kort)', VP4: 'Handståendepress mot vägg',
  VP5: 'Handståendepress, djup', VP6: 'Fri handståendepress', VP7: 'Fri handståendepress, djup', VP8: '90°-armhävning',
  DP1: 'Stödhäng på barr', DP2: 'Negativa dips', DP3: 'Dips', DP4: 'Stödhäng i ringar', DP5: 'Dips i ringar', DP6: 'Dips med vikt', DP7: 'Avancerade ringdips',
  HS1: 'Pike-häng mot låda', HS2: 'Handstående med bröstet mot vägg', HS3: 'Handstående med axeltapp', HS4: 'Uppsparkar + tåtapp från vägg',
  HS5: 'Fritt handstående 5–10 s', HS6: 'Fritt handstående 30 s', HS7: 'Handstående 60 s + gång', HS8: 'Press till handstående', HS9: 'Enarmshandstående',
  PL0a: 'Planche lean', PL0b: 'Grodställning', PL1: 'Tuck planche', PL2: 'Avancerad tuck planche', PL3: 'Straddle planche', PL4: 'Full planche', PL5: 'Planche-armhävningar',
  VPu1: 'Aktivt häng + skulderblads-pull-ups', VPu2: 'Negativa pull-ups', VPu3: 'Pull-ups med band', VPu4: 'Pull-ups', VPu5: 'Pull-ups till bröstet',
  VPu6: 'Pull-ups med vikt', VPu7: 'Archer pull-ups', VPu8: 'Assisterad enarms-chin-up', VPu9: 'Enarms-chin-up',
  HPu1: 'Lutande ringrodd', HPu2: 'Vågrät rodd', HPu3: 'Rodd, fötterna upphöjda', HPu4: 'Archer-rodd / rodd med väst', HPu5: 'Front lever-rodd',
  MU0: 'Muscle-up: förkunskaper', MU1: 'Explosiva pull-ups', MU2: 'Övergångsövningar', MU3: 'Muscle-up med band', MU4: 'Muscle-up på stång', MU5: 'Muscle-up i ringar', MU6: 'Långsam / belastad muscle-up',
  FL0: 'Front lever: förkunskaper', FL1: 'Tuck front lever', FL2: 'Avancerad tuck front lever', FL3: 'Enbens front lever', FL4: 'Straddle front lever', FL5: 'Full front lever', FL6: 'Front lever-drag',
  BL0: 'German hang', BL0b: 'Skin the cat', BL1: 'Tuck back lever', BL2: 'Back lever',
  HF1: 'Vertikal flagga', HF2: 'Tuck-flagga', HF3: 'Straddle-flagga', HF4: 'Human flag',
  CC1: 'Hollow body', CC2: 'Hängande knälyft', CC3: 'Hängande benlyft', CC4: 'Toes to bar', CC5: 'L-sit', CC6: 'Kompressionsövningar', CC7: 'V-sit', CC8: 'Manna',
  SL1: 'Assisterad knäböj', SL2: 'Split squat', SL3: 'Bulgarian split squat', SL4: 'Box-pistol', SL5: 'Pistol med motvikt', SL6: 'Pistol squat', SL7: 'Pistol med vikt',
  H1: 'Höftlyft', H2: 'Höftlyft på ett ben', H3: 'Enbens-marklyft', H4: 'Enbens-marklyft med hantel', H5: 'Höftlyft med vikt',
  KF1: 'Bryggvandring', KF2: 'Glidande bencurl', KF3: 'Glidande bencurl, ett ben', KF4: 'Nordic med band', KF5: 'Nordic, excentrisk', KF6: 'Nordic, hel',
};

/**
 * Exercises that need equipment. If the athlete owns none of `any`, the exercise is
 * swapped for `alt` (and loses its ladder link, since the alternative is a different movement).
 */
export const EX_NEEDS: Record<string, { any: Equip[]; alt: { name: string; cue: string; demo?: string } }> = {
  'upperA:C': { any: ['bar', 'rings'], alt: { name: 'Hollow body hold', cue: 'Grunden för front lever: ländryggen i golvet', demo: 'CC1' } },
  'upperA:D2': { any: ['bar', 'rings'], alt: { name: 'Långsam bordsrodd (3 s ner)', cue: 'Brett grepp, dra bröstet mot kanten, sänk på 3 s', demo: 'HPu1' } },
  'upperA:E1': { any: ['dip', 'rings'], alt: { name: 'Dips mellan två stolar', cue: 'Bara stadiga stolar! Annars: diamantarmhävningar', demo: 'DP2' } },
  'upperA:E2': { any: ['bar', 'rings'], alt: { name: 'Bordsrodd', cue: 'Ligg under ett stadigt bord, dra bröstet mot kanten', demo: 'HPu1' } },
  'upperA:F1': { any: ['dumbbells', 'bands'], alt: { name: 'Sidolyft med vattenflaskor', cue: 'Led med armbågarna, långsamt ner', demo: 'lateral' } },
  'upperA:F2': { any: ['dumbbells', 'rings', 'bands'], alt: { name: 'Curl med ryggsäck', cue: 'Stilla armbågar, full sträckning' } },
  'lowerA:A': { any: ['bench'], alt: { name: 'Upphopp från knäböj', cue: 'Hoppa högt, landa tyst', demo: 'pogo' } },
  'upperB:B': { any: ['bar', 'rings'], alt: { name: 'Hollow body hold', cue: 'Grunden för front lever: ländryggen i golvet', demo: 'CC1' } },
  'upperB:D': { any: ['bar', 'rings'], alt: { name: 'Explosiv bordsrodd', cue: 'Dra snabbt, sänk långsamt', demo: 'HPu1' } },
  'upperB:E2': { any: ['bar', 'rings'], alt: { name: 'Bordsrodd', cue: 'Ligg under ett stadigt bord, dra bröstet mot kanten', demo: 'HPu1' } },
  'upperB:F1': { any: ['bar', 'rings'], alt: { name: 'Bordsrodd, underhandsgrepp', cue: 'Handflatorna mot dig, bröstet mot kanten', demo: 'HPu1' } },
  'upperB:G1': { any: ['dumbbells', 'bands'], alt: { name: 'Diamantarmhävningar', cue: 'Händerna ihop under bröstet', demo: 'HP3' } },
  'upperB:G2': { any: ['bands', 'dumbbells'], alt: { name: 'Y-T-lyft på mage', cue: 'Tummarna upp, kläm skulderbladen' } },
  'upperB:H': { any: ['bar', 'rings'], alt: { name: 'Liggande benlyft', cue: 'Ländryggen i golvet, långsamt ner', demo: 'CC1' } },
  'lowerB:G2': { any: ['bands'], alt: { name: 'Dead bug', cue: 'Ländryggen i golvet, motsatt arm och ben' } },
};

/** Levels that can't be trained without equipment (used when estimating a starting level). */
export const LEVEL_NEEDS: Record<string, Equip[]> = {
  HP4: ['rings'], HP7: ['weight'],
  DP1: ['dip', 'rings'], DP2: ['dip', 'rings'], DP3: ['dip', 'rings'], DP4: ['rings'], DP5: ['rings'], DP6: ['dip'], DP7: ['rings'],
  VPu1: ['bar', 'rings'], VPu2: ['bar', 'rings'], VPu3: ['bar', 'rings'], VPu4: ['bar', 'rings'], VPu5: ['bar'], VPu6: ['weight'],
  HPu1: ['rings', 'bar'], HPu2: ['rings', 'bar'], HPu3: ['rings', 'bar'], HPu4: ['rings'],
  FL1: ['bar', 'rings'], FL2: ['bar', 'rings'], CC2: ['bar', 'rings'], CC3: ['bar', 'rings'], CC4: ['bar'],
  SL3: ['bench'], SL4: ['bench'],
};

export const exKey = (session: string, slot: string) => `${session}:${slot}`;

/** "RIR 2" → plain Swedish effort. */
export function effortText(rir: string): string {
  const n = parseInt(rir, 10);
  if (Number.isNaN(n)) {
    if (/hold reserve/i.test(rir)) return 'Sluta 2–3 s innan formen brister';
    if (/RPE/i.test(rir)) return 'Lugnt – ska kännas lätt';
    if (/max intent|quality|height/i.test(rir)) return 'Max fart, sluta när det blir sämre';
    return rir;
  }
  if (n >= 4) return 'Lätt – långt kvar';
  if (n === 3) return 'Lätt – 3 reps kvar';
  if (n === 2) return 'Lagom – 2 reps kvar';
  if (n === 1) return 'Tungt – 1 rep kvar';
  return 'Max';
}

/** "3-1-X-0" → "3 s ner · 1 s paus · explosivt upp". */
export function tempoText(tempo: string): string | null {
  if (!/^\d/.test(tempo)) return /static/i.test(tempo) ? 'Håll stilla' : null;
  const [down, pause, up, top] = tempo.split('-');
  const parts: string[] = [];
  if (down && down !== '0') parts.push(`${down} s ner`);
  if (pause && pause !== '0') parts.push(`${pause} s paus`);
  if (up) parts.push(up === 'X' ? 'explosivt upp' : `${up} s upp`);
  if (top && top !== '0') parts.push(`${top} s i toppen`);
  return parts.join(' · ');
}

/** Effort choices when logging a set, mapped to stored RIR. */
export const EFFORTS: { label: string; rir: number }[] = [
  { label: 'Lätt', rir: 3 },
  { label: 'Lagom', rir: 2 },
  { label: 'Tungt', rir: 1 },
  { label: 'Max', rir: 0 },
];

/** Swedish session names and one-line summaries. */
export const SESSION_SV: Record<string, { title: string; short: string }> = {
  upperA: { title: 'Överkropp A', short: 'Handstående, planche, pull-ups och dips' },
  lowerA: { title: 'Ben A', short: 'Hopp, enbensknäböj, baksida lår och vader' },
  upperB: { title: 'Överkropp B', short: 'Front lever, explosiva drag, armhävningar och rodd' },
  lowerB: { title: 'Ben B', short: 'Bulgarian split squat, höftlyft och stabilitet' },
  skill: { title: 'Teknik + kondition', short: 'Handstående, kompression och lätt kondition' },
  recovery: { title: 'Återhämtning', short: 'Mikroträning, promenad och rörlighet' },
  rest: { title: 'Vila', short: 'Vilodag' },
};

export const TEST_SV: Record<string, string> = { A: 'Test: överkropp', B: 'Test: ben + bål', C: 'Test: rörlighet', mini: 'Minitest' };

export const LADDER_SV: Record<string, string> = {
  HP: 'Armhävningar', VP: 'Press över huvudet', DP: 'Dips', HS: 'Handstående', PL: 'Planche', VPu: 'Pull-ups', HPu: 'Rodd',
  MU: 'Muscle-up', FL: 'Front lever', BL: 'Back lever', HF: 'Human flag', CC: 'Bål & kompression', SL: 'Enbensknäböj', H: 'Höft & baksida', KF: 'Baksida lår (Nordic)',
};

export const WARMUP_SV: Record<string, { title: string; steps: string[] }> = {
  push: {
    title: 'Uppvärmning (8 min)',
    steps: ['2 min hopp på stället eller hopprep', 'Handledsuppvärmning', 'Band dislocates ×10', 'Skulderblads-armhävningar ×10', 'Stödhäng 30 s', 'Utåtrotation med band + handledscurl 1×15', '5 lätta armhävningar'],
  },
  pull: {
    title: 'Uppvärmning (8 min)',
    steps: ['2 min hopp på stället eller hopprep', 'Handledsuppvärmning', 'Band dislocates ×10', 'Skulderblads-pull-ups ×8', 'German hang med fötterna i golvet 15–20 s', 'Utåtrotation med band 1×15', '3 lätta pull-ups'],
  },
  legs: {
    title: 'Uppvärmning (8 min)',
    steps: ['2–3 min lätt kondition', 'Knä-mot-vägg för fotleden ×10/sida', '10 djupa knäböj', '10 höftlyft', '5 lätta split squats/ben', '10 lätta pogohopp'],
  },
  handstand: {
    title: 'Uppvärmning (8 min)',
    steps: ['Handledsuppvärmning 2–3 min', 'Skulderblads-armhävningar ×10', 'Väggglid ×8', 'Band dislocates ×10', 'Pike-häng mot låda 2×20 s', 'Utåtrotation med band + handledscurl 1×15'],
  },
};
