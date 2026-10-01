// Starter mode: 3 short full-body workouts a week for people who have never trained.
// Built on the bottom rungs of the guide's ladders, so levels and progression carry
// over unchanged when the athlete graduates to the full 12-week program.
import { LADDER_BY_ID } from '@/data/ladders';
import { mondayOf, shiftDate, startOfDay } from '@/data/program';
import { SessionId, SESSIONS } from '@/data/sessions';
import { State } from './store';

export const STARTER: SessionId[] = ['starterA', 'starterB'];
export const STARTER_PER_WEEK = 3;
/** Full-body sessions: ~2 days between them (Mon/Wed/Fri), with slack for evening → morning. */
export const STARTER_GAP_H = 40;
export const GRADUATE_MIN_WEEKS = 6;

export const isStarter = (state: State) => state.track === 'starter';
export const isStarterSession = (id: SessionId) => STARTER.includes(id);

/** Starter week, 1-based. */
export function starterWeek(state: State, now = new Date()): number {
  if (!state.starterStart) return 1;
  const days = Math.floor((startOfDay(now).getTime() - new Date(state.starterStart + 'T00:00:00').getTime()) / 86400000);
  return Math.max(1, Math.floor(days / 7) + 1);
}

/** Exercises that unlock in a given starter week (for "New exercise unlocked" moments). */
export function unlocksAt(week: number): { session: SessionId; name: string }[] {
  return STARTER.flatMap((id) => SESSIONS[id].exercises.filter((e) => e.unlockWeek === week).map((e) => ({ session: id, name: e.name })));
}

/** Next unlock after the current week, if any. */
export function nextUnlock(week: number): { week: number; names: string[] } | null {
  const weeks = STARTER.flatMap((id) => SESSIONS[id].exercises.map((e) => e.unlockWeek ?? 0)).filter((w) => w > week);
  if (weeks.length === 0) return null;
  const w = Math.min(...weeks);
  return { week: w, names: unlocksAt(w).map((u) => u.name) };
}

const atLeast = (state: State, ladder: string, code: string) => {
  const codes = LADDER_BY_ID[ladder].levels.map((l) => l.code);
  return codes.indexOf(state.levels[ladder]) >= codes.indexOf(code);
};

export type Check = { label: string; ok: boolean };

/** What it takes to move to the full program. */
export function graduation(state: State, now = new Date()): { ready: boolean; checks: Check[] } {
  const week = starterWeek(state, now);
  const done = state.workouts.filter((w) => isStarterSession(w.session)).length;
  const hasBar = state.profile?.equipment.some((e) => e === 'bar' || e === 'rings') ?? false;
  const checks: Check[] = [
    { label: `${GRADUATE_MIN_WEEKS} weeks in Starter (week ${Math.min(week, GRADUATE_MIN_WEEKS)}/${GRADUATE_MIN_WEEKS})`, ok: week >= GRADUATE_MIN_WEEKS },
    { label: `15 workouts done (${Math.min(done, 15)}/15)`, ok: done >= 15 },
    { label: 'Push-ups on the floor (level HP2)', ok: atLeast(state, 'HP', 'HP2') },
    { label: 'Split squats (level SL2)', ok: atLeast(state, 'SL', 'SL2') },
  ];
  if (hasBar) checks.push({ label: 'Rows with feet on the floor (level HPu2)', ok: atLeast(state, 'HPu', 'HPu2') });
  return { ready: checks.every((c) => c.ok), checks };
}

/** Switch to (or restart) Starter mode from today. */
export const startStarter = (s: State): State => ({
  ...s,
  track: 'starter',
  starterStart: s.track === 'starter' && s.starterStart ? s.starterStart : mondayOf(),
  startMonday: s.startMonday ?? mondayOf(),
});

/** Move to the full program: Week 0 tests this week, or straight into Week 1. */
export const startFull = (s: State, withTests: boolean): State => ({
  ...s,
  track: 'full',
  startMonday: shiftDate(mondayOf(), withTests ? 0 : -7),
});
