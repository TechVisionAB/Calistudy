// Side-view stick-figure demos. The figure faces right; hands and feet are IK targets,
// so contact points (floor, bar, box) stay fixed while the body moves.

export type Vec = [number, number];

export const SEG = { trunk: 30, upperArm: 15, forearm: 14, thigh: 19, shin: 18, neck: 3, head: 5 };
const LEG = SEG.thigh + SEG.shin;
const BODY = LEG + SEG.trunk;

export type Pose = {
  /** Position of the anchor joint (hip by default). */
  at: Vec;
  anchor?: 'hip' | 'shoulder';
  /** Screen angle hip → shoulder in degrees (0 = right, −90 = up, 90 = down). */
  trunk: number;
  head?: number;
  hand: Vec;
  hand2?: Vec;
  foot: Vec;
  foot2?: Vec;
  /** ±1: which side the elbow / knee bends to. */
  elbow: number;
  elbow2?: number;
  knee: number;
  knee2?: number;
};

export type Prop =
  | { type: 'floor'; y: number }
  | { type: 'bar'; x: number; y: number }
  | { type: 'rings'; x: number; y: number }
  | { type: 'wall'; x: number; y: number }
  | { type: 'box'; x: number; y: number; w: number; h: number }
  | { type: 'pbars'; x: number; y: number };

export type Anim = {
  id: string;
  title: string;
  duration: number;
  viewBox?: [number, number, number, number];
  props: Prop[];
  keys: { t: number; pose: Pose }[];
  caption: string;
};

const FLOOR = 72;
const rad = (d: number) => (d * Math.PI) / 180;

/** Straight body (heels → shoulders) starting at `foot`, rising at `deg` degrees above horizontal. */
function plank(foot: Vec, deg: number) {
  const a = rad(-deg);
  return {
    at: [foot[0] + Math.cos(a) * LEG, foot[1] + Math.sin(a) * LEG] as Vec,
    trunk: -deg,
    shoulder: [foot[0] + Math.cos(a) * BODY, foot[1] + Math.sin(a) * BODY] as Vec,
  };
}

/** Straight body pivoting around the knee (kneeling). */
function fromKnee(knee: Vec, degFromVertical: number) {
  const a = rad(degFromVertical);
  return { at: [knee[0] + Math.sin(a) * SEG.thigh, knee[1] - Math.cos(a) * SEG.thigh] as Vec, trunk: -(90 - degFromVertical) };
}

const loop = (poses: [number, Pose][]) => poses.map(([t, pose]) => ({ t, pose }));

function pushupAnim(id: string, title: string, handX: number, caption: string): Anim {
  const foot: Vec = [18, FLOOR];
  const top = plank(foot, 25.6);
  const bottom = plank(foot, 7);
  const topP: Pose = { at: top.at, trunk: top.trunk, hand: [handX, FLOOR], foot, elbow: 1, knee: 1 };
  const botP: Pose = { ...topP, at: bottom.at, trunk: bottom.trunk };
  return { id, title, duration: 2800, props: [{ type: 'floor', y: FLOOR }], keys: loop([[0, topP], [0.45, botP], [0.55, botP], [1, topP]]), caption };
}

const pushup = pushupAnim('pushup', 'Push-up', 78, 'Straight body from heels to head, elbows ~45° back, chest down to fist height and full lockout at the top.');
const pseudo = pushupAnim('pseudo', 'Pseudo-planche push-up', 70, 'Hands by the lower ribs, shoulders ahead of the hands for the whole rep. Keep the lean.');

const incline: Anim = (() => {
  const foot: Vec = [12, FLOOR];
  const hand: Vec = [62, 52];
  const top = plank(foot, 45);
  const bot = plank(foot, 27);
  const p: Pose = { at: top.at, trunk: top.trunk, hand, foot, elbow: 1, knee: 1 };
  const b: Pose = { ...p, at: bot.at, trunk: bot.trunk };
  return {
    id: 'incline',
    title: 'Incline push-up',
    duration: 2600,
    props: [{ type: 'floor', y: FLOOR }, { type: 'box', x: 52, y: 52, w: 26, h: 20 }],
    keys: loop([[0, p], [0.45, b], [0.55, b], [1, p]]),
    caption: 'Hands on a bench/box. Same straight body as a regular push-up — lower the height over time.',
  };
})();

const pike: Anim = (() => {
  const foot: Vec = [38, FLOOR];
  const hand: Vec = [86, FLOOR];
  const top: Pose = { at: [44, 36], trunk: 40.6, hand, foot, elbow: -1, knee: 1, head: 0 };
  const bot: Pose = { at: [60, 42], trunk: 36.9, hand, foot, elbow: -1, knee: 1, head: 10 };
  return {
    id: 'pike',
    title: 'Pike push-up',
    duration: 2800,
    props: [{ type: 'floor', y: FLOOR }],
    keys: loop([[0, top], [0.45, bot], [0.55, bot], [1, top]]),
    caption: 'Hips high. The head travels forward past the hands so head and hands form a triangle (tripod).',
  };
})();

const handstand: Anim = (() => {
  const hand: Vec = [72, FLOOR];
  const hand2: Vec = [74, FLOOR];
  const base: Pose = { at: [73, 43], anchor: 'shoulder', trunk: 90, hand, hand2, foot: [75, -24], elbow: 1, knee: 1 };
  const tap: Pose = { ...base, at: [74.5, 43], hand: [73, 44] };
  return {
    id: 'handstand',
    title: 'Chest-to-wall handstand',
    duration: 3600,
    viewBox: [20, -34, 110, 110],
    props: [{ type: 'floor', y: FLOOR }, { type: 'wall', x: 80, y: FLOOR }],
    keys: loop([[0, base], [0.35, base], [0.5, tap], [0.65, base], [1, base]]),
    caption: 'Chest to the wall, hands 10–20 cm from it. Push the floor away, ribs in, straight arms. Shoulder taps once you are stable.',
  };
})();

const hspu: Anim = (() => {
  const hand: Vec = [72, FLOOR];
  const top: Pose = { at: [72, 43], anchor: 'shoulder', trunk: 90, hand, foot: [74, -24], elbow: 1, knee: 1 };
  const bot: Pose = { ...top, at: [70, 58], foot: [73, -9] };
  return {
    id: 'hspu',
    title: 'Wall handstand push-up',
    duration: 3200,
    viewBox: [20, -34, 110, 110],
    props: [{ type: 'floor', y: FLOOR }, { type: 'wall', x: 80, y: FLOOR }],
    keys: loop([[0, top], [0.45, bot], [0.55, bot], [1, top]]),
    caption: 'Lower with control until your head touches the surface in front of your hands. Elbows ~45°, never crash onto your head.',
  };
})();

const dip: Anim = (() => {
  const hand: Vec = [66, 48];
  const top: Pose = { at: [65, 19], anchor: 'shoulder', trunk: -90, hand, foot: [54, 80], elbow: 1, knee: 1 };
  const bot: Pose = { at: [70, 36], anchor: 'shoulder', trunk: -76, hand, foot: [56, 96], elbow: 1, knee: 1 };
  return {
    id: 'dip',
    title: 'Dip',
    duration: 2800,
    viewBox: [10, -2, 110, 100],
    props: [{ type: 'pbars', x: 66, y: 50 }],
    keys: loop([[0, top], [0.45, bot], [0.55, bot], [1, top]]),
    caption: 'Start locked out with shoulders pushed down. Lean the chest forward and lower until the shoulder is just below the elbow.',
  };
})();

const pullup: Anim = (() => {
  const hand: Vec = [60, 10];
  const hang: Pose = { at: [60, 39], anchor: 'shoulder', trunk: -90, hand, foot: [56, 104], elbow: 1, knee: -1, head: 0 };
  const top: Pose = { at: [53, 18], anchor: 'shoulder', trunk: -94, hand, foot: [50, 82], elbow: 1, knee: -1, head: -8 };
  return {
    id: 'pullup',
    title: 'Pull-up',
    duration: 3000,
    viewBox: [5, -6, 110, 116],
    props: [{ type: 'bar', x: 60, y: 10 }],
    keys: loop([[0, hang], [0.4, top], [0.55, top], [1, hang]]),
    caption: 'From a dead hang: pull the shoulders down first, then the elbows toward the ribs until your chin is over the bar.',
  };
})();

const row: Anim = (() => {
  const foot: Vec = [16, FLOOR];
  const hand: Vec = [84, 28];
  const lo = plank(foot, 12);
  const hi = plank(foot, 32);
  const b: Pose = { at: lo.at, trunk: lo.trunk, hand, foot, elbow: 1, knee: 1 };
  const t: Pose = { ...b, at: hi.at, trunk: hi.trunk };
  return {
    id: 'row',
    title: 'Ring row',
    duration: 2800,
    props: [{ type: 'floor', y: FLOOR }, { type: 'rings', x: 84, y: 28 }],
    keys: loop([[0, b], [0.4, t], [0.55, t], [1, b]]),
    caption: 'Straight body, pull the rings to your lower ribs and squeeze the shoulder blades for 1 s at the top.',
  };
})();

const lean: Anim = (() => {
  const hand: Vec = [72, FLOOR];
  const a = plank([13, FLOOR], 25.6);
  const b = plank([21, FLOOR], 24);
  const p: Pose = { at: a.at, trunk: a.trunk, hand, foot: [13, FLOOR], elbow: 1, knee: 1 };
  const q: Pose = { ...p, at: b.at, trunk: b.trunk, foot: [21, FLOOR] };
  return {
    id: 'lean',
    title: 'Planche lean',
    duration: 3600,
    props: [{ type: 'floor', y: FLOOR }],
    keys: loop([[0, p], [0.35, q], [0.75, q], [1, p]]),
    caption: 'Push-up position, protract (round the upper back) and lean the shoulders 5–15 cm past the hands with straight elbows.',
  };
})();

const tuckPlanche: Anim = (() => {
  const hand: Vec = [70, FLOOR];
  const down: Pose = { at: [47, 55], trunk: -15, hand, foot: [56, FLOOR], elbow: 1, knee: -1 };
  const up: Pose = { at: [46, 46], trunk: -2, hand, foot: [52, 56], elbow: 1, knee: -1 };
  return {
    id: 'tuckPlanche',
    title: 'Tuck planche',
    duration: 4200,
    props: [{ type: 'floor', y: FLOOR }],
    keys: loop([[0, down], [0.3, up], [0.75, up], [1, down]]),
    caption: 'Straight arms, shoulders ahead of the hands, hips at shoulder height and knees to chest. Protract and lock the elbows.',
  };
})();

const frontLever: Anim = (() => {
  const hand: Vec = [70, 12];
  const hang: Pose = { at: [70, 41], anchor: 'shoulder', trunk: -90, hand, foot: [80, 76], elbow: 1, knee: -1 };
  const lever: Pose = { at: [48, 32], anchor: 'shoulder', trunk: 0, hand, foot: [26, 30], elbow: 1, knee: -1, head: 0 };
  return {
    id: 'frontLever',
    title: 'Tuck front lever',
    duration: 4400,
    viewBox: [0, -4, 120, 96],
    props: [{ type: 'bar', x: 70, y: 12 }],
    keys: loop([[0, hang], [0.3, lever], [0.75, lever], [1, hang]]),
    caption: 'Press the bar down toward your hips with straight arms until your back is horizontal. Squeeze the glutes, shoulder blades down.',
  };
})();

const hollow: Anim = (() => {
  const flat: Pose = { at: [62, 67], trunk: 180, hand: [6, 69], foot: [99, 69], elbow: 1, knee: 1, head: 0 };
  const hold: Pose = { at: [62, 67], trunk: -171, hand: [9, 56], foot: [97, 56], elbow: 1, knee: -1, head: 0 };
  return {
    id: 'hollow',
    title: 'Hollow body hold',
    duration: 4000,
    props: [{ type: 'floor', y: FLOOR }],
    keys: loop([[0, flat], [0.3, hold], [0.8, hold], [1, flat]]),
    caption: 'Lower back pressed into the floor, ribs in. Lift shoulders and straight legs — lower legs = harder.',
  };
})();

const legRaise: Anim = (() => {
  const hand: Vec = [60, 10];
  const down: Pose = { at: [60, 39], anchor: 'shoulder', trunk: -90, hand, foot: [60, 106], elbow: 1, knee: 1 };
  const up: Pose = { at: [58, 39], anchor: 'shoulder', trunk: -86, hand, foot: [94, 64], elbow: 1, knee: 1 };
  return {
    id: 'legRaise',
    title: 'Hanging leg raise',
    duration: 3000,
    viewBox: [5, -6, 110, 116],
    props: [{ type: 'bar', x: 60, y: 10 }],
    keys: loop([[0, down], [0.4, up], [0.55, up], [1, down]]),
    caption: 'Tilt the pelvis back first, then raise straight legs to 90° without swinging.',
  };
})();

const lsit: Anim = (() => {
  const hand: Vec = [52, 62];
  const tuck: Pose = { at: [49, 33], anchor: 'shoulder', trunk: -93, hand, foot: [62, 60], elbow: 1, knee: -1 };
  const l: Pose = { ...tuck, foot: [86, 62], knee: 1 };
  return {
    id: 'lsit',
    title: 'L-sit',
    duration: 4000,
    props: [{ type: 'floor', y: FLOOR }, { type: 'box', x: 46, y: 62, w: 12, h: 10 }],
    keys: loop([[0, tuck], [0.3, l], [0.75, l], [1, tuck]]),
    caption: 'Push the shoulders down and away from the support, locked knees, legs at least horizontal.',
  };
})();

const squat: Anim = (() => {
  const foot: Vec = [58, FLOOR];
  const up: Pose = { at: [56, 35], trunk: -88, hand: [78, 40], foot, elbow: 1, knee: -1 };
  const down: Pose = { at: [46, 59], trunk: -62, hand: [84, 42], foot, elbow: 1, knee: -1 };
  return {
    id: 'squat',
    title: 'Squat (assisted)',
    duration: 3000,
    viewBox: [0, -14, 120, 94],
    props: [{ type: 'floor', y: FLOOR }],
    keys: loop([[0, up], [0.45, down], [0.55, down], [1, up]]),
    caption: 'Full depth with heels on the floor. Hold a door frame/rings if needed.',
  };
})();

const splitSquat = (bss: boolean): Anim => {
  const front: Vec = [72, FLOOR];
  const rear: Vec = bss ? [26, 54] : [34, FLOOR];
  const up: Pose = { at: [55, 37], trunk: -88, hand: [58, 64], foot: front, foot2: rear, elbow: 1, knee: -1, knee2: -1 };
  const down: Pose = { ...up, at: [51, bss ? 56 : 53], trunk: -86, hand: [55, bss ? 83 : 80] };
  return {
    id: bss ? 'bss' : 'splitSquat',
    title: bss ? 'Bulgarian split squat' : 'Split squat',
    duration: 3000,
    viewBox: [0, -14, 120, 94],
    props: bss ? [{ type: 'floor', y: FLOOR }, { type: 'box', x: 12, y: 54, w: 20, h: 18 }] : [{ type: 'floor', y: FLOOR }],
    keys: loop([[0, up], [0.45, down], [0.55, down], [1, up]]),
    caption: bss ? 'Back foot on a knee-high bench. Front shin slightly forward, drive through the whole foot.' : 'Back knee lightly down to a pad, controlled 2 s down.',
  };
};

const pistol = (box: boolean): Anim => {
  const foot: Vec = [60, FLOOR];
  const up: Pose = { at: [58, 35], trunk: -88, hand: [80, 42], foot, foot2: [70, 66], elbow: 1, knee: -1, knee2: -1 };
  const down: Pose = { at: [box ? 47 : 48, box ? 53 : 62], trunk: -58, hand: [88, 46], foot, foot2: [86, box ? 56 : 62], elbow: 1, knee: -1, knee2: -1 };
  return {
    id: box ? 'boxPistol' : 'pistol',
    title: box ? 'Box pistol' : 'Pistol squat',
    duration: 3400,
    viewBox: [0, -14, 120, 94],
    props: box ? [{ type: 'floor', y: FLOOR }, { type: 'box', x: 34, y: 55, w: 18, h: 17 }] : [{ type: 'floor', y: FLOOR }],
    keys: loop([[0, up], [0.45, down], [0.55, down], [1, up]]),
    caption: box ? 'Sit down on one leg to the box and stand up without rocking. Lower the box 10–15 cm at a time.' : 'Heel stays on the floor, sit back and down, other leg straight out in front.',
  };
};

const bridge: Anim = (() => {
  const foot: Vec = [80, FLOOR];
  const down: Pose = { at: [55, 68], trunk: 180, hand: [70, 70], foot, elbow: 1, knee: -1, head: 0 };
  const up: Pose = { at: [58, 50], trunk: 148, hand: [62, 70], foot, elbow: 1, knee: -1, head: 0 };
  return {
    id: 'bridge',
    title: 'Glute bridge / hip thrust',
    duration: 2800,
    props: [{ type: 'floor', y: FLOOR }],
    keys: loop([[0, down], [0.4, up], [0.6, up], [1, down]]),
    caption: 'Chin tucked, ribs down. Lock the hips with the glutes and squeeze 1 s at the top.',
  };
})();

const slRdl: Anim = (() => {
  const foot: Vec = [60, FLOOR];
  const up: Pose = { at: [60, 35], trunk: -90, hand: [61, 62], foot, foot2: [58, FLOOR], elbow: 1, knee: -1, knee2: -1 };
  const down: Pose = { at: [54, 38], trunk: -8, hand: [80, 60], foot, foot2: [18, 40], elbow: 1, knee: -1, knee2: 1 };
  return {
    id: 'slRdl',
    title: 'Single-leg RDL',
    duration: 3200,
    viewBox: [0, -14, 120, 94],
    props: [{ type: 'floor', y: FLOOR }],
    keys: loop([[0, up], [0.45, down], [0.55, down], [1, up]]),
    caption: 'Hips back, flat back, hips level. The back leg and torso move as one unit.',
  };
})();

const nordic: Anim = (() => {
  const knee: Vec = [48, FLOOR];
  const foot: Vec = [30, FLOOR];
  const a = fromKnee(knee, 0);
  const b = fromKnee(knee, 68);
  const up: Pose = { at: a.at, trunk: a.trunk, hand: [58, 50], foot, elbow: 1, knee: -1 };
  const low: Pose = { at: b.at, trunk: b.trunk, hand: [98, 66], foot, elbow: 1, knee: -1 };
  const caught: Pose = { ...low, hand: [96, FLOOR] };
  return {
    id: 'nordic',
    title: 'Nordic hamstring curl',
    duration: 5200,
    props: [{ type: 'floor', y: FLOOR }, { type: 'box', x: 22, y: 66, w: 10, h: 6 }],
    keys: loop([[0, up], [0.6, low], [0.68, caught], [0.85, up], [1, up]]),
    caption: 'Anchor the ankles, straight hips. Fall as slowly as possible (≥3–5 s), catch yourself with your hands.',
  };
})();

const muscleUp: Anim = (() => {
  const hand: Vec = [60, 40];
  const hang: Pose = { at: [58, 69], anchor: 'shoulder', trunk: -92, hand, foot: [62, 134], elbow: 1, knee: -1 };
  const pull: Pose = { at: [51, 49], anchor: 'shoulder', trunk: -98, hand, foot: [66, 112], elbow: 1, knee: -1 };
  const trans: Pose = { at: [62, 34], anchor: 'shoulder', trunk: -62, hand, foot: [50, 96], elbow: 1, knee: -1 };
  const support: Pose = { at: [58, 12], anchor: 'shoulder', trunk: -92, hand, foot: [60, 78], elbow: -1, knee: -1 };
  return {
    id: 'muscleUp',
    title: 'Muscle-up',
    duration: 4200,
    viewBox: [0, -8, 120, 150],
    props: [{ type: 'bar', x: 60, y: 40 }],
    keys: loop([[0, hang], [0.3, pull], [0.45, trans], [0.6, support], [0.75, support], [1, hang]]),
    caption: 'Explosive pull to the lower sternum, pull around the bar (not straight up) and press to support. Both arms at the same time.',
  };
})();

export const ANIMATIONS: Anim[] = [
  incline,
  pushup,
  pseudo,
  pike,
  hspu,
  dip,
  handstand,
  lean,
  tuckPlanche,
  pullup,
  row,
  muscleUp,
  frontLever,
  hollow,
  legRaise,
  lsit,
  squat,
  splitSquat(false),
  splitSquat(true),
  pistol(true),
  pistol(false),
  bridge,
  slRdl,
  nordic,
];

export const ANIM_BY_ID: Record<string, Anim> = Object.fromEntries(ANIMATIONS.map((a) => [a.id, a]));

/** Ladder level → animation id. Levels without a close match have no animation. */
export const LEVEL_ANIM: Record<string, string> = {
  HP1: 'incline', HP2: 'pushup', HP3: 'pushup', HP4: 'pushup', HP5: 'pushup', HP6: 'pseudo', HP7: 'pushup', HP8: 'incline', HP9: 'pushup',
  VP1: 'pike', VP2: 'pike', VP3: 'hspu', VP4: 'hspu', VP5: 'hspu', VP6: 'hspu', VP7: 'hspu',
  DP1: 'dip', DP2: 'dip', DP3: 'dip', DP5: 'dip', DP6: 'dip', DP7: 'dip',
  HS1: 'pike', HS2: 'handstand', HS3: 'handstand', HS4: 'handstand', HS5: 'handstand', HS6: 'handstand', HS7: 'handstand',
  PL0a: 'lean', PL1: 'tuckPlanche', PL2: 'tuckPlanche', PL3: 'tuckPlanche', PL4: 'tuckPlanche',
  VPu1: 'pullup', VPu2: 'pullup', VPu3: 'pullup', VPu4: 'pullup', VPu5: 'pullup', VPu6: 'pullup', VPu7: 'pullup', VPu8: 'pullup', VPu9: 'pullup',
  HPu1: 'row', HPu2: 'row', HPu3: 'row', HPu4: 'row', HPu5: 'frontLever',
  MU0: 'pullup', MU1: 'pullup', MU2: 'muscleUp', MU3: 'muscleUp', MU4: 'muscleUp', MU5: 'muscleUp', MU6: 'muscleUp',
  FL0: 'frontLever', FL1: 'frontLever', FL2: 'frontLever', FL3: 'frontLever', FL4: 'frontLever', FL5: 'frontLever', FL6: 'frontLever',
  CC1: 'hollow', CC2: 'legRaise', CC3: 'legRaise', CC4: 'legRaise', CC5: 'lsit', CC6: 'lsit', CC7: 'lsit',
  SL1: 'squat', SL2: 'splitSquat', SL3: 'bss', SL4: 'boxPistol', SL5: 'pistol', SL6: 'pistol', SL7: 'pistol',
  H1: 'bridge', H2: 'bridge', H3: 'slRdl', H4: 'slRdl', H5: 'bridge',
  KF4: 'nordic', KF5: 'nordic', KF6: 'nordic',
};
