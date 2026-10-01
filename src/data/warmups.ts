// Guided warm-ups: one step at a time, each with its own demo and either a timer
// (secs) or a rep target. Content follows the guide's Day 1 warm-up + prehab note
// (see WARMUPS in sessions.ts); the Starter warm-up is the app's own, for beginners.
import { WarmupId } from './sessions';

export type WarmupStep = {
  name: string;
  /** Timed step: counts down and moves on by itself. */
  secs?: number;
  /** Rep step: "×10", "×10 each way" – the user taps Done. */
  reps?: string;
  tip: string;
  /** Demo key: photo / animation / video lookup (ladder codes or warm-up keys). */
  demo?: string;
};

export const GUIDED_WARMUPS: Record<WarmupId, { title: string; minutes: number; steps: WarmupStep[] }> = {
  starter: {
    title: 'Warm-up',
    minutes: 5,
    steps: [
      { name: 'Jumping jacks', secs: 60, tip: 'Easy pace. March on the spot if jumping feels like too much.', demo: 'jumpingJacks' },
      { name: 'Arm circles', secs: 30, tip: 'Big slow circles – 15 s forwards, 15 s backwards.', demo: 'armCircles' },
      { name: 'Wrist circles', secs: 30, tip: 'Hands clasped, roll the wrists both ways. Then gently press the palms together.', demo: 'wristCircles' },
      { name: 'Bodyweight squats', reps: '×10', tip: 'Slow. Sit down between your heels, chest up.', demo: 'SL1' },
      { name: 'Glute bridges', reps: '×10', tip: 'Push through your heels and squeeze at the top.', demo: 'H1' },
      { name: 'Easy push-ups', reps: '×5', tip: 'Knees down or hands on a bench – this is just to wake the arms up.', demo: 'HP1' },
    ],
  },
  push: {
    title: 'Warm-up',
    minutes: 8,
    steps: [
      { name: 'Jumping jacks or skipping', secs: 120, tip: 'Easy pace – just get warm.', demo: 'jumpingJacks' },
      { name: 'Wrist warm-up', secs: 60, tip: 'Palm pulses, back-of-hand push-ups, finger rocks.', demo: 'wrist' },
      { name: 'Band dislocates', reps: '×10', tip: 'Wide grip, straight arms, slow over the head and back.', demo: 'dislocates' },
      { name: 'Scapular push-ups', reps: '×10', tip: 'Arms straight – only the shoulder blades move.', demo: 'scap' },
      { name: 'Support hold', secs: 30, tip: 'Arms locked, shoulders pushed down away from the ears.', demo: 'DP1' },
      { name: 'Band external rotation + wrist curls', reps: '×15', tip: 'Light band, elbow at your side. Prehab for shoulders and elbows.', demo: 'extRotation' },
      { name: 'Easy push-ups', reps: '×5', tip: 'Smooth and easy.', demo: 'HP2' },
    ],
  },
  pull: {
    title: 'Warm-up',
    minutes: 8,
    steps: [
      { name: 'Jumping jacks or skipping', secs: 120, tip: 'Easy pace – just get warm.', demo: 'jumpingJacks' },
      { name: 'Wrist warm-up', secs: 60, tip: 'Palm pulses, back-of-hand push-ups, finger rocks.', demo: 'wrist' },
      { name: 'Band dislocates', reps: '×10', tip: 'Wide grip, straight arms, slow over the head and back.', demo: 'dislocates' },
      { name: 'Scapular pull-ups', reps: '×8', tip: 'Hang, then pull the shoulders down without bending the arms.', demo: 'VPu1' },
      { name: 'German hang, feet on the floor', secs: 20, tip: 'Gentle stretch in the front of the shoulders. Never forced.', demo: 'BL0' },
      { name: 'Band external rotation', reps: '×15', tip: 'Light band, elbow at your side.', demo: 'extRotation' },
      { name: 'Easy pull-ups', reps: '×3', tip: 'Or 3 slow negatives.', demo: 'VPu4' },
    ],
  },
  legs: {
    title: 'Warm-up',
    minutes: 8,
    steps: [
      { name: 'Light cardio', secs: 150, tip: 'Skipping, marching or a brisk walk around the room.', demo: 'jumpingJacks' },
      { name: 'Knee-to-wall ankle rocks', reps: '×10 per side', tip: 'Knee forward over the toes, heel stays down.', demo: 'ankleRocks' },
      { name: 'Deep squats', reps: '×10', tip: 'Full depth, slow.', demo: 'SL1' },
      { name: 'Glute bridges', reps: '×10', tip: 'Squeeze at the top.', demo: 'H1' },
      { name: 'Easy split squats', reps: '×5 per leg', tip: 'Back knee gently to the floor.', demo: 'SL2' },
      { name: 'Pogo hops', reps: '×10', tip: 'Low and easy, bouncy ankles.', demo: 'pogo' },
    ],
  },
  handstand: {
    title: 'Warm-up',
    minutes: 8,
    steps: [
      { name: 'Wrist warm-up', secs: 150, tip: 'Palm pulses, back-of-hand push-ups, finger rocks.', demo: 'wrist' },
      { name: 'Scapular push-ups', reps: '×10', tip: 'Arms straight – only the shoulder blades move.', demo: 'scap' },
      { name: 'Wall slides', reps: '×8', tip: 'Back against the wall, slide the arms up without arching.', demo: 'wallSlides' },
      { name: 'Band dislocates', reps: '×10', tip: 'Wide grip, slow.', demo: 'dislocates' },
      { name: 'Pike hold on a box', reps: '2 × 20 s', tip: 'Hips high, push the floor away.', demo: 'HS1' },
      { name: 'Band external rotation + wrist curls', reps: '×15', tip: 'Light and controlled.', demo: 'extRotation' },
    ],
  },
};

export const stepAmount = (s: WarmupStep) => (s.secs ? (s.secs >= 60 ? `${s.secs / 60} min` : `${s.secs} s`) : s.reps ?? '');
