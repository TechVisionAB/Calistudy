/**
 * Exercise photos from the Free Exercise DB (github.com/yuhonas/free-exercise-db),
 * released into the public domain (Unlicense). Each exercise has two photos
 * (start / end position, 850×567 jpg) that we alternate like a GIF.
 *
 * Only keys whose photo genuinely shows the movement (or a very close,
 * beginner-appropriate equivalent) are mapped — every pair was checked visually.
 */

/** Our demo key (ladder level code, exercise key or warm-up step) → Free Exercise DB id. */
export const PHOTOS: Record<string, string> = {
  // Horizontal push
  HP1: 'Incline_Push-Up',
  HP2: 'Pushups',
  HP3: 'Push-Ups_-_Close_Triceps_Position',
  HP4: 'Suspended_Push-Up', // ring push-up (rings set higher in the photo)
  HP9: 'Single-Arm_Push-Up',
  // Vertical push
  VP3: 'Handstand_Push-Ups', // wall HSPU
  VP4: 'Handstand_Push-Ups',
  // Dips
  DP2: 'Parallel_Bar_Dip', // low bars, feet can assist
  DP3: 'Dips_-_Triceps_Version',
  DP5: 'Ring_Dips',
  // Vertical pull
  VPu1: 'Scapular_Pull-Up',
  VPu2: 'Pullups',
  VPu3: 'Band_Assisted_Pull-Up',
  VPu4: 'Pullups',
  VPu5: 'Gironda_Sternum_Chins', // pull to the sternum ≈ chest-to-bar
  VPu6: 'Weighted_Pull_Ups',
  VPu7: 'Side_To_Side_Chins', // typewriter
  VPu8: 'One_Arm_Chin-Up', // towel-assisted one-arm chin
  // Horizontal pull
  HPu1: 'Inverted_Row_with_Straps',
  HPu2: 'Inverted_Row',
  HPu5: 'Bodyweight_Mid_Row', // tuck front-lever row
  // Core
  CC2: 'Hanging_Leg_Raise', // photo shows bent knees → knee raise
  CC4: 'Hanging_Pike',
  // Single-leg squat
  SL1: 'Bodyweight_Squat',
  SL2: 'Split_Squats',
  SL3: 'Suspended_Split_Squat', // rear foot elevated (strap) ≈ Bulgarian
  SL5: 'Kettlebell_Pistol_Squat', // counterbalanced pistol
  // Hinge
  H1: 'Butt_Lift_Bridge',
  H2: 'Single_Leg_Glute_Bridge',
  H3: 'Kettlebell_One-Legged_Deadlift',
  H4: 'Kettlebell_One-Legged_Deadlift',
  H5: 'Barbell_Hip_Thrust',
  // Knee flexion
  KF2: 'Ball_Leg_Curl', // ball instead of sliders — same pattern
  KF5: 'Floor_Glute-Ham_Raise', // partner-held Nordic
  KF6: 'Floor_Glute-Ham_Raise',
  // Exercise demo keys
  lateral: 'Side_Lateral_Raise',
  calf: 'Standing_Dumbbell_Calf_Raise',
  copenhagen: 'Side_Bridge', // side plank (the Copenhagen regression)
  pallof: 'Pallof_Press',
  boxjump: 'Front_Box_Jump',
  // Warm-up steps
  jumpingJacks: 'Star_Jump',
  armCircles: 'Arm_Circles',
  wristCircles: 'Wrist_Circles',
  squat: 'Bodyweight_Squat',
  gluteBridge: 'Butt_Lift_Bridge',
  pushupEasy: 'Incline_Push-Up',
  extRotation: 'External_Rotation_with_Band',
};

const NAMES: Record<string, string> = {
  'Push-Ups_-_Close_Triceps_Position': 'Close-grip push-up',
  Butt_Lift_Bridge: 'Glute bridge',
  'Dips_-_Triceps_Version': 'Dips',
  Pullups: 'Pull-ups',
};

const BASE = 'https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises';
/** Fallback host if the CDN is unreachable. */
export const PHOTO_FALLBACK_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises';

export type Photo = { id: string; urls: [string, string]; name: string };

export function photoFor(key?: string): Photo | undefined {
  if (!key) return undefined;
  const id = PHOTOS[key];
  if (!id) return undefined;
  return {
    id,
    urls: [`${BASE}/${id}/0.jpg`, `${BASE}/${id}/1.jpg`],
    name: NAMES[id] ?? id.replace(/_/g, ' '),
  };
}

/** Same photo pair on the fallback host. */
export function fallbackUrls(id: string): [string, string] {
  return [`${PHOTO_FALLBACK_BASE}/${id}/0.jpg`, `${PHOTO_FALLBACK_BASE}/${id}/1.jpg`];
}
