import Constants from 'expo-constants';

import { mondayOf, programWeek } from '@/data/program';
import { State } from './store';

export type WeekStat = { week: string; workouts: number; microDays: number };

/** Workouts and micro-practice days per calendar week since the program started. */
export function weeklyStats(state: State, now = new Date()): WeekStat[] {
  if (!state.startMonday) return [];
  const out: WeekStat[] = [];
  const start = new Date(state.startMonday + 'T00:00:00');
  for (let d = new Date(start); d <= now; d.setDate(d.getDate() + 7)) {
    const from = mondayOf(d);
    const toDate = new Date(from + 'T00:00:00');
    toDate.setDate(toDate.getDate() + 7);
    const inWeek = (iso: string) => iso >= from && new Date(iso) < toDate;
    out.push({
      week: from,
      workouts: state.workouts.filter((w) => inWeek(w.date.slice(0, 10))).length,
      microDays: Object.entries(state.micro).filter(([day, done]) => done.length > 0 && inWeek(day)).length,
    });
  }
  return out;
}

/** Anonymous plain-text summary a tester can share back (no name, no free-text logs). */
export function buildReport(state: State, answers: { rating: number | null; best: string; worst: string }): string {
  const stats = weeklyStats(state);
  const week = state.startMonday ? programWeek(state.startMonday) : 0;
  const sets = state.workouts.reduce((n, w) => n + w.entries.reduce((m, e) => m + e.sets.filter((s) => s.value !== null).length, 0), 0);
  const lines = [
    'CALISTUDY TESTRAPPORT',
    `App-version: ${Constants.expoConfig?.version ?? '?'}`,
    `Startade: ${state.startMonday ?? 'ej startat'} · nu programvecka ${week}`,
    `Pass totalt: ${state.workouts.length} · loggade set: ${sets} · tester: ${state.tests.length}`,
    `Påminnelser: morgon ${state.reminders.morning.enabled ? 'på' : 'av'}, kväll ${state.reminders.evening.enabled ? 'på' : 'av'}`,
    '',
    'Per vecka (pass / mikrodagar):',
    ...stats.map((s, i) => `  v${i} (${s.week}): ${s.workouts} / ${s.microDays}`),
    '',
    `Betyg 1–5: ${answers.rating ?? '–'}`,
    `Bäst: ${answers.best.trim() || '–'}`,
    `Sämst / saknas: ${answers.worst.trim() || '–'}`,
  ];
  return lines.join('\n');
}
