// Weekly sessions — Section 10.4 (Block 1) and 10.6 (Block 2 rules) of docs/guide.md.

export type Unit = 'reps' | 'reps/side' | 'reps/leg' | 's' | 's/side' | 'attempts';

/**
 * skill: handstand/statics · main: bent-arm strength · accessory: F/G hypertrophy slots
 * (get +1 set in weeks 3–5 and 9–11) · core · plyo: dropped in deload weeks.
 */
export type Role = 'skill' | 'main' | 'accessory' | 'core' | 'plyo';

export type Exercise = {
  slot: string;
  name: string;
  ladder?: string;
  sets: number;
  min: number;
  max: number;
  unit: Unit;
  rest: string;
  restSec: number;
  rir: string;
  tempo: string;
  cue: string;
  role: Role;
  /** Demo media key (videos.json / animations) for exercises without a ladder. */
  demo?: string;
};

export type SessionId = 'upperA' | 'lowerA' | 'recovery' | 'upperB' | 'lowerB' | 'skill' | 'rest';

export type Session = {
  id: SessionId;
  title: string;
  short: string;
  duration: string;
  warmup?: WarmupId;
  intro?: string;
  exercises: Exercise[];
  /** Text steps for sessions that aren't set/rep based. */
  steps?: string[];
  /** Block 2 (weeks 7–11) IF/THEN changes for this session. */
  block2?: string[];
};

export type WarmupId = 'push' | 'pull' | 'legs' | 'handstand';

// The guide refers to named warm-ups in "Section 15" without listing them;
// these are built from the Day 1 warm-up (Section 19) plus the prehab note in Section 15.
export const WARMUPS: Record<WarmupId, { title: string; steps: string[]; demos: { key: string; label: string }[] }> = {
  push: {
    title: 'Push + planche (≈8 min)',
    demos: [{ key: 'wrist', label: 'Handledsuppvärmning' }, { key: 'dislocates', label: 'Band dislocates' }, { key: 'scap', label: 'Scap push-ups' }, { key: 'DP1', label: 'Support hold' }],
    steps: [
      '2 min easy jumping jacks or skipping',
      'Wrist protocol (palm pulses, back-of-hand push-ups, finger rocks)',
      'Band dislocates ×10',
      'Scap push-ups ×10',
      '30 s support hold',
      'Band external rotation 1×15 + wrist curls 1×15 (prehab)',
      '1 easy set of 5 push-ups',
    ],
  },
  pull: {
    title: 'Pull + front lever (≈8 min)',
    demos: [{ key: 'wrist', label: 'Handledsuppvärmning' }, { key: 'dislocates', label: 'Band dislocates' }, { key: 'VPu1', label: 'Scap pull-ups' }, { key: 'BL0', label: 'German hang' }],
    steps: [
      '2 min easy jumping jacks or skipping',
      'Wrist protocol',
      'Band dislocates ×10',
      'Scap pull-ups ×8',
      'German hang prep, feet assisted 1×15–20 s',
      'Band external rotation 1×15 + wrist flexor eccentrics 1×15 (prehab)',
      '1 easy set of 3 pull-ups',
    ],
  },
  legs: {
    title: 'Legs (≈8 min)',
    demos: [{ key: 'SL1', label: 'Djup knäböj' }, { key: 'SL2', label: 'Split squat' }, { key: 'pogo', label: 'Pogo hops' }],
    steps: [
      '2–3 min easy cardio (skipping, bike, brisk walk)',
      'Knee-to-wall ankle rocks ×10/side',
      'Bodyweight squats ×10, full depth',
      'Glute bridges ×10',
      'Split squats ×5/leg, easy',
      'Pogo hops ×10, low and easy',
    ],
  },
  handstand: {
    title: 'Handstand (≈8 min)',
    demos: [{ key: 'wrist', label: 'Handledsuppvärmning' }, { key: 'scap', label: 'Scap push-ups' }, { key: 'dislocates', label: 'Band dislocates' }, { key: 'HS1', label: 'Pike hold' }],
    steps: [
      'Wrist protocol (2–3 min)',
      'Scap push-ups ×10',
      'Wall slides ×8',
      'Band dislocates ×10',
      'Pike hold on box / wall plank 2×20 s',
      'Band external rotation 1×15 + wrist curls 1×15 (prehab, 2nd set of the week)',
    ],
  },
};

const ex = (e: Exercise) => e;

export const SESSIONS: Record<SessionId, Session> = {
  upperA: {
    id: 'upperA',
    title: 'Upper A',
    short: 'Planche-fokus + vertikalt tryck/drag',
    duration: '≈75–85 min',
    warmup: 'push',
    exercises: [
      ex({ slot: 'A', name: 'Handstand', ladder: 'HS', sets: 6, min: 20, max: 40, unit: 's', rest: '60 s', restSec: 60, rir: 'RPE ≤6', tempo: '—', cue: 'Push the floor away; ribs down', role: 'skill' }),
      ex({ slot: 'B', name: 'Planche (PL0a lean if not eligible)', ladder: 'PL', sets: 5, min: 6, max: 10, unit: 's', rest: '2 min', restSec: 120, rir: 'Hold reserve 2–3 s', tempo: 'Static', cue: 'Protract, lock elbows, shoulders ahead of hands', role: 'skill' }),
      ex({ slot: 'C', name: 'Front lever (FL0: 3×8 scap pull-ups + 3×20 s hollow)', ladder: 'FL', sets: 3, min: 6, max: 8, unit: 's', rest: '2 min', restSec: 120, rir: 'Hold reserve 3 s', tempo: 'Static', cue: 'Pull the bar to your hips; squeeze glutes', role: 'skill' }),
      ex({ slot: 'D1', name: 'Vertical push', ladder: 'VP', sets: 4, min: 4, max: 6, unit: 'reps', rest: '90 s → D2', restSec: 90, rir: '2', tempo: '3-0-1-0', cue: 'Head through to tripod; elbows ~45°', role: 'main' }),
      ex({ slot: 'D2', name: 'Vertical pull (weighted if VPu6)', ladder: 'VPu', sets: 4, min: 4, max: 6, unit: 'reps', rest: '90 s → D1', restSec: 90, rir: '2', tempo: '3-0-1-0', cue: 'Shoulders down first, then elbows to ribs', role: 'main' }),
      ex({ slot: 'E1', name: 'Dip', ladder: 'DP', sets: 3, min: 6, max: 10, unit: 'reps', rest: '75 s → E2', restSec: 75, rir: '2', tempo: '2-1-1-0', cue: 'Chest forward, shoulders down, lockout', role: 'main' }),
      ex({ slot: 'E2', name: 'Row', ladder: 'HPu', sets: 3, min: 8, max: 12, unit: 'reps', rest: '75 s → E1', restSec: 75, rir: '2', tempo: '2-0-1-1', cue: 'Chest to hands; squeeze 1 s', role: 'main' }),
      ex({ slot: 'F1', name: 'DB lateral raise (lean-away single-arm OK)', demo: 'lateral', sets: 3, min: 12, max: 20, unit: 'reps', rest: '60 s → F2', restSec: 60, rir: '1', tempo: '2-0-1-0', cue: 'Lead with elbows; stop at shoulder height', role: 'accessory' }),
      ex({ slot: 'F2', name: 'DB or ring curl (incline DB curl preferred)', sets: 3, min: 8, max: 12, unit: 'reps', rest: '60 s → F1', restSec: 60, rir: '1', tempo: '3-0-1-0', cue: 'Elbows still; full stretch at bottom', role: 'accessory' }),
      ex({ slot: 'G', name: 'L-sit (tuck/one-leg/full)', demo: 'CC5', sets: 4, min: 10, max: 15, unit: 's', rest: '60 s', restSec: 60, rir: 'Hold reserve 3 s', tempo: 'Static', cue: 'Shoulders down, push away, knees locked', role: 'accessory' }),
    ],
    block2: [
      'D1/D2: IF VPu ≥ VPu6 → weighted pull-up 4 × 3–5 @ RIR 1–2 + 1 back-off set × 8–12 @ BW. IF VP4+ → wall HSPU 4 × 3–5 + 1 back-off set pike push-ups × 8–12. OTHERWISE keep 4 × 4–6.',
      'E1: IF RTO ring support ≥30 s AND bar dips ≥12 → ring dips 3 × 6–10. ELSE IF bar dips ≥15 → weighted bar dips 3 × 5–8 (+5–10% BW). OTHERWISE keep bar dips.',
      'Handstand: IF CTW ≥60 s ×2 AND toe pulls ≥3 s ×10 → freestanding kick-up practice with bail. OTHERWISE CTW + shoulder taps.',
      'Planche: IF lean ≥3 × 20 s at ~15 cm AND dips ≥10 → tuck planche 5 × 5–8 s. OTHERWISE lean + frog stand.',
      'Accessories: +1 set on F/G from Week 9. IF a muscle is sore ≥5/10 at its next session, remove the added set.',
    ],
  },
  lowerA: {
    id: 'lowerA',
    title: 'Lower A',
    short: 'Plyo + enbensknäböj + SL-RDL + Nordic',
    duration: '≈60–70 min',
    warmup: 'legs',
    intro: 'Micro-practice in the morning or before the session.',
    exercises: [
      ex({ slot: 'A', name: 'Countermovement box jump (mid-shin to knee-height box); step down', demo: 'boxjump', sets: 4, min: 3, max: 3, unit: 'reps', rest: '90 s', restSec: 90, rir: 'Max intent, stop if height drops', tempo: 'X', cue: 'Jump tall, land quiet, knees track toes', role: 'plyo' }),
      ex({ slot: 'B', name: 'Single-leg squat ladder (SL4 box height as tested)', ladder: 'SL', sets: 4, min: 5, max: 8, unit: 'reps/leg', rest: '90 s between legs', restSec: 90, rir: '2', tempo: '3-1-X-0', cue: 'Sit back and down; heel stays heavy', role: 'main' }),
      ex({ slot: 'C', name: 'Single-leg RDL (DB/backpack; H3–H4)', ladder: 'H', sets: 3, min: 8, max: 12, unit: 'reps/leg', rest: '75 s', restSec: 75, rir: '2', tempo: '3-0-1-0', cue: 'Hips back, flat back, hips square', role: 'main' }),
      ex({ slot: 'D', name: 'Nordic ladder', ladder: 'KF', sets: 3, min: 3, max: 6, unit: 'reps', rest: '2 min', restSec: 120, rir: '2', tempo: 'Eccentric 3–5 s', cue: 'Hips extended; fall as slowly as possible', role: 'main' }),
      ex({ slot: 'E', name: 'Single-leg straight-knee calf raise on step (DB when >15)', demo: 'calf', sets: 3, min: 10, max: 15, unit: 'reps/leg', rest: '60 s', restSec: 60, rir: '1', tempo: '2-2-1-1', cue: 'Big toe pressure; full stretch', role: 'main' }),
      ex({ slot: 'F1', name: 'Copenhagen side plank (short → long lever)', demo: 'copenhagen', sets: 3, min: 15, max: 30, unit: 's/side', rest: '45 s → F2', restSec: 45, rir: 'Hold reserve', tempo: 'Static', cue: 'Top leg drives into bench', role: 'accessory' }),
      ex({ slot: 'F2', name: 'Hollow body hold (CC1 level)', demo: 'CC1', sets: 3, min: 20, max: 40, unit: 's', rest: '45 s → F1', restSec: 45, rir: 'Hold reserve', tempo: 'Static', cue: 'Low back glued; ribs down', role: 'accessory' }),
    ],
    block2: [
      'B: IF SL4 at ≤30 cm box for 3 × 6 → SL5 (counterbalanced pistol, 5 kg forward) 4 × 4–6. ELSE IF SL5 3 × 6 → SL6 pistol. OTHERWISE lower the box by 5–10 cm when 3 × 8 is achieved.',
      'D: IF Nordic eccentric ≥5 s controlled for 3 × 5 → KF6 (add push-up-assisted concentric). OTHERWISE keep.',
    ],
  },
  recovery: {
    id: 'recovery',
    title: 'Recovery + aerobic',
    short: 'Mikroträning + Zon 2 + rörlighet',
    duration: '≈55–70 min',
    exercises: [],
    steps: [
      'Micro-practice 10–15 min (se Idag-fliken).',
      'Zone 2 aerobic 30–40 min: brisk incline walk, bike, easy run or rower. You should be able to speak in full sentences.',
      'Targeted mobility 10 min, only for the tests you failed in Week 0. If you passed everything, do 5 min of pike and pancake compression only.',
    ],
  },
  upperB: {
    id: 'upperB',
    title: 'Upper B',
    short: 'Front lever-fokus + explosivt drag + horisontellt',
    duration: '≈75–85 min',
    warmup: 'pull',
    exercises: [
      ex({ slot: 'A', name: 'Handstand', ladder: 'HS', sets: 6, min: 20, max: 40, unit: 's', rest: '60 s', restSec: 60, rir: 'RPE ≤6', tempo: '—', cue: 'Stack wrists-shoulders-hips', role: 'skill' }),
      ex({ slot: 'B', name: 'Front lever (FL0 substitutes as Mon)', ladder: 'FL', sets: 5, min: 6, max: 10, unit: 's', rest: '2 min', restSec: 120, rir: 'Hold reserve 2–3 s', tempo: 'Static', cue: 'Depress, straight arms, hollow', role: 'skill' }),
      ex({ slot: 'C', name: 'Planche lean (PL0a) or planche level −1', demo: 'PL0a', sets: 3, min: 10, max: 15, unit: 's', rest: '90 s', restSec: 90, rir: 'Hold reserve 3 s', tempo: 'Static', cue: 'Lean until you feel shoulders load', role: 'skill' }),
      ex({ slot: 'D', name: 'Explosive pull-up to lower chest (if VPu4+); else negative pull-ups 3×3 (5 s)', demo: 'MU1', sets: 5, min: 3, max: 3, unit: 'reps', rest: '2 min', restSec: 120, rir: 'Stop when height drops', tempo: 'X up, 2 s down', cue: 'Pull the bar to your sternum, fast', role: 'main' }),
      ex({ slot: 'E1', name: 'Horizontal push', ladder: 'HP', sets: 4, min: 6, max: 10, unit: 'reps', rest: '90 s → E2', restSec: 90, rir: '2', tempo: '3-1-1-0', cue: 'Protract at top; elbows ~45°', role: 'main' }),
      ex({ slot: 'E2', name: 'Horizontal row (+ vest when top of range)', ladder: 'HPu', sets: 4, min: 6, max: 10, unit: 'reps', rest: '90 s → E1', restSec: 90, rir: '2', tempo: '2-0-1-1', cue: 'Pull rings to lower ribs', role: 'main' }),
      ex({ slot: 'F1', name: 'Chin-up (supinated; band if < 6)', demo: 'VPu4', sets: 3, min: 6, max: 10, unit: 'reps', rest: '75 s → F2', restSec: 75, rir: '1–2', tempo: '3-0-1-0', cue: 'Full dead hang; chest to bar intent', role: 'accessory' }),
      ex({ slot: 'F2', name: 'Pseudo-planche push-up (regress: hands at waist, on knees)', demo: 'HP6', sets: 3, min: 6, max: 10, unit: 'reps', rest: '75 s → F1', restSec: 75, rir: '2', tempo: '2-1-1-0', cue: 'Keep the lean the whole rep', role: 'accessory' }),
      ex({ slot: 'G1', name: 'Overhead DB/band triceps extension', sets: 3, min: 10, max: 15, unit: 'reps', rest: '60 s → G2', restSec: 60, rir: '1', tempo: '3-1-1-0', cue: 'Deep stretch behind head; elbows forward', role: 'accessory' }),
      ex({ slot: 'G2', name: 'Band pull-apart or DB reverse fly', sets: 3, min: 15, max: 25, unit: 'reps', rest: '60 s → G1', restSec: 60, rir: '1', tempo: '2-0-1-1', cue: 'Thumbs back; no shrug', role: 'accessory' }),
      ex({ slot: 'H', name: 'Hanging leg raise (CC2–CC4 level)', ladder: 'CC', sets: 3, min: 6, max: 12, unit: 'reps', rest: '75 s', restSec: 75, rir: '2', tempo: '2-1-1-0', cue: 'Posterior tilt first; no swing', role: 'core' }),
    ],
    block2: [
      'D: IF pull-ups ≥10 AND dips ≥10 AND C2B ≥3 → MU progression: 3 × 3 transition drills (MU2) + 3 × 2 band-assisted MU (MU3). Total MU-related reps ≤20. OTHERWISE explosive pull-ups 5 × 3.',
      'Warm-up: IF German hang 30 s pain-free AND skin-the-cat ×5 controlled → add tuck back lever 3 × 6–8 s after B (FL). OTHERWISE German hang 3 × 15–20 s, feet assisted.',
      'Front lever: apply the static rule. IF FL1 met → FL2. Add FL rows (HPu5) as E2 once adv tuck ≥8 s.',
      'Accessories: +1 set on F/G from Week 9. IF a muscle is sore ≥5/10 at its next session, remove the added set.',
    ],
  },
  lowerB: {
    id: 'lowerB',
    title: 'Lower B',
    short: 'Plyo + belastad BSS + höftlyft + bensträck',
    duration: '≈60–70 min',
    warmup: 'legs',
    intro: 'Micro-practice beforehand or separately.',
    exercises: [
      ex({ slot: 'A1', name: 'Pogo hops (stiff ankles)', demo: 'pogo', sets: 3, min: 10, max: 10, unit: 'reps', rest: '60 s → A2', restSec: 60, rir: 'Quality', tempo: 'Fast', cue: 'Bounce off the ball of the foot', role: 'plyo' }),
      ex({ slot: 'A2', name: 'Lateral bound, stick landing', sets: 3, min: 3, max: 3, unit: 'reps/side', rest: '60 s', restSec: 60, rir: 'Quality', tempo: 'X, 2 s stick', cue: 'Land soft, hold 2 s', role: 'plyo' }),
      ex({ slot: 'B', name: 'Bulgarian split squat, loaded (start BW if SL3 < 3×10)', demo: 'SL3', sets: 4, min: 6, max: 10, unit: 'reps/leg', rest: '90 s between legs', restSec: 90, rir: '1–2', tempo: '3-0-1-0', cue: 'Front shin slightly forward; drive through the whole foot', role: 'main' }),
      ex({ slot: 'C', name: 'Hip thrust on bench (DB/vest; single-leg when BW is too easy)', demo: 'H5', sets: 3, min: 8, max: 12, unit: 'reps', rest: '90 s', restSec: 90, rir: '1', tempo: '1-0-1-1', cue: 'Chin tucked, ribs down, lock with glutes', role: 'main' }),
      ex({ slot: 'D', name: 'Sliding leg curl (KF1–KF3 level)', demo: 'KF2', sets: 3, min: 8, max: 12, unit: 'reps', rest: '75 s', restSec: 75, rir: '2', tempo: '3-0-1-0', cue: 'Hips high throughout', role: 'main' }),
      ex({ slot: 'E', name: 'Shrimp squat (beginner) or Cossack squat', demo: 'shrimp', sets: 3, min: 5, max: 8, unit: 'reps/leg', rest: '75 s', restSec: 75, rir: '2', tempo: '3-1-1-0', cue: 'Control down; knee over toes', role: 'main' }),
      ex({ slot: 'F1', name: 'Bent-knee calf raise (soleus)', demo: 'calf', sets: 3, min: 15, max: 20, unit: 'reps', rest: '45 s → F2', restSec: 45, rir: '1', tempo: '2-1-1-0', cue: 'Full ROM', role: 'accessory' }),
      ex({ slot: 'F2', name: 'Tibialis raise (back against wall)', demo: 'tibialis', sets: 2, min: 15, max: 20, unit: 'reps', rest: '45 s', restSec: 45, rir: '1–2', tempo: '2-0-1-1', cue: 'Toes to shins', role: 'accessory' }),
      ex({ slot: 'G1', name: 'Side-lying hip abduction or banded lateral walk', sets: 2, min: 15, max: 20, unit: 'reps/side', rest: '45 s → G2', restSec: 45, rir: '1', tempo: '2-0-1-1', cue: 'Slight hip extension; toes forward', role: 'accessory' }),
      ex({ slot: 'G2', name: 'Pallof press (band)', demo: 'pallof', sets: 3, min: 10, max: 10, unit: 'reps/side', rest: '45 s', restSec: 45, rir: '2', tempo: '2-2-2-0', cue: 'Ribs down; resist rotation', role: 'accessory' }),
    ],
    block2: [
      'B: Load BSS: add 2.5–5 kg per hand whenever 4 × 10 @ RIR 1–2 is reached. IF DBs are maxed → rear-foot-elevated deficit (front foot on 5–10 cm plate) or 1.5-rep method.',
    ],
  },
  skill: {
    id: 'skill',
    title: 'Skill + conditioning',
    short: 'Handstand, kompression, kondition',
    duration: '≈60–75 min',
    warmup: 'handstand',
    exercises: [],
    steps: [
      'Handstand block 15–20 min. HS1–HS4: 8 × 30–45 s CTW, with shoulder taps on the last 3 sets. HS5+: 15 min of freestanding attempts; rest ≥30 s between attempts; stop when 3 consecutive attempts are worse than your session average.',
      'Compression 5 min: seated pike leg lifts 3 × 8–10 (2 s hold) + pancake leg lifts 2 × 8.',
      'OPTIONAL technique (only if eligible): MU transition drills 3 × 3 on a low bar, feet assisted. No other hard upper work.',
      'Conditioning: Weeks 1–3 Zone 2 30–45 min. Weeks 4–5: 8 × (30 s hard / 90 s easy) after a 10 min easy warm-up, hard efforts ~RPE 8. Weeks 7–8: Zone 2 40 min. Weeks 9–11: 10 × (30 s / 90 s) intervals OR 20 min tempo.',
      'Mobility 10 min for failed tests only.',
    ],
    block2: ['IF any Monday upper performance drops 2 weeks in a row, revert to Zone 2 only.'],
  },
  rest: {
    id: 'rest',
    title: 'Vila',
    short: 'Vilodag',
    duration: '—',
    exercises: [],
    steps: ['Rest. Optional 5 min: wrist prep + 2 × 10 scapular push-ups. Nothing to fatigue.'],
  },
};
