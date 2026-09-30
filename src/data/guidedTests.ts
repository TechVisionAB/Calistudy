// Guided, one-at-a-time version of the Week 0 tests (Section 7). Each answer is a big
// button or a stopwatch; follow-up tests only appear when the result makes them relevant.
// Button values are the lower bound of each range, so the guide's placement rules
// (TEST_A / TEST_B in tests.ts) give the same result as typing the exact number.
import { Equip } from './sv';
import { TestBattery } from './program';
import { Placement, Values } from './tests';

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
  /** Equipment the test needs; without it the `alt` test is used instead. */
  needs?: Equip[];
  /** Label for the "can't" button. With an `alt`, pressing it opens the easier variant. */
  skipLabel?: string;
  /** Easier or equipment-free variant. It may share the main test's key (same scoring) or bring its own `place`. */
  alt?: GuidedStep;
  /** Direct placement for alternative tests whose result isn't covered by the guide's rules. */
  place?: (v: number) => Placement;
  /** Set on steps that replace a test because equipment is missing. */
  noEquipment?: boolean;
  replaces?: string;
};

const r = (...pairs: [string, number][]): Choice[] => pairs.map(([label, value]) => ({ label, value }));
const has = (n: number | undefined) => typeof n === 'number';

// ---- Easier / equipment-free alternatives ----
const HS_ALT: GuidedStep = {
  key: 'hsPike', title: 'Pike hold on a chair', media: 'HS1', kind: 'hold',
  how: 'Feet on a chair, hands on the floor, hips high so your upper body is almost vertical. Hold with straight arms. This is the first step toward a handstand – no risk of tipping over.',
  place: () => ({ ladder: 'HS', level: 'HS1' }),
};
const TABLE_ROW: GuidedStep = {
  key: 'rows', title: 'Table row', media: 'HPu1', kind: 'choice',
  how: 'Lie on your back under a sturdy table, grip the edge and pull your chest to the table with a straight body. How many?',
  choices: r(['0–7', 0], ['8–14', 8], ['15+', 15]),
};
const CHAIR_DIPS: GuidedStep = {
  key: 'dips', title: 'Dips between two chairs', media: 'DP2', kind: 'choice',
  how: 'Two sturdy chairs (or a kitchen counter corner). Start with straight arms, lower until your shoulders are level with your elbows, and push up. How many?',
  choices: r(['0', 0], ['1–4', 1], ['5–9', 5], ['10–14', 10], ['15+', 15]),
};
const HOLLOW: GuidedStep = {
  key: 'hollow', title: 'Hollow body', media: 'CC1', kind: 'hold', skipLabel: "Can't do it at all",
  how: 'Lie on your back, press your lower back into the floor and lift your shoulders and straight legs a little. Hold – this is the foundation for the front lever.',
  place: () => ({ ladder: 'FL', level: 'FL0' }),
};
const PLANK: GuidedStep = {
  key: 'plank', title: 'Straight-arm plank', media: 'HP2', kind: 'hold', skipLabel: "Can't do it at all",
  how: 'Push-up position with straight arms and a straight body. Hold. This builds the strength you need to lean forward later.',
  place: () => ({ ladder: 'PL', level: 'PL0a' }),
};
const FROG: GuidedStep = {
  key: 'frog', title: 'Frog stand', media: 'PL0b', kind: 'hold', skipLabel: "Can't do it at all",
  how: 'Squat with your hands on the floor and knees against your elbows. Lean forward until your feet lift. Hold.',
  place: (v) => ({ ladder: 'PL', level: v >= 10 ? 'PL0b' : 'PL0a' }),
};
const LYING_LEG: GuidedStep = {
  key: 'lyingLeg', title: 'Lying leg raise', media: 'CC1', kind: 'choice',
  how: 'Lie on your back with your lower back on the floor. Raise straight legs to vertical and lower slowly. How many?',
  choices: r(['0–9', 0], ['10+', 10]),
  place: () => ({ ladder: 'CC', level: 'CC1' }),
};
const SLIDE_CURL: GuidedStep = {
  key: 'slide', title: 'Sliding leg curl', media: 'KF2', kind: 'choice',
  how: 'Lie on your back with your heels on a towel. Lift your hips, pull your heels toward your butt and slide them out again. How many?',
  choices: r(['0–4', 0], ['5–9', 5], ['10+', 10]),
  place: (v) => ({ ladder: 'KF', level: v >= 10 ? 'KF3' : v >= 5 ? 'KF2' : 'KF1' }),
};

export const GUIDED: Record<Exclude<TestBattery, 'C'>, GuidedStep[]> = {
  A: [
    { key: 'hs', title: 'Wall handstand', how: 'Walk your feet up the wall until your stomach almost touches it, hands 10–20 cm from the wall. Hold as long as your arms stay straight.', media: 'HS2', kind: 'hold', skipLabel: "Can't do it / Not comfortable", alt: HS_ALT },
    { key: 'pullups', title: 'Pull-ups', how: 'From straight arms, chin over the bar. No swinging. How many in a row?', media: 'VPu4', kind: 'choice', choices: r(['0', 0], ['1–4', 1], ['5–7', 5], ['8–9', 8], ['10–14', 10], ['15+', 15]), needs: ['bar', 'rings'], alt: TABLE_ROW },
    { key: 'negatives', title: 'Slow negatives', how: 'Jump up so your chin is over the bar and lower yourself as slowly as you can (at least 5 s). How many times can you do it?', media: 'VPu2', kind: 'choice', choices: r(['0', 0], ['1–2', 1], ['3 or more', 3]), when: (v) => v.pullups === 0, needs: ['bar', 'rings'] },
    { key: 'c2b', title: 'Chest to bar', how: 'Pull all the way until your chest touches the bar. How many?', media: 'VPu5', kind: 'choice', choices: r(['0–2', 0], ['3 or more', 3]), when: (v) => has(v.pullups) && v.pullups! >= 10 && v.pullups! < 15, needs: ['bar'] },
    { key: 'tuckFl', title: 'Tuck front lever', how: 'Hang from the bar, pull your knees up and lean back until your back is horizontal under the bar. Straight arms. Hold as long as you can.', media: 'FL1', kind: 'hold', when: (v) => has(v.pullups) && v.pullups! >= 8, needs: ['bar', 'rings'], skipLabel: "Can't do it", alt: HOLLOW },
    { key: 'advFl', title: 'Advanced tuck front lever', how: 'Same as before, but with a flat back and knees further from your chest.', media: 'FL2', kind: 'hold', when: (v) => has(v.tuckFl) && v.tuckFl! >= 10, needs: ['bar', 'rings'], skipLabel: "Can't do it" },
    { key: 'dips', title: 'Dips', how: 'Start with straight arms, lower until your shoulder is just below your elbow, and push up. How many?', media: 'DP3', kind: 'choice', choices: r(['0', 0], ['1–4', 1], ['5–9', 5], ['10–14', 10], ['15+', 15]), needs: ['dip', 'rings'], alt: CHAIR_DIPS },
    { key: 'support', title: 'Support hold', how: 'Hold yourself up on straight arms with your shoulders pushed down.', media: 'DP1', kind: 'hold', when: (v) => v.dips === 0, skipLabel: "Can't do it" },
    { key: 'lean', title: 'Planche lean', how: 'Push-up position with straight arms. Round your upper back and lean your shoulders about 10 cm forward past your hands. Hold.', media: 'PL0a', kind: 'hold', skipLabel: "Can't do it", alt: PLANK },
    { key: 'tuckPl', title: 'Tuck planche', how: 'Knees to chest, lean forward and lift your feet off the floor on straight arms. Hold.', media: 'PL1', kind: 'hold', when: (v) => has(v.lean) && v.lean! >= 20 && has(v.dips) && v.dips! >= 10, skipLabel: "Can't do it", alt: FROG },
    { key: 'pike', title: 'Pike push-ups', how: 'Hips high like an upside-down V. Lower your head to the floor in front of your hands and push up. How many?', media: 'VP1', kind: 'choice', choices: r(['0–4', 0], ['5–11', 5], ['12+', 12]) },
    { key: 'elevPike', title: 'Pike push-ups, feet on a box', how: 'Same movement but with your feet on a chair or box. How many?', media: 'VP2', kind: 'choice', choices: r(['0–5', 0], ['6–9', 6], ['10+', 10]), when: (v) => has(v.pike) && v.pike! >= 12 },
    { key: 'rows', title: 'Rows', how: 'Hang under rings, a bar or a sturdy table with a straight body and heels on the floor. Pull your chest up. How many?', media: 'HPu2', kind: 'choice', choices: r(['0–7', 0], ['8–14', 8], ['15+', 15]) },
    { key: 'pushups', title: 'Push-ups', how: 'Straight body, chest down to a fist’s height from the floor. How many?', media: 'HP2', kind: 'choice', choices: r(['0–4', 0], ['5–14', 5], ['15–25', 15], ['26+', 26]) },
    { key: 'diamond', title: 'Diamond push-ups', how: 'Hands together under your chest. How many?', media: 'HP3', kind: 'choice', choices: r(['0–7', 0], ['8+', 8]), when: (v) => has(v.pushups) && v.pushups! >= 15 && v.pushups! < 26 },
    { key: 'archer', title: 'Archer push-ups', how: 'Wide hands, lower toward one hand with the other arm straight. How many per side?', media: 'HP5', kind: 'choice', choices: r(['0–4', 0], ['5+', 5]), when: (v) => has(v.pushups) && v.pushups! >= 26 },
  ],
  B: [
    { key: 'split', title: 'Split squat', how: 'Stationary lunge, rear knee lightly touches the floor. How many per leg?', media: 'SL2', kind: 'choice', choices: r(['0–11', 0], ['12+', 12]) },
    { key: 'bss', title: 'Bulgarian split squat', how: 'Same thing, but with your rear foot on a chair or bench. How many per leg?', media: 'SL3', kind: 'choice', choices: r(['0–11', 0], ['12+', 12]), when: (v) => has(v.split) && v.split! >= 12 },
    { key: 'boxHeight', title: 'Single-leg squat to box', how: 'Sit down on one leg onto a box/chair and stand up without rocking. What is the lowest height you can do 5 times?', media: 'SL4', kind: 'choice', choices: r(["Can't do it", 0], ['Chair (≈45 cm)', 45], ['Low stool (≈30 cm)', 30], ['Almost floor (≈15 cm)', 15]), when: (v) => has(v.bss) && v.bss! >= 12 },
    { key: 'pistol', title: 'Full pistol squat', how: 'All the way down on one leg without a box, heel on the floor. Can you do 3?', media: 'SL6', kind: 'choice', choices: r(['No', 0], ['Yes', 3]), when: (v) => v.boxHeight === 15 },
    { key: 'hlr', title: 'Hanging leg raise', how: 'Hang from the bar and raise straight legs to horizontal without swinging. How many?', media: 'CC3', kind: 'choice', choices: r(['0', 0], ['1–9', 1], ['10+', 10]), needs: ['bar', 'rings'], alt: LYING_LEG },
    { key: 'slBridge', title: 'Single-leg glute bridge', how: 'Lie on your back, one foot on the floor, lift your hips. Can you do 10 with level hips?', media: 'H2', kind: 'choice', choices: r(['No', 5], ['Yes', 10]) },
    { key: 'slRdl', title: 'Single-leg RDL', how: 'Stand on one leg and hinge your hips back with a flat back. Can you do 10 with good balance?', media: 'H3', kind: 'choice', choices: r(['No', 5], ['Yes', 10]), when: (v) => v.slBridge === 10 },
    { key: 'nordic', title: 'Nordic', how: 'Kneel with your feet anchored (under a sofa). Fall forward slowly with straight hips. Start the timer when you begin to fall, stop it when you lose control.', media: 'KF5', kind: 'hold', skipLabel: "Can't do it", alt: SLIDE_CURL },
  ],
  mini: [
    { key: 'hs', title: 'Wall handstand', how: 'Hold as long as your arms stay straight.', media: 'HS2', kind: 'hold', skipLabel: "Can't do it / Not comfortable", alt: HS_ALT },
    { key: 'pullups', title: 'Pull-ups', how: 'How many in a row?', media: 'VPu4', kind: 'choice', choices: r(['0', 0], ['1–4', 1], ['5–9', 5], ['10–14', 10], ['15+', 15]), needs: ['bar', 'rings'], alt: TABLE_ROW },
    { key: 'dips', title: 'Dips', how: 'How many?', media: 'DP3', kind: 'choice', choices: r(['0', 0], ['1–4', 1], ['5–9', 5], ['10–14', 10], ['15+', 15]), needs: ['dip', 'rings'], alt: CHAIR_DIPS },
    { key: 'boxHeight', title: 'Single-leg squat to box', how: 'Lowest height you can do 5 times per leg?', media: 'SL4', kind: 'choice', choices: r(["Can't do it", 0], ['Chair (≈45 cm)', 45], ['Low stool (≈30 cm)', 30], ['Almost floor (≈15 cm)', 15]) },
    { key: 'nordic', title: 'Nordic', how: 'Fall forward slowly with straight hips. Stop when you lose control.', media: 'KF5', kind: 'hold', skipLabel: "Can't do it", alt: SLIDE_CURL },
  ],
};

/**
 * Steps to ask, in order. A test whose equipment is missing is replaced by its
 * home alternative (never silently dropped); tests without an alternative are skipped.
 */
export function activeSteps(battery: Exclude<TestBattery, 'C'>, values: Values, equipment: Equip[] | null): GuidedStep[] {
  const out: GuidedStep[] = [];
  for (const s of GUIDED[battery]) {
    if (s.when && !s.when(values)) continue;
    const missing = s.needs && equipment && !s.needs.some((e) => equipment.includes(e));
    if (!missing) out.push(s);
    else if (s.alt) out.push({ ...s.alt, noEquipment: true, replaces: s.title });
  }
  return out;
}

/** Placements from alternative tests that carry their own scoring. */
export function altPlacements(values: Values): Placement[] {
  const alts = Object.values(GUIDED).flatMap((steps) => steps.map((s) => s.alt).filter((a): a is GuidedStep => !!a?.place));
  const seen = new Set<string>();
  return alts
    .filter((a) => values[a.key] !== undefined && !seen.has(a.key) && seen.add(a.key))
    .map((a) => a.place!(values[a.key]!));
}
