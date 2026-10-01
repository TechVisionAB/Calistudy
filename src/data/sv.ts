// Plain-language English layer on top of the guide's content (friendly display names and cues),
// plus equipment rules. The guide text itself (sessions.ts, ladders.ts) stays untouched.

export type Equip = 'bar' | 'rings' | 'dip' | 'dumbbells' | 'weight' | 'bench' | 'bands';

export const EQUIPMENT: { id: Equip; label: string; hint: string }[] = [
  { id: 'bar', label: 'Pull-up bar', hint: 'Pull-ups, leg raises, front lever' },
  { id: 'rings', label: 'Gymnastic rings', hint: 'Rows, dips, ring push-ups' },
  { id: 'dip', label: 'Dip station / parallettes', hint: 'Dips, L-sit' },
  { id: 'dumbbells', label: 'Dumbbells', hint: 'Weighted legs, shoulders, arms' },
  { id: 'weight', label: 'Weight vest / dip belt', hint: 'Weighted pull-ups and dips' },
  { id: 'bench', label: 'Bench / sturdy box', hint: 'Bulgarian split squat, box pistol' },
  { id: 'bands', label: 'Resistance bands', hint: 'Assisted pull-ups, shoulder prehab' },
];

/** Plain-English display name and cue per session exercise, keyed "session:slot". */
export const EX_SV: Record<string, { name: string; cue: string }> = {
  'upperA:A': { name: 'Handstand', cue: 'Push the floor away, ribs in' },
  'upperA:B': { name: 'Planche', cue: 'Round the upper back, straight arms, shoulders ahead of hands' },
  'upperA:C': { name: 'Front lever', cue: 'Pull the bar toward your hips, squeeze the glutes' },
  'upperA:D1': { name: 'Vertical press', cue: 'Head forward into a triangle, elbows ~45°' },
  'upperA:D2': { name: 'Pull-ups', cue: 'Shoulders down first, then elbows toward the ribs' },
  'upperA:E1': { name: 'Dips', cue: 'Chest forward, shoulders down, lock out at the top' },
  'upperA:E2': { name: 'Row', cue: 'Chest to hands, squeeze 1 s' },
  'upperA:F1': { name: 'Dumbbell lateral raise', cue: 'Lead with the elbows, stop at shoulder height' },
  'upperA:F2': { name: 'Biceps curl', cue: 'Still elbows, full extension at the bottom' },
  'upperA:G': { name: 'L-sit', cue: 'Shoulders down, push away, straight knees' },
  'lowerA:A': { name: 'Box jump', cue: 'Jump high, land quietly, knees over toes. Step down.' },
  'lowerA:B': { name: 'Single-leg squat', cue: 'Sit back and down, heavy heel' },
  'lowerA:C': { name: 'Single-leg deadlift', cue: 'Hips back, flat back, hips level' },
  'lowerA:D': { name: 'Nordic hamstring', cue: 'Straight hips, fall as slowly as you can' },
  'lowerA:E': { name: 'Single-leg calf raise', cue: 'Push through the big toe, full extension' },
  'lowerA:F1': { name: 'Copenhagen plank', cue: 'Top leg presses down into the bench' },
  'lowerA:F2': { name: 'Hollow body', cue: 'Lower back into the floor, ribs in' },
  'upperB:A': { name: 'Handstand', cue: 'Wrists, shoulders and hips in line' },
  'upperB:B': { name: 'Front lever', cue: 'Shoulders down, straight arms, hollow' },
  'upperB:C': { name: 'Planche lean', cue: 'Lean until you feel your shoulders working' },
  'upperB:D': { name: 'Explosive pull-ups', cue: 'Pull the bar to your sternum – fast!' },
  'upperB:E1': { name: 'Push-ups', cue: 'Round the back at the top, elbows ~45°' },
  'upperB:E2': { name: 'Row', cue: 'Pull the rings to your lower ribs' },
  'upperB:F1': { name: 'Chin-ups', cue: 'Dead hang at the bottom, chest to the bar' },
  'upperB:F2': { name: 'Pseudo planche push-ups', cue: 'Keep the lean the whole rep' },
  'upperB:G1': { name: 'Overhead triceps extension', cue: 'Deep stretch behind the head' },
  'upperB:G2': { name: 'Band pull-apart', cue: 'Thumbs back, don’t shrug your shoulders' },
  'upperB:H': { name: 'Hanging leg raise', cue: 'Tilt the pelvis first, no swinging' },
  'lowerB:A1': { name: 'Pogo hops', cue: 'Bounce on the balls of your feet, stiff ankles' },
  'lowerB:A2': { name: 'Lateral hops', cue: 'Land softly and hold 2 s' },
  'lowerB:B': { name: 'Bulgarian split squat', cue: 'Front shin slightly forward, push through the whole foot' },
  'lowerB:C': { name: 'Hip thrust', cue: 'Chin tucked, lock the hips with the glutes' },
  'lowerB:D': { name: 'Sliding leg curl', cue: 'Keep the hips up the whole time' },
  'lowerB:E': { name: 'Shrimp squat', cue: 'Controlled down, knee over toes' },
  'lowerB:F1': { name: 'Bent-knee calf raise', cue: 'Full range of motion' },
  'lowerB:F2': { name: 'Tibialis raise', cue: 'Toes toward your shins' },
  'lowerB:G1': { name: 'Hip abduction', cue: 'Hips slightly extended, toes forward' },
  'lowerB:G2': { name: 'Pallof press', cue: 'Ribs down, resist the rotation' },
  'starterA:A': { name: 'Squat', cue: 'Sit down between your heels, chest up' },
  'starterA:B': { name: 'Push-up', cue: 'Body in one straight line' },
  'starterA:C': { name: 'Row', cue: 'Pull your chest up, squeeze the shoulder blades' },
  'starterA:D': { name: 'Glute bridge', cue: 'Push through the heels, squeeze at the top' },
  'starterA:E': { name: 'Hollow body hold', cue: 'Lower back into the floor, knees bent is fine' },
  'starterA:F': { name: 'Handstand prep', cue: 'Push the floor away, shoulders over the hands' },
  'starterB:A': { name: 'Split squat', cue: 'Long stance, back knee straight down' },
  'starterB:B': { name: 'Pike push-up', cue: 'Hips high, head forward of the hands' },
  'starterB:C': { name: 'Pull-up progression', cue: 'Shoulders down first, slow on the way down' },
  'starterB:D': { name: 'Dips', cue: 'Shoulders down, chest forward' },
  'starterB:E': { name: 'Side plank', cue: 'Hips high – knees down is fine' },
  'starterB:F': { name: 'Planche lean', cue: 'Straight arms, lean until the shoulders work' },
};

/** Plain-English short name per ladder level. */
export const LEVEL_SV: Record<string, string> = {
  HP1: 'Incline push-up (bench)', HP2: 'Push-up', HP3: 'Diamond push-up', HP4: 'Ring push-up', HP5: 'Archer push-up',
  HP6: 'Pseudo planche push-up', HP7: 'Weighted push-up', HP8: 'One-arm push-up on bench', HP9: 'One-arm push-up',
  VP1: 'Pike push-up', VP2: 'Pike push-up, feet on box', VP3: 'Wall handstand push-up (partial)', VP4: 'Wall handstand push-up',
  VP5: 'Handstand push-up, deficit', VP6: 'Freestanding handstand push-up', VP7: 'Freestanding handstand push-up, deficit', VP8: '90° push-up',
  DP1: 'Support hold on bars', DP2: 'Negative dips', DP3: 'Dips', DP4: 'Ring support hold', DP5: 'Ring dips', DP6: 'Weighted dips', DP7: 'Advanced ring dips',
  HS1: 'Pike hold on box', HS2: 'Chest-to-wall handstand', HS3: 'Handstand with shoulder taps', HS4: 'Kick-ups + toe pulls off the wall',
  HS5: 'Freestanding handstand 5–10 s', HS6: 'Freestanding handstand 30 s', HS7: 'Handstand 60 s + walking', HS8: 'Press to handstand', HS9: 'One-arm handstand',
  PL0a: 'Planche lean', PL0b: 'Frog stand', PL1: 'Tuck planche', PL2: 'Advanced tuck planche', PL3: 'Straddle planche', PL4: 'Full planche', PL5: 'Planche push-ups',
  VPu1: 'Active hang + scapular pull-ups', VPu2: 'Negative pull-ups', VPu3: 'Band-assisted pull-ups', VPu4: 'Pull-ups', VPu5: 'Chest-to-bar pull-ups',
  VPu6: 'Weighted pull-ups', VPu7: 'Archer pull-ups', VPu8: 'Assisted one-arm chin-up', VPu9: 'One-arm chin-up',
  HPu1: 'Incline ring row', HPu2: 'Horizontal row', HPu3: 'Feet-elevated row', HPu4: 'Archer row / weighted-vest row', HPu5: 'Front lever row',
  MU0: 'Muscle-up: prerequisites', MU1: 'Explosive pull-ups', MU2: 'Transition drills', MU3: 'Band-assisted muscle-up', MU4: 'Bar muscle-up', MU5: 'Ring muscle-up', MU6: 'Slow / weighted muscle-up',
  FL0: 'Front lever: prerequisites', FL1: 'Tuck front lever', FL2: 'Advanced tuck front lever', FL3: 'One-leg front lever', FL4: 'Straddle front lever', FL5: 'Full front lever', FL6: 'Front lever pulls',
  BL0: 'German hang', BL0b: 'Skin the cat', BL1: 'Tuck back lever', BL2: 'Back lever',
  HF1: 'Vertical flag', HF2: 'Tuck flag', HF3: 'Straddle flag', HF4: 'Human flag',
  CC1: 'Hollow body', CC2: 'Hanging knee raise', CC3: 'Hanging leg raise', CC4: 'Toes to bar', CC5: 'L-sit', CC6: 'Compression drills', CC7: 'V-sit', CC8: 'Manna',
  SL1: 'Assisted squat', SL2: 'Split squat', SL3: 'Bulgarian split squat', SL4: 'Box pistol', SL5: 'Counterbalanced pistol', SL6: 'Pistol squat', SL7: 'Weighted pistol',
  H1: 'Glute bridge', H2: 'Single-leg glute bridge', H3: 'Single-leg deadlift', H4: 'Single-leg deadlift with dumbbell', H5: 'Weighted hip thrust',
  KF1: 'Bridge walkouts', KF2: 'Sliding leg curl', KF3: 'Single-leg sliding leg curl', KF4: 'Band-assisted Nordic', KF5: 'Nordic, eccentric', KF6: 'Nordic, full',
};

/**
 * Exercises that need equipment. If the athlete owns none of `any`, the exercise is
 * swapped for `alt` (and loses its ladder link, since the alternative is a different movement).
 */
export const EX_NEEDS: Record<string, { any: Equip[]; alt: { name: string; cue: string; demo?: string } }> = {
  'upperA:C': { any: ['bar', 'rings'], alt: { name: 'Hollow body hold', cue: 'The foundation for front lever: lower back into the floor', demo: 'CC1' } },
  'upperA:D2': { any: ['bar', 'rings'], alt: { name: 'Slow table row (3 s down)', cue: 'Wide grip, pull your chest to the edge, lower over 3 s', demo: 'HPu1' } },
  'upperA:E1': { any: ['dip', 'rings'], alt: { name: 'Dips between two chairs', cue: 'Sturdy chairs only! Otherwise: diamond push-ups', demo: 'DP2' } },
  'upperA:E2': { any: ['bar', 'rings'], alt: { name: 'Table row', cue: 'Lie under a sturdy table, pull your chest to the edge', demo: 'HPu1' } },
  'upperA:F1': { any: ['dumbbells', 'bands'], alt: { name: 'Lateral raise with water bottles', cue: 'Lead with the elbows, slowly down', demo: 'lateral' } },
  'upperA:F2': { any: ['dumbbells', 'rings', 'bands'], alt: { name: 'Backpack curl', cue: 'Still elbows, full extension' } },
  'lowerA:A': { any: ['bench'], alt: { name: 'Squat jump', cue: 'Jump high, land quietly', demo: 'pogo' } },
  'upperB:B': { any: ['bar', 'rings'], alt: { name: 'Hollow body hold', cue: 'The foundation for front lever: lower back into the floor', demo: 'CC1' } },
  'upperB:D': { any: ['bar', 'rings'], alt: { name: 'Explosive table row', cue: 'Pull fast, lower slowly', demo: 'HPu1' } },
  'upperB:E2': { any: ['bar', 'rings'], alt: { name: 'Table row', cue: 'Lie under a sturdy table, pull your chest to the edge', demo: 'HPu1' } },
  'upperB:F1': { any: ['bar', 'rings'], alt: { name: 'Table row, underhand grip', cue: 'Palms facing you, chest to the edge', demo: 'HPu1' } },
  'upperB:G1': { any: ['dumbbells', 'bands'], alt: { name: 'Diamond push-ups', cue: 'Hands together under the chest', demo: 'HP3' } },
  'upperB:G2': { any: ['bands', 'dumbbells'], alt: { name: 'Prone Y-T raises', cue: 'Thumbs up, squeeze the shoulder blades' } },
  'upperB:H': { any: ['bar', 'rings'], alt: { name: 'Lying leg raise', cue: 'Lower back into the floor, slowly down', demo: 'CC1' } },
  'starterA:C': { any: ['bar', 'rings'], alt: { name: 'Table row', cue: 'Lie under a sturdy table, pull your chest to the edge', demo: 'HPu1' } },
  'starterB:C': { any: ['bar', 'rings'], alt: { name: 'Slow table row (3 s down)', cue: 'Underhand grip, chest to the edge, lower over 3 s', demo: 'HPu1' } },
  'starterB:D': { any: ['dip', 'rings'], alt: { name: 'Chair dips', cue: 'Sturdy chair against a wall; knees bent to make it easier', demo: 'DP2' } },
  'lowerB:G2': { any: ['bands'], alt: { name: 'Dead bug', cue: 'Lower back into the floor, opposite arm and leg' } },
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

/** "RIR 2" → plain-English effort. */
export function effortText(rir: string): string {
  const n = parseInt(rir, 10);
  if (Number.isNaN(n)) {
    if (/hold reserve/i.test(rir)) return 'Stop 2–3 s before your form breaks';
    if (/RPE/i.test(rir)) return 'Calm – should feel easy';
    if (/max intent|quality|height/i.test(rir)) return 'Max speed, stop when quality drops';
    return rir;
  }
  if (n >= 4) return 'Easy – plenty left';
  if (n === 3) return 'Easy – 3 reps left';
  if (n === 2) return 'Just right – 2 reps left';
  if (n === 1) return 'Hard – 1 rep left';
  return 'Max';
}

/** "3-1-X-0" → "3 s down · 1 s pause · explosive up". */
export function tempoText(tempo: string): string | null {
  if (!/^\d/.test(tempo)) return /static/i.test(tempo) ? 'Hold still' : null;
  const [down, pause, up, top] = tempo.split('-');
  const parts: string[] = [];
  if (down && down !== '0') parts.push(`${down} s down`);
  if (pause && pause !== '0') parts.push(`${pause} s pause`);
  if (up) parts.push(up === 'X' ? 'explosive up' : `${up} s up`);
  if (top && top !== '0') parts.push(`${top} s at the top`);
  return parts.join(' · ');
}

/** Effort choices when logging a set, mapped to stored RIR. */
export const EFFORTS: { label: string; rir: number }[] = [
  { label: 'Easy', rir: 3 },
  { label: 'Just right', rir: 2 },
  { label: 'Hard', rir: 1 },
  { label: 'Max', rir: 0 },
];

/** Plain-English session names and one-line summaries. */
export const SESSION_SV: Record<string, { title: string; short: string }> = {
  starterA: { title: 'Full body A', short: 'Squat, push-up, row, bridge and core' },
  starterB: { title: 'Full body B', short: 'Split squat, pike push-up, pull, dips and core' },
  upperA: { title: 'Upper body A', short: 'Handstand, planche, pull-ups and dips' },
  lowerA: { title: 'Legs A', short: 'Jumps, single-leg squats, hamstrings and calves' },
  upperB: { title: 'Upper body B', short: 'Front lever, explosive pulls, push-ups and rows' },
  lowerB: { title: 'Legs B', short: 'Bulgarian split squat, hip thrusts and stability' },
  skill: { title: 'Skill + conditioning', short: 'Handstand, compression and light cardio' },
  recovery: { title: 'Recovery', short: 'Micro-practice, walking and mobility' },
  rest: { title: 'Rest', short: 'Rest day' },
};

export const TEST_SV: Record<string, string> = { A: 'Test: upper body', B: 'Test: legs + core', C: 'Test: mobility', mini: 'Mini test' };

export const LADDER_SV: Record<string, string> = {
  HP: 'Push-ups', VP: 'Overhead press', DP: 'Dips', HS: 'Handstand', PL: 'Planche', VPu: 'Pull-ups', HPu: 'Rows',
  MU: 'Muscle-up', FL: 'Front lever', BL: 'Back lever', HF: 'Human flag', CC: 'Core & compression', SL: 'Single-leg squat', H: 'Hips & posterior chain', KF: 'Hamstrings (Nordic)',
};

export const WARMUP_SV: Record<string, { title: string; steps: string[] }> = {
  push: {
    title: 'Warm-up (8 min)',
    steps: ['2 min jumping in place or jump rope', 'Wrist warm-up', 'Band dislocates ×10', 'Scapular push-ups ×10', 'Support hold 30 s', 'Band external rotation + wrist curl 1×15', '5 easy push-ups'],
  },
  pull: {
    title: 'Warm-up (8 min)',
    steps: ['2 min jumping in place or jump rope', 'Wrist warm-up', 'Band dislocates ×10', 'Scapular pull-ups ×8', 'German hang with feet on the floor 15–20 s', 'Band external rotation 1×15', '3 easy pull-ups'],
  },
  legs: {
    title: 'Warm-up (8 min)',
    steps: ['2–3 min light cardio', 'Knee-to-wall ankle mobility ×10/side', '10 deep squats', '10 glute bridges', '5 easy split squats/leg', '10 easy pogo hops'],
  },
  starter: {
    title: 'Warm-up (5 min)',
    steps: ['1 min jumping jacks or marching on the spot', 'Arm circles ×10 each way', 'Wrist circles, 30 s', '10 slow bodyweight squats', '10 glute bridges', '5 easy push-ups (knees or bench is fine)'],
  },
  handstand: {
    title: 'Warm-up (8 min)',
    steps: ['Wrist warm-up 2–3 min', 'Scapular push-ups ×10', 'Wall slides ×8', 'Band dislocates ×10', 'Pike hold on box 2×20 s', 'Band external rotation + wrist curl 1×15'],
  },
};
