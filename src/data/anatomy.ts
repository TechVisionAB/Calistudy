// Muscle map + "feel it here / not here" per movement pattern. Muscles follow the guide's
// own "Muscles" lines (Section 5) where it gives them; joint warnings follow its injury notes.
// Slugs are react-native-body-highlighter body parts.
import { LEVEL_ANIM } from './animations';

export type Slug =
  | 'abs' | 'adductors' | 'ankles' | 'biceps' | 'calves' | 'chest' | 'deltoids' | 'feet' | 'forearm' | 'gluteal'
  | 'hamstring' | 'hands' | 'knees' | 'lower-back' | 'neck' | 'obliques' | 'quadriceps' | 'tibialis' | 'trapezius'
  | 'triceps' | 'upper-back';

export type Anatomy = {
  primary: Slug[];
  secondary: Slug[];
  /** Joints/areas that should NOT hurt — highlighted as warnings. */
  warnAt: Slug[];
  feel: string;
  notFeel: string;
};

const A = (primary: Slug[], secondary: Slug[], warnAt: Slug[], feel: string, notFeel: string): Anatomy => ({ primary, secondary, warnAt, feel, notFeel });

export const ANATOMY: Record<string, Anatomy> = {
  pushup: A(['chest', 'triceps', 'deltoids'], ['abs', 'obliques'], ['hands'], 'Chest, front of the shoulders and back of the arms. Your abs work to keep your body straight.', 'Wrists or the front of the shoulder joint. If your wrists hurt – use fists or parallettes.'),
  incline: A(['chest', 'triceps', 'deltoids'], ['abs'], ['hands'], 'Chest and back of the arms.', 'Wrists.'),
  pseudo: A(['deltoids', 'chest', 'triceps'], ['biceps', 'abs', 'forearm'], ['hands', 'forearm'], 'Front of the shoulders and chest – more shoulders than regular push-ups.', 'Wrists or the inside of the elbow.'),
  pike: A(['deltoids', 'triceps'], ['trapezius', 'chest'], ['neck', 'hands'], 'Shoulders and back of the arms.', 'Neck – lower your head with control, never land hard on your head.'),
  hspu: A(['deltoids', 'triceps'], ['trapezius', 'chest', 'abs'], ['neck', 'hands'], 'Shoulders and back of the arms.', 'Neck or wrists.'),
  dip: A(['chest', 'triceps', 'deltoids'], ['abs'], ['deltoids'], 'Lower chest and back of the arms.', 'Front of the shoulder joint or the sternum. If it hurts – don’t go as deep.'),
  handstand: A(['deltoids', 'trapezius'], ['triceps', 'abs', 'forearm'], ['hands', 'neck'], 'Shoulders and upper back pushing you up, abs keeping you straight.', 'Wrists or neck.'),
  lean: A(['deltoids', 'chest'], ['biceps', 'abs', 'forearm'], ['hands', 'forearm'], 'Front of the shoulders and abs.', 'Inside of the elbow or wrists.'),
  tuckPlanche: A(['deltoids', 'chest', 'abs'], ['biceps', 'triceps', 'forearm', 'trapezius'], ['forearm', 'hands'], 'Front of the shoulders, chest and abs.', 'Inside of the elbow (biceps tendon) or wrists – stop immediately if it hurts there.'),
  pullup: A(['upper-back', 'biceps'], ['forearm', 'trapezius', 'deltoids'], ['forearm'], 'Back (lats) below the armpits and biceps.', 'Inside of the elbow. Change grip if it hurts.'),
  row: A(['upper-back', 'trapezius', 'biceps'], ['deltoids', 'forearm'], ['forearm'], 'Middle of the back between the shoulder blades, and biceps.', 'Outside of the elbow.'),
  muscleUp: A(['upper-back', 'chest', 'triceps'], ['biceps', 'deltoids', 'abs', 'forearm'], ['forearm', 'hands'], 'Back during the pull, chest and triceps in the press up.', 'Elbows and wrists – max 20 reps per workout.'),
  frontLever: A(['upper-back', 'abs'], ['deltoids', 'gluteal', 'trapezius'], ['forearm'], 'Back (lats), abs and glutes keeping your body straight.', 'Inside of the elbow.'),
  backLever: A(['deltoids', 'chest', 'biceps'], ['abs', 'lower-back', 'gluteal'], ['forearm', 'deltoids'], 'Front of the shoulders and chest in a stretched position.', 'Inside of the elbow or front of the shoulder – progress very slowly.'),
  flag: A(['obliques', 'upper-back', 'deltoids'], ['abs', 'triceps'], ['deltoids'], 'Side of the abs and back/shoulders.', 'Shoulder joint.'),
  hollow: A(['abs'], ['obliques', 'quadriceps'], ['lower-back'], 'Your whole midsection.', 'Lower back – if it lifts off the floor, bend your knees more.'),
  legRaise: A(['abs', 'obliques'], ['quadriceps', 'forearm'], ['lower-back'], 'Lower abs and hip flexors.', 'Lower back.'),
  lsit: A(['abs', 'quadriceps', 'triceps'], ['deltoids', 'obliques'], ['hands'], 'Abs, front of the thighs and arms pushing down.', 'Wrists.'),
  squat: A(['quadriceps', 'gluteal'], ['adductors', 'calves'], ['knees'], 'Front of the thighs and glutes.', 'Knees – your knees should point the same way as your toes.'),
  splitSquat: A(['quadriceps', 'gluteal'], ['adductors', 'hamstring', 'calves'], ['knees'], 'Front of the thigh and glute of the front leg.', 'Knee.'),
  bss: A(['quadriceps', 'gluteal'], ['adductors', 'hamstring'], ['knees'], 'Front of the thigh and glute of the front leg.', 'Knee, or the groin of the back leg.'),
  boxPistol: A(['quadriceps', 'gluteal'], ['calves', 'abs', 'adductors'], ['knees', 'ankles'], 'Front of the thigh and glutes.', 'Knee or ankle.'),
  pistol: A(['quadriceps', 'gluteal'], ['calves', 'abs', 'adductors'], ['knees', 'ankles'], 'Front of the thigh and glutes.', 'Knee or ankle.'),
  bridge: A(['gluteal', 'hamstring'], ['lower-back', 'abs'], ['lower-back'], 'Glutes – squeeze at the top.', 'Lower back. If you mostly feel it in your back, tilt your pelvis more.'),
  slRdl: A(['hamstring', 'gluteal'], ['lower-back', 'adductors'], ['lower-back'], 'Back of the thigh and glute of the standing leg.', 'Lower back – keep your back flat.'),
  nordic: A(['hamstring'], ['gluteal', 'calves'], ['knees'], 'Back of the thighs – a lot.', 'Kneecap (put something soft under your knees).'),
  slide: A(['hamstring', 'gluteal'], ['calves'], ['lower-back'], 'Back of the thighs and glutes.', 'Lower back.'),
  calf: A(['calves'], ['feet'], ['ankles'], 'Calves, especially in the long stretch at the bottom.', 'Achilles tendon or ankle.'),
  tibialis: A(['tibialis'], [], ['ankles'], 'Front of the shin.', 'Ankle.'),
  copenhagen: A(['adductors'], ['obliques', 'abs'], ['knees'], 'Inner thigh of the top leg.', 'Knee – start with the knee on the bench (short lever).'),
  pallof: A(['obliques', 'abs'], ['deltoids'], ['lower-back'], 'Side of the abs resisting the rotation.', 'Lower back.'),
  lateral: A(['deltoids'], ['trapezius'], ['neck'], 'Outside of the shoulders.', 'Neck – don’t shrug your shoulders.'),
  curl: A(['biceps'], ['forearm'], ['forearm'], 'Biceps.', 'Elbow joint.'),
  triceps: A(['triceps'], [], ['forearm'], 'Back of the arms in a deep stretch.', 'Elbow.'),
  pullApart: A(['trapezius', 'deltoids', 'upper-back'], [], ['neck'], 'Back of the shoulders and between the shoulder blades.', 'Neck.'),
  pogo: A(['calves'], ['quadriceps'], ['ankles', 'knees'], 'Calves – bouncy and light.', 'Achilles tendon, ankles or knees.'),
  boxjump: A(['quadriceps', 'gluteal', 'calves'], ['hamstring'], ['knees', 'ankles'], 'Legs in an explosive drive.', 'Knees on landing – land softly.'),
  wrist: A(['forearm'], ['hands'], ['hands'], 'A light stretch in the forearms and wrists.', 'Sharp pain in the wrist.'),
  scap: A(['trapezius', 'upper-back'], ['chest'], ['neck'], 'Around the shoulder blades.', 'Neck.'),
};

/** Ladders whose levels have no animation get a pattern by ladder. */
const LADDER_PATTERN: Record<string, string> = { BL: 'backLever', HF: 'flag', KF: 'slide', MU: 'muscleUp', DP: 'dip', CC: 'hollow', PL: 'lean', FL: 'frontLever', HS: 'handstand', VP: 'pike' };

export function anatomyFor(key?: string): Anatomy | undefined {
  if (!key) return undefined;
  if (ANATOMY[key]) return ANATOMY[key];
  const anim = LEVEL_ANIM[key];
  if (anim && ANATOMY[anim]) return ANATOMY[anim];
  if (key === 'KF4' || key === 'KF5' || key === 'KF6') return ANATOMY.nordic;
  const ladder = key.match(/^[A-Za-z]+/)?.[0];
  return ladder && LADDER_PATTERN[ladder] ? ANATOMY[LADDER_PATTERN[ladder]] : undefined;
}

ANATOMY.shrimp = ANATOMY.pistol;
ANATOMY.dislocates = ANATOMY.scap;
