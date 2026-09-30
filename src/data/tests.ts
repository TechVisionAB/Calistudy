// Baseline test battery — Section 7 (Week 0), 10.5 (mini-retest) and 19 (Day 1) of docs/guide.md.

export type Values = Record<string, number | undefined>;

export type Placement = { ladder: string; level: string; note?: string };

export type TestInput = { key: string; label: string; unit: string };

export type TestItem = {
  id: string;
  name: string;
  how: string;
  counts?: string;
  stop?: string;
  interpretation: string;
  inputs: TestInput[];
  place?: (v: Values) => Placement | null;
};

export type CheckItem = { id: string; name: string; how: string; pass: string; fail: string };

const has = (n: number | undefined): n is number => typeof n === 'number' && !Number.isNaN(n);

export const GENERAL_RULES = [
  'Test when rested: 48 h after your last hard session, normal sleep.',
  'All rep tests are to technical failure (the first rep that breaks the standard doesn’t count), tempo 2 s down, no bounce.',
  'Rest 3–5 min between tests.',
  'Stop any test immediately for joint pain ≥3/10, sharp or pinching pain, or pain rising within a set.',
  'Film the handstand, the planche lean and one pull-up set from the side.',
];

export const TEST_A: TestItem[] = [
  {
    id: 'hs',
    name: 'Wall handstand (chest-to-wall)',
    how: 'Walk up to CTW, hands 10–20 cm from wall.',
    counts: 'Straight arms, ribs down, shoulders open',
    stop: 'Shape breaks or wrist pain',
    interpretation: '<20 s → HS1; 20–59 s → HS2; ≥60 s → HS3/HS4 test (toe pulls)',
    inputs: [{ key: 'hs', label: 'Hålltid', unit: 's' }],
    place: ({ hs }) => (has(hs) ? { ladder: 'HS', level: hs < 20 ? 'HS1' : hs < 60 ? 'HS2' : 'HS3' } : null),
  },
  {
    id: 'lean',
    name: 'Planche lean',
    how: 'Push-up position, protract, lean shoulders forward ~10 cm.',
    counts: 'Straight elbows, protracted',
    stop: 'Elbows bend',
    interpretation: '<20 s → PL0a; ≥20 s + dips ≥10 → test tuck planche (≥6 s → PL1)',
    inputs: [
      { key: 'lean', label: 'Lean-hållning', unit: 's' },
      { key: 'tuckPl', label: 'Tuck planche (om lean ≥20 s och dips ≥10)', unit: 's' },
    ],
    place: ({ lean, tuckPl, dips }) => {
      if (!has(lean)) return null;
      if (lean >= 20 && has(dips) && dips >= 10 && has(tuckPl) && tuckPl >= 6) return { ladder: 'PL', level: 'PL1' };
      return { ladder: 'PL', level: 'PL0a' };
    },
  },
  {
    id: 'fl',
    name: 'Front lever (tuck)',
    how: 'Tuck FL from hang (only if you can do ≥8 pull-ups).',
    counts: 'Hips at shoulder height, arms straight',
    stop: 'Hips drop',
    interpretation: 'Pull-ups <8 → FL0 (prereqs); otherwise tuck ≥6 s → FL1; adv tuck ≥10 s → FL2',
    inputs: [
      { key: 'tuckFl', label: 'Tuck FL', unit: 's' },
      { key: 'advFl', label: 'Advanced tuck FL', unit: 's' },
    ],
    place: ({ pullups, tuckFl, advFl }) => {
      if (!has(pullups) && !has(tuckFl)) return null;
      if (has(pullups) && pullups < 8) return { ladder: 'FL', level: 'FL0' };
      if (has(advFl) && advFl >= 10) return { ladder: 'FL', level: 'FL2' };
      if (has(tuckFl) && tuckFl >= 6) return { ladder: 'FL', level: 'FL1' };
      return { ladder: 'FL', level: 'FL0' };
    },
  },
  {
    id: 'pullups',
    name: 'Pull-ups (pronated)',
    how: 'Dead hang, elbows straight; chin clearly over bar.',
    counts: 'No kip, full hang each rep',
    stop: 'Kip needed or incomplete ROM',
    interpretation: '0 → test negatives (≥5 s ×3 → VPu3, else VPu1–2); 1–4 → VPu3; 5–9 → VPu4; 10–14 → VPu4 + test C2B (≥3 → VPu5); ≥15 → VPu6 weighted',
    inputs: [
      { key: 'pullups', label: 'Max pull-ups', unit: 'reps' },
      { key: 'negatives', label: 'Om 0: antal negativer ≥5 s', unit: 'reps' },
      { key: 'c2b', label: 'Om 10–14: chest-to-bar', unit: 'reps' },
    ],
    place: ({ pullups, negatives, c2b }) => {
      if (!has(pullups)) return null;
      if (pullups === 0) {
        if (has(negatives) && negatives >= 3) return { ladder: 'VPu', level: 'VPu3' };
        return { ladder: 'VPu', level: has(negatives) && negatives > 0 ? 'VPu2' : 'VPu1' };
      }
      if (pullups <= 4) return { ladder: 'VPu', level: 'VPu3' };
      if (pullups <= 9) return { ladder: 'VPu', level: 'VPu4' };
      if (pullups <= 14) return { ladder: 'VPu', level: has(c2b) && c2b >= 3 ? 'VPu5' : 'VPu4' };
      return { ladder: 'VPu', level: 'VPu6' };
    },
  },
  {
    id: 'pike',
    name: 'Pike push-ups',
    how: 'Hips high, head travels forward to form a tripod.',
    counts: 'Head touches floor lightly',
    stop: 'Form break',
    interpretation: '<5 → VP1 at easier incline (hands on box); 5–12 → VP1; ≥12 → test elevated pike: ≥6 → VP2; ≥10 → test wall HSPU partial',
    inputs: [
      { key: 'pike', label: 'Max pike push-ups', unit: 'reps' },
      { key: 'elevPike', label: 'Om ≥12: elevated pike', unit: 'reps' },
    ],
    place: ({ pike, elevPike }) => {
      if (!has(pike)) return null;
      if (pike < 5) return { ladder: 'VP', level: 'VP1', note: 'Hands on box (easier incline)' };
      if (pike >= 12 && has(elevPike) && elevPike >= 6) {
        return { ladder: 'VP', level: 'VP2', note: elevPike >= 10 ? 'Test wall HSPU partial (VP3)' : undefined };
      }
      return { ladder: 'VP', level: 'VP1' };
    },
  },
  {
    id: 'dips',
    name: 'Dips (parallel bars)',
    how: 'Start locked out, shoulders depressed, descend until shoulder is just below elbow.',
    counts: 'Full depth, lockout',
    stop: 'Shoulder pain; loss of depth',
    interpretation: "Can't do 1 → support hold (<60 s → DP1; ≥60 s → DP2); 1–9 → DP2/DP3 (DP3 if ≥5); ≥10 → DP3, test ring support; ≥15 → DP6 (weighted)",
    inputs: [
      { key: 'dips', label: 'Max dips', unit: 'reps' },
      { key: 'support', label: 'Om 0: support hold', unit: 's' },
    ],
    place: ({ dips, support }) => {
      if (!has(dips)) return null;
      if (dips === 0) return { ladder: 'DP', level: has(support) && support >= 60 ? 'DP2' : 'DP1' };
      if (dips < 5) return { ladder: 'DP', level: 'DP2' };
      if (dips < 15) return { ladder: 'DP', level: 'DP3', note: dips >= 10 ? 'Test ring support (DP4)' : undefined };
      return { ladder: 'DP', level: 'DP6' };
    },
  },
  {
    id: 'rows',
    name: 'Rows (rings/bar, body horizontal)',
    how: 'Straight body, feet on floor, chest to hands.',
    counts: 'Full ROM, 1 s squeeze',
    stop: 'Hip sag',
    interpretation: '<8 → HPu1; 8–14 → HPu2; ≥15 → HPu3',
    inputs: [{ key: 'rows', label: 'Max rows', unit: 'reps' }],
    place: ({ rows }) => (has(rows) ? { ladder: 'HPu', level: rows < 8 ? 'HPu1' : rows < 15 ? 'HPu2' : 'HPu3' } : null),
  },
  {
    id: 'pushups',
    name: 'Push-ups',
    how: 'Hands shoulder-width, body rigid, chest to a fist-height object, full lockout.',
    counts: 'Full ROM, no hip sag/pike',
    stop: 'Form break or 2 s pause at bottom',
    interpretation: '<5 → HP1; 5–14 → HP2; 15–25 → test diamond: ≥8 → HP3/HP4; ≥26 → test archer: ≥5/side → HP5',
    inputs: [
      { key: 'pushups', label: 'Max push-ups', unit: 'reps' },
      { key: 'diamond', label: 'Om 15–25: diamond', unit: 'reps' },
      { key: 'archer', label: 'Om ≥26: archer', unit: 'reps/side' },
    ],
    place: ({ pushups, diamond, archer }) => {
      if (!has(pushups)) return null;
      if (pushups < 5) return { ladder: 'HP', level: 'HP1' };
      if (pushups < 15) return { ladder: 'HP', level: 'HP2' };
      if (pushups <= 25) return { ladder: 'HP', level: has(diamond) && diamond >= 8 ? 'HP3' : 'HP2' };
      return { ladder: 'HP', level: has(archer) && archer >= 5 ? 'HP5' : 'HP4' };
    },
  },
  {
    id: 'chins',
    name: 'Chin-ups (supinated)',
    how: 'Same standard as pull-ups.',
    interpretation: 'Record. Chins > pull-ups by >3 is normal; use chins for accessory volume.',
    inputs: [{ key: 'chins', label: 'Max chin-ups', unit: 'reps' }],
  },
];

export const TEST_B: TestItem[] = [
  {
    id: 'squat',
    name: 'Bodyweight squat',
    how: 'Feet shoulder-width, hip crease below knee, heels down.',
    interpretation: "Can't reach depth with heels down → ankle/hip mobility priority.",
    inputs: [{ key: 'squatDepth', label: 'Full djup med hälar i golvet? (1 = ja, 0 = nej)', unit: '' }],
  },
  {
    id: 'sl',
    name: 'Split squat → Bulgarian → box pistol → pistol',
    how: 'Split squat: rear knee lightly touches pad. BSS: rear foot on knee-height bench. Box pistol: descend on one leg to box (45 → 30 → 15 cm), stand up without rocking.',
    interpretation: 'Split squat <12 → SL2; BSS <10 → SL3; box pistol 45 cm ×5 → SL4 (lowest height with ×5 sets your box height); full pistol ×3 → SL6',
    inputs: [
      { key: 'split', label: 'Split squat per ben', unit: 'reps' },
      { key: 'bss', label: 'Bulgarian split squat per ben', unit: 'reps' },
      { key: 'boxHeight', label: 'Lägsta lådhöjd med ×5', unit: 'cm' },
      { key: 'pistol', label: 'Full pistol', unit: 'reps' },
    ],
    place: ({ split, bss, boxHeight, pistol }) => {
      if (has(pistol) && pistol >= 3) return { ladder: 'SL', level: 'SL6' };
      if (has(boxHeight) && boxHeight > 0) return { ladder: 'SL', level: 'SL4', note: `Box ${boxHeight} cm` };
      if (has(bss)) return { ladder: 'SL', level: 'SL3' };
      if (has(split)) return { ladder: 'SL', level: split < 12 ? 'SL2' : 'SL3' };
      return null;
    },
  },
  {
    id: 'calf',
    name: 'Single-leg calf raise (step, full stretch)',
    how: '1 s up, 1 s down, full ROM.',
    interpretation: 'Record per leg. <15 → bilateral + loaded; ≥20 → single-leg loaded',
    inputs: [{ key: 'calf', label: 'Reps (sämsta benet)', unit: 'reps' }],
  },
  {
    id: 'hlr',
    name: 'Hanging leg raise',
    how: 'Straight legs to 90° without swing.',
    interpretation: '0 → CC2; 1–9 → CC3; ≥10 → CC4',
    inputs: [{ key: 'hlr', label: 'Reps', unit: 'reps' }],
    place: ({ hlr }) => (has(hlr) ? { ladder: 'CC', level: hlr === 0 ? 'CC2' : hlr < 10 ? 'CC3' : 'CC4' } : null),
  },
  {
    id: 'lsit',
    name: 'L-sit (floor/parallettes)',
    how: 'Straight legs, hips off floor, legs ≥ horizontal.',
    interpretation: 'Tuck <15 s → tuck L-sit; full <10 s → full at short holds; ≥20 s full → V-sit work',
    inputs: [
      { key: 'lsitTuck', label: 'Tuck L-sit', unit: 's' },
      { key: 'lsitFull', label: 'Full L-sit', unit: 's' },
    ],
  },
  {
    id: 'hollow',
    name: 'Hollow body hold',
    how: 'Low back pressed to floor, arms overhead.',
    interpretation: '<30 s → tuck hollow; ≥45 s → full',
    inputs: [{ key: 'hollow', label: 'Hålltid', unit: 's' }],
  },
  {
    id: 'arch',
    name: 'Arch (superman) hold',
    how: 'Chest and thighs off floor, glutes on.',
    interpretation: '<30 s → include arch holds in micro-practice',
    inputs: [{ key: 'arch', label: 'Hålltid', unit: 's' }],
  },
  {
    id: 'hinge',
    name: 'Single-leg glute bridge / SL-RDL',
    how: '10 reps each, level pelvis, balance.',
    interpretation: 'Places H2–H4',
    inputs: [
      { key: 'slBridge', label: 'SL glute bridge (rena reps)', unit: 'reps' },
      { key: 'slRdl', label: 'SL-RDL kroppsvikt (rena reps)', unit: 'reps' },
    ],
    place: ({ slBridge, slRdl }) => {
      if (has(slRdl) && slRdl >= 10) return { ladder: 'H', level: 'H4' };
      if (has(slBridge) && slBridge >= 10) return { ladder: 'H', level: 'H3' };
      if (has(slBridge) || has(slRdl)) return { ladder: 'H', level: 'H2' };
      return null;
    },
  },
  {
    id: 'nordic',
    name: 'Nordic eccentric',
    how: 'Kneel, ankles anchored, lower slowly.',
    interpretation: '<3 s control → KF1–3; 3–5 s → KF4; ≥5 s → KF5',
    inputs: [{ key: 'nordic', label: 'Kontrollerad tid', unit: 's' }],
    place: ({ nordic }) =>
      has(nordic)
        ? { ladder: 'KF', level: nordic < 3 ? 'KF2' : nordic < 5 ? 'KF4' : 'KF5', note: nordic < 3 ? 'KF1–3: pick the level you can do 3×10' : undefined }
        : null,
  },
];

export const TEST_C: CheckItem[] = [
  { id: 'overhead', name: 'Overhead (wall) shoulder flexion', how: 'Back, head and hips against wall; ribs down; raise straight arms.', pass: 'Thumbs touch the wall without arching', fail: 'Daily overhead mobility; keep HS on wall; no freestanding press work' },
  { id: 'wrist', name: 'Wrist extension', how: 'Quadruped, palms flat, shift knees forward.', pass: '~90° forearm-to-hand angle without pain', fail: 'Daily wrist protocol; use parallettes for push work' },
  { id: 'pike', name: 'Hamstring (seated pike)', how: 'Legs straight, reach forward.', pass: 'Fingertips to toes', fail: 'Compression and pike mobility in micro-practice (limits L-sit/V-sit/press)' },
  { id: 'ankle', name: 'Ankle dorsiflexion (knee-to-wall)', how: 'Knee touches wall with heel down.', pass: '≥10–12 cm toe-to-wall', fail: 'Ankle mobility daily + heel-elevated pistol variants' },
  { id: 'shoulderExt', name: 'Shoulder extension (German hang)', how: 'Hang from rings/bar, feet assisting.', pass: '20–30 s comfortable', fail: 'No back lever; gradual German hang exposure' },
  { id: 'pancake', name: 'Pancake / straddle', how: 'Seated straddle, fold forward.', pass: 'Chest reaches ~45°', fail: 'Optional; affects straddle planche/FL and press' },
];

export const MINI_RETEST = [
  'Max pull-ups, max push-ups at your HP level, max dips',
  'Best CTW or freestanding HS hold',
  'Best planche/FL level holds',
  'L-sit max',
  'Box pistol lowest height ×5',
  'Nordic control time',
];

export const DAY1_ORDER = [
  'Wall handstand hold (CTW)',
  'Planche lean hold',
  'Tuck FL hold (only if you can do ≥8 pull-ups)',
  'Max pull-ups',
  'Max pike push-ups',
  'Max dips',
  'Max rows',
  'Max push-ups',
  'Max chin-ups',
];

export function placements(items: TestItem[], values: Values): Placement[] {
  return items.map((t) => t.place?.(values) ?? null).filter((p): p is Placement => p !== null);
}
