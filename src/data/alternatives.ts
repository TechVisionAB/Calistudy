// "Swap exercise" options for the workout screen. Calisthenics always has another way:
// every pattern gets at least one option that needs nothing but a floor, a table or a chair.
// Easier/harder ladder levels are offered separately (computed from ladders.ts).

export type Alternative = { name: string; cue: string; demo?: string; needs?: string };

const TABLE_ROW: Alternative = { name: 'Table row', cue: 'Lie under a sturdy table, grip the edge, pull your chest up to it', demo: 'HPu1', needs: 'A sturdy table' };
const TOWEL_ROW: Alternative = { name: 'Door towel row', cue: 'Towel around both door handles (door closed!), lean back and pull', demo: 'HPu1', needs: 'A towel and a solid door' };
const FLOOR_PULL: Alternative = { name: 'Prone Y-T-W raises', cue: 'Lie face down, lift the arms into a Y, T and W – squeeze the shoulder blades', demo: 'scap' };

/** By ladder id (or by exercise demo key for non-ladder exercises). */
export const ALTERNATIVES: Record<string, Alternative[]> = {
  HP: [
    { name: 'Wall push-up', cue: 'Hands on the wall, body straight – the easiest start', demo: 'HP1' },
    { name: 'Knee push-up', cue: 'Knees down, hips in line with the body', demo: 'HP2' },
    { name: 'Incline push-up on a bench or sofa arm', cue: 'The higher the hands, the easier', demo: 'HP1' },
  ],
  VP: [
    { name: 'Pike push-up on knees', cue: 'Knees down, hips high, head forward of the hands', demo: 'VP1' },
    { name: 'Incline push-up', cue: 'Hands on a bench – easier on the shoulders', demo: 'HP1' },
  ],
  DP: [
    { name: 'Chair dips', cue: 'Sturdy chair against a wall, knees bent to make it easier', demo: 'DP2' },
    { name: 'Diamond push-up', cue: 'Hands together under the chest – also trains the triceps', demo: 'HP3' },
    { name: 'Knee diamond push-up', cue: 'Knees down, hands close together', demo: 'HP3' },
  ],
  VPu: [
    TABLE_ROW,
    TOWEL_ROW,
    { name: 'Slow negative pull-up from a chair', cue: 'Step up so the chin is over the bar, lower yourself over 5 s', demo: 'VPu2', needs: 'A pull-up bar and a chair' },
    FLOOR_PULL,
  ],
  HPu: [TABLE_ROW, TOWEL_ROW, FLOOR_PULL],
  SL: [
    { name: 'Squat to a chair', cue: 'Sit down lightly and stand up again – no bouncing', demo: 'SL1' },
    { name: 'Assisted squat holding a door frame', cue: 'Hold the frame for balance, go as deep as is comfortable', demo: 'SL1' },
    { name: 'Split squat', cue: 'Long stance, back knee straight down', demo: 'SL2' },
  ],
  H: [
    { name: 'Glute bridge', cue: 'Push through the heels, squeeze at the top', demo: 'H1' },
    { name: 'Glute bridge with a 3 s hold', cue: 'Hold the top for 3 s every rep', demo: 'H1' },
  ],
  CC: [
    { name: 'Lying knee raises', cue: 'Lower back pressed down, bring the knees to the chest', demo: 'CC1' },
    { name: 'Dead bug', cue: 'Lower back in the floor, opposite arm and leg out slowly', demo: 'CC1' },
    { name: 'Plank', cue: 'Elbows under shoulders, body straight', demo: 'CC1' },
  ],
  KF: [
    { name: 'Sliding leg curl on a towel', cue: 'Hips up, slide the heels in and out on a smooth floor', demo: 'KF2' },
    { name: 'Single-leg glute bridge', cue: 'One foot up, squeeze at the top', demo: 'H2' },
  ],
  HS: [
    { name: 'Pike hold on the floor', cue: 'Hands and feet on the floor, hips high, push the floor away', demo: 'HS1' },
    { name: 'Plank shoulder taps', cue: 'Slow taps, hips still', demo: 'CC1' },
  ],
  PL: [
    { name: 'Plank lean', cue: 'From a plank, lean the shoulders forward over the hands', demo: 'PL0a' },
    { name: 'Push-up plus', cue: 'At the top of a push-up, push the floor away further', demo: 'scap' },
  ],
  FL: [
    { name: 'Hollow body hold', cue: 'The base for the front lever: lower back in the floor', demo: 'CC1' },
    TABLE_ROW,
  ],
  BL: [{ name: 'Superman hold', cue: 'Lie face down, lift arms and legs a little', demo: 'scap' }],
  MU: [
    TABLE_ROW,
    { name: 'Explosive push-up', cue: 'Push hard enough for the hands to leave the floor', demo: 'HP2' },
  ],
  HF: [{ name: 'Side plank', cue: 'Hips high, body straight', demo: 'copenhagen' }],
  // Non-ladder exercises (by demo key)
  CC1: [
    { name: 'Dead bug', cue: 'Lower back in the floor, opposite arm and leg out slowly' },
    { name: 'Plank', cue: 'Elbows under shoulders, body straight' },
  ],
  CC5: [{ name: 'Tuck hold on two chairs', cue: 'Push down, lift the knees – or just lift the hips', demo: 'DP1' }],
  copenhagen: [{ name: 'Side plank on knees', cue: 'Knees down, hips high' }],
  PL0a: [{ name: 'Plank lean', cue: 'From a plank, lean the shoulders forward over the hands' }],
  SL2: [{ name: 'Reverse lunge holding a chair', cue: 'Step back, knee gently down, hold the chair for balance', demo: 'SL2' }],
  SL3: [{ name: 'Split squat', cue: 'Both feet on the floor, long stance', demo: 'SL2' }],
  lateral: [{ name: 'Lateral raise with water bottles', cue: 'Lead with the elbows, slow down' }],
  calf: [{ name: 'Two-leg calf raise on a step', cue: 'Full stretch at the bottom' }],
  boxjump: [{ name: 'Squat jump', cue: 'Jump tall, land quietly', demo: 'pogo' }],
  pogo: [{ name: 'Calf raises', cue: 'Smooth and quick', demo: 'calf' }],
  shrimp: [{ name: 'Split squat', cue: 'Long stance, back knee straight down', demo: 'SL2' }],
  pallof: [{ name: 'Dead bug', cue: 'Lower back in the floor, opposite arm and leg out slowly' }],
  tibialis: [{ name: 'Heel walks', cue: 'Toes up, walk on the heels for 30 s' }],
  VPu4: [TABLE_ROW, TOWEL_ROW],
  HP6: [{ name: 'Push-up with hands by the waist, on knees', cue: 'Keep leaning forward', demo: 'HP2' }],
  MU1: [TABLE_ROW, { name: 'Slow negative pull-up', cue: 'Lower over 5 s', demo: 'VPu2' }],
  KF2: [{ name: 'Single-leg glute bridge', cue: 'One foot up, squeeze at the top', demo: 'H2' }],
  H5: [{ name: 'Single-leg glute bridge', cue: 'One foot up, squeeze at the top', demo: 'H2' }],
};

/** Options for an exercise: its ladder's list, else its demo key's list, else generic. */
export function alternativesFor(ladder?: string, demo?: string): Alternative[] {
  return (ladder && ALTERNATIVES[ladder]) || (demo && ALTERNATIVES[demo]) || [{ name: 'Plank', cue: 'Elbows under shoulders, body straight', demo: 'CC1' }];
}
