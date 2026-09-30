// Session and static progression rules — Section 10.1 and 12 of docs/guide.md.
import { LADDER_BY_ID } from '@/data/ladders';
import { EntryLog, WorkoutLog } from './store';

export type Suggestion = {
  ladder: string;
  from: string;
  to?: string;
  kind: 'up' | 'down' | 'test' | 'modify' | 'keep';
  reason: string;
};

const isHold = (e: EntryLog) => e.unit === 's' || e.unit === 's/side';

const done = (e: EntryLog) => e.sets.filter((s) => s.value !== null) as { value: number; rir: number | null; pain: number | null }[];

const allTop = (e: EntryLog) => {
  const s = done(e);
  return s.length > 0 && s.length === e.sets.length && s.every((x) => x.value >= e.max);
};

export function neighbour(ladder: string, code: string, step: 1 | -1): string | undefined {
  const l = LADDER_BY_ID[ladder];
  if (!l) return undefined;
  const i = l.levels.findIndex((x) => x.code === code);
  return l.levels[i + step]?.code;
}

/**
 * Given the workout just finished and earlier history, propose level changes for
 * every ladder-linked exercise.
 */
export function suggest(current: WorkoutLog, history: WorkoutLog[]): Suggestion[] {
  const out: Suggestion[] = [];
  for (const e of current.entries) {
    if (!e.ladder || !e.level) continue;
    const sets = done(e);
    if (sets.length === 0) continue;

    const maxPain = Math.max(...sets.map((s) => s.pain ?? 0));
    if (maxPain > 5) {
      out.push({ ladder: e.ladder, from: e.level, kind: 'modify', reason: `Pain ${maxPain}/10: stop this movement pattern and see a physiotherapist/doctor if it persists.` });
      continue;
    }
    if (maxPain >= 3) {
      out.push({
        ladder: e.ladder,
        from: e.level,
        to: neighbour(e.ladder, e.level, -1),
        kind: 'modify',
        reason: `Pain ${maxPain}/10: next workout −1 level and −30–50% volume for this pattern. Re-evaluate in 1 week.`,
      });
      continue;
    }

    const prev = history
      .filter((w) => w.id !== current.id && w.session === current.session && w.date <= current.date)
      .map((w) => w.entries.find((x) => x.slot === e.slot && x.level === e.level))
      .find((x): x is EntryLog => !!x);

    if (isHold(e)) {
      const best = Math.max(...sets.map((s) => s.value));
      if (allTop(e) && prev && allTop(prev) && best >= 15) {
        out.push({ ladder: e.ladder, from: e.level, to: neighbour(e.ladder, e.level, 1), kind: 'test', reason: 'All holds completed 2 workouts in a row and best ≥15 s: test the next level. If you manage ≥4 s, switch with holds = max − 2 s; otherwise mixed sets.' });
      }
      continue;
    }

    if (sets[0].value < e.min) {
      out.push({ ladder: e.ladder, from: e.level, to: neighbour(e.ladder, e.level, -1), kind: 'down', reason: `Set 1 (${sets[0].value}) below the bottom of the range (${e.min}): drop one level or add a band next workout.` });
    } else if (allTop(e) && prev && allTop(prev)) {
      out.push({ ladder: e.ladder, from: e.level, to: neighbour(e.ladder, e.level, 1), kind: 'up', reason: `Top of the range (${e.max}) on all sets 2 workouts in a row: move up one level. If the next level gives fewer than ${e.min} reps, add weight instead.` });
    }
  }
  return out;
}

/** Plateau: no increase in best value for 3 consecutive exposures (Section 13). */
export function plateaus(history: WorkoutLog[]): { name: string; level?: string }[] {
  const byKey = new Map<string, { name: string; level?: string; bests: number[] }>();
  const sorted = [...history].sort((a, b) => a.date.localeCompare(b.date));
  for (const w of sorted) {
    for (const e of w.entries) {
      const vals = done(e).map((s) => s.value);
      if (!vals.length) continue;
      const key = `${w.session}:${e.slot}:${e.level ?? ''}`;
      const item = byKey.get(key) ?? { name: e.name, level: e.level, bests: [] };
      item.bests.push(Math.max(...vals));
      byKey.set(key, item);
    }
  }
  const out: { name: string; level?: string }[] = [];
  for (const { name, level, bests } of byKey.values()) {
    if (bests.length < 4) continue;
    const last = bests.slice(-4);
    if (last.slice(1).every((v) => v <= last[0])) out.push({ name, level });
  }
  return out;
}
