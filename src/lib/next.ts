// "What should I do today?" — the program's weekly sessions in order, not bound to
// fixed weekdays. Missing Monday doesn't lose Upper A; it just becomes the next session.
import { isoDate, mondayOf, programWeek, TestBattery } from '@/data/program';
import { SessionId } from '@/data/sessions';
import { State } from './store';

export const HARD: SessionId[] = ['upperA', 'lowerA', 'upperB', 'lowerB'];
const UPPER: SessionId[] = ['upperA', 'upperB'];

/** Same tissues need ~72 h (guide); 44 h lets a Mon-evening → Wed-afternoon split still count. */
const MIN_GAP_H = 44;

export type Next =
  | { kind: 'session'; session: SessionId; deload: boolean; note?: string }
  | { kind: 'test'; battery: TestBattery }
  | { kind: 'rest'; note: string; then?: SessionId | TestBattery }
  | { kind: 'startWeek1' }
  | { kind: 'notStarted' };

export type WeekProgress = { week: number; done: SessionId[]; goal: number; deload: boolean };

const localDay = (iso: string) => isoDate(new Date(iso));

export function weekProgress(state: State, now = new Date()): WeekProgress {
  const week = state.startMonday ? programWeek(state.startMonday, now) : 0;
  const from = mondayOf(now);
  const done = state.workouts.filter((w) => localDay(w.date) >= from && HARD.includes(w.session)).map((w) => w.session);
  return { week, done, goal: week === 0 ? 0 : week === 12 ? 2 : 4, deload: week === 6 || week === 12 };
}

export function nextUp(state: State, now = new Date()): Next {
  if (!state.startMonday) return { kind: 'notStarted' };
  const week = programWeek(state.startMonday, now);
  const today = isoDate(now);
  const from = mondayOf(now);
  const thisWeek = state.workouts.filter((w) => localDay(w.date) >= from);
  const doneSessions = new Set(thisWeek.map((w) => w.session));
  const testsSince = (battery: TestBattery, since: string) => state.tests.some((t) => t.battery === battery && localDay(t.date) >= since);
  const trainedToday = state.workouts.some((w) => localDay(w.date) === today && HARD.includes(w.session));
  const testedToday = state.tests.some((t) => localDay(t.date) === today);

  const nextTest = (list: TestBattery[], since: string): Next | null => {
    const pending = list.find((b) => !testsSince(b, since));
    if (!pending) return null;
    if (testedToday) return { kind: 'rest', note: 'Nice work on the test! Next test tomorrow.', then: pending };
    return { kind: 'test', battery: pending };
  };

  if (week === 0) return nextTest(['A', 'B', 'C'], state.startMonday) ?? { kind: 'startWeek1' };

  const deload = week === 6 || week === 12;
  const hardOrder: SessionId[] = week === 12 ? ['upperA', 'lowerA'] : HARD;
  const pending = hardOrder.filter((s) => !doneSessions.has(s));

  if (pending.length === 0) {
    if (week === 12) return nextTest(['A', 'B', 'C'], from) ?? { kind: 'rest', note: 'The cycle is complete! Next week starts Week 1 with your new levels.' };
    if (week === 6) {
      const mini = nextTest(['mini'], from);
      if (mini) return mini;
    }
    if (trainedToday) return { kind: 'rest', note: 'This week\'s workouts are done 🎉 Micro-practice and rest for the rest of the week.' };
    if (!doneSessions.has('skill') && week !== 6) {
      return { kind: 'session', session: 'skill', deload, note: 'Optional: handstand, compression and conditioning.' };
    }
    return { kind: 'rest', note: 'This week\'s workouts are done 🎉 Micro-practice and rest for the rest of the week.' };
  }

  if (trainedToday) return { kind: 'rest', note: 'You\'ve already trained today. Do your micro-practice and rest.', then: pending[0] };

  const lastOf = (group: SessionId[]) =>
    state.workouts.filter((w) => group.includes(w.session)).reduce<number>((m, w) => Math.max(m, new Date(w.date).getTime()), 0);
  const hoursSince = (group: SessionId[]) => (now.getTime() - lastOf(group)) / 3600000;
  const isUpper = (s: SessionId) => UPPER.includes(s);
  const rested = (s: SessionId) => hoursSince(isUpper(s) ? UPPER : HARD.filter((x) => !UPPER.includes(x))) >= MIN_GAP_H;

  const choice = pending.find(rested);
  if (choice) {
    const note = choice !== pending[0] ? `${isUpper(pending[0]) ? 'Your upper body' : 'Your legs'} need rest – do this one first.` : undefined;
    return { kind: 'session', session: choice, deload, note };
  }
  return { kind: 'rest', note: 'Your muscles from the last workout are recovering. Micro-practice today, next workout tomorrow.', then: pending[0] };
}
