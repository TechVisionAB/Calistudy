import { LADDER_BY_ID } from '@/data/ladders';
import { Unit } from '@/data/sessions';
import { WorkoutLog } from './store';

export type Point = { date: string; value: number; level?: string };

export type Series = {
  key: string;
  title: string;
  unit: Unit;
  ladder?: string;
  points: Point[];
};

/**
 * One series per ladder (e.g. all vertical-pull work regardless of session) or,
 * for exercises without a ladder, per exercise name. Each point is the best set
 * of one logged workout.
 */
export function progressSeries(workouts: WorkoutLog[]): Series[] {
  const map = new Map<string, Series>();
  const sorted = [...workouts].sort((a, b) => a.date.localeCompare(b.date));
  for (const w of sorted) {
    for (const e of w.entries) {
      const vals = e.sets.map((s) => s.value).filter((v): v is number => v !== null);
      if (!vals.length) continue;
      const key = e.ladder ? `ladder:${e.ladder}:${e.unit}` : `ex:${e.name}`;
      const s = map.get(key) ?? {
        key,
        title: e.ladder ? LADDER_BY_ID[e.ladder]?.name ?? e.name : e.name,
        unit: e.unit,
        ladder: e.ladder,
        points: [],
      };
      s.points.push({ date: w.date, value: Math.max(...vals), level: e.level });
      map.set(key, s);
    }
  }
  return [...map.values()].sort((a, b) => b.points[b.points.length - 1].date.localeCompare(a.points[a.points.length - 1].date));
}

/** Change since the first point at the current level (values are only comparable within a level). */
export function deltaAtLevel(s: Series): { delta: number; since: number; level?: string } | null {
  const last = s.points[s.points.length - 1];
  const same = s.points.filter((p) => p.level === last.level);
  if (same.length < 2) return null;
  return { delta: last.value - same[0].value, since: same.length, level: last.level };
}
