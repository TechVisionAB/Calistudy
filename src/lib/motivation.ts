import { mondayOf, programWeek, shiftDate } from '@/data/program';
import { HARD } from './next';
import { State } from './store';

/** A week "counts" with 3+ hard sessions (2+ in deload weeks 6 and 12). */
function weekCounts(state: State, monday: string): boolean {
  const end = shiftDate(monday, 7);
  const n = state.workouts.filter((w) => {
    const d = mondayOf(new Date(w.date));
    return d >= monday && d < end && HARD.includes(w.session);
  }).length;
  const week = state.startMonday ? programWeek(state.startMonday, new Date(monday + 'T12:00:00')) : 1;
  return n >= (week === 6 || week === 12 ? 2 : 3);
}

/**
 * Consecutive training weeks. The current week only adds to the streak once it
 * counts — an unfinished week never breaks it.
 */
export function weekStreak(state: State, now = new Date()): number {
  const thisMonday = mondayOf(now);
  let streak = weekCounts(state, thisMonday) ? 1 : 0;
  for (let m = shiftDate(thisMonday, -7); state.startMonday && m >= mondayOf(new Date(state.startMonday + 'T12:00:00')); m = shiftDate(m, -7)) {
    if (!weekCounts(state, m)) break;
    streak++;
  }
  return streak;
}
